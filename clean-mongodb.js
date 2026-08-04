const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'api', '.env') });
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not set in environment variables.');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({ username: String, role: String });
const CommentSchema = new mongoose.Schema({ id: String, entryId: String, content: String });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

async function cleanMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB Cloud Database...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully!');

    // 1. Delete all non-admin users (reader accounts created during testing)
    const userDeleteResult = await User.deleteMany({ role: { $ne: 'Admin' } });
    console.log(`🧹 Removed ${userDeleteResult.deletedCount} reader accounts.`);

    // 2. Clean out old test comments
    const commentDeleteResult = await Comment.deleteMany({});
    console.log(`🧹 Cleared ${commentDeleteResult.deletedCount} test comments.`);

    console.log('✨ MongoDB Database cleaned successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning database:', err);
    process.exit(1);
  }
}

cleanMongoDB();
