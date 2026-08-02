import React from 'react';
import { motion } from 'motion/react';
import { Flame, Bookmark, Heart, BookOpen, Feather, Sparkles } from 'lucide-react';
import { UserProfile, Diary } from '../types';
import { LibraryShelves } from './LibraryShelves';

interface ReaderDashboardProps {
  user: UserProfile;
  diaries: Diary[];
  onSelectDiary: (diary: Diary) => void;
  onOpenBookmarks: () => void;
}

export const ReaderDashboard: React.FC<ReaderDashboardProps> = ({
  user,
  diaries,
  onSelectDiary,
  onOpenBookmarks,
}) => {
  return (
    <div className="bg-[#0d0d0d] font-sans-body min-h-screen">
      {/* ─── READER GREETING BAND ──────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#2d1f14] bg-gradient-to-b from-[#14100c] via-[#0f0c09] to-[#0d0d0d]">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(212,175,55,0.12), transparent 60%)' }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reader's Study</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f3efe6]">
              Welcome back, <span className="text-[#d4af37]">{user.name}</span>
            </h1>
            <p className="font-serif-title italic text-sm sm:text-base text-[#a3978c] mt-2">
              "The library shelves are warm, and your ribbon marks the pages you love."
            </p>


            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="h-px w-16 bg-[#d4af37]/40" />
              <Feather className="w-4 h-4 text-[#d4af37]/70" />
              <div className="h-px w-16 bg-[#d4af37]/40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── LIBRARY SHELVES ───────────────────────────────────────── */}
      <LibraryShelves
        diaries={diaries}
        onSelectDiary={onSelectDiary}
        canManage={false}
      />
    </div>
  );
};
