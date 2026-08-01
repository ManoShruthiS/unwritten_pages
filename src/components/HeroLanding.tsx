import React from 'react';
import { motion } from 'motion/react';
import { DustParticlesCanvas } from './DustParticlesCanvas';
import { BookOpen, Sparkles, Feather, Compass, Flame } from 'lucide-react';

interface HeroLandingProps {
  onOpenLibrary: () => void;
  totalDiariesCount: number;
  totalEntriesCount: number;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onOpenLibrary,
  totalDiariesCount,
  totalEntriesCount
}) => {
  return (
    <section className="relative min-h-[92vh] bg-[#0d0d0d] text-[#e5e5e5] flex flex-col justify-between items-center overflow-hidden px-4 sm:px-6 lg:px-8 border-b border-[#2d221c] select-none py-12">
      
      {/* Soft Candlelight Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#d4af3715] to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[200px] bg-[#2b1d1240] pointer-events-none" />

      {/* Floating Dust Particles Canvas */}
      <DustParticlesCanvas />

      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#d4af37]/15 via-[#2a1e17]/30 to-transparent blur-3xl pointer-events-none flicker-candle" />

      {/* Top Tagline */}
      <div className="z-20 text-[#d4af37] tracking-[0.2em] text-[10px] uppercase font-bold mb-4">
        Est. 2024 • Single Author Sanctuary
      </div>

      {/* Hero Central Header */}
      <div className="flex flex-col items-center text-center mt-2 z-10 max-w-3xl mx-auto">
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[44px] sm:text-[64px] font-serif text-[#d4af37] leading-none mb-3"
          style={{ fontFamily: "'Georgia', 'Cinzel', serif", letterSpacing: "-0.01em" }}
        >
          The Unwritten Pages
        </motion.h1>

        {/* Divider & Subtitle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af3760]" />
          <p className="text-[18px] sm:text-[22px] text-[#f4efe690] font-serif italic" style={{ fontFamily: "'Georgia', serif" }}>
            "Thoughts Nobody Ordered."
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af3760]" />
        </motion.div>

        {/* Author Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col items-center mb-8"
        >
          <p className="text-[14px] uppercase tracking-[0.3em] text-[#d4af37] opacity-90 mb-1 font-bold">
            by Mahi 🦢
          </p>
          <p className="text-[12px] text-[#f4efe660] italic uppercase tracking-[0.1em] font-serif">
            Learning as a Journey.
          </p>
        </motion.div>

        {/* Primary CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          onClick={onOpenLibrary}
          className="px-8 py-3.5 border border-[#d4af3740] bg-[#140e0b]/80 text-[#d4af37] text-[12px] uppercase tracking-[0.2em] hover:bg-[#d4af3715] hover:border-[#d4af37] transition-all duration-500 rounded-sm cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span>Open The Library</span>
        </motion.button>

      </div>

      {/* The Library Shelves (Current Collections Showcase) */}
      <div className="mt-12 w-full max-w-[900px] mb-6 relative z-10">
        
        {/* Shelf Header */}
        <div className="flex justify-between items-end px-4 mb-2">
          <h2 className="text-[11px] uppercase tracking-[0.3em] text-[#d4af3790] font-bold">Current Collections</h2>
          <div className="text-[10px] text-[#f4efe660] uppercase tracking-wider font-mono">{totalDiariesCount} Diaries Shelved</div>
        </div>

        {/* Vertical Books Layout */}
        <div className="flex justify-around items-end h-[260px] sm:h-[280px] px-6 sm:px-12 bg-[#2b1d1230] border-b-[8px] border-[#3d2b1f] rounded-t-lg shadow-2xl relative">
          
          {/* Book 1: The CodersHigh Journal */}
          <div 
            onClick={onOpenLibrary}
            className="group relative flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-4"
          >
            <div className="w-[50px] sm:w-[55px] h-[200px] sm:h-[220px] bg-[#1a2c38] rounded-l-md border-r-2 border-[#101921] flex flex-col items-center py-4 relative shadow-[8px_0_15px_-5px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-y-0 left-2 w-[1px] bg-white/5" />
              <div 
                className="text-[10px] font-serif tracking-widest text-[#d4af3790] uppercase h-full flex items-center justify-center whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                CodersHigh Journal
              </div>
              <div className="absolute bottom-4 text-[#d4af3790]">✦</div>
            </div>
            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] border border-[#d4af3730] p-3 w-44 text-left rounded shadow-2xl pointer-events-none z-30">
              <div className="text-[#d4af37] text-[10px] font-bold uppercase mb-1">The CodersHigh Journal</div>
              <div className="text-[#f4efe680] text-[9px] leading-tight italic">"Every lesson, challenge, and breakthrough documented."</div>
            </div>
          </div>

          {/* Book 2: AI Journal (Featured) */}
          <div 
            onClick={onOpenLibrary}
            className="group relative flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-4"
          >
            <div className="w-[65px] sm:w-[75px] h-[220px] sm:h-[240px] bg-[#222222] rounded-sm border-r-4 border-[#121212] border-l border-white/5 flex flex-col items-center py-6 shadow-[10px_0_20px_-5px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-y-0 left-3 w-[2px] bg-white/5" />
              <div 
                className="text-[11px] sm:text-[12px] font-serif tracking-widest text-[#d4af37] uppercase h-full flex items-center justify-center whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                The AI Chronicles
              </div>
              <div className="w-12 h-[1px] bg-[#d4af3730] my-4" />
              <div className="text-[#d4af3790] text-[10px]">M . I</div>
            </div>
            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] border border-[#d4af3730] p-3 w-44 text-left rounded shadow-2xl pointer-events-none z-30">
              <div className="text-[#d4af37] text-[10px] font-bold uppercase mb-1">The AI Journal</div>
              <div className="text-[#f4efe680] text-[9px] leading-tight italic">"Reflections on LLMs, generative models & human mind."</div>
            </div>
          </div>

          {/* Book 3: Python Journal */}
          <div 
            onClick={onOpenLibrary}
            className="group relative flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-4"
          >
            <div className="w-[45px] sm:w-[50px] h-[190px] sm:h-[210px] bg-[#1e2a1e] rounded-sm border-r-2 border-[#121b12] flex flex-col items-center py-4 shadow-[8px_0_15px_-5px_rgba(0,0,0,0.5)]">
              <div 
                className="text-[10px] font-serif tracking-widest text-[#84a184] uppercase h-full flex items-center justify-center whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Python Scripts
              </div>
              <div className="absolute top-4 text-[#84a18450]">03</div>
            </div>
            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] border border-[#d4af3730] p-3 w-44 text-left rounded shadow-2xl pointer-events-none z-30">
              <div className="text-[#84a184] text-[10px] font-bold uppercase mb-1">The Python Journal</div>
              <div className="text-[#f4efe680] text-[9px] leading-tight italic">"Snippets, automation & elegant code solutions."</div>
            </div>
          </div>

          {/* Book 4: Personal Reflections */}
          <div 
            onClick={onOpenLibrary}
            className="group relative flex flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-4"
          >
            <div className="w-[55px] sm:w-[65px] h-[210px] sm:h-[230px] bg-[#3d2b1f] rounded-sm border-r-4 border-[#2b1d12] flex flex-col items-center py-4 shadow-[10px_0_20px_-5px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-y-0 left-2 w-[1px] bg-white/10" />
              <div 
                className="text-[10px] sm:text-[11px] font-serif tracking-[0.15em] text-[#f4efe6a0] uppercase h-full flex items-center justify-center whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Personal Reflections
              </div>
              <div className="absolute bottom-8 w-8 h-[2px] bg-[#d4af3740]" />
            </div>
            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] border border-[#d4af3730] p-3 w-44 text-left rounded shadow-2xl pointer-events-none z-30">
              <div className="text-[#f4efe6] text-[10px] font-bold uppercase mb-1">Personal Reflections</div>
              <div className="text-[#f4efe680] text-[9px] leading-tight italic">"Quiet thoughts, life philosophy & late night musings."</div>
            </div>
          </div>

          {/* Book 5: Java Anthology */}
          <div 
            onClick={onOpenLibrary}
            className="hidden sm:flex group relative flex-col items-center cursor-pointer transition-transform duration-500 hover:-translate-y-4"
          >
            <div className="w-[45px] h-[200px] bg-[#331c1c] rounded-sm border-r-2 border-[#201010] flex flex-col items-center py-4 shadow-[8px_0_15px_-5px_rgba(0,0,0,0.5)]">
              <div 
                className="text-[9px] font-serif tracking-widest text-[#d4af3770] uppercase h-full flex items-center justify-center whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Java Anthology
              </div>
            </div>
            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#121212] border border-[#d4af3730] p-3 w-44 text-left rounded shadow-2xl pointer-events-none z-30">
              <div className="text-[#d4af3770] text-[10px] font-bold uppercase mb-1">Java Anthology</div>
              <div className="text-[#f4efe680] text-[9px] leading-tight italic">"Core OOP concepts & systems architecture."</div>
            </div>
          </div>

          {/* Shadow Under Books */}
          <div className="absolute bottom-[-2px] left-0 right-0 h-4 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        
        {/* Wooden Shelf Detail */}
        <div className="h-8 w-full bg-[#1e130b] border-t-2 border-[#3d2b1f] shadow-[0_10px_30px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Library Status Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-4 border-t border-[#2d221c]/60 z-20 text-[10px] uppercase tracking-widest">
        <p className="text-[#f4efe640] font-serif italic text-xs">
          "Every page marks another step in the journey."
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#065f46] shadow-[0_0_8px_#065f46]" />
            <span className="text-[#f4efe650]">Writer Active</span>
          </div>
          <div className="text-[#d4af3780] font-mono">{totalEntriesCount} Entries Logged</div>
        </div>
      </div>

    </section>
  );
};

