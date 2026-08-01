import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Feather, X, Send, Check } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => Promise<boolean>;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  isOpen,
  onClose,
  onSubscribe
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    const ok = await onSubscribe(email);
    if (ok) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
        onClose();
      }, 2000);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#18120e] border border-[#d4af37]/40 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#a3978c] hover:text-[#f3efe6] hover:bg-[#281d17]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#2a1e17] border border-[#d4af37] mx-auto mb-4 flex items-center justify-center text-[#d4af37]">
          <Feather className="w-6 h-6" />
        </div>

        <h2 className="font-cinzel text-xl font-bold text-[#f3efe6] mb-2">Mahi's Quill Dispatch</h2>
        <p className="font-serif-title italic text-xs text-[#d4af37] mb-6">
          "Receive quiet monthly letters directly from the library desk when new diary entries are bound."
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="w-full bg-[#121013] border border-[#3a2d24] rounded-xl p-3 text-xs text-[#f3efe6] placeholder-[#8c8075] focus:outline-none focus:border-[#d4af37]"
          />

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2b1e16] to-[#3a291e] border border-[#d4af37] text-[#f3efe6] font-cinzel font-bold text-xs hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'success' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Subscribed to Mahi's Quill!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#d4af37]" />
                <span>Join Reader Ledger</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-[#8c8075] font-mono mt-4">
          Zero spam. Only quiet thoughts delivered when a page turns.
        </p>
      </motion.div>
    </div>
  );
};
