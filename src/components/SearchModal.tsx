import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Diary, JournalEntry } from '../types';
import { Search, X, BookOpen, Clock, Tag, ArrowRight, History } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaries: Diary[];
  entries: JournalEntry[];
  onSelectDiary: (diary: Diary) => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  diaries,
  entries,
  onSelectDiary,
  onSelectEntry
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unwritten_recent_searches');
      return saved ? JSON.parse(saved) : ['Git', 'CodersHigh', 'Generative', 'Decorators'];
    } catch {
      return ['Git', 'CodersHigh', 'Generative', 'Decorators'];
    }
  });

  // Handle keyboard shortcut (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();

  // Search matched diaries
  const matchedDiaries = trimmedQuery
    ? diaries.filter(d => d.title.toLowerCase().includes(trimmedQuery) || d.description.toLowerCase().includes(trimmedQuery))
    : [];

  // Search matched entries
  const matchedEntries = trimmedQuery
    ? entries.filter(e =>
        e.title.toLowerCase().includes(trimmedQuery) ||
        e.subtitle.toLowerCase().includes(trimmedQuery) ||
        e.previewParagraph.toLowerCase().includes(trimmedQuery) ||
        e.tags.some(t => t.toLowerCase().includes(trimmedQuery)) ||
        e.content.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const handleSelectQuery = (q: string) => {
    setQuery(q);
  };

  const handleEntryClick = (entry: JournalEntry) => {
    if (query && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('unwritten_recent_searches', JSON.stringify(updated));
    }
    onSelectEntry(entry);
    onClose();
  };

  const handleDiaryClick = (diary: Diary) => {
    onSelectDiary(diary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#18120e] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2d211a] flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Search className="w-5 h-5 text-[#d4af37]" />
            <input
              type="text"
              autoFocus
              placeholder="Search across diary volumes, titles, tags, and content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-base text-[#f3efe6] placeholder-[#8c8075] focus:outline-none font-sans-body"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c8075] hover:text-[#f3efe6] hover:bg-[#281d17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Recent Searches Header if query is empty */}
          {!trimmedQuery && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#a3978c] mb-3">
                <History className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSelectQuery(s)}
                    className="px-3 py-1 rounded-lg bg-[#231b16] text-[#c5b8ab] hover:text-[#d4af37] border border-[#3a2d24] text-xs transition-colors flex items-center space-x-1"
                  >
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Diaries */}
          {matchedDiaries.length > 0 && (
            <div>
              <div className="text-xs font-mono text-[#d4af37] mb-3 uppercase tracking-wider">
                Matching Diaries ({matchedDiaries.length})
              </div>
              <div className="space-y-2">
                {matchedDiaries.map(d => (
                  <div
                    key={d.id}
                    onClick={() => handleDiaryClick(d)}
                    className="p-3 rounded-xl bg-[#201813] hover:bg-[#2b1f18] border border-[#30231b] hover:border-[#d4af37]/60 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-[#d4af37]" />
                      <div>
                        <h4 className="font-cinzel text-sm font-bold text-[#f3efe6]">{d.title}</h4>
                        <p className="text-xs text-[#a3978c] line-clamp-1">{d.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d4af37]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Journal Entries */}
          {matchedEntries.length > 0 && (
            <div>
              <div className="text-xs font-mono text-[#d4af37] mb-3 uppercase tracking-wider">
                Matching Pages & Entries ({matchedEntries.length})
              </div>
              <div className="space-y-2">
                {matchedEntries.map(e => (
                  <div
                    key={e.id}
                    onClick={() => handleEntryClick(e)}
                    className="p-3.5 rounded-xl bg-[#201813] hover:bg-[#2b1f18] border border-[#30231b] hover:border-[#d4af37]/60 cursor-pointer transition-all flex items-start justify-between group"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-[#a3978c]">
                        <span className="text-[#d4af37] font-bold">{e.entryNumber}</span>
                        <span>•</span>
                        <span>{e.publishedDate}</span>
                        <span>•</span>
                        <span>{e.readingTime}</span>
                      </div>
                      <h4 className="font-cinzel text-sm font-bold text-[#f3efe6] group-hover:text-[#d4af37] transition-colors">
                        {e.title}
                      </h4>
                      <p className="text-xs text-[#c5b8ab] line-clamp-2 leading-relaxed">
                        {e.previewParagraph}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d4af37] shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {trimmedQuery && matchedDiaries.length === 0 && matchedEntries.length === 0 && (
            <div className="text-center py-10 text-[#a3978c]">
              <Search className="w-10 h-10 mx-auto text-[#3a2d24] mb-2" />
              <p className="font-serif-title text-base text-[#f3efe6]">No pages or diaries found matching "{query}"</p>
              <p className="text-xs mt-1">Try searching for keywords like "Git", "Python", "Mindset", or "DSA".</p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#121013] border-t border-[#2d211a] text-right text-[11px] text-[#8c8075] font-mono">
          Press <kbd className="px-1.5 py-0.5 bg-[#201813] border border-[#3a2d24] rounded text-[#d4af37]">ESC</kbd> to exit search
        </div>
      </motion.div>
    </div>
  );
};
