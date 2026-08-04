const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'api', '.env') });
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not set in environment variables.');
  process.exit(1);
}

const DiarySchema = new mongoose.Schema({
  id: String,
  slug: String,
  title: String,
  description: String,
  icon: String,
  coverColor: String,
  spineColor: String,
  accentColor: String,
  entryCount: Number,
  lastUpdated: String,
  isPinned: Boolean,
  sections: Array
});

const EntrySchema = new mongoose.Schema({
  id: String,
  diaryId: String,
  sectionId: String,
  entryNumber: String,
  title: String,
  subtitle: String,
  publishedDate: String,
  updatedDate: String,
  readingTime: String,
  tags: Array,
  coverImage: String,
  previewParagraph: String,
  content: String,
  likes: Number,
  commentsCount: Number,
  slug: String,
  isPinned: Boolean,
  isFeatured: Boolean
});

const Diary = mongoose.models.Diary || mongoose.model('Diary', DiarySchema);
const Entry = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

const INITIAL_DIARIES = [
  {
    id: 'diary-the-code-book',
    slug: 'the-code-book',
    title: 'The Code Book',
    description: 'Summaries, secret ciphers, and key takeaways from the science of secrecy and cryptography.',
    icon: 'Lock',
    coverColor: '#1c2e3b',
    spineColor: '#101b24',
    accentColor: '#d4af37',
    entryCount: 1,
    lastUpdated: 'Today',
    isPinned: true,
    sections: [
      { id: 'sec-ciphers', name: 'Classical Ciphers' },
      { id: 'sec-enigma', name: 'Enigma & WWII' },
      { id: 'sec-quantum', name: 'Public Keys & Quantum Crypto' }
    ]
  }
];

const INITIAL_ENTRIES = [
  {
    id: 'entry-codebook-intro',
    diaryId: 'diary-the-code-book',
    sectionId: 'sec-ciphers',
    entryNumber: 'Entry 001',
    title: 'The Evolution of Secret Writing',
    subtitle: 'From Caesar Ciphers to Modern Cryptography',
    publishedDate: 'August 4, 2026',
    updatedDate: 'August 4, 2026',
    readingTime: '4 min read',
    tags: ['Cryptography', 'Book Summary', 'Security'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'An introduction to "The Code Book"—tracing humanity’s age-old battle between code makers and code breakers.',
    content: `# The Evolution of Secret Writing\n\n> "History is shaped by secret messages sent, intercepted, and deciphered."\n\n### Key Takeaways:\n- **Steganography vs. Cryptography**: Hiding a message in plain sight versus scrambling its contents.\n- **Monoalphabetic Ciphers**: How frequency analysis cracks simple substitution ciphers.\n- **The Golden Rule**: Security depends on the secrecy of the key, not the algorithm.\n\n*Ready for your chapter summaries and key takeaways!*`,
    likes: 1,
    commentsCount: 0,
    slug: 'evolution-of-secret-writing',
    isPinned: true,
    isFeatured: true
  }
];

async function seedMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB Cloud Database...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully!');

    for (let d of INITIAL_DIARIES) {
      await Diary.findOneAndUpdate({ id: d.id }, d, { upsert: true, new: true });
    }
    console.log('📚 Seeded Initial Diaries into MongoDB!');

    for (let e of INITIAL_ENTRIES) {
      await Entry.findOneAndUpdate({ id: e.id }, e, { upsert: true, new: true });
    }
    console.log('✍️ Seeded Initial Entries into MongoDB!');

    console.log('✨ MongoDB Atlas populated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedMongoDB();
