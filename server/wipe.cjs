const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://manoshruthis3_db_user:31LAz8IkyvxOxH5v@unwrittenpages.ee5z7f3.mongodb.net/unwrittenpages?retryWrites=true&w=majority';

const diarySchema = new mongoose.Schema({}, { strict: false, collection: 'diaries' });
const entrySchema = new mongoose.Schema({}, { strict: false, collection: 'entries' });
const commentSchema = new mongoose.Schema({}, { strict: false, collection: 'comments' });

const Diary = mongoose.model('Diary', diarySchema);
const Entry = mongoose.model('Entry', entrySchema);
const Comment = mongoose.model('Comment', commentSchema);

async function wipe() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  
  await Diary.deleteMany({});
  await Entry.deleteMany({});
  await Comment.deleteMany({});
  
  console.log('Diaries, entries, and comments wiped successfully!');
  process.exit(0);
}

wipe().catch(console.error);
