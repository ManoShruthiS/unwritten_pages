const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'api', '.env') });
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not set in environment variables.');
  process.exit(1);
}

async function cleanMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB Cloud Database...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully!');

    const db = mongoose.connection.db;

    // Drop users collection if exists
    try {
      await db.collection('users').drop();
      console.log('🧹 Dropped "users" collection from MongoDB.');
    } catch (e) {
      console.log('ℹ️ "users" collection was already clean/empty.');
    }

    // Drop comments collection if exists
    try {
      await db.collection('comments').drop();
      console.log('🧹 Dropped "comments" collection from MongoDB.');
    } catch (e) {
      console.log('ℹ️ "comments" collection was already clean/empty.');
    }

    console.log('✨ MongoDB Database cleaned successfully! Only "diaries" and "entries" remain.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning database:', err);
    process.exit(1);
  }
}

cleanMongoDB();
