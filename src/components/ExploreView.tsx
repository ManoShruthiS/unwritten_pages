import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, BookOpen } from 'lucide-react';
import { Diary, JournalEntry } from '../types';

interface ExploreViewProps {
  diaries: Diary[];
  entries: JournalEntry[];
  onSelectDiary: (diary: Diary) => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  diaries,
  entries,
  onSelectDiary,
  onSelectEntry
}) => {
  // Get top 3 popular entries
  const popularEntries = [...entries].sort((a, b) => b.likes - a.likes).slice(0, 3);
  
  // Get featured diaries
  const featuredDiaries = diaries.filter(d => d.isFeatured);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[70vh]"
    >
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-[#2d221c]">
        <Compass className="w-6 h-6 text-[#d4af37]" />
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f3efe6]">
          Explore the Archives
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        {/* Popular Entries Section */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-serif-title italic text-[#d4af37] mb-6">
            <Sparkles className="w-4 h-4 fill-[#d4af37]" />
            <span className="text-sm font-semibold text-[#f3efe6]">Most Read Pages</span>
          </div>
          
          <div className="space-y-4">
            {popularEntries.map(entry => {
              const parentDiary = diaries.find(d => d.id === entry.diaryId);
              return (
                <div 
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className="bg-[#18120e] hover:bg-[#1f1712] border border-[#2d211a] hover:border-[#d4af37]/60 p-4 rounded-xl cursor-pointer transition-all flex items-start space-x-4"
                >
                  <div className="w-16 h-20 bg-[#2b1b17] rounded-md overflow-hidden shrink-0">
                    <img src={entry.coverImage} alt="" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-[#f3efe6] mb-1">{entry.title}</h3>
                    <p className="text-xs text-[#a3978c] font-sans-body line-clamp-2 mb-2">{entry.previewParagraph}</p>
                    <div className="text-[10px] text-[#d4af37] uppercase tracking-wider font-mono">
                      From: {parentDiary?.title || 'Unknown Volume'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Collections Section */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-serif-title italic text-[#d4af37] mb-6">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#f3efe6]">Curated Collections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredDiaries.map(diary => (
              <div 
                key={diary.id}
                onClick={() => onSelectDiary(diary)}
                className="relative rounded-xl p-5 shadow-xl border border-[#d4af37]/30 cursor-pointer overflow-hidden group min-h-[140px] flex flex-col justify-end"
                style={{ backgroundColor: diary.coverColor || '#2b1b17' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="relative z-10">
                  <h3 className="font-cinzel text-base font-bold text-[#f3efe6] group-hover:text-[#d4af37] transition-colors">{diary.title}</h3>
                  <div className="text-[10px] text-[#a3978c] uppercase tracking-wider mt-1 font-mono">
                    {diary.entryCount} Pages
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
