import React, { useState, useRef, useEffect } from 'react';
import { Search, Feather, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'landing' | 'library' | 'about') => void;
  onOpenSearch: () => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenSearch,
  currentView,
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
        {standardNavItems.map(item => (
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
        ))}
      </nav>

      {/* Right: Search */}
      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 text-[#8c8075] hover:text-[#c5b8ab] transition-colors text-sm font-sans"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </header>
  );
};
