import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { JournalEntry, Diary, Comment } from '../types';
import { 
  ArrowLeft, Clock, Calendar, Heart, Bookmark, Share2, 
  Check, MessageSquare, Send, ThumbsUp, ShieldAlert, Sparkles, 
  ChevronLeft, ChevronRight, User, Feather, CornerDownRight, Copy, Terminal, Lock
} from 'lucide-react';

interface JournalEntryViewProps {
  entry: JournalEntry;
  diary?: Diary;
  allEntries: JournalEntry[];
  isBookmarked: boolean;
  isParchmentMode: boolean;
  onSelectEntry: (entry: JournalEntry) => void;
  onBackToDiary: () => void;
  onLikeEntry: (entryId: string) => void;
  onBookmarkEntry: (entryId: string) => void;
  isLiked: boolean;
  comments: Comment[];
  onAddComment: (entryId: string, content: string) => void;
  isAuthenticated: boolean;
}

export const JournalEntryView: React.FC<JournalEntryViewProps> = ({
  entry,
  diary,
  allEntries,
  onSelectEntry,
  onBackToDiary,
  onLikeEntry,
  onBookmarkEntry,
  isBookmarked,
  isLiked,
  isParchmentMode,
  comments,
  onAddComment,
  isAuthenticated
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const [hasLiked, setHasLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(entry.likes);

  // Sync likes count on entry change
  useEffect(() => {
    setLikesCount(entry.likes);
    setHasLiked(isLiked);
  }, [entry.id, entry.likes, isLiked]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Like Entry
  const handleLikeClick = () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }
    
    if (!hasLiked) {
      setHasLiked(true);
      setLikesCount(prev => prev + 1);
      onLikeEntry(entry.id);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#d4af37', '#e5c158', '#10b981']
      });
    }
  };

  // Handle Share / Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Find Previous and Next entries in the same or overall list
  const currentIdx = allEntries.findIndex(e => e.id === entry.id);
  const prevEntry = currentIdx > 0 ? allEntries[currentIdx - 1] : null;
  const nextEntry = currentIdx < allEntries.length - 1 ? allEntries[currentIdx + 1] : null;

  // Find related entries sharing tags or diary
  const relatedEntries = allEntries
    .filter(e => e.id !== entry.id && (e.diaryId === entry.diaryId || e.tags.some(t => entry.tags.includes(t))))
    .slice(0, 2);


  // Parse markdown-style content simple helper for rich display
  const renderFormattedContent = (content: string) => {
    const lines = content.trim().split('\n');
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          elements.push(
            <div key={`code-${idx}`} className="my-6 rounded-xl bg-[#0e0c0d] border border-[#3a2d24] overflow-hidden shadow-2xl font-code text-xs sm:text-sm">
              <div className="bg-[#18120e] px-4 py-2 border-b border-[#2d211a] flex items-center justify-between text-[#a3978c]">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-mono text-xs uppercase">{codeLanguage || 'code'}</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(codeBuffer.join('\n'))}
                  className="flex items-center space-x-1 text-[11px] text-[#a3978c] hover:text-[#d4af37] transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[#f3efe6] leading-relaxed">
                <code>{codeBuffer.join('\n')}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#f3efe6] mt-8 mb-4 border-b border-[#2d211a] pb-3">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="font-serif-title text-xl font-bold text-[#e5c158] mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={idx} className="my-6 p-4 rounded-r-xl border-l-4 border-[#d4af37] bg-[#1a1411]/80 italic font-handwriting text-2xl text-[#f3efe6] shadow-inner">
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
        elements.push(
          <div key={idx} className="my-6 p-4 rounded-xl bg-[#1a1411] border border-[#d4af37]/30 text-center font-mono text-sm text-[#e5c158]">
            {line.trim().replaceAll('$$', '')}
          </div>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li key={idx} className="ml-6 list-disc text-sm sm:text-base text-[#c5b8ab] my-1 leading-relaxed">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      } else if (line.trim() === '---') {
        elements.push(<hr key={idx} className="my-8 border-[#3a2d24]" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={idx} className="my-4 text-sm sm:text-base text-[#c5b8ab] leading-relaxed font-sans-body">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isParchmentMode ? 'page-parchment' : 'bg-[#121013] text-[#f3efe6]'}`}>
      
      {/* STICKY READING PROGRESS BAR */}
      <div className="fixed top-16 left-0 right-0 z-30 h-1 bg-[#1e1713]">
        <div 
          className="h-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-emerald-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Navigation Back Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToDiary}
            className="inline-flex items-center space-x-2 text-xs font-sans-body font-medium text-[#d4af37] hover:text-[#f3efe6] bg-[#1a1411] hover:bg-[#281d17] px-3.5 py-1.5 rounded-lg border border-[#3a2b21] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {diary?.title || 'Diary'}</span>
          </button>

          {/* Reading progress indicator label */}
          <div className="text-xs font-mono text-[#a3978c] flex items-center space-x-2">
            <span>{Math.round(scrollProgress)}% read</span>
          </div>
        </div>

        {/* HERO COVER IMAGE */}
        <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl mb-8 relative">
          <img
            src={entry.coverImage}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121013] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3 py-1 rounded-md bg-[#121013]/90 border border-[#d4af37]/60 text-[#d4af37] font-mono text-xs font-bold">
            {entry.entryNumber}
          </div>
        </div>

        {/* ARTICLE HEADER */}
        <header className="mb-10 text-center sm:text-left border-b border-[#2d211a] pb-8">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-sans-body text-[#a3978c] mb-3">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Published: {entry.publishedDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{entry.readingTime}</span>
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-[#1e1713] text-[#e5c158] border border-[#3a2d24] font-mono">
              {diary?.title || 'Volume'}
            </span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#f3efe6] leading-tight mb-3">
            {entry.title}
          </h1>

          {entry.subtitle && (
            <p className="font-serif-title italic text-lg sm:text-xl text-[#d4af37] max-w-2xl">
              "{entry.subtitle}"
            </p>
          )}

          {/* Author Bio Badge */}
          <div className="mt-6 flex items-center justify-between pt-6 border-t border-[#231b16]">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-[#2a1e17] border border-[#d4af37] flex items-center justify-center text-[#d4af37] font-bold text-lg shadow-inner">
                🦢
              </div>
              <div>
                <span className="block font-serif-title font-bold text-sm text-[#f3efe6]">
                  Mahi 🦢
                </span>
                <span className="text-xs text-[#a3978c] font-sans-body">
                  Sole Author & Curator • "Thoughts Nobody Ordered"
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLikeClick}
                className={`p-2.5 rounded-lg border transition-all flex items-center space-x-1.5 text-xs ${
                  hasLiked
                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-900/20'
                    : 'bg-[#1e1713] text-[#c5b8ab] border-[#3a2d24] hover:text-rose-400 hover:border-rose-500/40'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span className="font-mono">{likesCount}</span>
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthWarning(true);
                    return;
                  }
                  onBookmarkEntry(entry.id);
                }}
                className={`p-2.5 rounded-lg border transition-all text-xs ${
                  isBookmarked
                    ? 'bg-[#2b1e16] text-[#d4af37] border-[#d4af37]'
                    : 'bg-[#1e1713] text-[#c5b8ab] border-[#3a2d24] hover:text-[#d4af37]'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Entry'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#d4af37]' : ''}`} />
              </button>

              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-lg bg-[#1e1713] text-[#c5b8ab] border border-[#3a2d24] hover:text-[#d4af37] transition-all text-xs flex items-center space-x-1"
                title="Share or copy link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </header>

        {/* ARTICLE BODY */}
        <div className="prose prose-invert max-w-none font-sans-body leading-relaxed space-y-4 text-[#c5b8ab]">
          {renderFormattedContent(entry.content)}
        </div>

        {/* TAGS FOOTER */}
        <div className="mt-12 pt-6 border-t border-[#2d211a] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#a3978c] font-mono mr-2">Entry Tags:</span>
          {entry.tags.map(t => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-[#1e1713] text-[#d4af37] border border-[#3a2d24]">
              #{t}
            </span>
          ))}
        </div>

        {/* LIKE & SHARE ACTION BAR */}
        <div className="my-10 p-6 rounded-2xl bg-[#18120e] border border-[#3a2a1e] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif-title text-base font-bold text-[#f3efe6]">Did this entry resonate with you?</h4>
            <p className="text-xs text-[#a3978c] mt-0.5">Leave a like or bookmark this page to return later in your reading journey.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLikeClick}
              className={`px-5 py-2.5 rounded-xl border text-xs font-sans-body font-bold transition-all flex items-center space-x-2 ${
                hasLiked
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/30'
                  : 'bg-[#2b1e16] text-[#e5c158] border-[#d4af37]/60 hover:border-[#d4af37]'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
              <span>{hasLiked ? 'Liked Page' : 'Applaud Entry'} ({likesCount})</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-[#1a1411] border border-[#3a2d24] text-[#a3978c] hover:text-[#f3efe6] text-xs font-sans-body flex items-center space-x-1.5 transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
            </button>
          </div>
        </div>

        {/* PREVIOUS & NEXT ENTRY NAVIGATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
          {prevEntry ? (
            <div
              onClick={() => onSelectEntry(prevEntry)}
              className="cursor-pointer p-4 rounded-xl bg-[#18120e] hover:bg-[#221913] border border-[#30231b] hover:border-[#d4af37]/60 transition-all flex items-center space-x-3"
            >
              <ChevronLeft className="w-5 h-5 text-[#d4af37] shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-[#a3978c] uppercase">Previous Entry</span>
                <span className="font-cinzel text-sm font-bold text-[#f3efe6] line-clamp-1">{prevEntry.title}</span>
              </div>
            </div>
          ) : <div />}

          {nextEntry ? (
            <div
              onClick={() => onSelectEntry(nextEntry)}
              className="cursor-pointer p-4 rounded-xl bg-[#18120e] hover:bg-[#221913] border border-[#30231b] hover:border-[#d4af37]/60 transition-all flex items-center justify-end space-x-3 text-right"
            >
              <div>
                <span className="block text-[10px] font-mono text-[#a3978c] uppercase">Next Entry</span>
                <span className="font-cinzel text-sm font-bold text-[#f3efe6] line-clamp-1">{nextEntry.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#d4af37] shrink-0" />
            </div>
          ) : <div />}
        </div>

        {/* RELATED ENTRIES */}
        {relatedEntries.length > 0 && (
          <div className="my-12">
            <h3 className="font-cinzel text-xl font-bold text-[#f3efe6] mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Related Pages in the Library</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedEntries.map(re => (
                <div
                  key={re.id}
                  onClick={() => onSelectEntry(re)}
                  className="cursor-pointer p-4 rounded-xl bg-[#18120e] border border-[#30231b] hover:border-[#d4af37]/60 transition-all flex items-start space-x-3 group"
                >
                  <img src={re.coverImage} alt={re.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-[#d4af37]">{re.entryNumber}</span>
                    <h4 className="font-cinzel text-sm font-bold text-[#f3efe6] group-hover:text-[#d4af37] transition-colors leading-snug">
                      {re.title}
                    </h4>
                    <p className="text-xs text-[#a3978c] line-clamp-1 mt-1">{re.previewParagraph}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS SECTION - LOCKED FOR NOW */}
        <div className="my-16 pt-12 border-t border-[#2d211a]">
          <div className="flex items-center space-x-2 mb-8">
            <MessageSquare className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-cinzel text-2xl font-bold text-[#f3efe6]">Notes & Reflections</h3>
          </div>

          <div className="bg-[#110e0b] border border-[#d4af37]/20 rounded-xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#18120e] border border-[#3a2d24] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#8c8075]" />
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#f3efe6] mb-2">Community Reflections</h4>
            <p className="text-sm text-[#8c8075] max-w-sm mx-auto">
              This feature is currently locked. Soon, you will be able to share your thoughts and read reflections from other readers.
            </p>
            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#18120e] border border-[#3a2d24]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">Coming Soon</span>
            </div>
          </div>
        </div>

      </article>

      {/* Auth Warning Modal */}
      {showAuthWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#18120e] border border-[#d4af37]/40 rounded-xl max-w-sm w-full p-6 text-center shadow-2xl relative"
          >
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center mx-auto mb-4 border border-[#d4af37]/20">
              <User className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#f3efe6] mb-2">Authentication Required</h3>
            <p className="text-[#a3978c] text-sm mb-6">
              You have not logged in yet. Please log in to like this entry or leave a comment so we can display your name properly!
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowAuthWarning(false)}
                className="px-6 py-2 bg-[#d4af37] text-black font-cinzel font-bold text-sm rounded hover:bg-[#e5c158] transition-colors"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
