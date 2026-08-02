require('dotenv').config();
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

// --- FULL INITIAL SEED DATA ---
const INITIAL_DIARIES = [
  {
    id: 'codershigh',
    slug: 'codershigh-journal',
    title: 'The CodersHigh Journal',
    description: 'My journey through CodersHigh—every lesson, challenge, breakthrough, and reflection documented one page at a time.',
    icon: 'Code',
    coverColor: '#2b1b17',
    spineColor: '#1a100d',
    accentColor: '#d4af37',
    entryCount: 4,
    lastUpdated: 'July 28, 2026',
    sections: [
      { id: 'ch-reflections', name: 'Reflections' },
      { id: 'ch-projects', name: 'Projects' },
      { id: 'ch-tutorials', name: 'Tutorials' }
    ],
    isPinned: true,
    isFeatured: true
  },
  {
    id: 'ai-journal',
    slug: 'the-ai-journal',
    title: 'The AI Journal',
    description: 'Exploring generative models, neural architectures, attention mechanisms, and human-AI synthesis.',
    icon: 'Sparkles',
    coverColor: '#1c2e3b',
    spineColor: '#101d27',
    accentColor: '#38bdf8',
    entryCount: 1,
    lastUpdated: 'July 25, 2026',
    sections: [
      { id: 'ai-research', name: 'Research' },
      { id: 'ai-thoughts', name: 'Thoughts' }
    ],
    isFeatured: true
  },
  {
    id: 'python-journal',
    slug: 'python-journal',
    title: 'Python Journal',
    description: 'Mastering Pythonic idioms, async loops, generators, meta-programming, and clean architecture.',
    icon: 'Terminal',
    coverColor: '#1c3b28',
    spineColor: '#0e2417',
    accentColor: '#10b981',
    entryCount: 1,
    lastUpdated: 'July 20, 2026',
    sections: [
      { id: 'py-snippets', name: 'Snippets' },
      { id: 'py-deep-dives', name: 'Deep Dives' }
    ]
  },
  {
    id: 'java-journal',
    slug: 'java-journal',
    title: 'Java Journal',
    description: 'Deep dives into JVM internals, memory models, garbage collection, and concurrency primitives.',
    icon: 'Coffee',
    coverColor: '#3b201c',
    spineColor: '#26120e',
    accentColor: '#f97316',
    entryCount: 0,
    lastUpdated: 'July 15, 2026',
    sections: [
      { id: 'java-core', name: 'Core Concepts' },
      { id: 'java-systems', name: 'Systems Architecture' }
    ]
  },
  {
    id: 'dsa-journal',
    slug: 'dsa-journal',
    title: 'DSA Journal',
    description: 'Algorithmic problem solving, graph theory, dynamic programming, and space-time optimization.',
    icon: 'Cpu',
    coverColor: '#2d1c3b',
    spineColor: '#1d1027',
    accentColor: '#a855f7',
    entryCount: 0,
    lastUpdated: 'July 10, 2026',
    sections: [
      { id: 'dsa-algorithms', name: 'Algorithms' },
      { id: 'dsa-problems', name: 'Problem Solving' }
    ]
  },
  {
    id: 'life-journal',
    slug: 'life-journal',
    title: 'Life Journal',
    description: 'Personal reflections, quiet library evenings, philosophical ramblings, and unhurried curiosity.',
    icon: 'Feather',
    coverColor: '#382a1e',
    spineColor: '#241a12',
    accentColor: '#e5c158',
    entryCount: 1,
    lastUpdated: 'July 05, 2026',
    sections: [
      { id: 'life-philosophy', name: 'Philosophy' },
      { id: 'life-musings', name: 'Musings' }
    ]
  },
  {
    id: 'personal-reflections',
    slug: 'personal-reflections',
    title: 'Personal Reflections',
    description: 'Unfiltered thoughts on discipline, deep focus in a noisy world, and keeping promises to oneself.',
    icon: 'Compass',
    coverColor: '#1f1f2e',
    spineColor: '#12121d',
    accentColor: '#cbd5e1',
    entryCount: 0,
    lastUpdated: 'June 29, 2026',
    sections: [
      { id: 'pr-discipline', name: 'Discipline' },
      { id: 'pr-focus', name: 'Focus' }
    ]
  }
];

