import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Feather, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  onNavigate: (view: 'landing' | 'library' | 'explore' | 'about' | 'login') => void;
  onAdminNavigate?: (page: string) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenDashboard: () => void;
  onSignOut: () => void;
  user: UserProfile;
  isAuthenticated: boolean;
  currentView: string;
  adminActivePage?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onAdminNavigate,
  onOpenSearch,
  onOpenBookmarks,
  onOpenDashboard,
  onSignOut,
  user,
  isAuthenticated,
  currentView,
  adminActivePage
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const standardNavItems = [
    { label: 'Home', view: 'landing' as const },
    { label: 'Library', view: 'library' as const },
    { label: 'Explore', view: 'explore' as const },
    { label: 'About', view: 'about' as const },
  ];

  const adminNavGroups = [
    {
      label: 'Write',
      items: [
        { label: 'Drafts', page: 'drafts' },
        { label: 'Media Vault', page: 'media' },
      ]
    },
    {
      label: 'Manage',
      items: [
        { label: 'Library', page: 'library' },
        { label: 'Entries', page: 'entries' },
      ]
    },
    {
      label: 'Community',
      items: [
        { label: 'Comments', page: 'comments' },
        { label: 'Readers', page: 'readers' },
        { label: 'Newsletter', page: 'newsletter' },
      ]
    },
    {
      label: 'Insights',
      items: [
        { label: 'Analytics', page: 'analytics' },
        { label: 'Statistics', page: 'statistics' },
      ]
    },
    {
      label: 'Config',
      items: [
        { label: 'Settings', page: 'settings' },
        { label: 'Appearance', page: 'appearance' },
        { label: 'Integrations', page: 'integrations' },
      ]
    }
  ];

  return (
    <header className="flex items-center justify-between px-6 sm:px-10 h-16 w-full">
      
      {/* Left: Logo + Brand */}
      <div
        className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        onClick={() => onNavigate('landing')}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Feather className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
        </div>
        <span
          className="text-[#f3efe6] text-sm font-semibold tracking-wide group-hover:text-[#d4af37] transition-colors hidden sm:block"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          The Unwritten Pages
        </span>
      </div>

      {/* Center: Nav Links */}
      <nav ref={navRef} className="flex items-center gap-6 sm:gap-8">
        {isAuthenticated && user.role === 'Admin' ? (
          // Admin Dropdown Navigation
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className={`text-sm font-sans transition-colors relative ${
                currentView === 'landing'
                  ? 'text-[#f3efe6] font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#d4af37]'
                  : 'text-[#8c8075] hover:text-[#c5b8ab]'
              }`}
            >
              Home
            </button>
            {adminNavGroups.map((group) => (
              <div key={group.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                  className={`flex items-center gap-1 text-sm font-sans transition-colors ${
                    openDropdown === group.label || (currentView === 'admin' && group.items.some(i => i.page === adminActivePage))
                      ? 'text-[#f3efe6]'
                      : 'text-[#8c8075] hover:text-[#c5b8ab]'
                  }`}
                >
                  {group.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {openDropdown === group.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-40 bg-[#16120f] border border-[#2d1f14] rounded-lg shadow-xl overflow-hidden py-1 z-50">
                    {group.items.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => {
                          if (onAdminNavigate) onAdminNavigate(item.page);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          currentView === 'admin' && adminActivePage === item.page
                            ? 'bg-[#2a1f18] text-[#d4af37]'
                            : 'text-[#8c8075] hover:bg-[#201712] hover:text-[#f3efe6]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Standard Reader Navigation
          standardNavItems.map(item => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`text-sm font-sans transition-colors relative ${
                currentView === item.view
                  ? 'text-[#f3efe6] font-semibold after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#d4af37]'
                  : 'text-[#8c8075] hover:text-[#c5b8ab]'
              }`}
            >
              {item.label}
            </button>
          ))
        )}
        
        {/* Bookmarks (Readers Only) */}
        {(!isAuthenticated || user.role !== 'Admin') && (
          <button
            onClick={onOpenBookmarks}
            className="text-sm font-sans text-[#8c8075] hover:text-[#c5b8ab] transition-colors"
          >
            Bookmarks
          </button>
        )}
      </nav>

      {/* Right: Search + Sign In */}
      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 text-[#8c8075] hover:text-[#c5b8ab] transition-colors text-sm font-sans"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>

        <div className="w-px h-4 bg-[#3d2b1e]" />

        {!isAuthenticated ? (
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 text-[#8c8075] hover:text-[#c5b8ab] transition-colors text-sm font-sans cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        ) : (
          <>
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 text-[#c5b8ab] hover:text-[#d4af37] transition-colors text-sm font-sans cursor-pointer group"
              title={user.role === 'Admin' ? 'Author Dashboard' : 'Reader Dashboard'}
            >
              <span className="w-6 h-6 rounded-full overflow-hidden border border-[#d4af37]/40 flex items-center justify-center bg-[#1e1713]">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </span>
              <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-[#d4af37]/70 font-mono">
                {user.role === 'Admin' ? 'Author' : 'Reader'}
              </span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 text-[#8c8075] hover:text-[#c0533a] transition-colors text-sm font-sans cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
