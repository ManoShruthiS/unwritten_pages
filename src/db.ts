import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;

export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        avatar TEXT,
        role VARCHAR(20) DEFAULT 'Reader',
        following_author BOOLEAN DEFAULT true,
        bookmarks TEXT[] DEFAULT '{}',
        liked_entries TEXT[] DEFAULT '{}',
        reading_streak INT DEFAULT 1,
        last_read_date VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS diaries (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'BookOpen',
        cover_color VARCHAR(50) DEFAULT '#2b1b17',
        spine_color VARCHAR(50) DEFAULT '#1a100d',
        accent_color VARCHAR(50) DEFAULT '#d4af37',
        entry_count INT DEFAULT 0,
        last_updated VARCHAR(100),
        is_pinned BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        user_id VARCHAR(255) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS entries (
        id VARCHAR(255) PRIMARY KEY,
        diary_id VARCHAR(255) REFERENCES diaries(id) ON DELETE CASCADE,
        entry_number VARCHAR(50),
        title VARCHAR(500) NOT NULL,
        subtitle VARCHAR(500),
        published_date VARCHAR(100),
        updated_date VARCHAR(100),
        reading_time VARCHAR(50),
        tags TEXT[] DEFAULT '{}',
        cover_image TEXT,
        preview_paragraph TEXT,
        content TEXT,
        likes INT DEFAULT 0,
        comments_count INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        slug VARCHAR(500)
      );

      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(255) PRIMARY KEY,
        entry_id VARCHAR(255) REFERENCES entries(id) ON DELETE CASCADE,
        author_name VARCHAR(255),
        author_avatar TEXT,
        author_role VARCHAR(20) DEFAULT 'Reader',
        content TEXT,
        created_at VARCHAR(100),
        likes INT DEFAULT 0,
        parent_id VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        date TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS stats (
        id INT PRIMARY KEY DEFAULT 1,
        followers_count INT DEFAULT 142,
        total_views INT DEFAULT 3820
      );

      INSERT INTO stats (id, followers_count, total_views)
      VALUES (1, 142, 3820)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Database tables initialized');
  } finally {
    client.release();
  }
}
