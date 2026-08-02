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

        is_pinned BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        slug VARCHAR(500)
      );




    `);
    console.log('Database tables initialized');
  } finally {
    client.release();
  }
}
