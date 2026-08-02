const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: String,
  name: String
});

const diarySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: String,
  title: String,
  description: String,
  icon: String,
  coverColor: String,
  spineColor: String,
  accentColor: String,
  entryCount: { type: Number, default: 0 },
  lastUpdated: String,
  sections: [sectionSchema],
  isPinned: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Diary', diarySchema);
