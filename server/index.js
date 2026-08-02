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

// --- INITIAL SEED DATA ---
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
    entryCount: 2,
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
    entryCount: 1,
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
    entryCount: 1,
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
      { id: 'life-reflections', name: 'Reflections' }
    ]
  }
];

const INITIAL_ENTRIES = [
  {
    id: 'entry-ch-1',
    diaryId: 'codershigh',
    sectionId: 'ch-reflections',
    entryNumber: 'ENTRY #001',
    title: 'Beginning the CodersHigh Journey',
    subtitle: 'Stepping into a structured haven for deep coding and disciplined growth.',
    publishedDate: 'July 28, 2026',
    readingTime: '4 min read',
    tags: ['CodersHigh', 'Reflection', 'Milestone'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'Today marks the official commencement of CodersHigh. Walking into this dedicated environment feels like entering a sanctuary where code is treated with reverence.',
    content: `Today marks the official commencement of CodersHigh. Walking into this dedicated environment feels like entering a sanctuary where code is treated with reverence.

The objective isn't merely to write lines of syntax, but to craft thoughtful software architecture. Every challenge encountered here is an invitation to refine logic and deepen understanding.

### Key Intentions for this Cohort:
1. **Consistency over Intensity:** Daily deliberate practice beats midnight burnouts.
2. **Deep Documentation:** Writing down not just *what* works, but *why* it works.
3. **Clean Architecture:** Prioritizing readable, maintainable, and elegant code structures.

> "True craftsmanship lies in the quiet details that most viewers will never notice."

As I turn this first page, I am eager to see how the subsequent chapters unfold.`,
    likes: 12,
    commentsCount: 0,
    isPinned: true,
    isFeatured: true,
    slug: 'beginning-the-codershigh-journey'
  },
  {
    id: 'entry-ch-2',
    diaryId: 'codershigh',
    sectionId: 'ch-projects',
    entryNumber: 'ENTRY #002',
    title: 'Building the Digital Sanctuary',
    subtitle: 'Designing a library-themed space for unwritten pages and quiet thoughts.',
    publishedDate: 'July 26, 2026',
    readingTime: '6 min read',
    tags: ['React', 'TypeScript', 'Design'],
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: 'Modern web design often feels rushed and noisy. For this project, I wanted to build an aesthetic refuge inspired by ancient libraries, leather-bound books, and quiet reading desks.',
    content: `Modern web design often feels rushed and noisy. For this project, I wanted to build an aesthetic refuge inspired by ancient libraries, leather-bound books, and quiet reading desks.

### Design Principles Chosen:
- **Warm Leather & Gold Accents:** Using rich HSL colors like deep mahogany (#2b1b17) and warm gold (#d4af37).
- **Typography as Art:** Pairing classical serif headers (Cinzel) with ultra-readable body text.
- **Physical Feel:** Giving pages physical depth, soft spine shadows, and delicate bookmark ribbons.

Building this sanctuary has reinforced how powerful thoughtful UI design can be in creating emotional resonance.`,
    likes: 8,
    commentsCount: 0,
    slug: 'building-the-digital-sanctuary'
  }
];

// --- SEED FUNCTION ---
async function seedDatabase() {
  const diaryCount = await Diary.countDocuments();
  if (diaryCount === 0) {
    console.log('🌱 Seeding initial Diaries...');
    await Diary.insertMany(INITIAL_DIARIES);
  }

  const entryCount = await Entry.countDocuments();
  if (entryCount === 0) {
    console.log('🌱 Seeding initial Journal Entries...');
    await Entry.insertMany(INITIAL_ENTRIES);
  }
}

// --- AUTH API ROUTES ---

// 1. Reader Registration
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
      password: code, // Saved as code for simple 4-digit auth
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
      likedEntries: newUser.likedEntries,
      readingStreak: newUser.readingStreak
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. Auth Login (Author & Reader)
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
          likedEntries: [],
          readingStreak: 5
        });
      } else {
        return res.status(401).json({ error: 'Incorrect Author credentials.' });
      }
    }

    // Reader Login
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
      likedEntries: user.likedEntries,
      readingStreak: user.readingStreak
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// --- DATA API ROUTES ---

// Get all diaries
app.get('/api/diaries', async (req, res) => {
  try {
    const diaries = await Diary.find();
    res.json(diaries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diaries.' });
  }
});

// Get all journal entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

// Create new Entry (Author only)
app.post('/api/entries', async (req, res) => {
  try {
    const newEntry = new Entry(req.body);
    await newEntry.save();
    
    // Update diary count
    await Diary.findOneAndUpdate({ id: newEntry.diaryId }, { $inc: { entryCount: 1 } });

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry.' });
  }
});

// Toggle Like on an Entry
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

// Toggle Bookmark on an Entry
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