const INITIAL_ENTRIES = [
  {
    id: 'ch-001',
    diaryId: 'codershigh',
    sectionId: 'ch-reflections',
    entryNumber: 'Entry 001',
    title: 'The Beginning',
    subtitle: 'Stepping into the sanctuary of code and unwritten expectations.',
    publishedDate: 'July 10, 2026',
    updatedDate: 'July 10, 2026',
    readingTime: '5 min read',
    tags: ['CodersHigh', 'Beginning', 'Mindset', 'Growth'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'Every programmer remembers the quiet tremor of their very first blank editor window. Not knowing which commands to trust, yet sensing that somewhere inside those empty lines lay the power to build worlds.',
    content: `# The First Page in the Dark

Every journey starts with silence. Sitting at my desk with a steaming mug of black tea and a freshly cloned repository, I realized that learning to program isn't merely about memorizing syntax—it is about cultivating a relationship with problem-solving.

> "We don't write code to tell the machine what to do; we write code to structure our own thinking."

When I joined **CodersHigh**, I made a promise to myself: I would document not only the code that compiles, but the confusion, the dead ends, and the quiet epiphanies along the way.`,
    likes: 42,
    commentsCount: 0,
    isPinned: true,
    slug: 'the-beginning'
  },
  {
    id: 'ch-002',
    diaryId: 'codershigh',
    sectionId: 'ch-tutorials',
    entryNumber: 'Entry 002',
    title: 'Understanding Git',
    subtitle: 'Taming time travel, branches, and merge conflict anxiety.',
    publishedDate: 'July 14, 2026',
    updatedDate: 'July 14, 2026',
    readingTime: '7 min read',
    tags: ['Git', 'VersionControl', 'CodersHigh', 'Workflow'],
    coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'Git is often described as a DAG (Directed Acyclic Graph) of snapshots. But to a beginner, it feels like managing multiple parallel dimensions without losing your home universe.',
    content: `# The Physics of Version Control

In my second week at **CodersHigh**, Git stopped being a scary list of memorized commands and started making conceptual sense.

### The Mental Model
Think of Git not as a file syncer like Dropbox, but as an **immutable append-only tree of snapshots**. Every commit is a state node pointed to by its parent commit hash.`,
    likes: 38,
    commentsCount: 0,
    slug: 'understanding-git'
  },
  {
    id: 'ch-003',
    diaryId: 'codershigh',
    sectionId: 'ch-projects',
    entryNumber: 'Entry 003',
    title: 'Building My First Project',
    subtitle: 'From empty folder to living software: lessons from the furnace of creation.',
    publishedDate: 'July 21, 2026',
    updatedDate: 'July 22, 2026',
    readingTime: '8 min read',
    tags: ['FullStack', 'CodersHigh', 'Projects', 'Design'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'There is a distinct magic when wireframes and abstract components solidify into an interactive application that responds gracefully under your fingertips.',
    content: `# Architecture from the Ground Up

Building my first full-stack application at CodersHigh taught me that architecture is the art of making decisions early so that late changes don't crush you.`,
    likes: 54,
    commentsCount: 0,
    isFeatured: true,
    slug: 'building-my-first-project'
  },
  {
    id: 'ch-004',
    diaryId: 'codershigh',
    sectionId: 'ch-reflections',
    entryNumber: 'Entry 004',
    title: 'Mistakes That Made Me Better',
    subtitle: 'A humble inventory of bugs, failed assumptions, and hard-earned wisdom.',
    publishedDate: 'July 28, 2026',
    updatedDate: 'July 28, 2026',
    readingTime: '6 min read',
    tags: ['Debugging', 'Mindset', 'CodersHigh', 'Reflections'],
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'Bugs are not insults to our intelligence; they are compass directions showing us where our mental models deviate from reality.',
    content: `# The Catalog of Helpful Failures

Looking back over the past few weeks, the code that broke taught me tenfold more than the code that worked on the first try.`,
    likes: 49,
    commentsCount: 0,
    slug: 'mistakes-that-made-me-better'
  },
  {
    id: 'ai-001',
    diaryId: 'ai-journal',
    sectionId: 'ai-research',
    entryNumber: 'Entry 001',
    title: 'The Spark of Generative Intelligence',
    subtitle: 'Demystifying latent spaces, embeddings, and prompt design.',
    publishedDate: 'July 25, 2026',
    updatedDate: 'July 25, 2026',
    readingTime: '9 min read',
    tags: ['AI', 'LLM', 'Generative', 'Embeddings'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'When a model translates human language into a high-dimensional vector space, concepts become geometric coordinates where semantic distance can be calculated with cosine similarity.',
    content: `# Navigating the Geometry of Meaning

In generative AI, text isn't represented as letters or words, but as **vectors in a continuous manifold**.`,
    likes: 67,
    commentsCount: 0,
    slug: 'spark-of-generative-intelligence'
  },
  {
    id: 'py-001',
    diaryId: 'python-journal',
    sectionId: 'py-deep-dives',
    entryNumber: 'Entry 001',
    title: 'Decorators and Generator Elegance',
    subtitle: 'Crafting expressive Python pipelines with zero memory footprint.',
    publishedDate: 'July 20, 2026',
    updatedDate: 'July 20, 2026',
    readingTime: '6 min read',
    tags: ['Python', 'Generators', 'Decorators', 'CleanCode'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'Python generators allow us to process streams of arbitrary size lazily. Combined with higher-order decorators, we can write code that reads like poetry while maintaining memory efficiency.',
    content: `# The Quiet Elegance of Yield

Generators yield control back to the caller without destroying local stack state.`,
    likes: 31,
    commentsCount: 0,
    slug: 'decorators-and-generator-elegance'
  },
  {
    id: 'life-001',
    diaryId: 'life-journal',
    sectionId: 'life-musings',
    entryNumber: 'Entry 001',
    title: 'On Solitude, Books, and the Joy of Unhurried Learning',
    subtitle: 'Why deep focus requires stepping away from the endless feed.',
    publishedDate: 'July 05, 2026',
    updatedDate: 'July 05, 2026',
    readingTime: '5 min read',
    tags: ['Solitude', 'Reading', 'Philosophy', 'Focus'],
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'In an era that rewards rapid hot-takes and instant notifications, sitting quietly in a room with a single dense book feels like an act of gentle defiance.',
    content: `# The Sanctuary of Quiet Hours

I wrote this entry sitting by a window as evening twilight settled over my bookshelves.`,
    likes: 89,
    commentsCount: 0,
    isFeatured: true,
    slug: 'on-solitude-books-and-unhurried-learning'
  }
];

// --- SEED FUNCTION ---
async function seedDatabase() {
  const diaryCount = await Diary.countDocuments();
  if (diaryCount === 0) {
    console.log('🌱 Seeding complete set of 7 Diaries into MongoDB Atlas...');
    await Diary.insertMany(INITIAL_DIARIES);
  }

  const entryCount = await Entry.countDocuments();
  if (entryCount === 0) {
    console.log('🌱 Seeding complete set of 7 Journal Entries into MongoDB Atlas...');
    await Entry.insertMany(INITIAL_ENTRIES);
  }
}

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
    await Diary.findOneAndDelete({ id: req.params.id });
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
    const entry = await Entry.findOneAndDelete({ id: req.params.id });
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

// Bookmark Endpoint
app.post('/api/users/:id/bookmark', async (req, res) => {
  try {
    const { entryId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.bookmarks.indexOf(entryId);
    if (index > -1) {
      user.bookmarks.splice(index, 1);
    } else {
      user.bookmarks.push(entryId);
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bookmarks.' });
  }
});

// Seed API Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await Diary.deleteMany({});
    await Entry.deleteMany({});
    await Diary.insertMany(INITIAL_DIARIES);
    await Entry.insertMany(INITIAL_ENTRIES);
    res.json({ success: true, message: 'Database successfully re-seeded!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed database.' });
  }
});

// START SERVER & CONNECT TO MONGODB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas Cloud Database!');
    await seedDatabase();
    app.listen(PORT, () => console.log(`🚀 Node/Express Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });
