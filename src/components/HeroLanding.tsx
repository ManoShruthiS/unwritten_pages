import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Feather } from 'lucide-react';

interface HeroLandingProps {
  onOpenLibrary: () => void;
  ctaLabel: string;
  ctaIcon: 'book' | 'feather';
  onSelectDiary?: (diary: any) => void;
  onSelectEntry?: (entry: any) => void;
  diaries?: any[];
  entries?: any[];
  totalDiariesCount: number;
  totalEntriesCount: number;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onOpenLibrary,
  ctaLabel = 'Open Library',
  ctaIcon = 'book',
}) => {
  const IconComponent = ctaIcon === 'feather' ? Feather : BookOpen;
  return (
    <div className="bg-[#0a0804] min-h-screen font-serif">

      {/* ─── HERO SECTION ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('/hero-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0804]/30 via-[#0a0804]/55 to-[#0a0804]" />
        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,8,4,0.7) 100%)' }} />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-4">
          {/* Top star ornament */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#d4af37] text-xl mb-3 tracking-widest"
          >
            ✦
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#c5b8ab] text-base sm:text-lg tracking-widest italic mb-4"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Thoughts Nobody Ordered.
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[#d4af37] leading-none mb-4"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              textShadow: '0 0 80px rgba(212,175,55,0.3), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            The Unwritten Pages
          </motion.h1>

          {/* Signature */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#c5b8ab] text-xl sm:text-2xl italic mb-3"
            style={{ fontFamily: "'Georgia', cursive", letterSpacing: '0.05em' }}
          >
            by Mahi 🦢
          </motion.p>

          {/* Sub tagline with ornamental lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-[#d4af37]/50" />
            <p className="text-[#a3978c] text-sm tracking-[0.2em] uppercase">
              Learning as a Journey.
            </p>
            <div className="h-px w-12 bg-[#d4af37]/50" />
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={onOpenLibrary}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-10 py-3.5 border border-[#8b3a2a] bg-[#6b2a1c]/90 text-[#f3e8d4] text-sm tracking-[0.25em] uppercase hover:bg-[#7d3020] hover:border-[#c0533a] transition-all duration-300 shadow-[0_4px_30px_rgba(107,42,28,0.5)] cursor-pointer min-w-[240px] justify-center"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: '0.2em' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={ctaIcon}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center"
              >
                <IconComponent className="w-5 h-5" />
              </motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={ctaLabel}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {ctaLabel}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </section>

    </div>
  );
};
