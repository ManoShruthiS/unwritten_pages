import express from 'express';
import path from 'path';
import { execSync } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { INITIAL_DIARIES, INITIAL_ENTRIES, INITIAL_COMMENTS } from './src/data/initialData';
import { Diary, JournalEntry, Comment } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store initialized with default sample content
let diariesStore: Diary[] = [...INITIAL_DIARIES];
let entriesStore: JournalEntry[] = [...INITIAL_ENTRIES];
let commentsStore: Comment[] = [...INITIAL_COMMENTS];
let subscribersStore: { email: string; date: string }[] = [];
let followersCount = 142;
let totalViews = 3820;

// API ROUTES

// Download full project source as ZIP
app.get('/api/download-zip', (req, res) => {
  try {
    const pythonCmd = `python3 -c "import zipfile, os; ignore = {'node_modules', '.git', 'dist', 'project.zip'}; z = zipfile.ZipFile('project.zip', 'w', zipfile.ZIP_DEFLATED); [z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), '.')) for r, d, fs in os.walk('.') for f in fs if not any(x in r.split(os.sep) for x in ignore) and f != 'project.zip']; z.close()"`;
    execSync(pythonCmd, { cwd: process.cwd() });
    const zipPath = path.join(process.cwd(), 'project.zip');
    res.download(zipPath, 'unwritten-pages-source.zip');
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate ZIP file', details: String(err) });
  }
});

// 1. Get all diaries
app.get('/api/diaries', (req, res) => {
  res.json({ success: true, diaries: diariesStore });
});

