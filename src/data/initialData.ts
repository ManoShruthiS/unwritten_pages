import { Diary, JournalEntry } from '../types';

export const INITIAL_DIARIES: Diary[] = [
  {
    id: 'codershigh',
    slug: 'codershigh-journal',
    title: 'The CodersHigh Journal',
    description: 'My journey through CodersHigh—every lesson, challenge, breakthrough, and reflection documented one page at a time.',
    icon: 'Code',
    coverColor: '#2b1b17', // Deep mahogany
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
    coverColor: '#1c2e3b', // Deep sapphire blue leather
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
    coverColor: '#1c3b28', // Emerald forest leather
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
    coverColor: '#3b201c', // Rust chestnut leather
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
    coverColor: '#2d1c3b', // Royal amethyst leather
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
    coverColor: '#382a1e', // Warm walnut leather
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
    coverColor: '#1f1f2e', // Onyx night leather
    spineColor: '#12121d',
    accentColor: '#cbd5e1',
    entryCount: 1,
    lastUpdated: 'June 29, 2026',
    sections: [
      { id: 'pr-discipline', name: 'Discipline' },
      { id: 'pr-focus', name: 'Focus' }
    ]
  }
];

export const INITIAL_ENTRIES: JournalEntry[] = [
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
    content: `
# The First Page in the Dark

Every journey starts with silence. Sitting at my desk with a steaming mug of black tea and a freshly cloned repository, I realized that learning to program isn't merely about memorizing syntax—it is about cultivating a relationship with problem-solving.

> "We don't write code to tell the machine what to do; we write code to structure our own thinking."

When I joined **CodersHigh**, I made a promise to myself: I would document not only the code that compiles, but the confusion, the dead ends, and the quiet epiphanies along the way.

---

### What CodersHigh Represents to Me

1. **Deliberate Practice over Speed**: Rushing through tutorials creates an illusion of competence. True skill is built in the friction of debugging.
2. **Community of Seekers**: Surrounding myself with peers who treat engineering as a craft.
3. **The Unwritten Promise**: To keep writing, one page at a time, until the complex becomes intuitive.

\`\`\`typescript
// My inaugural execution
function initiateJourney(author: string): string {
  const mindset = "curiosity";
  const horizon = "infinite";
  return \`\${author} embarked on the unwritten path with \${mindset} toward an \${horizon} destination.\`;
}

console.log(initiateJourney("Mahi 🦢"));
\`\`\`

> **Note on Intention**: As I turn to page 2, the goal isn't perfection; it's consistency.
    `,
    likes: 42,

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
    content: `
# The Physics of Version Control

In my second week at **CodersHigh**, Git stopped being a scary list of memorized commands (\`git add .\`, \`git commit -m "fixed stuff"\`) and started making conceptual sense.

### The Mental Model

Think of Git not as a file syncer like Dropbox, but as an **immutable append-only tree of snapshots**. Every commit is a state node pointed to by its parent commit hash.

| Command | Mental Analogy |
| :--- | :--- |
| \`git status\` | Looking into the mirror before stepping outside |
| \`git branch\` | Opening a parallel timeline to test an idea safely |
| \`git merge\` | Braiding two streams of work back into one river |
| \`git rebase\` | Re-writing history so the story flows in a straight line |

\`\`\`bash
# Creating a feature branch with clean commit history
git checkout -b feature/quill-theme
git commit -m "feat(ui): add antique gold accents to library shelves"
git fetch origin main
git rebase origin/main
\`\`\`

> **Insight**: When you encounter a merge conflict, Git isn't breaking—it's humbly admitting: *"I value your intent too much to guess which version matters more."*
    `,
    likes: 38,

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
    content: `
# Architecture from the Ground Up

Building my first full-stack application at CodersHigh taught me that architecture is the art of making decisions early so that late changes don't crush you.

### Key Learnings

1. **Component Atomicity**: Keep UI components focused on a single responsibility.
2. **State Location**: Lift state only as high as necessary, but no higher.
3. **Graceful Failures**: Always design empty states and loading states as first-class citizens.

\`\`\`tsx
// A custom hook for smooth scroll progress
import { useState, useEffect } from 'react';

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setProgress((currentScroll / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
\`\`\`

> "A project isn't finished when there is nothing left to add, but when there is nothing left to take away."
    `,
    likes: 54,

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
    content: `
# The Catalog of Helpful Failures

Looking back over the past few weeks, the code that broke taught me tenfold more than the code that worked on the first try.

### Three Mistakes I Won't Repeat

1. **Mutating State Directly in React**:
   - *Mistake*: \`items.push(newItem)\` instead of \`setItems([...items, newItem])\`.
   - *Lesson*: Immutability isn't just a rule—it's what enables React's reconciliation engine to trigger re-renders reliably.

2. **Neglecting Edge Cases in API Logic**:
   - *Mistake*: Assuming network calls always return HTTP 200 with complete payloads.
   - *Lesson*: Always account for null safety, timeouts, and network drops.

3. **Optimizing prematurely**:
   - *Mistake*: Wrapping every helper function in \`useCallback\` before measuring performance.
   - *Lesson*: Readability and clarity beat micro-optimizations every single time.

> "Experience is simply the name we give our mistakes." — Oscar Wilde
    `,
    likes: 49,

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
    content: `
# Navigating the Geometry of Meaning

In generative AI, text isn't represented as letters or words, but as **vectors in a continuous manifold**.

### Mathematical Foundations

The cosine similarity between two vector embeddings $u$ and $v$ is computed as:

$$\\text{similarity}(u, v) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$$

This simple equation allows us to find conceptually related documents, cluster memories, and perform semantic search across thousands of library pages in milliseconds.

\`\`\`python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Semantic vector comparison
vec_king = np.array([0.25, 0.88, 0.12])
vec_queen = np.array([0.28, 0.85, 0.15])
print(f"Semantic Alignment: {cosine_similarity(vec_king, vec_queen):.4f}")
\`\`\`

> **Observation**: The magic of LLMs isn't that they know everything—it's that they have synthesized a map of human thought.
    `,
    likes: 67,

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
    content: `
# The Quiet Elegance of Yield

Generators yield control back to the caller without destroying local stack state.

\`\`\`python
import functools
import time

function log_execution_time(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"[{func.__name__}] Executed in {duration * 1000:.2f}ms")
        return result
    return wrapper

@log_execution_time
def read_journal_pages(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            if line.strip():
                yield line.strip()
\`\`\`

> "Simple is better than complex. Readability counts." — The Zen of Python
    `,
    likes: 31,

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
    content: `
# The Sanctuary of Quiet Hours

I wrote this entry sitting by a window as evening twilight settled over my bookshelves.

There is a distinct difference between acquiring information and absorbing knowledge. Information is fast, fragmented, and loud. Knowledge is slow, structured, and quiet.

When we create spaces like *The Unwritten Pages*, we build a haven away from the algorithmic noise—a personal library where thoughts are allowed to take their time to ripen.

> "Reading is to the mind what exercise is to the body." — Joseph Addison
    `,
    likes: 89,

    isFeatured: true,
    slug: 'on-solitude-books-and-unhurried-learning'
  }
];
