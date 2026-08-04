import { Diary, JournalEntry } from '../types';

export const INITIAL_DIARIES: Diary[] = [
  {
    id: 'diary-the-code-book',
    slug: 'the-code-book',
    title: 'The Code Book',
    description: 'Summaries, secret ciphers, and key takeaways from the science of secrecy and cryptography.',
    icon: 'Lock',
    coverColor: '#1c2e3b', // Deep Cipher Sapphire
    spineColor: '#101b24',
    accentColor: '#d4af37',
    entryCount: 1,
    lastUpdated: 'Today',
    isPinned: true,
    sections: [
      { id: 'sec-ciphers', name: 'Classical Ciphers' },
      { id: 'sec-enigma', name: 'Enigma & WWII' },
      { id: 'sec-quantum', name: 'Public Keys & Quantum Crypto' },
    ]
  }
];

export const INITIAL_ENTRIES: JournalEntry[] = [
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
    content: `# The Evolution of Secret Writing

> "History is shaped by secret messages sent, intercepted, and deciphered."

### Key Takeaways:
- **Steganography vs. Cryptography**: Hiding a message in plain sight versus scrambling its contents.
- **Monoalphabetic Ciphers**: How frequency analysis cracks simple substitution ciphers.
- **The Golden Rule**: Security depends on the secrecy of the key, not the algorithm.

*Ready for your chapter summaries and key takeaways!*`,
    likes: 1,
    commentsCount: 0,
    isPinned: true,
    slug: 'evolution-of-secret-writing'
  }
];
