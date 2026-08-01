export type CoverColor = 
  | '#2b1b17' // Deep Mahogany
  | '#1c2e3b' // Sapphire Blue
  | '#1c3b28' // Emerald Forest
  | '#3b201c' // Rust Chestnut
  | '#2d1c3b' // Amethyst
  | '#382a1e' // Warm Walnut
  | '#1f1f2e' // Onyx Night
  | '#4a1515' // Crimson Red
  | '#2d333b'; // Slate Gray

export interface DiarySection {
  id: string;
  name: string;
}

export interface Diary {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  coverColor: CoverColor | string;
  spineColor: string;
  accentColor: string;
  entryCount: number;
  lastUpdated: string;
  sections: DiarySection[];
  isPinned?: boolean;
  isFeatured?: boolean;
}

export interface JournalEntry {
  id: string;
  diaryId: string;
  sectionId: string;
  entryNumber: string; // e.g. "Entry 001"
  title: string;
  subtitle: string;
  publishedDate: string;
  updatedDate: string;
  readingTime: string;
  tags: string[];
  coverImage: string;
  previewParagraph: string;
  content: string; // Rich Markdown content
  likes: number;
  commentsCount: number;
  isPinned?: boolean;
  isFeatured?: boolean;
  slug: string;
}

export interface Comment {
  id: string;
  entryId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: 'Admin' | 'Reader';
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string | null;
  replies?: Comment[];
  isReported?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Reader';
  followingAuthor: boolean;
  bookmarks: string[]; // entry IDs
  likedEntries: string[]; // entry IDs
  readingStreak: number;
  lastReadDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}
