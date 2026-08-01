import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Rss, X, Copy, Check } from 'lucide-react';

interface RSSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSSModal: React.FC<RSSModalProps> = ({ isOpen, onClose }) => {
  const [rssXml, setRssXml] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/rss.xml')
        .then(res => res.text())
        .then(data => setRssXml(data))
        .catch(() => setRssXml('<?xml version="1.0"?><rss version="2.0"><channel><title>The Unwritten Pages</title></channel></rss>'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rssXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#18120e] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-[#2d211a] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rss className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-cinzel text-base font-bold text-[#f3efe6]">Library RSS Feed XML</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-[#2b1e16] text-[#d4af37] border border-[#d4af37]/40 rounded-lg text-xs font-mono flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy XML'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#8c8075] hover:text-[#f3efe6] hover:bg-[#281d17]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto bg-[#0f0c0d] font-code text-xs text-[#a3978c]">
          <pre className="whitespace-pre-wrap">{rssXml}</pre>
        </div>

        <div className="p-3 bg-[#121013] border-t border-[#2d211a] text-right text-[11px] font-mono text-[#8c8075]">
          Syndication endpoint: /api/rss.xml
        </div>
      </motion.div>
    </div>
  );
};
