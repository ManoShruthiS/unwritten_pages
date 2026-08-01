export interface Diary {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  coverColor: string;
  spineColor: string;
  accentColor: string;
  entryCount: number;
  lastUpdated: string;
  isPinned?: boolean;
  isFeatured?: boolean;
}

export interface JournalEntry {
  id: string;
  diaryId: string;
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
