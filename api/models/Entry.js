const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  diaryId: String,
  sectionId: String,
  entryNumber: String,
  title: String,
  subtitle: String,
  publishedDate: String,
  updatedDate: String,
  readingTime: String,
  tags: [String],
  coverImage: String,
  previewParagraph: String,
  content: String,
  isPinned: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  slug: String
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);
