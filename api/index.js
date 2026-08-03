const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // Fallback to root .env if available
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Import Models
const User = require('./models/User');
const Diary = require('./models/Diary');
const Entry = require('./models/Entry');
const Comment = require('./models/Comment');

// --- AUTH API ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, code } = req.body;
    if (!username || !code) {
      return res.status(400).json({ error: 'Username and 4-digit code are required.' });
    }

    const cleanUsername = username.toLowerCase().trim();
    const existingUser = await User.findOne({ username: cleanUsername });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken by another reader.' });
    }

    const newUser = new User({
      username: cleanUsername,
      password: code,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'Reader',
      bookmarks: [],
      likedEntries: []
    });

    await newUser.save();

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      bookmarks: newUser.bookmarks,
      likedEntries: newUser.likedEntries
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, code, role } = req.body;
    const cleanUsername = (username || '').toLowerCase().trim();

    if (role === 'Admin' || cleanUsername === 'manoshruthis') {
      if (cleanUsername === 'manoshruthis' && code === '3678') {
        return res.json({
          id: 'author-mahi',
          name: 'Manoshruthis',
          email: 'manoshruthis@library.internal',
          role: 'Admin',
          followingAuthor: true,
          bookmarks: [],
          likedEntries: []
        });
      } else {
        return res.status(401).json({ error: 'Incorrect Author credentials.' });
      }
    }

    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please sign up first.' });
    }

    if (user.password !== code) {
      return res.status(401).json({ error: 'Incorrect 4-digit code.' });
    }

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      bookmarks: user.bookmarks,
      likedEntries: user.likedEntries
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login.' });
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
    
    // Find all entries associated with this diary to delete their comments
    const entries = await Entry.find({ diaryId });
    for (let entry of entries) {
      await Comment.deleteMany({ entryId: entry.id });
    }
    
    // Delete all entries in the diary
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
    
    // Auto increment parent diary's entryCount
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
    
    // Delete all comments associated with this entry
    await Comment.deleteMany({ entryId });
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry.' });
  }
});

// Like Entry Endpoint
app.post('/api/entries/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const entryId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.likedEntries.includes(entryId)) {
      return res.status(400).json({ error: 'Already liked this entry' });
    }

    user.likedEntries.push(entryId);
    await user.save();

    const entry = await Entry.findOneAndUpdate({ id: entryId }, { $inc: { likes: 1 } }, { new: true });

    res.json({ userLikedEntries: user.likedEntries, entryLikes: entry ? entry.likes : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like entry.' });
  }
});

// --- USER API ROUTES ---
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

app.post('/api/users/:id/bookmark', async (req, res) => {
  try {
    const { entryId } = req.body;
    const user = await User.findOne({ id: req.params.id });
    
    if (user.bookmarks.includes(entryId)) {
      user.bookmarks = user.bookmarks.filter(id => id !== entryId);
    } else {
      user.bookmarks.push(entryId);
    }
    
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle bookmark.' });
  }
});

// --- COMMENTS API ROUTES ---
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { id, entryId, authorName, content, date } = req.body;
    const newComment = new Comment({
      id,
      entryId,
      authorName,
      content,
      date
    });
    await newComment.save();
    
    // Auto increment parent entry's comment count
    await Entry.findOneAndUpdate({ id: entryId }, { $inc: { comments: 1 } });
    
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment.' });
  }
});

// START SERVER & CONNECT TO MONGODB
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas Cloud Database!');
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });
} else {
  console.warn('⚠️ No MONGODB_URI found. Backend running in offline/in-memory mode.');
}

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Node/Express Backend running on http://localhost:${PORT}`));
}

module.exports = app;
