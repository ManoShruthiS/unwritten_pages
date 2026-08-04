import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { LibraryShelves } from './components/LibraryShelves';
import { DiaryView } from './components/DiaryView';
import { JournalEntryView } from './components/JournalEntryView';
import { AuthorDashboard } from './components/AuthorDashboard';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { RSSModal } from './components/RSSModal';
import { AboutView } from './components/AboutView';
import { Lock, Feather, X } from 'lucide-react';

import { Diary, JournalEntry, NotificationItem, Comment } from './types';
import { INITIAL_DIARIES, INITIAL_ENTRIES } from './data/initialData';

import { API_URL } from './config';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'library' | 'about' | 'diary' | 'entry' | 'admin'>('landing');
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [adminActivePage, setAdminActivePage] = useState<string>('entries');

  // Data Stores with LocalStorage Fallback (Works 100% Offline & Mobile)
  const [diaries, setDiaries] = useState<Diary[]>(() => {
    try {
      const saved = localStorage.getItem('unwritten_diaries');
      return saved ? JSON.parse(saved) : INITIAL_DIARIES;
    } catch {
      return INITIAL_DIARIES;
    }
  });

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('unwritten_entries');
      return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
    } catch {
      return INITIAL_ENTRIES;
    }
  });

  const [comments, setComments] = useState<Comment[]>([]);
  const [isParchmentMode, setIsParchmentMode] = useState(false);

  // Author Authentication (Persisted)
  const [isAuthor, setIsAuthor] = useState<boolean>(() => {
    try {
      return localStorage.getItem('unwritten_author_session') === 'true';
    } catch {
      return false;
    }
  });

  // Secret Admin Lock Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRssOpen, setIsRssOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Persist Diaries & Entries
  useEffect(() => {
    try {
      localStorage.setItem('unwritten_diaries', JSON.stringify(diaries));
    } catch (e) {
      console.error(e);
    }
  }, [diaries]);

  useEffect(() => {
    try {
      localStorage.setItem('unwritten_entries', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  // Silent Background API Sync on Mount (if backend is deployed and reachable)
  useEffect(() => {
    if (!API_URL) return;

    fetch(`${API_URL}/api/diaries`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDiaries(data);
      })
      .catch(() => {/* Silent catch */});

    fetch(`${API_URL}/api/entries`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setEntries(data);
      })
      .catch(() => {/* Silent catch */});

    fetch(`${API_URL}/api/comments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {/* Silent catch */});
  }, []);

  // Keyboard shortcut for Search (Cmd+K) and Secret Admin Access (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check URL hash for secret #admin link
  useEffect(() => {
    if (window.location.hash === '#admin') {
      handleOpenAdmin();
    }
  }, []);

  const handleOpenAdmin = () => {
    if (isAuthor) {
      setCurrentView('admin');
      setAdminActivePage('entries');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminModalOpen(true);
      setAdminPinInput('');
      setAdminPinError('');
    }
  };

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput.trim() === '3678') {
      setIsAuthor(true);
      try {
        localStorage.setItem('unwritten_author_session', 'true');
      } catch (err) {
        console.error(err);
      }
      setIsAdminModalOpen(false);
      setCurrentView('admin');
      setAdminActivePage('entries');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAdminPinError('Incorrect Author Passcode.');
    }
  };

  // Handlers
  const handleNavigate = (view: 'landing' | 'library' | 'about') => {
    setCurrentView(view);
    if (view === 'library') {
      setSelectedDiary(null);
      setSelectedEntry(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setIsAuthor(false);
    try {
      localStorage.removeItem('unwritten_author_session');
    } catch (e) {
      console.error(e);
    }
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDiary = (diary: Diary) => {
    setSelectedDiary(diary);
    setCurrentView('diary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    if (!selectedDiary) {
      const parent = diaries.find(d => d.id === entry.diaryId);
      if (parent) setSelectedDiary(parent);
    }
    setCurrentView('entry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikeEntry = (entryId: string) => {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, likes: e.likes + 1 } : e));
    setSelectedEntry(prev => prev && prev.id === entryId ? { ...prev, likes: prev.likes + 1 } : prev);

    if (API_URL) {
      fetch(`${API_URL}/api/entries/${entryId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {});
    }
  };

  const handleAddComment = (entryId: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      entryId,
      authorName: 'Reader',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      likes: 0
    };

    setComments(prev => [...prev, newComment]);
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, commentsCount: (e.commentsCount || 0) + 1 } : e));

    if (API_URL) {
      fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      }).catch(() => {});
    }
  };

  const handleCreateDiary = (diaryData: Partial<Diary>) => {
    const tempId = `diary-${Date.now()}`;
    const newDiaryPayload: Diary = {
      id: tempId,
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

    setDiaries(prev => [...prev, newDiaryPayload]);

    if (API_URL) {
      fetch(`${API_URL}/api/diaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiaryPayload)
      }).catch(() => {});
    }
  };

  const handleDeleteDiary = (diaryId: string) => {
    setDiaries(prev => prev.filter(d => d.id !== diaryId));
    setEntries(prev => prev.filter(e => e.diaryId !== diaryId));
    if (API_URL) {
      fetch(`${API_URL}/api/diaries/${diaryId}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleUpdateDiary = (diaryId: string, diaryData: Partial<Diary>) => {
    setDiaries(prev => prev.map(d => (d.id === diaryId ? { ...d, ...diaryData } : d)));
    if (API_URL) {
      fetch(`${API_URL}/api/diaries/${diaryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diaryData)
      }).catch(() => {});
    }
  };

  const handleCreateEntry = (entryData: Partial<JournalEntry>) => {
    const newEntryPayload: JournalEntry = {
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

    setEntries(prev => [newEntryPayload, ...prev]);

    if (API_URL) {
      fetch(`${API_URL}/api/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntryPayload)
      }).catch(() => {});
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
    if (API_URL) {
      fetch(`${API_URL}/api/entries/${entryId}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleUpdateEntry = (entryId: string, entryData: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(e => (e.id === entryId ? { ...e, ...entryData } : e)));
    if (API_URL) {
      fetch(`${API_URL}/api/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      }).catch(() => {});
    }
  };

  const handleTogglePinDiary = (diaryId: string) => {
    setDiaries(prev => prev.map(d => (d.id === diaryId ? { ...d, isPinned: !d.isPinned } : d)));
  };

  const diariesWithCounts = diaries.map(d => ({
    ...d,
    entryCount: entries.filter(e => e.diaryId === d.id).length
  }));

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
      {currentView !== 'landing' && (
        <div className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2d1f14]">
          <Header
            onNavigate={handleNavigate}
            onAdminNavigate={(page) => {
              setCurrentView('admin');
              setAdminActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSearch={() => setIsSearchOpen(true)}
            onSignOut={handleSignOut}
            isAuthor={isAuthor}
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
              <div className="absolute top-0 left-0 right-0 z-50">
                <Header
                  onNavigate={handleNavigate}
                  onAdminNavigate={(page) => {
                    setCurrentView('admin');
                    setAdminActivePage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onSignOut={handleSignOut}
                  isAuthor={isAuthor}
                  currentView={currentView}
                  adminActivePage={adminActivePage}
                />
              </div>
              <HeroLanding
                onOpenLibrary={() => handleNavigate('library')}
                ctaLabel="Enter Library"
                ctaIcon="book"
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
                onOpenAdmin={handleOpenAdmin}
                canManage={isAuthor}
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
              />
            </motion.div>
          )}

          {currentView === 'entry' && selectedEntry && (
            <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <JournalEntryView
                entry={selectedEntry}
                diary={selectedDiary || diariesWithCounts.find(d => d.id === selectedEntry.diaryId)}
                allEntries={entries}
                onSelectEntry={handleSelectEntry}
                onBackToDiary={() => setCurrentView('diary')}
                onLikeEntry={handleLikeEntry}
                isParchmentMode={isParchmentMode}
                comments={comments.filter(c => c.entryId === selectedEntry.id)}
                onAddComment={handleAddComment}
                isAuthenticated={isAuthor}
              />
            </motion.div>
          )}

          {currentView === 'admin' && isAuthor && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthorDashboard
                diaries={diariesWithCounts}
                entries={entries}
                authorName="Mahi 🦢"
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

        </AnimatePresence>
      </main>

      {/* Secret Author PIN Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#16120f] border border-[#d4af37]/40 rounded-xl shadow-2xl p-6 relative text-center"
          >
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute top-4 right-4 text-[#8c8075] hover:text-[#f3efe6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#2a1e16] border border-[#d4af37]/50 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="font-cinzel text-xl font-bold text-[#f3efe6] mb-1">
              Author Sanctuary
            </h3>
            <p className="text-xs text-[#a3978c] mb-6">
              Enter your secret 4-digit passcode to access the Author Dashboard.
            </p>

            <form onSubmit={handleVerifyAdminPin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                placeholder="••••"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-2xl py-2 bg-[#0d0a08] border border-[#3d2b1e] rounded-lg text-[#d4af37] focus:outline-none focus:border-[#d4af37]"
                autoFocus
              />

              {adminPinError && (
                <p className="text-xs text-[#e55353]">{adminPinError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#8c6d27] to-[#d4af37] text-[#0d0a08] font-bold text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <Feather className="w-4 h-4" />
                <span>Unlock Sanctuary</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}

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
