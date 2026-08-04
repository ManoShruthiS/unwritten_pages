const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // Fallback to root .env if available
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables.');
    return;
  }
  await mongoose.connect(uri);
  isConnected = true;
  console.log('✅ Connected to MongoDB Atlas Cloud Database!');
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    next();
  }
});

const PORT = process.env.PORT || 5000;

// Import Models (Diaries & Entries Only)
const Diary = require('./models/Diary');
const Entry = require('./models/Entry');

const crypto = require('crypto');
const PASSCODE_HASH = '62f4d89dd319a4e7788a88a37913e1295e46b25ba49d6741be302ff6fe0b6baf';

function isPasscodeValid(code) {
  if (!code) return false;
  const hash = crypto.createHash('sha256').update(String(code).trim()).digest('hex');
  return hash === PASSCODE_HASH;
}

// --- AUTHOR AUTH CHECK ROUTE ---
app.post('/api/auth/verify-author', async (req, res) => {
  try {
    const { code } = req.body;
    if (isPasscodeValid(code)) {
      return res.json({
        id: 'author-mahi',
        name: 'Mahi 🦢',
        role: 'Admin'
      });
    }
    return res.status(401).json({ error: 'Incorrect Passcode' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- ADMIN DATABASE CLEANUP ROUTE ---
app.post('/api/admin/clean-db', async (req, res) => {
  try {
    const { code } = req.body;
    if (!isPasscodeValid(code)) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    // Explicitly target unwrittenpages database from client connection
    const client = mongoose.connection.client;
    const targetDb = client ? client.db('unwrittenpages') : mongoose.connection.db;

    let droppedUsers = false;
    let droppedComments = false;

    if (targetDb) {
      try {
        await targetDb.collection('users').drop();
        droppedUsers = true;
      } catch (e) {
        console.log('Drop users error:', e.message);
      }

      try {
        await targetDb.collection('comments').drop();
        droppedComments = true;
      } catch (e) {
        console.log('Drop comments error:', e.message);
      }
    }

    res.json({
      success: true,
      message: 'MongoDB database cleaned.',
      droppedUsers,
      droppedComments
    });
  } catch (err) {
    console.error('Clean DB Error:', err);
    res.status(500).json({ error: err.message || 'Failed to clean MongoDB database.' });
  }
});

// --- DIARIES API ROUTES ---
app.get('/api/diaries', async (req, res) => {
  try {
    const diaries = await Diary.find();
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diaries.' });
  }
});

app.post('/api/diaries', async (req, res) => {
  try {
    const newDiary = new Diary(req.body);
    await newDiary.save();
    res.status(201).json(newDiary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create diary.' });
  }
});

app.put('/api/diaries/:id', async (req, res) => {
  try {
    const updated = await Diary.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update diary.' });
  }
});

app.delete('/api/diaries/:id', async (req, res) => {
  try {
    const diaryId = req.params.id;
    await Diary.findOneAndDelete({ id: diaryId });
    await Entry.deleteMany({ diaryId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete diary.' });
  }
});

// --- ENTRIES API ROUTES ---
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

app.post('/api/entries', async (req, res) => {
  try {
    const newEntry = new Entry(req.body);
    await newEntry.save();
    
    await Diary.findOneAndUpdate({ id: newEntry.diaryId }, { $inc: { entryCount: 1 } });

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry.' });
  }
});

app.put('/api/entries/:id', async (req, res) => {
  try {
    const updated = await Entry.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entry.' });
  }
});

app.delete('/api/entries/:id', async (req, res) => {
  try {
    const entryId = req.params.id;
    const entry = await Entry.findOneAndDelete({ id: entryId });
    if (entry) {
      await Diary.findOneAndUpdate({ id: entry.diaryId }, { $inc: { entryCount: -1 } });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry.' });
  }
});

// Like Entry Endpoint
app.post('/api/entries/:id/like', async (req, res) => {
  try {
    const entryId = req.params.id;
    const entry = await Entry.findOneAndUpdate({ id: entryId }, { $inc: { likes: 1 } }, { new: true });
    res.json({ entryLikes: entry ? entry.likes : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like entry.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Node/Express Backend running on http://localhost:${PORT}`));
}

module.exports = app;
