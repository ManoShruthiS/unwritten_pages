import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalEntry } from '../types';
import { Bookmark, X, ArrowRight, Trash2, BookOpen } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedEntries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onRemoveBookmark: (entryId: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedEntries,
  onSelectEntry,
  onRemoveBookmark
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[#18120e] border-l border-[#d4af37]/40 h-full flex flex-col shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#2d211a] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
            <h2 className="font-cinzel text-lg font-bold text-[#f3efe6]">Saved Bookmarks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a3978c] hover:text-[#f3efe6] hover:bg-[#281d17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {bookmarkedEntries.length === 0 ? (
            <div className="text-center py-16 text-[#a3978c]">
              <BookOpen className="w-12 h-12 mx-auto text-[#3a2d24] mb-3" />
              <p className="font-serif-title text-base text-[#f3efe6]">No saved pages in your ribbon</p>
              <p className="text-xs mt-1">Click the bookmark icon on any journal entry to store it here.</p>
            </div>
          ) : (
            bookmarkedEntries.map(entry => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-[#201813] border border-[#30231b] hover:border-[#d4af37]/60 transition-all flex items-start justify-between gap-3 group"
              >
                <div 
                  onClick={() => {
                    onSelectEntry(entry);
                    onClose();
                  }}
                  className="cursor-pointer space-y-1 flex-1"
                >
                  <span className="text-[10px] font-mono text-[#d4af37] font-bold">{entry.entryNumber}</span>
                  <h4 className="font-cinzel text-sm font-bold text-[#f3efe6] group-hover:text-[#d4af37] transition-colors">
                    {entry.title}
                  </h4>
                  <p className="text-xs text-[#a3978c] line-clamp-1">{entry.previewParagraph}</p>
                </div>

                <button
                  onClick={() => onRemoveBookmark(entry.id)}
                  className="p-1.5 text-[#8c8075] hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121013] border-t border-[#2d211a] text-xs font-mono text-[#a3978c] text-center">
          {bookmarkedEntries.length} saved page{bookmarkedEntries.length === 1 ? '' : 's'} stored
        </div>
      </motion.div>
    </div>
  );
};
