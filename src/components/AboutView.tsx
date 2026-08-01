import React from 'react';
import { motion } from 'motion/react';
import { Feather, BookOpen } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[70vh] flex flex-col justify-center"
    >
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#2a1e17] to-[#121013] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner mb-6">
          <Feather className="w-8 h-8" />
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#f3efe6] mb-4">
          About the Author
        </h1>
        <p className="font-serif-title italic text-lg text-[#d4af37]/80">
          "Thoughts Nobody Ordered."
        </p>
      </div>

      <div className="bg-[#18120e] border border-[#2d211a] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        
        <div className="prose prose-invert prose-p:text-[#c5b8ab] prose-p:font-sans-body max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to <strong>The Unwritten Pages</strong>. I am Mahi, and this is my digital sanctuary. 
            In a world that constantly rushes toward the next notification, I wanted to build a quiet corner on the internet—a place where thoughts can breathe, ideas can marinate, and code can be appreciated as a craft.
          </p>
          
          <p className="text-lg leading-relaxed mb-6">
            This library is a collection of my personal diaries. Each volume represents a different facet of my journey, from the intricate logic of algorithms in the CodersHigh Journal, to the philosophical musings of late-night reading sessions.
          </p>

          <p className="text-lg leading-relaxed mb-8">
            Pull up a chair, pick a book from the shelf, and stay a while. The pages are always open.
          </p>
        </div>

        <div className="flex justify-center mt-8 pt-8 border-t border-[#2d211a]">
          <div className="text-center">
            <BookOpen className="w-6 h-6 text-[#d4af37]/60 mx-auto mb-2" />
            <span className="text-xs font-mono tracking-widest text-[#a3978c] uppercase">Est. 2024</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
