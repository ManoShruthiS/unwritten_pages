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
import { RSSModal } from './components/RSSModal';
import { Footer } from './components/Footer';
import { AboutView } from './components/AboutView';
import { ExploreView } from './components/ExploreView';
import { LoginView } from './components/LoginView';
import { ReaderDashboard } from './components/ReaderDashboard';

import { Diary, JournalEntry, UserProfile, NotificationItem } from './types';
import { INITIAL_DIARIES, INITIAL_ENTRIES } from './data/initialData';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'library' | 'explore' | 'about' | 'diary' | 'entry' | 'admin' | 'reader' | 'login'>('landing');
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [adminActivePage, setAdminActivePage] = useState<string>('entries');

  // Data Stores
  const [diaries, setDiaries] = useState<Diary[]>(INITIAL_DIARIES);
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);


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

  // Authentication session (persisted)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('unwritten_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
  const handleNavigate = (view: 'landing' | 'library' | 'explore' | 'about' | 'login') => {
    setCurrentView(view);
    if (view === 'library') {
      setSelectedDiary(null);
      setSelectedEntry(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLibrary = () => {
    if (!isAuthenticated) {
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (user.role === 'Admin') {
      setCurrentView('admin');
      setAdminActivePage('write');
    } else {
      setCurrentView('reader');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDashboard = () => {
    if (user.role === 'Admin') {
      setCurrentView('admin');
      setAdminActivePage('write');
    } else {
      setCurrentView('reader');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('unwritten_auth');
    } catch (e) {
      console.error(e);
    }
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('unwritten_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    if (loggedInUser.role === 'Admin') {
      setCurrentView('landing'); // Redirect to home page per user request
    } else {
      setCurrentView('reader');
    }
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

    // Comments feature removed
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
    setUser(prev => ({
      ...prev,
      followingAuthor: !prev.followingAuthor
    }));
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
          lastUpdated: 'Today',
          sections: diaryData.sections || []
        };
        setDiaries(prev => [...prev, fallbackDiary]);
      });
  };

  const handleDeleteDiary = (diaryId: string) => {
    fetch(`/api/diaries/${diaryId}`, { method: 'DELETE' }).catch(() => {});
    setDiaries(prev => prev.filter(d => d.id !== diaryId));
    setEntries(prev => prev.filter(e => e.diaryId !== diaryId));
  };

  const handleUpdateDiary = (diaryId: string, diaryData: Partial<Diary>) => {
    fetch(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diaryData)
    }).catch(() => {});
    setDiaries(prev => prev.map(d => (d.id === diaryId ? { ...d, ...diaryData } : d)));
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
          sectionId: entryData.sectionId || '',
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
          slug: entryData.title?.toLowerCase().replace(/\s+/g, '-') || 'entry',
          isPinned: entryData.isPinned || false,
          isFeatured: entryData.isFeatured || false
        };
        setEntries(prev => [fallbackEntry, ...prev]);
      });
  };

  const handleDeleteEntry = (entryId: string) => {
    fetch(`/api/entries/${entryId}`, { method: 'DELETE' }).catch(() => {});
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const handleUpdateEntry = (entryId: string, entryData: Partial<JournalEntry>) => {
    fetch(`/api/entries/${entryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData)
    }).catch(() => {});
    setEntries(prev => prev.map(e => (e.id === entryId ? { ...e, ...entryData } : e)));
  };

  const handleTogglePinDiary = (diaryId: string) => {
    setDiaries(prev => prev.map(d => {
      if (d.id !== diaryId) return d;
      const nextPin = !d.isPinned;
      fetch(`/api/diaries/${diaryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: nextPin })
      }).catch(() => {});
      return { ...d, isPinned: nextPin };
    }));
  };



  const bookmarkedEntries = entries.filter(e => user.bookmarks.includes(e.id));
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const heroCta = !isAuthenticated
    ? { label: 'Open Library', icon: 'book' }
    : user.role === 'Admin'
    ? { label: 'Start writing', icon: 'feather' }
    : { label: 'Enter Library', icon: 'book' };

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans-body transition-colors duration-300 ${isParchmentMode ? 'page-parchment' : 'text-[#e5e5e5]'}`}
      style={!isParchmentMode ? {
        backgroundImage: 'linear-gradient(rgba(13, 13, 13, 0.75), rgba(13, 13, 13, 0.95)), url(/bg-library.jpg)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      } : {}}
    >
      
      {/* Header — overlays hero on landing, sticky on other pages. */}
      {currentView !== 'landing' && currentView !== 'login' && (
        <div className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2d1f14]">
          <Header
            onNavigate={handleNavigate}
            onAdminNavigate={(page) => {
              setCurrentView('admin');
              setAdminActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
            onOpenDashboard={handleOpenDashboard}
            onSignOut={handleSignOut}
            user={user}
            isAuthenticated={isAuthenticated}
            currentView={currentView}
            adminActivePage={adminActivePage}
          />
        </div>
      )}

      {/* Main View Transition Stage */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {currentView === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              {/* Header overlays the hero section */}
              <div className="absolute top-0 left-0 right-0 z-50">
                <Header
                  onNavigate={handleNavigate}
                  onAdminNavigate={(page) => {
                    setCurrentView('admin');
                    setAdminActivePage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenBookmarks={() => setIsBookmarksOpen(true)}
                  onOpenDashboard={handleOpenDashboard}
                  onSignOut={handleSignOut}
                  user={user}
                  isAuthenticated={isAuthenticated}
                  currentView={currentView}
                  adminActivePage={adminActivePage}
                />
              </div>
              <HeroLanding
                onOpenLibrary={handleOpenLibrary}
                ctaLabel={heroCta.label}
                ctaIcon={heroCta.icon}
                onSelectDiary={handleSelectDiary}
                onSelectEntry={handleSelectEntry}
                diaries={diaries}
                entries={entries}
                totalDiariesCount={diaries.length}
                totalEntriesCount={entries.length}
              />
            </motion.div>
          )}

          {currentView === 'library' && (
            <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LibraryShelves
                diaries={diaries}
                onSelectDiary={handleSelectDiary}
                onOpenAdmin={() => setCurrentView('admin')}
                canManage={isAuthenticated && user.role === 'Admin'}
              />
            </motion.div>
          )}

          {currentView === 'reader' && (
            <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ReaderDashboard
                user={user}
                diaries={diaries}
                onSelectDiary={handleSelectDiary}
                onOpenBookmarks={() => setIsBookmarksOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'explore' && (
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExploreView 
                diaries={diaries}
                entries={entries}
                onSelectDiary={handleSelectDiary}
                onSelectEntry={handleSelectEntry}
              />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AboutView />
            </motion.div>
          )}

          {currentView === 'diary' && selectedDiary && (
            <motion.div key="diary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DiaryView
                diary={selectedDiary}
                entries={entries.filter(e => e.diaryId === selectedDiary.id)}
                onSelectEntry={handleSelectEntry}
                onBackToLibrary={() => handleNavigate('library')}
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
                isBookmarked={user.bookmarks.includes(selectedEntry.id)}
                onSelectEntry={handleSelectEntry}
                onBackToDiary={() => setCurrentView('diary')}
                onLikeEntry={handleLikeEntry}
                onBookmarkEntry={handleBookmarkEntry}
                isParchmentMode={isParchmentMode}
              />
            </motion.div>
          )}


          {currentView === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthorDashboard
                diaries={diaries}
                entries={entries}
                authorName={user.name}
                activePage={adminActivePage as any}
                setActivePage={(page) => setAdminActivePage(page)}
                onCreateDiary={handleCreateDiary}
                onUpdateDiary={handleUpdateDiary}
                onDeleteDiary={handleDeleteDiary}
                onCreateEntry={handleCreateEntry}
                onUpdateEntry={handleUpdateEntry}
                onTogglePinDiary={handleTogglePinDiary}
                onDeleteEntry={handleDeleteEntry}
                onClose={() => setCurrentView('library')}
                onSignOut={handleSignOut}
              />
            </motion.div>
          )}
          {currentView === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoginView
                onLoginSuccess={handleLoginSuccess}
                onBackToHome={() => setCurrentView('landing')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>



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

      <RSSModal
        isOpen={isRssOpen}
        onClose={() => setIsRssOpen(false)}
      />

    </div>
  );
}
