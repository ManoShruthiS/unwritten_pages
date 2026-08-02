const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Reader'], default: 'Reader' },
  name: { type: String, required: true },
  email: { type: String },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  followingAuthor: { type: Boolean, default: true },
  bookmarks: [{ type: String }],
  likedEntries: [{ type: String }],
  readingStreak: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
