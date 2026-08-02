const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  entryId: { type: String, required: true },
  authorName: String,
  content: String,
  date: String,
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
