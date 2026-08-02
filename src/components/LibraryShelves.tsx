import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Diary } from '../types';
import * as LucideIcons from 'lucide-react';
import { BookOpen, Search, Star, Plus } from 'lucide-react';

interface LibraryShelvesProps {
  diaries: Diary[];
  onSelectDiary: (diary: Diary) => void;
  onOpenAdmin?: () => void;
  canManage?: boolean;
}

// Map string icon names to Lucide icon components dynamically
export const renderDiaryIcon = (iconName: string, className = "w-5 h-5") => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <LucideIcons.BookOpen className={className} />;
};

export const LibraryShelves: React.FC<LibraryShelvesProps> = ({
  diaries,
  onSelectDiary,
  onOpenAdmin,
  canManage = false,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured' | 'pinned'>('all');

  const filteredDiaries = diaries.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          d.description.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFilter === 'featured') return d.isFeatured;
    if (selectedFilter === 'pinned') return d.isPinned;
    return true;
  });

  const featuredDiaries = diaries.filter(d => d.isFeatured || d.isPinned);

  return (
    <section id="library-shelves" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Library Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#2d221c] gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#d4af37] mb-2 uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Main Stacks</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f3efe6]">
            Mahi's Leather-Bound Diaries
          </h2>
          <p className="font-serif-title italic text-sm sm:text-base text-[#a3978c] mt-1">
            "Each diary represents a different journey of my life. Pull a book from the shelf to read."
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a3978c]" />
            <input
              type="text"
              placeholder="Search diaries..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#1e1713] border border-[#3a2d24] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f3efe6] placeholder-[#8c8075] focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>

          <div className="flex bg-[#1e1713] p-1 rounded-lg border border-[#3a2d24] text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow'
                  : 'text-[#a3978c] hover:text-[#f3efe6]'
              }`}
            >
              All ({diaries.length})
            </button>
            <button
              onClick={() => setSelectedFilter('featured')}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedFilter === 'featured'
                  ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow'
                  : 'text-[#a3978c] hover:text-[#f3efe6]'
              }`}
            >
              Featured
            </button>
          </div>

          {canManage && (
            <button
              onClick={onOpenAdmin}
              className="p-1.5 bg-[#2a1e17] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] rounded-lg text-xs font-sans-body flex items-center space-x-1 transition-all"
              title="Create a new Diary in Sanctuary"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Diary</span>
            </button>
          )}

        </div>
      </div>

      {/* FEATURED DIARIES SHELF (Upper Level) */}
      {selectedFilter === 'all' && !filterQuery && featuredDiaries.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center space-x-2 text-xs font-serif-title italic text-[#d4af37] mb-4">
            <Star className="w-4 h-4 fill-[#d4af37]" />
            <span className="text-sm font-semibold text-[#f3efe6]">Featured & Pinned Volumes</span>
          </div>

          <div className="relative rounded-2xl p-6 sm:p-8 wood-panel border border-[#3a2a1e] shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDiaries.map((diary) => (
                <DiaryBookCard
                  key={`featured-${diary.id}`}
                  diary={diary}
                  onSelectDiary={onSelectDiary}
                  isFeaturedBadge={true}
                />
              ))}
            </div>
            {/* Wooden Shelf Base */}
            <div className="w-full h-5 wood-shelf mt-6 rounded-b-xl"></div>
          </div>
        </div>
      )}

      {/* ALL DIARIES SHELVES */}
      <div className="relative rounded-2xl p-6 sm:p-8 wood-panel border border-[#3a2a1e] shadow-2xl">
        <div className="text-xs font-serif-title text-[#a3978c] mb-6 flex items-center justify-between">
          <span>Displaying {filteredDiaries.length} Leather-Bound Journals</span>
          <span className="italic">Click any book to open pages</span>
        </div>

        {filteredDiaries.length === 0 ? (
          <div className="text-center py-12 text-[#a3978c]">
            <BookOpen className="w-12 h-12 mx-auto text-[#3a2a1e] mb-3" />
            <p className="font-serif-title text-base text-[#f3efe6]">No diaries matched your query.</p>
            <p className="text-xs mt-1">Try resetting search or create a new journal volume.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDiaries.map((diary) => (
              <DiaryBookCard
                key={diary.id}
                diary={diary}
                onSelectDiary={onSelectDiary}
              />
            ))}
          </div>
        )}

        {/* Wooden Shelf Base */}
        <div className="w-full h-5 wood-shelf mt-8 rounded-b-xl"></div>
      </div>

      {/* Quote Banner */}
      <div className="mt-16 text-center max-w-2xl mx-auto p-6 rounded-xl bg-[#18120e] border border-[#2d211a]">
        <p className="font-handwriting text-2xl text-[#e5c158] mb-1">
          "A diary is a conversation with one's future self."
        </p>

      </div>

    </section>
  );
};

