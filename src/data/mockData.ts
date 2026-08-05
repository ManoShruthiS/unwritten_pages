import { Diary, JournalEntry } from '../types';

export const INITIAL_DIARIES: Diary[] = [
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

export const INITIAL_ENTRIES: JournalEntry[] = [];
