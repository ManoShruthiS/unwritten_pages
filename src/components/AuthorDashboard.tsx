import React, { useState, useRef, useEffect } from 'react';
import { Diary, JournalEntry, Comment } from '../types';
import { renderDiaryIcon } from './LibraryShelves';
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

interface AuthorDashboardProps {
  diaries: Diary[];
  entries: JournalEntry[];
  comments: Comment[];
  stats: {
    diariesCount: number;
    entriesCount: number;
    totalLikes: number;
    totalViews: number;
    followersCount: number;
    subscribersCount: number;
  };
  authorName: string;
  onCreateDiary: (diaryData: Partial<Diary>) => void;
  onDeleteDiary: (diaryId: string) => void;
  onCreateEntry: (entryData: Partial<JournalEntry>) => void;
  onUpdateEntry: (entryId: string, entryData: Partial<JournalEntry>) => void;
  onTogglePinDiary: (diaryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onClose: () => void;
  onSignOut: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

type ActivePage =
  | 'dashboard'
  | 'library'
  | 'entries'
  | 'drafts'
  | 'media'
  | 'comments'
  | 'readers'
  | 'newsletter'
  | 'analytics'
  | 'statistics'
  | 'settings'
  | 'appearance'
  | 'integrations'
  | 'write';

// Tiny sparkline bar chart component
const SparkBar: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#d4af37' }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px] h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-80"
          style={{
            height: `${Math.max(8, (v / max) * 40)}px`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5
          }}
        />
      ))}
    </div>
  );
};

