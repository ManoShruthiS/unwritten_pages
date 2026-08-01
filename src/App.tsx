import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { LibraryShelves } from './components/LibraryShelves';
import { DiaryView } from './components/DiaryView';
import { JournalEntryView } from './components/JournalEntryView';
import { AuthorDashboard } from './components/AuthorDashboard';
import { SearchModal } from './components/SearchModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { NewsletterModal } from './components/NewsletterModal';
import { RSSModal } from './components/RSSModal';
import { Footer } from './components/Footer';

import { Diary, JournalEntry, Comment, UserProfile, NotificationItem } from './types';
import { INITIAL_DIARIES, INITIAL_ENTRIES, INITIAL_COMMENTS } from './data/initialData';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'library' | 'diary' | 'entry' | 'admin'>('landing');
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Data Stores
  const [diaries, setDiaries] = useState<Diary[]>(INITIAL_DIARIES);
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [stats, setStats] = useState({
    diariesCount: INITIAL_DIARIES.length,
    entriesCount: INITIAL_ENTRIES.length,
    totalLikes: INITIAL_ENTRIES.reduce((a, b) => a + b.likes, 0),
    totalViews: 3820,
    followersCount: 142,
    subscribersCount: 18
  });

  // User Profile & Preferences
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('unwritten_user_profile');
      return saved ? JSON.parse(saved) : {
        id: 'usr-1',
        name: 'Scholar Reader',
        email: 'reader@library.internal',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'Reader',
        followingAuthor: true,
        bookmarks: ['ch-001', 'ch-003'],
        likedEntries: ['ch-001'],
        readingStreak: 3
      };
    } catch {
      return {
        id: 'usr-1',
        name: 'Scholar Reader',
        email: 'reader@library.internal',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'Reader',
        followingAuthor: true,
        bookmarks: ['ch-001', 'ch-003'],
        likedEntries: ['ch-001'],
        readingStreak: 3
      };
    }
  });

  const [isParchmentMode, setIsParchmentMode] = useState(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isRssOpen, setIsRssOpen] = useState(false);

  // Notifications Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'New Page Bound',
      message: 'Mahi swan bound "Mistakes That Made Me Better" into The CodersHigh Journal.',
      date: 'July 28, 2026',
      read: false
    },
    {
      id: 'n-2',
      title: 'Quill Reflection Published',
      message: 'Mahi bound "The Spark of Generative Intelligence" into The AI Journal.',
      date: 'July 25, 2026',
      read: false
    }
  ]);

  // Persist User Profile
  useEffect(() => {
    try {
      localStorage.setItem('unwritten_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Sync API Data on Mount
  useEffect(() => {
    fetch('/api/diaries')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.diaries) setDiaries(data.diaries);
      })
      .catch(() => {});

    fetch('/api/entries')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.entries) setEntries(data.entries);
      })
      .catch(() => {});

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut for Cmd+K Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleOpenLibrary = () => {
    setCurrentView('library');
    setSelectedDiary(null);
    setSelectedEntry(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDiary = (diary: Diary) => {
    setSelectedDiary(diary);
    setCurrentView('diary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    // Find parent diary if not currently set
    if (!selectedDiary) {
      const parent = diaries.find(d => d.id === entry.diaryId);
      if (parent) setSelectedDiary(parent);
    }
    setCurrentView('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch entry comments
    fetch(`/api/comments/${entry.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.comments) {
          setComments(data.comments);
        }
      })
      .catch(() => {});
  };

  const handleRandomEntry = () => {
    if (entries.length === 0) return;
    const randomIdx = Math.floor(Math.random() * entries.length);
    handleSelectEntry(entries[randomIdx]);
  };

  const handleLikeEntry = (entryId: string) => {
    fetch(`/api/entries/${entryId}/like`, { method: 'POST' }).catch(() => {});

    setEntries(prev => prev.map(e => {
      if (e.id === entryId) {
        return { ...e, likes: e.likes + 1 };
      }
      return e;
    }));

    setUser(prev => {
      if (!prev.likedEntries.includes(entryId)) {
        return { ...prev, likedEntries: [...prev.likedEntries, entryId] };
      }
      return prev;
    });
  };

  const handleBookmarkEntry = (entryId: string) => {
    setUser(prev => {
      const exists = prev.bookmarks.includes(entryId);
      const updated = exists
        ? prev.bookmarks.filter(id => id !== entryId)
        : [...prev.bookmarks, entryId];
      return { ...prev, bookmarks: updated };
    });
  };

  const handleToggleFollow = () => {
    fetch('/api/follow', { method: 'POST' }).catch(() => {});
    setUser(prev => ({
      ...prev,
      followingAuthor: !prev.followingAuthor
    }));
    setStats(prev => ({
      ...prev,
      followersCount: user.followingAuthor ? prev.followersCount - 1 : prev.followersCount + 1
    }));
  };

  const handleAddComment = (content: string, parentId?: string | null) => {
    if (!selectedEntry) return;

    const newCommentObj = {
      entryId: selectedEntry.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: 'Reader' as const,
      content,
      parentId: parentId || null
    };

    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCommentObj)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.comment) {
          setComments(prev => [...prev, data.comment]);
          setEntries(prev => prev.map(e => e.id === selectedEntry.id ? { ...e, commentsCount: e.commentsCount + 1 } : e));
        }
      })
      .catch(() => {
        // Fallback local update
        const fallbackComment = {
          id: `comm-${Date.now()}`,
          ...newCommentObj,
          createdAt: 'Just now',
          likes: 0
        };
        setComments(prev => [...prev, fallbackComment]);
      });
  };

  const handleLikeComment = (commentId: string) => {
    fetch(`/api/comments/${commentId}/like`, { method: 'POST' }).catch(() => {});
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const handleSubscribeNewsletter = async (email: string) => {
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStats(prev => ({ ...prev, subscribersCount: prev.subscribersCount + 1 }));
        return true;
      }
      return false;
    } catch {
      return true; // Fallback success
    }
  };

  const handleCreateDiary = (diaryData: Partial<Diary>) => {
    fetch('/api/diaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diaryData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.diary) {
          setDiaries(prev => [...prev, data.diary]);
        }
      })
      .catch(() => {
        const fallbackDiary: Diary = {
          id: `diary-${Date.now()}`,
          slug: diaryData.title?.toLowerCase().replace(/\s+/g, '-') || 'new-diary',
          title: diaryData.title || 'Untitled Volume',
          description: diaryData.description || '',
          icon: diaryData.icon || 'BookOpen',
          coverColor: diaryData.coverColor || '#2b1b17',
          spineColor: '#1a100d',
          accentColor: '#d4af37',
          entryCount: 0,
          lastUpdated: 'Today'
        };
        setDiaries(prev => [...prev, fallbackDiary]);
      });
  };

  const handleDeleteDiary = (diaryId: string) => {
    fetch(`/api/diaries/${diaryId}`, { method: 'DELETE' }).catch(() => {});
    setDiaries(prev => prev.filter(d => d.id !== diaryId));
    setEntries(prev => prev.filter(e => e.diaryId !== diaryId));
  };

  const handleCreateEntry = (entryData: Partial<JournalEntry>) => {
    fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.entry) {
          setEntries(prev => [data.entry, ...prev]);
        }
      })
      .catch(() => {
        const fallbackEntry: JournalEntry = {
          id: `entry-${Date.now()}`,
          diaryId: entryData.diaryId || diaries[0]?.id,
          entryNumber: `Entry ${String(entries.length + 1).padStart(3, '0')}`,
          title: entryData.title || 'New Reflection',
          subtitle: entryData.subtitle || '',
          publishedDate: 'Just now',
          updatedDate: 'Just now',
          readingTime: entryData.readingTime || '5 min read',
          tags: entryData.tags || ['Reflections'],
          coverImage: entryData.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
          previewParagraph: entryData.previewParagraph || '',
          content: entryData.content || '',
          likes: 0,
          commentsCount: 0,
          slug: entryData.title?.toLowerCase().replace(/\s+/g, '-') || 'entry'
        };
        setEntries(prev => [fallbackEntry, ...prev]);
      });
  };

  const handleDeleteEntry = (entryId: string) => {
    fetch(`/api/entries/${entryId}`, { method: 'DELETE' }).catch(() => {});
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const handleDeleteComment = (commentId: string) => {
    fetch(`/api/comments/${commentId}`, { method: 'DELETE' }).catch(() => {});
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const bookmarkedEntries = entries.filter(e => user.bookmarks.includes(e.id));
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans-body transition-colors duration-300 ${isParchmentMode ? 'page-parchment' : 'bg-[#0d0d0d] text-[#e5e5e5]'}`}>
      
      {/* Sticky Header */}
      <Header
        onOpenLibrary={handleOpenLibrary}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        onRandomEntry={handleRandomEntry}
        user={user}
        onToggleFollow={handleToggleFollow}
        unreadNotifications={unreadNotifications}
        isParchmentMode={isParchmentMode}
        onToggleParchment={() => setIsParchmentMode(!isParchmentMode)}
        currentView={currentView}
      />

      {/* Main View Transition Stage */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {currentView === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HeroLanding
                onOpenLibrary={handleOpenLibrary}
                totalDiariesCount={diaries.length}
                totalEntriesCount={entries.length}
              />
              <LibraryShelves
                diaries={diaries}
                onSelectDiary={handleSelectDiary}
                onOpenAdmin={() => setCurrentView('admin')}
              />
            </motion.div>
          )}

          {currentView === 'library' && (
            <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LibraryShelves
                diaries={diaries}
                onSelectDiary={handleSelectDiary}
                onOpenAdmin={() => setCurrentView('admin')}
              />
            </motion.div>
          )}

          {currentView === 'diary' && selectedDiary && (
            <motion.div key="diary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DiaryView
                diary={selectedDiary}
                entries={entries.filter(e => e.diaryId === selectedDiary.id)}
                onSelectEntry={handleSelectEntry}
                onBackToLibrary={handleOpenLibrary}
                onBookmarkEntry={handleBookmarkEntry}
                bookmarkedIds={user.bookmarks}
              />
            </motion.div>
          )}

          {currentView === 'entry' && selectedEntry && (
            <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <JournalEntryView
                entry={selectedEntry}
                diary={selectedDiary || diaries.find(d => d.id === selectedEntry.diaryId)}
                allEntries={entries}
                comments={comments}
                onSelectEntry={handleSelectEntry}
                onBackToDiary={() => setCurrentView('diary')}
                onLikeEntry={handleLikeEntry}
                onBookmarkEntry={handleBookmarkEntry}
                isBookmarked={user.bookmarks.includes(selectedEntry.id)}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                isParchmentMode={isParchmentMode}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthorDashboard
                diaries={diaries}
                entries={entries}
                comments={comments}
                stats={stats}
                onCreateDiary={handleCreateDiary}
                onDeleteDiary={handleDeleteDiary}
                onCreateEntry={handleCreateEntry}
                onDeleteEntry={handleDeleteEntry}
                onDeleteComment={handleDeleteComment}
                onClose={() => setCurrentView('library')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenRSS={() => setIsRssOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        diaries={diaries}
        entries={entries}
        onSelectDiary={handleSelectDiary}
        onSelectEntry={handleSelectEntry}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedEntries={bookmarkedEntries}
        onSelectEntry={handleSelectEntry}
        onRemoveBookmark={handleBookmarkEntry}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
      />

      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
        onSubscribe={handleSubscribeNewsletter}
      />

      <RSSModal
        isOpen={isRssOpen}
        onClose={() => setIsRssOpen(false)}
      />

    </div>
  );
}
