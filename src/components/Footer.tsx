import React from 'react';
import { Feather, Rss, Mail, ShieldCheck, Heart } from 'lucide-react';
interface FooterProps {
  onOpenRSS: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRSS,
  onOpenAdmin
}) => {
  return (
    <footer className="mt-20 border-t border-[#2d211a] bg-[#100d0e] text-[#a3978c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
        
        {/* Swan Quill Icon */}
        <div className="w-10 h-10 rounded-full bg-[#1c1511] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-lg">
          <Feather className="w-5 h-5" />
        </div>

        {/* Brand Name */}
        <h3 className="font-cinzel text-xl font-bold tracking-wider text-[#f3efe6]">
          The Unwritten Pages
        </h3>

        {/* Required Quote */}
        <p className="font-serif-title italic text-base sm:text-lg text-[#d4af37] max-w-lg">
          "Every page marks another step in the journey."
        </p>

        {/* Subtitle / Author Tagline */}
        <div className="flex items-center justify-center space-x-2 text-xs font-sans-body text-[#8c8075]">
          <span>Single Author Library owned by <strong className="text-[#f3efe6]">Mahi 🦢</strong></span>
          <span>•</span>
          <span className="italic">Thoughts Nobody Ordered</span>
        </div>

        {/* Quick Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans-body pt-2 border-t border-[#231b16] w-full max-w-md">
          <button
            onClick={onOpenRSS}
            className="hover:text-[#d4af37] transition-colors flex items-center space-x-1"
          >
            <Rss className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>RSS Feed XML</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="hover:text-[#d4af37] transition-colors flex items-center space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Mahi's Sanctuary</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-mono text-[#6e6359] pt-4">
          © {new Date().getFullYear()} The Unwritten Pages by Mahi 🦢. All rights reserved in silent sanctuary.
        </div>

      </div>
    </footer>
  );
};
