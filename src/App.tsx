import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { LibraryShelves } from './components/LibraryShelves';
import { DiaryView } from './components/DiaryView';
import { JournalEntryView } from './components/JournalEntryView';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { RSSModal } from './components/RSSModal';
import { AboutView } from './components/AboutView';
import { Feather, X } from 'lucide-react';

import { Diary, JournalEntry, NotificationItem } from './types';
import { INITIAL_DIARIES, INITIAL_ENTRIES } from './data/mockData';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'library' | 'about' | 'diary' | 'entry'>('landing');
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const [diaries, setDiaries] = useState<Diary[]>(INITIAL_DIARIES);
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);

  const [isParchmentMode, setIsParchmentMode] = useState(false);



  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRssOpen, setIsRssOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);



  // Keyboard shortcut for Search (Cmd+K) and Secret Admin Access (Ctrl+Shift+A)
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

  // Handle Hash Deep Linking on Mount & HashChange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#entry/')) {
        const entryRef = hash.replace('#entry/', '');
        const found = entries.find(e => e.slug === entryRef || e.id === entryRef);
        if (found) {
          setSelectedEntry(found);
          const parent = diaries.find(d => d.id === found.diaryId);
          if (parent) setSelectedDiary(parent);
          setCurrentView('entry');
        }
      } else if (hash.startsWith('#diary/')) {
        const diaryRef = hash.replace('#diary/', '');
        const found = diaries.find(d => d.slug === diaryRef || d.id === diaryRef);
        if (found) {
          setSelectedDiary(found);
          setCurrentView('diary');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [diaries, entries]);



  // Handlers
  const handleNavigate = (view: 'landing' | 'library' | 'about') => {
    setCurrentView(view);
    if (view === 'library') {
      setSelectedDiary(null);
      setSelectedEntry(null);
    }
    window.location.hash = view === 'landing' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const handleSelectDiary = (diary: Diary) => {
    setSelectedDiary(diary);
    setCurrentView('diary');
    window.location.hash = `diary/${diary.slug || diary.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    if (!selectedDiary) {
      const parent = diaries.find(d => d.id === entry.diaryId);
      if (parent) setSelectedDiary(parent);
    }
    setCurrentView('entry');
    window.location.hash = `entry/${entry.slug || entry.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onOpenSearch={() => setIsSearchOpen(true)}
            currentView={currentView}
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
                  onOpenSearch={() => setIsSearchOpen(true)}
                  currentView={currentView}
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
                isParchmentMode={isParchmentMode}
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
