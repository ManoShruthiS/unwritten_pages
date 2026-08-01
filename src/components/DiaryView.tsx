import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Diary, JournalEntry } from '../types';
import { renderDiaryIcon } from './LibraryShelves';
import { 
  ArrowLeft, Clock, Calendar, Heart, MessageSquare, Tag, 
  Search, BookOpen, Sparkles, Filter, ChevronRight, Bookmark
} from 'lucide-react';

interface DiaryViewProps {
  diary: Diary;
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onBackToLibrary: () => void;
  onBookmarkEntry: (entryId: string) => void;
  bookmarkedIds: string[];
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  diary,
  entries,
  onSelectEntry,
  onBackToLibrary,
  onBookmarkEntry,
  bookmarkedIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'popular' | 'commented'>('newest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Extract all unique tags across entries in this diary
  const allTags = Array.from(
    new Set(entries.flatMap(e => e.tags))
  );

  // Calculate cumulative reading time string
  const totalReadingMinutes = entries.reduce((acc, curr) => {
    const mins = parseInt(curr.readingTime) || 5;
    return acc + mins;
  }, 0);

  // Filter and sort entries
  const processedEntries = entries
    .filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.previewParagraph.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.content.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedTag && !e.tags.includes(selectedTag)) return false;
      if (selectedSectionId && e.sectionId !== selectedSectionId) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'oldest') {
        return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
      }
      if (sortOption === 'popular') {
        return b.likes - a.likes;
      }
      if (sortOption === 'commented') {
        return b.commentsCount - a.commentsCount;
      }
      // Newest
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
    >
      
      {/* Return to Library Button */}
      <button
        onClick={onBackToLibrary}
        className="inline-flex items-center space-x-2 text-xs font-sans-body font-medium text-[#d4af37] hover:text-[#f3efe6] bg-[#1a1411] hover:bg-[#281d17] px-3.5 py-1.5 rounded-lg border border-[#3a2b21] transition-all mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Library Stacks</span>
      </button>

      {/* DIARY COVER & STATS HEADER */}
      <div 
        className="rounded-2xl p-6 sm:p-10 border border-[#d4af37]/40 shadow-2xl relative overflow-hidden mb-12"
        style={{
          backgroundColor: diary.coverColor || '#2b1b17',
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)`
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start space-x-4">
            <div className="p-4 rounded-xl bg-[#121013]/80 border border-[#d4af37]/60 text-[#d4af37] shadow-2xl">
              {renderDiaryIcon(diary.icon, "w-8 h-8")}
            </div>

            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-1">
                <span>Journal Volume</span>
                <span>•</span>
                <span>by Mahi 🦢</span>
              </div>

              <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#f3efe6] leading-tight">
                {diary.title}
              </h1>

              <p className="font-serif-title italic text-base sm:text-lg text-[#e5c158]/90 mt-2 max-w-2xl">
                {diary.description}
              </p>
            </div>
          </div>

          {/* Book Stats Box */}
          <div className="grid grid-cols-3 gap-3 bg-[#121013]/90 border border-[#d4af37]/30 p-4 rounded-xl text-center min-w-[280px]">
            <div>
              <span className="block font-cinzel text-2xl font-bold text-[#f3efe6]">
                {diary.entryCount}
              </span>
              <span className="text-[11px] text-[#a3978c] uppercase tracking-wider font-mono">Entries</span>
            </div>

            <div className="border-x border-[#3a2d24]">
              <span className="block font-cinzel text-2xl font-bold text-[#d4af37]">
                ~{totalReadingMinutes}m
              </span>
              <span className="text-[11px] text-[#a3978c] uppercase tracking-wider font-mono">Read Time</span>
            </div>

            <div>
              <span className="block font-cinzel text-xs font-bold text-[#f3efe6] pt-1">
                {diary.lastUpdated}
              </span>
              <span className="text-[11px] text-[#a3978c] uppercase tracking-wider font-mono">Newest</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION NAVIGATION TABS */}
      {diary.sections && diary.sections.length > 0 && (
        <div className="flex items-center space-x-6 border-b border-[#2d211a] mb-8 pb-1 overflow-x-auto">
          <button
            onClick={() => setSelectedSectionId(null)}
            className={`whitespace-nowrap pb-2 text-sm font-sans-body transition-colors ${
              selectedSectionId === null
                ? 'text-[#d4af37] border-b-2 border-[#d4af37] font-bold'
                : 'text-[#a3978c] hover:text-[#f3efe6]'
            }`}
          >
            All Entries
          </button>
          {diary.sections.map(section => (
            <button
              key={section.id}
              onClick={() => setSelectedSectionId(section.id)}
              className={`whitespace-nowrap pb-2 text-sm font-sans-body transition-colors ${
                selectedSectionId === section.id
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37] font-bold'
                  : 'text-[#a3978c] hover:text-[#f3efe6]'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      )}

      {/* FILTER & SORT TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#2d211a]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a3978c]" />
          <input
            type="text"
            placeholder={`Search entries in ${diary.title}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1613] border border-[#3a2d24] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f3efe6] placeholder-[#8c8075] focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans-body">
          <span className="text-[#a3978c] flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </span>

          {(['newest', 'oldest', 'popular', 'commented'] as const).map(option => (
            <button
              key={option}
              onClick={() => setSortOption(option)}
              className={`px-3 py-1.5 rounded-md capitalize transition-all border ${
                sortOption === option
                  ? 'bg-[#2b1e16] text-[#d4af37] border-[#d4af37] font-bold'
                  : 'bg-[#18120e] text-[#a3978c] border-[#3a2d24] hover:text-[#f3efe6]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

      </div>

      {/* TAG FILTER CHIPS */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs text-[#a3978c] font-mono mr-1">Tags:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-full text-xs transition-all ${
              selectedTag === null
                ? 'bg-[#d4af37] text-[#121013] font-bold'
                : 'bg-[#1a1411] text-[#a3978c] border border-[#3a2d24] hover:text-[#f3efe6]'
            }`}
          >
            All Tags
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center space-x-1 ${
                selectedTag === tag
                  ? 'bg-[#d4af37] text-[#121013] font-bold'
                  : 'bg-[#1a1411] text-[#a3978c] border border-[#3a2d24] hover:text-[#f3efe6]'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* JOURNAL ENTRIES LIST */}
      {processedEntries.length === 0 ? (
        <div className="text-center py-16 bg-[#18120e] rounded-xl border border-[#2d211a]">
          <BookOpen className="w-12 h-12 mx-auto text-[#3a2d24] mb-3" />
          <h3 className="font-serif-title text-lg text-[#f3efe6]">No entries found in this diary</h3>
          <p className="text-xs text-[#a3978c] mt-1">Try adjusting search filters or selecting another tag.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {processedEntries.map((entry) => {
            const isBookmarked = bookmarkedIds.includes(entry.id);
            return (
              <motion.article
                key={entry.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectEntry(entry)}
                className="group cursor-pointer bg-[#18120e] hover:bg-[#1f1712] border border-[#30231b] hover:border-[#d4af37]/60 rounded-xl p-5 sm:p-6 transition-all duration-300 shadow-xl flex flex-col md:flex-row gap-6 relative"
              >
                {/* Entry Number Badge & Small Cover Image */}
                <div className="w-full md:w-48 h-36 md:h-auto rounded-lg overflow-hidden relative shrink-0 border border-[#3a2d24]">
                  <img
                    src={entry.coverImage}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#121013]/90 border border-[#d4af37]/60 text-[#d4af37] font-mono text-[10px] font-bold">
                    {entry.entryNumber}
                  </div>
                </div>

                {/* Entry Body Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#a3978c] font-sans-body mb-1">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{entry.publishedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>{entry.readingTime}</span>
                        </span>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookmarkEntry(entry.id);
                        }}
                        className={`p-1.5 rounded-full hover:bg-[#2b1e16] transition-all ${
                          isBookmarked ? 'text-[#d4af37]' : 'text-[#8c8075] hover:text-[#d4af37]'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Entry'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#d4af37]' : ''}`} />
                      </button>
                    </div>

                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f3efe6] group-hover:text-[#d4af37] transition-colors mt-1">
                      {entry.title}
                    </h2>

                    {entry.subtitle && (
                      <p className="font-serif-title italic text-sm text-[#e5c158]/80 mt-1">
                        {entry.subtitle}
                      </p>
                    )}

                    <p className="font-sans-body text-xs sm:text-sm text-[#c5b8ab] mt-2 line-clamp-2 leading-relaxed">
                      {entry.previewParagraph}
                    </p>
                  </div>

                  {/* Tags & Action Bar */}
                  <div className="mt-4 pt-3 border-t border-[#2a1d17] flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#231b16] text-[#a3978c] border border-[#382a20]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-[#a3978c]">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>{entry.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                        <span>{entry.commentsCount}</span>
                      </span>
                      <span className="text-[#d4af37] font-sans-body font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                        <span>Continue Reading</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                </div>
              </motion.article>
            );
          })}
        </div>
      )}

    </motion.div>
  );
};