interface DiaryBookCardProps {
  diary: Diary;
  onSelectDiary: (diary: Diary) => void;
  isFeaturedBadge?: boolean;
}

const DiaryBookCard: React.FC<DiaryBookCardProps> = ({ diary, onSelectDiary, isFeaturedBadge }) => {
  return (
    <motion.div
      whileHover={{ y: -8, rotateZ: -1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onSelectDiary(diary)}
      className="group cursor-pointer flex flex-col justify-between h-full"
    >
      {/* Book Cover Design */}
      <div 
        className="relative rounded-xl p-5 sm:p-6 shadow-2xl border border-[#d4af37]/30 transition-all duration-300 emerald-hover-glow overflow-hidden flex flex-col justify-between min-h-[260px]"
        style={{
          backgroundColor: diary.coverColor || '#2b1b17',
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.4) 0%, transparent 80%)`
        }}
      >
        {/* Leather Book Spine Binding Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-5 leather-spine border-r border-[#d4af37]/30 flex flex-col items-center justify-between py-4">
          <div className="w-2 h-0.5 bg-[#d4af37]/60 rounded" />
          <div className="w-2 h-0.5 bg-[#d4af37]/60 rounded" />
          <div className="w-2 h-0.5 bg-[#d4af37]/60 rounded" />
        </div>

        {/* Top Spine Header */}
        <div className="pl-4 flex items-start justify-between">
          <div className="p-2.5 rounded-lg bg-[#121013]/60 border border-[#d4af37]/40 text-[#d4af37] shadow-inner">
            {renderDiaryIcon(diary.icon, "w-5 h-5")}
          </div>

          <div className="flex items-center space-x-1.5">
            {diary.isPinned && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#d4af37] text-[#121013] font-bold">
                Pinned
              </span>
            )}
            {isFeaturedBadge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#38bdf8] text-[#121013] font-bold">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="pl-4 my-4">
          <h3 className="font-cinzel text-xl font-bold text-[#f3efe6] group-hover:text-[#d4af37] transition-colors leading-snug line-clamp-2">
            {diary.title}
          </h3>
          <p className="font-sans-body text-xs text-[#c5b8ab] mt-2 line-clamp-3 leading-relaxed">
            {diary.description}
          </p>
        </div>

        {/* Book Footer Info */}
        <div className="pl-4 pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-xs font-mono text-[#d4af37]/90">
          <span>{diary.entryCount} {diary.entryCount === 1 ? 'Page' : 'Pages'}</span>
          <span className="text-[11px] text-[#a3978c]">{diary.lastUpdated}</span>
        </div>

        {/* Gold Corner Emboss */}
        <div className="absolute right-2 bottom-2 w-4 h-4 border-r-2 border-b-2 border-[#d4af37]/40 pointer-events-none" />
      </div>

      {/* Book Base Edge Shadow */}
      <div className="h-2 bg-[#120e0b] rounded-b-lg mx-3 shadow-md" />
    </motion.div>
  );
};
