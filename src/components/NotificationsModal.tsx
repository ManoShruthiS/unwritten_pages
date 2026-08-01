import React from 'react';
import { motion } from 'motion/react';
import { NotificationItem } from '../types';
import { Bell, X, Sparkles, CheckCheck } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#18120e] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[#2d211a] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-cinzel text-lg font-bold text-[#f3efe6]">Library Dispatches</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a3978c] hover:text-[#f3efe6] hover:bg-[#281d17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all ${
                n.read
                  ? 'bg-[#121013] border-[#2a201a] opacity-75'
                  : 'bg-[#201813] border-[#d4af37]/50 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#d4af37] font-mono mb-1">
                <span className="font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>{n.title}</span>
                </span>
                <span className="text-[#8c8075] text-[10px]">{n.date}</span>
              </div>
              <p className="text-xs text-[#c5b8ab] font-sans-body leading-relaxed">
                {n.message}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#121013] border-t border-[#2d211a] flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllRead}
            className="text-[#d4af37] hover:underline flex items-center space-x-1 font-mono"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
          <span className="text-[#8c8075]">From Mahi's Desk</span>
        </div>
      </motion.div>
    </div>
  );
};
