import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { LibraryShelves } from './components/LibraryShelves';
import { DiaryView } from './components/DiaryView';
import { JournalEntryView } from './components/JournalEntryView';
import { AuthorDashboard } from './components/AuthorDashboard';
import { SearchModal } from './components/SearchModal';
import { BookmarksView } from './components/BookmarksView';
import { NotificationsModal } from './components/NotificationsModal';
import { RSSModal } from './components/RSSModal';
import { Footer } from './components/Footer';
import { AboutView } from './components/AboutView';
import { LoginView } from './components/LoginView';
import { ReaderDashboard } from './components/ReaderDashboard';

import { Diary, JournalEntry, UserProfile, NotificationItem, Comment } from './types';
import { INITIAL_DIARIES, INITIAL_ENTRIES } from './data/initialData';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'library' | 'bookmarks' | 'about' | 'diary' | 'entry' | 'admin' | 'reader' | 'login'>('landing');
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
        bookmarks: [],
        likedEntries: []
      };
    } catch {
      return {
        id: 'usr-1',
        name: 'Scholar Reader',
        email: 'reader@library.internal',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'Reader',
        followingAuthor: true,
        bookmarks: [],
        likedEntries: []
      };
    }
  });

  const [comments, setComments] = useState<Comment[]>([]);

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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Persist User Profile
  useEffect(() => {
    try {
      localStorage.setItem('unwritten_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Sync API Data on Mount (Connected to Express MongoDB Backend)
  useEffect(() => {
    // Fetch Diaries
    fetch('http://localhost:5000/api/diaries')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDiaries(data);
      })
      .catch(() => {});

    // Fetch Entries
    fetch('http://localhost:5000/api/entries')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setEntries(data);
      })
      .catch(() => {});
      
    // Fetch Comments
    fetch('http://localhost:5000/api/comments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
      
    // Fetch Latest User Profile if Authenticated
    if (isAuthenticated && user?.id) {
      fetch(`http://localhost:5000/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) setUser(data);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user?.id]);

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
  const handleNavigate = (view: 'landing' | 'library' | 'bookmarks' | 'about' | 'login') => {
    setCurrentView(view);
    if (view === 'library') {
      setSelectedDiary(null);
      setSelectedEntry(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLibrary = () => {
    if (isAuthenticated && user.role === 'Admin') {
      setCurrentView('admin');
      setAdminActivePage('write');
    } else {
      setCurrentView('library');
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
    if (!user || !user.id) return;

    fetch(`http://localhost:5000/api/entries/${entryId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.userLikedEntries) {
        setUser(prev => ({ ...prev, likedEntries: data.userLikedEntries }));
      }
      if (typeof data.entryLikes === 'number') {
        setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likes: data.entryLikes } : e));
        setSelectedEntry(prev => prev && prev.id === entryId ? { ...prev, likes: data.entryLikes } : prev);
      }
    })
    .catch(() => {
      // Fallback local update
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likes: e.likes + 1 } : e));
      setSelectedEntry(prev => prev && prev.id === entryId ? { ...prev, likes: prev.likes + 1 } : prev);
      setUser(prev => ({ ...prev, likedEntries: [...prev.likedEntries, entryId] }));
    });
  };

  const handleBookmarkEntry = (entryId: string) => {
    if (!user || !user.id) return;

    fetch(`http://localhost:5000/api/users/${user.id}/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.bookmarks) {
        setUser(prev => ({ ...prev, bookmarks: data.bookmarks }));
      }
    })
    .catch(() => {
      setUser(prev => {
        const exists = prev.bookmarks.includes(entryId);
        const updated = exists ? prev.bookmarks.filter(id => id !== entryId) : [...prev.bookmarks, entryId];
        return { ...prev, bookmarks: updated };
      });
    });
  };

  const handleToggleFollow = () => {
    setUser(prev => ({
      ...prev,
      followingAuthor: !prev.followingAuthor
    }));
  };

  const handleAddComment = (entryId: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      entryId,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      likes: 0
    };

    fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment)
    })
    .then(res => res.json())
    .then(savedComment => {
      setComments(prev => [...prev, savedComment]);
      
      // Increment comments count on the entry
      setEntries(prev => prev.map(e => 
        e.id === entryId ? { ...e, comments: (e.comments || 0) + 1 } : e
      ));
    })
    .catch(err => console.error('Failed to post comment:', err));
  };



  const handleCreateDiary = (diaryData: Partial<Diary>) => {
    const newDiaryPayload = {
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

    fetch('http://localhost:5000/api/diaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiaryPayload)
    })
      .then(res => { if (!res.ok) throw new Error(`Failed to create diary (${res.status})`); return res.json(); })
      .then(created => {
        setDiaries(prev => [...prev, created]);
      })
      .catch(err => { console.error(err); refreshLibraryData(); });
  };

  const refreshLibraryData = () => {
    fetch('http://localhost:5000/api/diaries')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setDiaries(data); })
      .catch(() => {});
    fetch('http://localhost:5000/api/entries')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setEntries(data); })
      .catch(() => {});
  };

  const handleDeleteDiary = (diaryId: string) => {
    // Optimistic UI update, then re-sync from Mongo so local state always matches the database
    setDiaries(prev => prev.filter(d => d.id !== diaryId));
    setEntries(prev => prev.filter(e => e.diaryId !== diaryId));
    fetch(`http://localhost:5000/api/diaries/${diaryId}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error(`Failed to delete diary (${res.status})`); return res.json(); })
      .then(() => refreshLibraryData())
      .catch(err => { console.error(err); refreshLibraryData(); });
  };

  const handleUpdateDiary = (diaryId: string, diaryData: Partial<Diary>) => {
    // Optimistic UI update, then apply the Mongo-confirmed document
    setDiaries(prev => prev.map(d => (d.id === diaryId ? { ...d, ...diaryData } : d)));
    fetch(`http://localhost:5000/api/diaries/${diaryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diaryData)
    })
      .then(res => { if (!res.ok) throw new Error(`Failed to update diary (${res.status})`); return res.json(); })
      .then(updated => { if (updated) setDiaries(prev => prev.map(d => (d.id === diaryId ? updated : d))); })
      .catch(err => { console.error(err); refreshLibraryData(); });
  };

  const handleCreateEntry = (entryData: Partial<JournalEntry>) => {
    const newEntryPayload = {
      id: `entry-${Date.now()}`,
      diaryId: entryData.diaryId || diaries[0]?.id || 'codershigh',
      sectionId: entryData.sectionId || '',
      entryNumber: `Entry ${String(entries.length + 1).padStart(3, '0')}`,
      title: entryData.title || 'New Reflection',
      subtitle: entryData.subtitle || '',
      publishedDate: 'Today',
      updatedDate: 'Today',
      readingTime: entryData.readingTime || '5 min read',
      tags: entryData.tags || ['Reflections'],
      coverImage: entryData.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      previewParagraph: entryData.previewParagraph || '',
      content: entryData.content || '',
      likes: 0,
      commentsCount: 0,
      slug: entryData.title?.toLowerCase().replace(/\s+/g, '-') || 'entry',
      isPinned: entryData.isPinned || false,
      isFeatured: entryData.isFeatured || false
    };

    fetch('http://localhost:5000/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntryPayload)
    })
      .then(res => { if (!res.ok) throw new Error(`Failed to create entry (${res.status})`); return res.json(); })
      .then(created => {
        setEntries(prev => [created, ...prev]);
        // Refresh diaries to update entryCount
        refreshLibraryData();
      })
      .catch(err => { console.error(err); refreshLibraryData(); });
  };

  const handleDeleteEntry = (entryId: string) => {
    // Optimistic UI update, then re-sync from Mongo so local state always matches the database
    setEntries(prev => prev.filter(e => e.id !== entryId));
    fetch(`http://localhost:5000/api/entries/${entryId}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error(`Failed to delete entry (${res.status})`); return res.json(); })
      .then(() => refreshLibraryData())
      .catch(err => { console.error(err); refreshLibraryData(); });
  };

  const handleUpdateEntry = (entryId: string, entryData: Partial<JournalEntry>) => {
    // Optimistic UI update, then apply the Mongo-confirmed document
    setEntries(prev => prev.map(e => (e.id === entryId ? { ...e, ...entryData } : e)));
    fetch(`http://localhost:5000/api/entries/${entryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData)
    })
      .then(res => { if (!res.ok) throw new Error(`Failed to update entry (${res.status})`); return res.json(); })
      .then(updated => { if (updated) setEntries(prev => prev.map(e => (e.id === entryId ? updated : e))); })
      .catch(err => { console.error(err); refreshLibraryData(); });
  };

  const handleTogglePinDiary = (diaryId: string) => {
    setDiaries(prev => prev.map(d => {
      if (d.id !== diaryId) return d;
      const nextPin = !d.isPinned;
      fetch(`http://localhost:5000/api/diaries/${diaryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: nextPin })
      })
        .then(res => { if (!res.ok) throw new Error(`Failed to update pin state (${res.status})`); })
        .then(() => refreshLibraryData())
        .catch(err => { console.error(err); refreshLibraryData(); });
      return { ...d, isPinned: nextPin };
    }));
  };



  const bookmarkedEntries = isAuthenticated ? entries.filter(e => user.bookmarks.includes(e.id)) : [];
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  const diariesWithCounts = diaries.map(d => ({
    ...d,
    entryCount: entries.filter(e => e.diaryId === d.id).length
  }));

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
                onOpenLibrary={() => {
                  if (user?.role === 'Admin') {
                    setCurrentView('admin');
                    setAdminActivePage('write');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleNavigate('library');
                  }
                }}
                ctaLabel={heroCta.label}
                ctaIcon={heroCta.icon as any}
                onSelectDiary={handleSelectDiary}
                onSelectEntry={handleSelectEntry}
                diaries={diariesWithCounts}
                entries={entries}
                totalDiariesCount={diaries.length}
                totalEntriesCount={entries.length}
              />
            </motion.div>
          )}

          {currentView === 'library' && (
            <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LibraryShelves
                diaries={diariesWithCounts}
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



          {currentView === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BookmarksView 
                bookmarkedEntries={bookmarkedEntries}
                onSelectEntry={handleSelectEntry}
                onRemoveBookmark={handleBookmarkEntry}
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
                diary={selectedDiary || diariesWithCounts.find(d => d.id === selectedEntry.diaryId)}
                allEntries={entries}
                isBookmarked={isAuthenticated && user.bookmarks.includes(selectedEntry.id)}
                isLiked={isAuthenticated && user.likedEntries.includes(selectedEntry.id)}
                onSelectEntry={handleSelectEntry}
                onBackToDiary={() => setCurrentView('diary')}
                onLikeEntry={handleLikeEntry}
                onBookmarkEntry={handleBookmarkEntry}
                isParchmentMode={isParchmentMode}
                comments={comments.filter(c => c.entryId === selectedEntry.id)}
                onAddComment={handleAddComment}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
          )}


          {currentView === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthorDashboard
                diaries={diariesWithCounts}
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
        diaries={diariesWithCounts}
        entries={entries}
        onSelectDiary={(d) => {
          setIsSearchOpen(false);
          handleSelectDiary(d);
        }}
        onSelectEntry={handleSelectEntry}
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
