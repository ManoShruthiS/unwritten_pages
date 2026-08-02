import React, { useState, useRef, useEffect } from 'react';
import { Diary, JournalEntry } from '../types';
import { renderDiaryIcon } from './LibraryShelves';
import * as LucideIcons from 'lucide-react';
import {
  BookOpen, Plus, Edit3, Trash2, BarChart2, Eye, Heart,
  Users, Sparkles, Save, Check, FileText, Image, Tag, Clock,
  Send, MessageSquare, Pencil, Pin, Search, TrendingUp, Star,
  ArrowRight, ArrowLeft, Settings, LayoutDashboard, Feather, Bell, Globe,
  LogOut, ChevronRight, Mail, Zap, Activity, PieChart,
  Layers, HardDrive, Palette, Link, X, Menu, MoreHorizontal,
  BookMarked, BarChart, LineChart, ThumbsUp, UserCheck, Filter,
  RefreshCw, Download, Upload, ExternalLink, Home, Cpu, Flame,
  Calendar, Hash, AtSign, Radio, Rss, Shield, Terminal,
  Coffee, Compass, FolderOpen, FileEdit, Archive, Award,
  AlignLeft, Type, Code, ImageIcon
} from 'lucide-react';

const COVER_COLORS = [
  '#2b1b17', '#1c2e3b', '#1c3b28', '#3b201c', '#2d1c3b',
  '#1f1f2e', '#4a2511', '#243a46', '#3d1627', '#172418'
];

const AVAILABLE_ICONS = [
  'BookOpen', 'Code', 'Sparkles', 'Terminal', 'Coffee', 'Cpu', 'Feather', 'Compass', 'Flame', 'PenTool',
  'Activity', 'Anchor', 'Aperture', 'Archive', 'Award', 'Battery', 'Bell', 'Camera', 'Cast', 'Cloud',
  'Command', 'Database', 'Disc', 'Droplet', 'Eye', 'Film', 'Flag', 'Folder', 'Gift', 'Globe',
  'Headphones', 'Heart', 'Hexagon', 'Image', 'Inbox', 'Key', 'Layers', 'Layout', 'LifeBuoy', 'Link',
  'Lock', 'Map', 'MessageSquare', 'Mic', 'Monitor', 'Moon', 'Music', 'Navigation', 'Package', 'Paperclip',
  'PieChart', 'Play', 'Power', 'Printer', 'Radio', 'RefreshCw', 'Save', 'Scissors', 'Search',
  'Send', 'Server', 'Settings', 'Shield', 'ShoppingBag', 'Smartphone', 'Speaker', 'Star', 'Sun', 'Tablet',
  'Tag', 'Target', 'Thermometer', 'ThumbsUp', 'Tool', 'Trash2', 'TrendingUp', 'Truck', 'Tv', 'Umbrella',
  'Unlock', 'Upload', 'User', 'Video', 'Voicemail', 'Volume2', 'Watch', 'Wifi', 'Wind', 'Zap',
  'ZoomIn', 'Focus', 'Gamepad2', 'Glasses', 'KeyRound', 'Laptop', 'Leaf', 'Lightbulb', 'Magnet', 'Mail'
];

