import React from 'react';
import { BookOpen, Search, Bookmark, Bell, Sparkles, Feather, Flame, Shuffle, UserCheck, UserPlus } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenLibrary: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onRandomEntry: () => void;
  user: UserProfile;
  onToggleFollow: () => void;
  unreadNotifications: number;
  isParchmentMode: boolean;
  onToggleParchment: () => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLibrary,
  onOpenSearch,
  onOpenBookmarks,
  onOpenNotifications,
  onOpenAdmin,
  onRandomEntry,
  user,
  onToggleFollow,
  unreadNotifications,
  isParchmentMode,
  onToggleParchment,
  currentView
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#121013]/90 border-b border-[#2d221c] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Author Tag */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onOpenLibrary}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2a1e17] to-[#121013] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner group-hover:border-[#d4af37] transition-all">
            <Feather className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#f3efe6] group-hover:text-[#d4af37] transition-colors">
              The Unwritten Pages
            </span>
            <div className="flex items-center space-x-2 text-xs text-[#a3978c] font-sans-body">
              <span>by Mahi 🦢</span>
              <span className="text-[#d4af37]/60">•</span>
              <span className="hidden sm:inline italic font-serif-title text-[#d4af37]/90">Thoughts Nobody Ordered.</span>
            </div>
          </div>
        </div>

        {/* Center/Right Action Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          
          {/* Reading Streak Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1e1713] border border-[#3d2f25] text-xs text-[#e5c158]">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="font-mono font-medium">{user.readingStreak} Day Streak</span>
          </div>

          {/* Random Entry Button */}
          <button
            onClick={onRandomEntry}
            title="Surprise me with a random entry"
            className="p-2 rounded-lg text-[#c5b8ab] hover:text-[#d4af37] hover:bg-[#1a1411] transition-all flex items-center space-x-1 text-xs"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden md:inline font-sans-body">Random Page</span>
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-[#c5b8ab] hover:text-[#d4af37] hover:bg-[#1a1411] transition-all flex items-center space-x-1.5 text-xs"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline font-sans-body text-xs bg-[#231b16] px-1.5 py-0.5 rounded border border-[#3a2d24] text-[#a3978c]">⌘K</span>
          </button>

          {/* Bookmarks Drawer Trigger */}
          <button
            onClick={onOpenBookmarks}
            title="Saved bookmarks"
            className="p-2 rounded-lg text-[#c5b8ab] hover:text-[#d4af37] hover:bg-[#1a1411] transition-all relative"
          >
            <Bookmark className="w-4 h-4" />
            {user.bookmarks.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#d4af37] text-[#121013] font-mono text-[10px] font-bold rounded-full flex items-center justify-center">
                {user.bookmarks.length}
              </span>
            )}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            title="Library Dispatches & Updates"
            className="p-2 rounded-lg text-[#c5b8ab] hover:text-[#d4af37] hover:bg-[#1a1411] transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#121013]" />
            )}
          </button>

          {/* Parchment Mode Toggle */}
          <button
            onClick={onToggleParchment}
            title={isParchmentMode ? "Switch to Dark Library Mode" : "Switch to Warm Parchment Mode"}
            className={`p-2 rounded-lg text-xs font-sans-body transition-all flex items-center space-x-1 border ${
              isParchmentMode
                ? 'bg-[#fcf9f2] text-[#2b1b17] border-[#d4af37]'
                : 'bg-[#1e1713] text-[#c5b8ab] border-[#382b22] hover:text-[#d4af37]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden xl:inline">{isParchmentMode ? 'Dark Library' : 'Warm Parchment'}</span>
          </button>

          {/* Follow Author Button */}
          <button
            onClick={onToggleFollow}
            className={`px-3 py-1.5 rounded-md text-xs font-sans-body font-medium transition-all flex items-center space-x-1.5 border ${
              user.followingAuthor
                ? 'bg-[#1c3b28]/60 text-emerald-300 border-emerald-600/40'
                : 'bg-[#2b1e16] text-[#e5c158] border-[#d4af37]/40 hover:bg-[#38281d] hover:border-[#d4af37]'
            }`}
          >
            {user.followingAuthor ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Following Mahi</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Follow Mahi 🦢</span>
              </>
            )}
          </button>

          {/* Admin Dashboard / Mahi's Sanctuary */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 py-1.5 rounded-md text-xs font-sans-body font-medium transition-all flex items-center space-x-1.5 border ${
              currentView === 'admin'
                ? 'bg-[#d4af37] text-[#121013] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-bold'
                : 'bg-gradient-to-r from-[#2a1e17] to-[#1e1510] text-[#f3efe6] border-[#3d2e23] hover:border-[#d4af37]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mahi's Sanctuary</span>
          </button>

        </div>
      </div>
    </header>
  );
};