// 2. Create new diary (Admin)
app.post('/api/diaries', (req, res) => {
  const newDiary: Diary = {
    id: `diary-${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-'),
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon || 'BookOpen',
    coverColor: req.body.coverColor || '#2b1b17',
    spineColor: req.body.spineColor || '#1a100d',
    accentColor: req.body.accentColor || '#d4af37',
    entryCount: 0,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    isPinned: req.body.isPinned || false,
    isFeatured: req.body.isFeatured || false
  };

  diariesStore.push(newDiary);
  res.status(201).json({ success: true, diary: newDiary });
});

// 3. Update diary
app.put('/api/diaries/:id', (req, res) => {
  const { id } = req.params;
  const index = diariesStore.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Diary not found' });
  }

  diariesStore[index] = { ...diariesStore[index], ...req.body };
  res.json({ success: true, diary: diariesStore[index] });
});

// 4. Delete diary
app.delete('/api/diaries/:id', (req, res) => {
  const { id } = req.params;
  diariesStore = diariesStore.filter(d => d.id !== id);
  entriesStore = entriesStore.filter(e => e.diaryId !== id);
  res.json({ success: true, message: 'Diary deleted successfully' });
});

// 5. Get entries
app.get('/api/entries', (req, res) => {
  const { diaryId, tag, search, sort } = req.query;
  let result = [...entriesStore];

  if (diaryId) {
    result = result.filter(e => e.diaryId === diaryId);
  }

  if (tag) {
    result = result.filter(e => e.tags.map(t => t.toLowerCase()).includes(String(tag).toLowerCase()));
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.subtitle.toLowerCase().includes(q) ||
      e.previewParagraph.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'oldest') {
    result.sort((a, b) => new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime());
  } else if (sort === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  } else if (sort === 'commented') {
    result.sort((a, b) => b.commentsCount - a.commentsCount);
  } else {
    // Newest default
    result.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }

  res.json({ success: true, entries: result });
});

// 6. Get single entry by ID or slug
app.get('/api/entries/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const entry = entriesStore.find(e => e.id === idOrSlug || e.slug === idOrSlug);
  if (!entry) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }
  totalViews += 1;
  res.json({ success: true, entry });
});

// 7. Create entry
app.post('/api/entries', (req, res) => {
  const newEntry: JournalEntry = {
    id: `entry-${Date.now()}`,
    diaryId: req.body.diaryId,
    entryNumber: req.body.entryNumber || `Entry ${String(entriesStore.length + 1).padStart(3, '0')}`,
    title: req.body.title,
    subtitle: req.body.subtitle || '',
    publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    readingTime: req.body.readingTime || '5 min read',
    tags: req.body.tags || ['Reflections'],
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    previewParagraph: req.body.previewParagraph || req.body.content.slice(0, 160) + '...',
    content: req.body.content,
    likes: 0,
    commentsCount: 0,
    isPinned: req.body.isPinned || false,
    isFeatured: req.body.isFeatured || false,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  };

  entriesStore.unshift(newEntry);

  // Update diary entry count & last updated
  const diaryIndex = diariesStore.findIndex(d => d.id === req.body.diaryId);
  if (diaryIndex !== -1) {
    diariesStore[diaryIndex].entryCount += 1;
    diariesStore[diaryIndex].lastUpdated = newEntry.publishedDate;
  }

  res.status(201).json({ success: true, entry: newEntry });
});

// 8. Update entry
app.put('/api/entries/:id', (req, res) => {
  const { id } = req.params;
  const index = entriesStore.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }

  entriesStore[index] = {
    ...entriesStore[index],
    ...req.body,
    updatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  };
  res.json({ success: true, entry: entriesStore[index] });
});

// 9. Delete entry
app.delete('/api/entries/:id', (req, res) => {
  const { id } = req.params;
  const entry = entriesStore.find(e => e.id === id);
  if (entry) {
    const diary = diariesStore.find(d => d.id === entry.diaryId);
    if (diary && diary.entryCount > 0) {
      diary.entryCount -= 1;
    }
  }
  entriesStore = entriesStore.filter(e => e.id !== id);
  res.json({ success: true, message: 'Entry deleted' });
});

// 10. Like entry
app.post('/api/entries/:id/like', (req, res) => {
  const { id } = req.params;
  const entry = entriesStore.find(e => e.id === id);
  if (!entry) {
    return res.status(404).json({ success: false, message: 'Entry not found' });
  }
  entry.likes += 1;
  res.json({ success: true, likes: entry.likes });
});

// 11. Comments API
app.get('/api/comments/:entryId', (req, res) => {
  const { entryId } = req.params;
  const comments = commentsStore.filter(c => c.entryId === entryId);
  res.json({ success: true, comments });
});

app.post('/api/comments', (req, res) => {
  const { entryId, authorName, authorAvatar, authorRole, content, parentId } = req.body;
  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    entryId,
    authorName: authorName || 'Anonymous Scholar',
    authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorRole: authorRole || 'Reader',
    content,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    likes: 0,
    parentId: parentId || null
  };

  commentsStore.push(newComment);

  // Update comment count on entry
  const entry = entriesStore.find(e => e.id === entryId);
  if (entry) {
    entry.commentsCount += 1;
  }

  res.status(201).json({ success: true, comment: newComment });
});

app.post('/api/comments/:id/like', (req, res) => {
  const { id } = req.params;
  const comment = commentsStore.find(c => c.id === id);
  if (comment) {
    comment.likes += 1;
    return res.json({ success: true, likes: comment.likes });
  }
  res.status(404).json({ success: false, message: 'Comment not found' });
});

app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  commentsStore = commentsStore.filter(c => c.id !== id);
  res.json({ success: true, message: 'Comment deleted' });
});

// 12. Newsletter Subscribe
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  subscribersStore.push({ email, date: new Date().toISOString() });
  res.json({ success: true, message: 'Welcome to Mahi\'s Quill dispatch.' });
});

// 13. Follow author
app.post('/api/follow', (req, res) => {
  followersCount += 1;
  res.json({ success: true, followers: followersCount });
});

// 14. Global Stats
app.get('/api/stats', (req, res) => {
  const totalLikes = entriesStore.reduce((acc, curr) => acc + curr.likes, 0);
  res.json({
    success: true,
    stats: {
      diariesCount: diariesStore.length,
      entriesCount: entriesStore.length,
      totalLikes,
      totalViews,
      followersCount,
      subscribersCount: subscribersStore.length
    }
  });
});

// 15. RSS Feed XML
app.get('/api/rss.xml', (req, res) => {
  res.setHeader('Content-Type', 'text/xml');
  const items = entriesStore.map(e => `
    <item>
      <title><![CDATA[${e.title}]]></title>
      <description><![CDATA[${e.previewParagraph}]]></description>
      <pubDate>${e.publishedDate}</pubDate>
      <author>Mahi 🦢</author>
      <category>${e.tags.join(', ')}</category>
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>The Unwritten Pages | Mahi 🦢</title>
      <description>Thoughts Nobody Ordered. Learning as a Journey.</description>
      <link>https://unwritten-pages.internal</link>
      ${items}
    </channel>
  </rss>`;

  res.send(xml);
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Library server running on http://localhost:${PORT}`);
  });
}

startServer();