interface AuthorDashboardProps {
  diaries: Diary[];
  entries: JournalEntry[];
  authorName: string;
  onCreateDiary: (diaryData: Partial<Diary>) => void;
  onDeleteDiary: (diaryId: string) => void;
  onCreateEntry: (entryData: Partial<JournalEntry>) => void;
  onUpdateEntry: (entryId: string, entryData: Partial<JournalEntry>) => void;
  onTogglePinDiary: (diaryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onUpdateDiary: (diaryId: string, data: Partial<Diary>) => void;
  onClose: () => void;
  onSignOut: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

type ActivePage =
  | 'library'
  | 'entries'
  | 'drafts'
  | 'media'
  | 'write';



export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({
  diaries,
  entries,
  authorName,
  onCreateDiary,
  onDeleteDiary,
  onCreateEntry,
  onUpdateEntry,
  onUpdateDiary,
  onTogglePinDiary,
  onDeleteEntry,
  onClose,
  onSignOut,
  activePage,
  setActivePage
}) => {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entriesQuery, setEntriesQuery] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [vaultImages, setVaultImages] = useState<string[]>(
    Array.from(new Set(diaries.flatMap(d => entries.filter(e => e.diaryId === d.id).map(e => e.coverImage)).filter(Boolean)))
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [draftsList, setDraftsList] = useState([
    { id: '1', title: 'The Midnight Thoughts', updated: '6h ago', words: 340 },
    { id: '2', title: 'On Persistence', updated: '2d ago', words: 820 },
    { id: '3', title: 'Building in the Dark', updated: '1w ago', words: 1240 },
  ]);

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'diary' | 'entry' | 'comment' | 'draft' | 'vault';
    id: string;
    title: string;
  } | null>(null);

  const confirmDelete = (type: 'diary' | 'entry' | 'comment' | 'draft' | 'vault', id: string, title: string) => {
    setDeleteConfirmation({ isOpen: true, type, id, title });
  };

  const executeDelete = () => {
    if (!deleteConfirmation) return;
    const { type, id } = deleteConfirmation;
    switch (type) {
      case 'diary': onDeleteDiary(id); break;
      case 'entry': onDeleteEntry(id); break;
      case 'draft': setDraftsList(prev => prev.filter(d => d.id !== id)); break;
      case 'vault': setVaultImages(prev => prev.filter(img => img !== id)); break;
    }
    setDeleteConfirmation(null);
  };

  // New Entry Form State
  const [entryDiaryId, setEntryDiaryId] = useState(diaries[0]?.id || '');
  const [entryTitle, setEntryTitle] = useState('');
  const [entrySubtitle, setEntrySubtitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryCoverImage, setEntryCoverImage] = useState(
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
  );
  const [entryTags, setEntryTags] = useState('Reflections');

  // New Diary Form State
  const [newDiaryTitle, setNewDiaryTitle] = useState('');
  const [newDiaryDesc, setNewDiaryDesc] = useState('');
  const [newDiaryColor, setNewDiaryColor] = useState(COVER_COLORS[0]);
  const [newDiaryIcon, setNewDiaryIcon] = useState(AVAILABLE_ICONS[0]);
  const [editingVolumeId, setEditingVolumeId] = useState<string | null>(null);
  
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  // Derived
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Late night musings';
  const topEntries = [...entries].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const maxLikes = Math.max(1, ...topEntries.map(e => e.likes));
  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(entriesQuery.toLowerCase()) ||
    e.tags?.some(t => t.toLowerCase().includes(entriesQuery.toLowerCase()))
  );

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) return;
    setSaveStatus('saving');
    const words = entryContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const parsedTags = entryTags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: entryTitle.trim(),
      subtitle: entrySubtitle.trim(),
      content: entryContent,
      coverImage: entryCoverImage,
      tags: parsedTags,
      readingTime: `${minutes} min read`,
      previewParagraph: entryContent.slice(0, 180) + '...'
    };
    if (editingEntryId) {
      onUpdateEntry(editingEntryId, payload);
    } else {
      onCreateEntry({ ...payload, diaryId: entryDiaryId || diaries[0]?.id });
    }
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus('idle');
        setEditingEntryId(null);
        setEntryTitle('');
        setEntrySubtitle('');
        setEntryContent('');
        setActivePage('entries');
      }, 1000);
    }, 600);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setEntryDiaryId(entry.diaryId);
    setEntryTitle(entry.title);
    setEntrySubtitle(entry.subtitle);
    setEntryContent(entry.content);
    setEntryCoverImage(entry.coverImage);
    setEntryTags(entry.tags?.join(', ') || '');
    setIsPreviewMode(false);
    setActivePage('write');
  };

  const handleCreateDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiaryTitle.trim()) return;
    
    const payload = {
      title: newDiaryTitle.trim(),
      description: newDiaryDesc.trim(),
      coverColor: newDiaryColor,
      icon: newDiaryIcon,
    };

    if (editingVolumeId) {
      onUpdateDiary(editingVolumeId, payload);
    } else {
      onCreateDiary(payload);
    }
    
    setNewDiaryTitle('');
    setNewDiaryDesc('');
    setNewDiaryColor(COVER_COLORS[0]);
    setNewDiaryIcon(AVAILABLE_ICONS[0]);
    setEditingVolumeId(null);
  };

  const handleEditDiary = (d: Diary) => {
    setEditingVolumeId(d.id);
    setNewDiaryTitle(d.title);
    setNewDiaryDesc(d.description || '');
    setNewDiaryColor(d.coverColor || COVER_COLORS[0]);
    setNewDiaryIcon(d.icon || AVAILABLE_ICONS[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 bg-[#0e0b09] text-[#e8e0d5] overflow-y-auto font-sans-body">
      <div className="max-w-[1400px] mx-auto min-h-full">
        {/* Content area */}
        <div className="flex-1 overflow-y-auto bg-[#0e0b09]">

          {/* Universal Back Button */}
          {activePage !== 'entries' && (
            <div className="px-5 pt-5 pb-1 flex items-center">
              <button
                onClick={() => setActivePage('entries')}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#8a7a6a] hover:text-[#d4af37] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Entries
              </button>
            </div>
          )}


          {/* ── WRITER'S DESK / WRITE ────────────────────────────── */}
          {activePage === 'write' && (
            <div className="p-5 max-w-4xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-6">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#2a1e15]">
                  <div>
                    <h2 className="font-cinzel text-base font-bold text-[#f0e8d8]">
                      {editingEntryId ? `Editing: ${entryTitle || 'Untitled'}` : 'Compose New Entry'}
                    </h2>
                    <p className="text-[10px] text-[#6a5a4a] mt-0.5">Write with full markdown support</p>
                  </div>
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="px-3 py-1.5 border border-[#3a2a1a] text-[10px] text-[#d4af37] rounded-lg hover:border-[#d4af37] cursor-pointer transition-all"
                  >
                    {isPreviewMode ? 'Edit Mode' : 'Live Preview'}
                  </button>
                </div>

                <form onSubmit={handleEntrySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Select Journal Volume</label>
                      <select
                        value={entryDiaryId}
                        onChange={e => setEntryDiaryId(e.target.value)}
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none"
                      >
                        {diaries.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={entryTags}
                        onChange={e => setEntryTags(e.target.value)}
                        placeholder="CodersHigh, Reflect, AI"
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Entry Title</label>
                    <input
                      type="text"
                      value={entryTitle}
                      onChange={e => setEntryTitle(e.target.value)}
                      placeholder="e.g. Building My First Project"
                      className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-xl p-3 text-sm font-cinzel font-bold text-[#f0e8d8] focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Subtitle / Epigraph</label>
                    <input
                      type="text"
                      value={entrySubtitle}
                      onChange={e => setEntrySubtitle(e.target.value)}
                      placeholder="A reflective note..."
                      className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-xs font-serif-title italic text-[#d4af37] focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#d4af37] mb-2">Cover Image</label>
                    <div className="flex items-end gap-3">
                      {entryCoverImage ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[#2a1e15] group">
                          <img src={entryCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEntryCoverImage('')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-20 rounded-lg border-2 border-dashed border-[#2a1e15] flex items-center justify-center text-[#5a4a3a]">
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsVaultModalOpen(true)}
                        className="px-3 py-2 bg-[#1c1814] border border-[#2a1e15] text-[10px] text-[#d4af37] rounded-lg hover:border-[#d4af37] transition-colors whitespace-nowrap cursor-pointer h-9"
                      >
                        Select from Vault
                      </button>
                    </div>
                  </div>


                  <div>
                    <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Content (Markdown)</label>
                    {isPreviewMode ? (
                      <div className="bg-[#110e0b] border border-[#2a1e15] rounded-xl p-5 min-h-[250px] text-sm text-[#c5b8ab] leading-relaxed">
                        <h1 className="font-cinzel text-xl font-bold text-[#f0e8d8] mb-2">{entryTitle || 'Untitled'}</h1>
                        <p className="font-serif-title italic text-[#d4af37] mb-4">{entrySubtitle}</p>
                        <pre className="whitespace-pre-wrap font-sans-body text-xs">{entryContent}</pre>
                      </div>
                    ) : (
                      <textarea
                        rows={12}
                        value={entryContent}
                        onChange={e => setEntryContent(e.target.value)}
                        placeholder="Write your reflection here... Use # for headings, ``` for code blocks, > for quotes."
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-xl p-4 text-xs text-[#e8e0d5] font-mono leading-relaxed focus:border-[#d4af37] outline-none resize-none"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a1e15]">
                    <span className="text-[10px] text-[#6a5a4a] font-mono">
                      Words: {entryContent.trim().split(/\s+/).filter(Boolean).length}
                    </span>
                    <button
                      type="submit"
                      disabled={!entryTitle.trim() || !entryContent.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[#2b1e16] border border-[#d4af37] text-[#f0e8d8] font-cinzel font-bold text-xs hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {saveStatus === 'saving' ? (
                        <><RefreshCw className="w-3.5 h-3.5 text-[#d4af37] animate-spin" /><span>Saving...</span></>
                      ) : saveStatus === 'saved' ? (
                        <><Check className="w-3.5 h-3.5 text-emerald-400" /><span>Published!</span></>
                      ) : (
                        <><Send className="w-3.5 h-3.5 text-[#d4af37]" /><span>{editingEntryId ? 'Save Changes' : 'Publish Entry'}</span></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── LIBRARY / DIARIES ───────────────────────────────── */}
          {activePage === 'library' && (
            <div className="p-5 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Create/Edit Diary */}
                <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5 self-start">
                  <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">
                    {editingVolumeId ? 'Update Volume Details' : 'Create New Diary Volume'}
                  </h2>
                  <form onSubmit={handleCreateDiarySubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Diary Title</label>
                      <input
                        type="text"
                        value={newDiaryTitle}
                        onChange={e => setNewDiaryTitle(e.target.value)}
                        placeholder="e.g. System Design Journal"
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={newDiaryDesc}
                        onChange={e => setNewDiaryDesc(e.target.value)}
                        placeholder="Brief summary..."
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 relative">
                      <div className="relative">
                        <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Cover Color</label>
                        <button
                          type="button"
                          onClick={() => { setIsColorPickerOpen(!isColorPickerOpen); setIsIconPickerOpen(false); }}
                          className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 flex items-center gap-2 text-xs text-[#e8e0d5] hover:border-[#d4af37] transition-colors"
                        >
                          <div className="w-4 h-4 rounded-full border border-black/50" style={{ backgroundColor: newDiaryColor }}></div>
                          <span className="flex-1 text-left">{newDiaryColor}</span>
                        </button>
                        
                        {isColorPickerOpen && (
                          <div className="absolute top-full left-0 mt-1 p-2 bg-[#16120e] border border-[#3a2a1a] rounded-lg shadow-xl z-50 w-full grid grid-cols-5 gap-2">
                            {COVER_COLORS.map(color => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => { setNewDiaryColor(color); setIsColorPickerOpen(false); }}
                                className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 ${newDiaryColor === color ? 'border-[#d4af37]' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="relative">
                        <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Icon</label>
                        <button
                          type="button"
                          onClick={() => { setIsIconPickerOpen(!isIconPickerOpen); setIsColorPickerOpen(false); }}
                          className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 flex items-center gap-2 text-xs text-[#e8e0d5] hover:border-[#d4af37] transition-colors"
                        >
                          <div className="text-[#d4af37]">
                            {renderDiaryIcon(newDiaryIcon, "w-4 h-4")}
                          </div>
                          <span className="flex-1 text-left truncate">{newDiaryIcon}</span>
                        </button>

                        {isIconPickerOpen && (
                          <div className="absolute top-full right-0 mt-1 p-3 bg-[#16120e] border border-[#3a2a1a] rounded-xl shadow-xl z-50 w-[280px] h-[300px] flex flex-col">
                            <div className="text-xs font-mono text-[#d4af37] mb-2 flex justify-between items-center">
                              <span>Select an Icon</span>
                              <button type="button" onClick={() => setIsIconPickerOpen(false)}><X className="w-4 h-4 text-[#8a7a6a] hover:text-rose-400"/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-1 pr-1 custom-scrollbar">
                              {AVAILABLE_ICONS.map(iconName => (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => { setNewDiaryIcon(iconName); setIsIconPickerOpen(false); }}
                                  className={`aspect-square rounded flex items-center justify-center transition-all hover:bg-[#2b1e16] hover:text-[#d4af37] ${newDiaryIcon === iconName ? 'bg-[#2b1e16] text-[#d4af37] border border-[#d4af37]/30' : 'text-[#8a7a6a]'}`}
                                  title={iconName}
                                >
                                  {renderDiaryIcon(iconName, "w-4 h-4")}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2" onClick={() => { setIsColorPickerOpen(false); setIsIconPickerOpen(false); }}>
                      {editingVolumeId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVolumeId(null);
                            setNewDiaryTitle('');
                            setNewDiaryDesc('');
                            setNewDiaryColor(COVER_COLORS[0]);
                            setNewDiaryIcon(AVAILABLE_ICONS[0]);
                          }}
                          className="w-1/3 py-2.5 bg-[#1c1814] border border-[#2a1e15] text-[#8a7a6a] rounded-xl font-cinzel font-bold text-xs hover:text-[#f0e8d8] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!newDiaryTitle.trim()}
                        className={`${editingVolumeId ? 'w-2/3' : 'w-full'} py-2.5 bg-[#2b1e16] border border-[#d4af37] text-[#e5c158] rounded-xl font-cinzel font-bold text-xs hover:bg-[#38281d] transition-all cursor-pointer disabled:opacity-50`}
                      >
                        {editingVolumeId ? 'Save Changes' : 'Bind New Volume'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Diaries */}
                <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                  <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">
                    Existing Volumes ({diaries.length})
                  </h2>
                  <div className="flex flex-col gap-16 pt-6 pb-12 max-h-[500px] overflow-y-auto px-6">
                    {diaries.length > 0 ? (
                      Array.from({ length: Math.ceil(diaries.length / 4) }, (_, i) => diaries.slice(i * 4, i * 4 + 4)).map((shelf, shelfIdx) => (
                        <div key={shelfIdx} className="relative w-full">
                          {/* Shelf books */}
                          <div className="grid grid-cols-4 justify-items-center px-2 relative z-10 w-full">
                            {shelf.map(d => (
                              <div key={d.id} className="relative group flex flex-col items-center">
                                {/* Book Spine */}
                                <div 
                                  className="relative w-12 h-32 rounded-r-md rounded-l-[1px] shadow-[3px_0_8px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between py-2.5 border-l-[2px] border-black/40 overflow-hidden cursor-pointer transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[4px_8px_15px_rgba(0,0,0,0.6)]"
                                  style={{ backgroundColor: d.coverColor || '#2b1e16' }}
                                >
                                  {/* Page Edge Illusion (right side) */}
                                  <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-white/20"></div>
                                  {/* Hinge indentation */}
                                  <div className="absolute top-0 bottom-0 left-1 w-[1px] bg-black/20"></div>

                                  {/* Icon */}
                                  <div className="text-white/40 drop-shadow-md z-0">
                                    {renderDiaryIcon(d.icon, 'w-4 h-4')}
                                  </div>
                                  
                                  {/* Spine Title */}
                                  <div className="flex-1 flex items-center justify-center overflow-hidden w-full z-0 pt-1">
                                    <span 
                                      className="font-cinzel text-[9px] font-bold text-white/90 uppercase tracking-widest truncate max-h-[65px] drop-shadow-md"
                                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                                    >
                                      {d.title}
                                    </span>
                                  </div>
                                  
                                  {d.isPinned && <Pin className="w-2.5 h-2.5 text-[#e5c158] fill-[#e5c158] absolute top-2 right-2 drop-shadow-md z-0" />}
                                  
                                  {/* Hover Actions Overlay */}
                                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity z-10 backdrop-blur-[1px]">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleEditDiary(d); }} 
                                      className="p-1.5 rounded-full bg-[#1c1814]/90 text-[#d4af37] hover:bg-[#2a1e15] border border-[#d4af37]/30 transition-transform hover:scale-110"
                                      title="Edit Volume"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onTogglePinDiary(d.id); }} 
                                      className="p-1.5 rounded-full bg-[#1c1814]/90 text-[#e5c158] hover:bg-[#2a1e15] border border-[#d4af37]/30 transition-transform hover:scale-110"
                                      title={d.isPinned ? "Unpin" : "Pin"}
                                    >
                                      <Pin className={`w-3.5 h-3.5 ${d.isPinned ? 'fill-[#e5c158]' : ''}`} />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); confirmDelete('diary', d.id, d.title); }} 
                                      className="p-1.5 rounded-full bg-[#1c1814]/90 text-rose-400 hover:bg-rose-950/80 border border-rose-900/50 transition-transform hover:scale-110"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                {/* Page Count (hanging below the shelf) */}
                                <span className="absolute -bottom-7 text-[9px] text-[#6a5a4a] font-mono">{d.entryCount} pgs</span>
                              </div>
                            ))}
                          </div>
                          {/* Solid Shelf Board */}
                          <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#2a1e15] rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-t border-[#3a2a1a] z-0"></div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-xs text-[#5a4a3a] italic font-serif-title">No volumes resting on the shelf yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── JOURNAL ENTRIES ─────────────────────────────────── */}
          {activePage === 'entries' && (
            <div className="p-5 max-w-5xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8]">
                    Published Entries ({entries.length})
                  </h2>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6a5a4a]" />
                    <input
                      type="text"
                      value={entriesQuery}
                      onChange={e => setEntriesQuery(e.target.value)}
                      placeholder="Search by title or tag..."
                      className="bg-[#110e0b] border border-[#2a1e15] rounded-lg pl-8 pr-3 py-2 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none w-60"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredEntries.map(e => (
                    <div key={e.id} className="p-3.5 rounded-xl bg-[#110e0b] border border-[#2a1e15] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={e.coverImage} alt={e.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-[#d4af37]">{e.entryNumber}</span>
                          <h3 className="font-cinzel text-xs font-bold text-[#f0e8d8] truncate">{e.title}</h3>
                          <p className="text-[10px] text-[#6a5a4a] truncate">{e.publishedDate} • {e.likes} Likes • {e.commentsCount} Notes</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleEditEntry(e)}
                          className="p-2 rounded-lg bg-[#2b1e16] text-[#d4af37] border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete('entry', e.id, e.title)}
                          className="p-2 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-800/30 hover:bg-rose-950/60 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredEntries.length === 0 && (
                    <p className="text-xs text-[#5a4a3a] italic font-serif-title text-center py-8">
                      {entries.length === 0 ? 'No entries published yet.' : 'No entries match your search.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}



          {/* ── DRAFTS ──────────────────────────────────────────── */}
          {(activePage === 'drafts') && (
            <div className="p-5 max-w-4xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#d4af37]" />
                  Drafts ({draftsList.length})
                </h2>
                {draftsList.map((draft) => (
                  <div key={draft.id} className="p-3.5 rounded-xl bg-[#110e0b] border border-[#2a1e15] flex items-center justify-between gap-4 mb-2.5">
                    <div>
                      <h3 className="font-cinzel text-xs font-bold text-[#f0e8d8]">{draft.title}</h3>
                      <p className="text-[10px] text-[#6a5a4a]">Last saved {draft.updated} • {draft.words} words</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => { setEntryTitle(draft.title); setActivePage('write'); }}
                        className="p-2 rounded-lg bg-[#2b1e16] text-[#d4af37] border border-[#d4af37]/20 transition-colors cursor-pointer hover:border-[#d4af37]/50"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => confirmDelete('draft', draft.id, draft.title)}
                        className="p-2 rounded-lg bg-rose-950/30 text-rose-400 transition-colors cursor-pointer hover:bg-rose-950/60"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {draftsList.length === 0 && (
                  <p className="text-xs text-[#5a4a3a] italic font-serif-title text-center py-8">
                    No drafts available.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── MEDIA VAULT ─────────────────────────────────────── */}
          {activePage === 'media' && (
            <div className="p-5 w-full">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#d4af37]" />
                  Media Vault
                </h2>
                <div
                  className="border-2 border-dashed border-[#3a2a1a] rounded-xl p-12 text-center hover:border-[#d4af37]/50 transition-colors cursor-pointer mb-5"
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={e => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const url = URL.createObjectURL(e.dataTransfer.files[0]);
                      setVaultImages(prev => [url, ...prev]);
                    }
                  }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        setVaultImages(prev => [url, ...prev]);
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-[#5a4a3a] mx-auto mb-3" />
                  <p className="text-xs text-[#6a5a4a]">Drag & drop files here or click to upload</p>
                  <p className="text-[10px] text-[#4a3a2a] mt-1">Images, PDFs, Videos supported</p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {vaultImages.map((imgUrl, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-[#2a1e15] relative group">
                      <img src={imgUrl} alt={`Vault Image ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          className="cursor-pointer"
                          onClick={() => confirmDelete('vault', imgUrl, 'this image')}
                        >
                          <Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-300" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



        </div>
      </div>

      {/* Media Vault Selection Modal */}
      {isVaultModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-[#2a1e15] flex items-center justify-between">
              <h3 className="font-cinzel text-lg font-bold text-[#f0e8d8] flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#d4af37]" />
                Select from Media Vault
              </h3>
              <button 
                onClick={() => setIsVaultModalOpen(false)}
                className="text-[#6a5a4a] hover:text-[#f0e8d8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {vaultImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEntryCoverImage(imgUrl);
                      setIsVaultModalOpen(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      entryCoverImage === imgUrl ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-transparent hover:border-[#3a2a1a]'
                    }`}
                  >
                    <img src={imgUrl} alt={`Vault Image ${idx + 1}`} className="w-full h-full object-cover" />
                    {entryCoverImage === imgUrl && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {vaultImages.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-sm text-[#6a5a4a]">Your vault is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d0d0d]/80 backdrop-blur-sm">
          <div className="bg-[#16120e] border border-[#3a2a1a] rounded-xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-950/30 text-rose-500 mb-4 mx-auto border border-rose-900/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-[#f0e8d8] text-center mb-2">Confirm Deletion</h3>
              <p className="text-sm text-[#9a8a7a] text-center">
                Are you sure you want to delete <span className="text-[#d4af37] font-semibold">"{deleteConfirmation.title}"</span>?<br/>
                This action cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#2a1e15] bg-[#110e0b]">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 px-4 py-3 text-sm font-semibold text-[#8a7a6a] hover:text-[#f0e8d8] hover:bg-[#1a1612] transition-colors cursor-pointer border-r border-[#2a1e15]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 px-4 py-3 text-sm font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