// Mini line chart
const MiniLineChart: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#d4af37' }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16 overflow-visible">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Fill area */}
      <polygon
        points={`0,${h} ${pts.join(' ')} ${w},${h}`}
        fill="url(#lineGrad)"
      />
      {/* Dots */}
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
};

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({
  diaries,
  entries,
  comments,
  stats,
  authorName,
  onCreateDiary,
  onDeleteDiary,
  onCreateEntry,
  onUpdateEntry,
  onTogglePinDiary,
  onDeleteEntry,
  onDeleteComment,
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
  const [newDiaryColor, setNewDiaryColor] = useState('#2b1b17');
  const [newDiaryIcon, setNewDiaryIcon] = useState('Code');

  // Derived
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Late night musings';
  const topEntries = [...entries].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const maxLikes = Math.max(1, ...topEntries.map(e => e.likes));
  const recentComments = [...comments].slice(-5).reverse();
  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(entriesQuery.toLowerCase()) ||
    e.tags?.some(t => t.toLowerCase().includes(entriesQuery.toLowerCase()))
  );

  // Fake weekly data for chart
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const viewsData = [42, 65, 38, 78, 55, 90, 67];
  const visitorsData = [30, 50, 25, 60, 40, 72, 50];
  const writingStreak = 12;

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
    onCreateDiary({
      title: newDiaryTitle.trim(),
      description: newDiaryDesc.trim(),
      coverColor: newDiaryColor,
      icon: newDiaryIcon,
    });
    setNewDiaryTitle('');
    setNewDiaryDesc('');
    setActivePage('library');
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
                {/* Create Diary */}
                <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                  <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">Create New Diary Volume</h2>
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
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Cover Color</label>
                        <select
                          value={newDiaryColor}
                          onChange={e => setNewDiaryColor(e.target.value)}
                          className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-[10px] text-[#e8e0d5]"
                        >
                          <option value="#2b1b17">Mahogany</option>
                          <option value="#1c2e3b">Sapphire</option>
                          <option value="#1c3b28">Emerald</option>
                          <option value="#3b201c">Chestnut</option>
                          <option value="#2d1c3b">Amethyst</option>
                          <option value="#1f1f2e">Onyx</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#d4af37] mb-1">Icon</label>
                        <select
                          value={newDiaryIcon}
                          onChange={e => setNewDiaryIcon(e.target.value)}
                          className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2 text-[10px] text-[#e8e0d5]"
                        >
                          <option value="Code">Code</option>
                          <option value="Sparkles">Sparkles</option>
                          <option value="Terminal">Terminal</option>
                          <option value="Coffee">Coffee</option>
                          <option value="Cpu">Cpu</option>
                          <option value="Feather">Feather</option>
                          <option value="Compass">Compass</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!newDiaryTitle.trim()}
                      className="w-full py-2.5 bg-[#2b1e16] border border-[#d4af37] text-[#e5c158] rounded-xl font-cinzel font-bold text-xs hover:bg-[#38281d] transition-all cursor-pointer disabled:opacity-50"
                    >
                      Bind New Volume
                    </button>
                  </form>
                </div>

                {/* Existing Diaries */}
                <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                  <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">
                    Existing Volumes ({diaries.length})
                  </h2>
                  <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                    {diaries.map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-[#110e0b] border border-[#2a1e15] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-10 rounded flex items-center justify-center text-[#d4af37] flex-shrink-0"
                            style={{ backgroundColor: d.coverColor }}
                          >
                            {renderDiaryIcon(d.icon, 'w-4 h-4')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-cinzel text-xs font-bold text-[#f0e8d8] truncate flex items-center gap-1">
                              {d.title}
                              {d.isPinned && <Pin className="w-2.5 h-2.5 text-[#e5c158] fill-[#e5c158] flex-shrink-0" />}
                            </h4>
                            <span className="text-[9px] text-[#6a5a4a]">{d.entryCount} pages</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => onTogglePinDiary(d.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${d.isPinned ? 'text-[#e5c158]' : 'text-[#5a4a3a] hover:text-[#e5c158]'}`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${d.isPinned ? 'fill-[#e5c158]' : ''}`} />
                          </button>
                          <button
                            onClick={() => onDeleteDiary(d.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {diaries.length === 0 && (
                      <p className="text-xs text-[#5a4a3a] italic font-serif-title text-center py-6">No volumes yet.</p>
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
                          onClick={() => onDeleteEntry(e.id)}
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

          {/* ── COMMENTS ─────────────────────────────────────────── */}
          {activePage === 'comments' && (
            <div className="p-5 max-w-4xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">
                  Comments Moderation ({comments.length})
                </h2>
                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c.id} className="p-4 rounded-xl bg-[#110e0b] border border-[#2a1e15] flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2b1e16] border border-[#3a2a1a] flex items-center justify-center text-xs font-bold text-[#d4af37] flex-shrink-0">
                          {c.authorName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[#f0e8d8]">
                            <span>{c.authorName}</span>
                            <span className="text-[9px] font-mono text-[#6a5a4a]">• {c.createdAt}</span>
                          </div>
                          <p className="text-xs text-[#9a8a7a] mt-1 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteComment(c.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-xs text-[#5a4a3a] italic font-serif-title text-center py-8">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ───────────────────────────────────────── */}
          {activePage === 'analytics' && (
            <div className="p-5 max-w-5xl space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#38bdf8' },
                  { label: 'Total Likes', value: stats.totalLikes.toLocaleString(), icon: Heart, color: '#f87171' },
                  { label: 'Followers', value: stats.followersCount.toLocaleString(), icon: Users, color: '#34d399' },
                  { label: 'Subscribers', value: stats.subscribersCount.toLocaleString(), icon: Mail, color: '#a78bfa' },
                ].map(item => (
                  <div key={item.label} className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                    <item.icon className="w-5 h-5 mb-2" style={{ color: item.color }} />
                    <span className="block font-cinzel text-2xl font-bold text-[#f0e8d8]">{item.value}</span>
                    <span className="text-[10px] text-[#6a5a4a]">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                  <h3 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Reader Applause by Entry
                  </h3>
                  <div className="space-y-3">
                    {topEntries.map((e, idx) => (
                      <div key={e.id}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#d4c5a8] truncate mr-3 flex items-center gap-1">
                            <span className="text-[#d4af37] font-mono">{idx + 1}.</span>
                            {e.title}
                          </span>
                          <span className="font-mono text-[#6a5a4a] flex-shrink-0">{e.likes} ♥</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#2a1e15] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6b2a1c] to-[#d4af37]"
                            style={{ width: `${Math.max(6, (e.likes / maxLikes) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                  <h3 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#d4af37]" />
                    Weekly Engagement
                  </h3>
                  <MiniLineChart data={viewsData} color="#d4af37" />
                  <div className="flex justify-between mt-2">
                    {weekDays.map(d => (
                      <span key={d} className="text-[9px] text-[#5a4a3a]">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── READERS ─────────────────────────────────────────── */}
          {activePage === 'readers' && (
            <div className="p-5 max-w-4xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#d4af37]" />
                  Readers
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Total Readers', value: stats.totalViews, color: '#d4af37' },
                    { label: 'Followers', value: stats.followersCount, color: '#34d399' },
                    { label: 'Subscribers', value: stats.subscribersCount, color: '#a78bfa' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#110e0b] border border-[#2a1e15] rounded-xl p-4 text-center">
                      <div className="font-cinzel text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[10px] text-[#6a5a4a] mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#5a4a3a] italic font-serif-title text-center py-6">
                  Detailed reader profiles and management coming soon.
                </p>
              </div>
            </div>
          )}

          {/* ── NEWSLETTER ──────────────────────────────────────── */}
          {activePage === 'newsletter' && (
            <div className="p-5 max-w-4xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  Newsletter Management
                </h2>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Total Subscribers', value: stats.subscribersCount > 0 ? stats.subscribersCount * 20 : 380 },
                    { label: 'New This Week', value: 12 },
                    { label: 'Open Rate', value: '68%' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#110e0b] border border-[#2a1e15] rounded-xl p-4 text-center">
                      <div className="font-cinzel text-2xl font-bold text-[#d4af37]">{s.value}</div>
                      <div className="text-[10px] text-[#6a5a4a] mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#5a4a3a] italic font-serif-title text-center py-6">
                  Full newsletter composer and subscriber management coming soon.
                </p>
              </div>
            </div>
          )}

          {/* ── STATISTICS ──────────────────────────────────────── */}
          {activePage === 'statistics' && (
            <div className="p-5 max-w-5xl space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Diaries', value: stats.diariesCount, sparkData: [2, 3, 4, 4, 5, 5, stats.diariesCount] },
                  { label: 'Entries', value: stats.entriesCount, sparkData: [10, 15, 20, 22, 25, 28, stats.entriesCount] },
                  { label: 'Total Likes', value: stats.totalLikes, sparkData: [20, 35, 45, 60, 75, 90, stats.totalLikes] },
                  { label: 'Comments', value: comments.length, sparkData: [1, 2, 4, 6, 8, 10, comments.length] },
                ].map(s => (
                  <div key={s.label} className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-4">
                    <div className="font-cinzel text-2xl font-bold text-[#f0e8d8] mb-1">{s.value}</div>
                    <div className="text-[10px] text-[#6a5a4a] mb-3">{s.label}</div>
                    <SparkBar data={s.sparkData} />
                  </div>
                ))}
              </div>
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h3 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">Growth Over Time</h3>
                <MiniLineChart data={[10, 18, 24, 30, 45, 62, 80]} color="#d4af37" />
                <div className="flex justify-between mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => (
                    <span key={m} className="text-[9px] text-[#5a4a3a]">{m}</span>
                  ))}
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
                        onClick={() => setDraftsList(prev => prev.filter(d => d.id !== draft.id))}
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
                          onClick={() => setVaultImages(prev => prev.filter(i => i !== imgUrl))}
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

          {/* ── SETTINGS ────────────────────────────────────────── */}
          {activePage === 'settings' && (
            <div className="p-5 max-w-2xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5 space-y-4">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8]">Settings</h2>
                {[
                  { label: 'Display Name', value: authorName, type: 'text' },
                  { label: 'Email', value: 'mahi@unwritten.pages', type: 'email' },
                  { label: 'Bio', value: 'Writing my journey, one page at a time.', type: 'textarea' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-[10px] font-mono text-[#d4af37] mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        defaultValue={field.value}
                        rows={3}
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2.5 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full bg-[#110e0b] border border-[#2a1e15] rounded-lg p-2.5 text-xs text-[#e8e0d5] focus:border-[#d4af37] outline-none"
                      />
                    )}
                  </div>
                ))}
                <button className="px-5 py-2.5 bg-[#2b1e16] border border-[#d4af37] text-[#d4af37] rounded-xl font-cinzel text-xs font-bold hover:bg-[#38281d] cursor-pointer transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ── APPEARANCE ──────────────────────────────────────── */}
          {activePage === 'appearance' && (
            <div className="p-5 max-w-2xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5 space-y-4">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8]">Appearance</h2>
                <p className="text-xs text-[#6a5a4a] italic font-serif-title">
                  Customize how your library looks to readers. Theme settings, font choices, and layout preferences.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {['Dark Parchment', 'Midnight Ink', 'Sepia Warm'].map(theme => (
                    <div key={theme} className="p-3 bg-[#110e0b] border border-[#2a1e15] rounded-xl text-center cursor-pointer hover:border-[#d4af37]/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#2b1e16] mx-auto mb-2 border border-[#d4af37]/30" />
                      <p className="text-[10px] text-[#8a7a6a]">{theme}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── INTEGRATIONS ────────────────────────────────────── */}
          {activePage === 'integrations' && (
            <div className="p-5 max-w-3xl">
              <div className="bg-[#16120e] border border-[#2a1e15] rounded-xl p-5">
                <h2 className="font-cinzel text-sm font-bold text-[#f0e8d8] mb-4">Integrations</h2>
                <div className="space-y-3">
                  {[
                    { name: 'Google Analytics', desc: 'Track visitors and page views', icon: BarChart2, connected: false },
                    { name: 'RSS Feed', desc: 'Syndicate your entries', icon: Rss, connected: true },
                    { name: 'Social Media', desc: 'Auto-share new entries', icon: AtSign, connected: false },
                    { name: 'Mail Service', desc: 'Connect your email provider', icon: Mail, connected: false },
                  ].map(s => (
                    <div key={s.name} className="p-4 bg-[#110e0b] border border-[#2a1e15] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2b1e16] border border-[#3a2a1a] flex items-center justify-center">
                          <s.icon className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#d4c5a8]">{s.name}</p>
                          <p className="text-[10px] text-[#6a5a4a]">{s.desc}</p>
                        </div>
                      </div>
                      <button className={`px-3 py-1.5 text-[10px] rounded-lg border cursor-pointer transition-all ${
                        s.connected
                          ? 'border-emerald-800 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50'
                          : 'border-[#3a2a1a] text-[#8a7a6a] hover:border-[#d4af37] hover:text-[#d4af37]'
                      }`}>
                        {s.connected ? 'Connected' : 'Connect'}
                      </button>
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
    </div>
  );
};
