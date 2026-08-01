import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import pool, { initDB } from './src/db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// DATABASE ROUTES

// 1. Get all diaries
app.get('/api/diaries', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM diaries ORDER BY is_pinned DESC, last_updated DESC');
    res.json({ success: true, diaries: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 2. Create new diary (Admin)
app.post('/api/diaries', async (req, res) => {
  try {
    const { title, description, icon, coverColor, spineColor, accentColor, isPinned, isFeatured } = req.body;
    const slug = req.body.slug || title.toLowerCase().replace(/\s+/g, '-');
    const id = `diary-${Date.now()}`;
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const { rows } = await pool.query(
      `INSERT INTO diaries (id, slug, title, description, icon, cover_color, spine_color, accent_color, entry_count, last_updated, is_pinned, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,$9,$10,$11) RETURNING *`,
      [id, slug, title, description, icon || 'BookOpen', coverColor || '#2b1b17', spineColor || '#1a100d', accentColor || '#d4af37', lastUpdated, isPinned || false, isFeatured || false]
    );
    res.status(201).json({ success: true, diary: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 3. Update diary
app.put('/api/diaries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, coverColor, spineColor, accentColor, isPinned, isFeatured } = req.body;

    const { rows } = await pool.query(
      `UPDATE diaries SET title=COALESCE($1,title), description=COALESCE($2,description), icon=COALESCE($3,icon),
       cover_color=COALESCE($4,cover_color), spine_color=COALESCE($5,spine_color), accent_color=COALESCE($6,accent_color),
       is_pinned=COALESCE($7,is_pinned), is_featured=COALESCE($8,is_featured) WHERE id=$9 RETURNING *`,
      [title, description, icon, coverColor, spineColor, accentColor, isPinned, isFeatured, id]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Diary not found' });
    res.json({ success: true, diary: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 4. Delete diary
app.delete('/api/diaries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM diaries WHERE id=$1', [id]);
    res.json({ success: true, message: 'Diary deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 5. Get entries
app.get('/api/entries', async (req, res) => {
  try {
    const { diaryId, tag, search, sort } = req.query;
    let query = 'SELECT * FROM entries WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (diaryId) {
      query += ` AND diary_id=$${paramIndex++}`;
      params.push(diaryId);
    }
    if (tag) {
      query += ` AND $${paramIndex++} = ANY(tags)`;
      params.push(String(tag));
    }
    if (search) {
      query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(subtitle) LIKE $${paramIndex} OR LOWER(preview_paragraph) LIKE $${paramIndex} OR LOWER(content) LIKE $${paramIndex})`;
      params.push(`%${String(search).toLowerCase()}%`);
      paramIndex++;
    }

    if (sort === 'oldest') query += ' ORDER BY published_date ASC';
    else if (sort === 'popular') query += ' ORDER BY likes DESC';
    else if (sort === 'commented') query += ' ORDER BY comments_count DESC';
    else query += ' ORDER BY published_date DESC';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, entries: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 6. Get single entry
app.get('/api/entries/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const { rows } = await pool.query('SELECT * FROM entries WHERE id=$1 OR slug=$1', [idOrSlug]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Entry not found' });

    await pool.query('UPDATE stats SET total_views = total_views + 1 WHERE id=1');
    res.json({ success: true, entry: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 7. Create entry
app.post('/api/entries', async (req, res) => {
  try {
    const { diaryId, title, subtitle, readingTime, tags, coverImage, content, isPinned, isFeatured } = req.body;
    const id = `entry-${Date.now()}`;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const previewParagraph = req.body.previewParagraph || content.slice(0, 160) + '...';

    // Get next entry number
    const { rows: countRows } = await pool.query('SELECT COUNT(*)::int as cnt FROM entries WHERE diary_id=$1', [diaryId]);
    const entryNumber = `Entry ${String(countRows[0].cnt + 1).padStart(3, '0')}`;

    const { rows } = await pool.query(
      `INSERT INTO entries (id, diary_id, entry_number, title, subtitle, published_date, updated_date, reading_time, tags, cover_image, preview_paragraph, content, likes, comments_count, is_pinned, is_featured, slug)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,0,0,$13,$14,$15) RETURNING *`,
      [id, diaryId, entryNumber, title, subtitle || '', now, now, readingTime || '5 min read', tags || ['Reflections'], coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80', previewParagraph, content, isPinned || false, isFeatured || false, slug]
    );

    // Update diary entry count
    await pool.query('UPDATE diaries SET entry_count = entry_count + 1, last_updated = $1 WHERE id = $2', [now, diaryId]);

    res.status(201).json({ success: true, entry: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 8. Update entry
app.put('/api/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const { rows } = await pool.query(
      `UPDATE entries SET title=COALESCE($1,title), subtitle=COALESCE($2,subtitle), content=COALESCE($3,content),
       tags=COALESCE($4,tags), cover_image=COALESCE($5,cover_image), reading_time=COALESCE($6,reading_time),
       updated_date=$7, is_pinned=COALESCE($8,is_pinned), is_featured=COALESCE($9,is_featured) WHERE id=$10 RETURNING *`,
      [req.body.title, req.body.subtitle, req.body.content, req.body.tags, req.body.coverImage, req.body.readingTime, now, req.body.isPinned, req.body.isFeatured, id]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, entry: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 9. Delete entry
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT diary_id FROM entries WHERE id=$1', [id]);
    await pool.query('DELETE FROM entries WHERE id=$1', [id]);

    if (rows.length) {
      await pool.query('UPDATE diaries SET entry_count = GREATEST(entry_count - 1, 0) WHERE id=$1', [rows[0].diary_id]);
    }
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 10. Like entry
app.post('/api/entries/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('UPDATE entries SET likes = likes + 1 WHERE id=$1 RETURNING likes', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, likes: rows[0].likes });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 11. Comments API
app.get('/api/comments/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;
    const { rows } = await pool.query('SELECT * FROM comments WHERE entry_id=$1 ORDER BY created_at ASC', [entryId]);
    res.json({ success: true, comments: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { entryId, authorName, authorAvatar, authorRole, content, parentId } = req.body;
    const id = `comm-${Date.now()}`;
    const createdAt = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const { rows } = await pool.query(
      `INSERT INTO comments (id, entry_id, author_name, author_avatar, author_role, content, created_at, likes, parent_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,0,$8) RETURNING *`,
      [id, entryId, authorName || 'Anonymous Scholar', authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', authorRole || 'Reader', content, createdAt, parentId || null]
    );

    await pool.query('UPDATE entries SET comments_count = comments_count + 1 WHERE id=$1', [entryId]);
    res.status(201).json({ success: true, comment: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.post('/api/comments/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('UPDATE comments SET likes = likes + 1 WHERE id=$1 RETURNING likes', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, likes: rows[0].likes });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM comments WHERE id=$1', [id]);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 12. Newsletter Subscribe
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    await pool.query('INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]);
    res.json({ success: true, message: "Welcome to Mahi's Quill dispatch." });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 13. Follow author
app.post('/api/follow', async (req, res) => {
  try {
    await pool.query('UPDATE stats SET followers_count = followers_count + 1 WHERE id=1');
    const { rows } = await pool.query('SELECT followers_count FROM stats WHERE id=1');
    res.json({ success: true, followers: rows[0].followers_count });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 14. Global Stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await pool.query('SELECT * FROM stats WHERE id=1');
    const entriesCount = await pool.query('SELECT COUNT(*)::int as cnt FROM entries');
    const diariesCount = await pool.query('SELECT COUNT(*)::int as cnt FROM diaries');
    const totalLikes = await pool.query('SELECT COALESCE(SUM(likes),0)::int as total FROM entries');
    const subscribersCount = await pool.query('SELECT COUNT(*)::int as cnt FROM subscribers');

    res.json({
      success: true,
      stats: {
        diariesCount: diariesCount.rows[0].cnt,
        entriesCount: entriesCount.rows[0].cnt,
        totalLikes: totalLikes.rows[0].total,
        totalViews: stats.rows[0].total_views,
        followersCount: stats.rows[0].followers_count,
        subscribersCount: subscribersCount.rows[0].cnt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 15. RSS Feed XML
app.get('/api/rss.xml', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM entries ORDER BY published_date DESC');
    res.setHeader('Content-Type', 'text/xml');
    const items = rows.map(e => `
      <item>
        <title><![CDATA[${e.title}]]></title>
        <description><![CDATA[${e.preview_paragraph}]]></description>
        <pubDate>${e.published_date}</pubDate>
        <author>Mahi</author>
        <category>${e.tags?.join(', ') || ''}</category>
      </item>
    `).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>The Unwritten Pages | Mahi</title>
        <description>Thoughts Nobody Ordered. Learning as a Journey.</description>
        <link>https://unwritten-pages.internal</link>
        ${items}
      </channel>
    </rss>`;
    res.send(xml);
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 16. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    const { rows: existing } = await pool.query('SELECT id FROM users WHERE username=$1', [username.toLowerCase()]);
    if (existing.length) return res.status(400).json({ success: false, message: 'Username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const id = `${role === 'Admin' ? 'author' : 'reader'}-${username.toLowerCase()}`;
    const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

    const { rows } = await pool.query(
      `INSERT INTO users (id, username, password_hash, name, email, avatar, role, following_author)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true) RETURNING id, username, name, email, avatar, role, following_author, bookmarks, liked_entries, reading_streak`,
      [id, username.toLowerCase(), hash, username.charAt(0).toUpperCase() + username.slice(1), `${username.toLowerCase()}@example.com`, avatar, role || 'Reader']
    );
    res.status(201).json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 17. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password required' });

    const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [username.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Account not found' });

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Incorrect password' });

    const { password_hash, ...user } = rows[0];
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// 18. User: Update bookmarks/likes
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bookmarks, likedEntries, readingStreak } = req.body;

    const { rows } = await pool.query(
      `UPDATE users SET bookmarks=COALESCE($1,bookmarks), liked_entries=COALESCE($2,liked_entries), reading_streak=COALESCE($3,reading_streak)
       WHERE id=$4 RETURNING id, username, name, email, avatar, role, following_author, bookmarks, liked_entries, reading_streak`,
      [bookmarks, likedEntries, readingStreak, id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// VITE MIDDLEWARE + START
async function startServer() {
  await initDB();

  // Seed author account if not exists
  const { rows } = await pool.query("SELECT id FROM users WHERE username='manoshruthis'");
  if (!rows.length) {
    const hash = await bcrypt.hash('3678', 10);
    await pool.query(
      `INSERT INTO users (id, username, password_hash, name, email, avatar, role, following_author)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true)`,
      ['author-mahi', 'manoshruthis', hash, 'Mahi', 'mahi@library.internal', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 'Admin']
    );
    console.log('Author account created');
  }

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

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
