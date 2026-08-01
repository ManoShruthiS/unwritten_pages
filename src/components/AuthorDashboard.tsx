import React, { useState } from 'react';
import { Diary, JournalEntry, Comment } from '../types';
import { renderDiaryIcon } from './LibraryShelves';
import { 
  BookOpen, Plus, Edit3, Trash2, BarChart2, Eye, Heart, 
  Users, Sparkles, Save, Check, FileText, Image, Tag, Clock, 
  Send, ShieldCheck, ArrowLeft, Terminal, MessageSquare
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
  onCreateDiary: (diaryData: Partial<Diary>) => void;
  onDeleteDiary: (diaryId: string) => void;
  onCreateEntry: (entryData: Partial<JournalEntry>) => void;
  onDeleteEntry: (entryId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onClose: () => void;
}

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({
  diaries,
  entries,
  comments,
  stats,
  onCreateDiary,
  onDeleteDiary,
  onCreateEntry,
  onDeleteEntry,
  onDeleteComment,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'diaries' | 'write' | 'entries' | 'comments'>('write');

  // New Diary Form State
  const [newDiaryTitle, setNewDiaryTitle] = useState('');
  const [newDiaryDesc, setNewDiaryDesc] = useState('');
  const [newDiaryColor, setNewDiaryColor] = useState('#2b1b17');
  const [newDiaryIcon, setNewDiaryIcon] = useState('Code');
  const [newDiaryPinned, setNewDiaryPinned] = useState(false);

  // New Entry Form State
  const [entryDiaryId, setEntryDiaryId] = useState(diaries[0]?.id || '');
  const [entryTitle, setEntryTitle] = useState('');
  const [entrySubtitle, setEntrySubtitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryCoverImage, setEntryCoverImage] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80');
  const [entryTags, setEntryTags] = useState('CodersHigh, Reflections');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  // Submit New Diary
  const handleCreateDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiaryTitle.trim()) return;
    onCreateDiary({
      title: newDiaryTitle.trim(),
      description: newDiaryDesc.trim(),
      coverColor: newDiaryColor,
      icon: newDiaryIcon,
      isPinned: newDiaryPinned
    });
    setNewDiaryTitle('');
    setNewDiaryDesc('');
    setActiveTab('diaries');
  };

  // Submit New Journal Entry
  const handleCreateEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) return;

    // Auto calculate reading time based on word count (~200 wpm)
    const words = entryContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    const parsedTags = entryTags.split(',').map(t => t.trim()).filter(Boolean);

    onCreateEntry({
      diaryId: entryDiaryId || diaries[0]?.id,
      title: entryTitle.trim(),
      subtitle: entrySubtitle.trim(),
      content: entryContent,
      coverImage: entryCoverImage,
      tags: parsedTags,
      readingTime: `${minutes} min read`,
      previewParagraph: entryContent.slice(0, 180) + '...'
    });

    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
      setEntryTitle('');
      setEntrySubtitle('');
      setEntryContent('');
      setActiveTab('entries');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#121013] text-[#f3efe6] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Admin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-[#2d211a] gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2b1e16] border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-2xl shadow-xl">
            🖋️
          </div>
          <div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3efe6]">
              Mahi's Writing Sanctuary
            </h1>
            <p className="font-serif-title italic text-xs sm:text-sm text-[#d4af37]">
              Sole Curator & Author Portal • "Every page is another step in the journey."
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="inline-flex items-center space-x-2 text-xs font-sans-body font-medium text-[#d4af37] hover:text-[#f3efe6] bg-[#1a1411] hover:bg-[#281d17] px-4 py-2 rounded-lg border border-[#3a2b21] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Reader Library</span>
        </button>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex flex-wrap bg-[#18120e] p-1.5 rounded-xl border border-[#3a2d24] mb-8 text-xs font-sans-body gap-1">
        <button
          onClick={() => setActiveTab('write')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'write' ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow-md' : 'text-[#a3978c] hover:text-[#f3efe6]'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Write Entry</span>
        </button>

        <button
          onClick={() => setActiveTab('entries')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'entries' ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow-md' : 'text-[#a3978c] hover:text-[#f3efe6]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Entries ({entries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diaries')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'diaries' ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow-md' : 'text-[#a3978c] hover:text-[#f3efe6]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manage Diaries ({diaries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'analytics' ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow-md' : 'text-[#a3978c] hover:text-[#f3efe6]'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'comments' ? 'bg-[#2b1e16] text-[#d4af37] font-bold shadow-md' : 'text-[#a3978c] hover:text-[#f3efe6]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comments ({comments.length})</span>
        </button>
      </div>

      {/* TAB 1: WRITE JOURNAL ENTRY */}
      {activeTab === 'write' && (
        <div className="bg-[#18120e] rounded-2xl p-6 sm:p-8 border border-[#3a2d24] shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2d211a]">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-[#f3efe6]">Compose New Journal Page</h2>
              <p className="text-xs text-[#a3978c]">Write with full markdown support, code blocks, quotes, and math formulas.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-3 py-1.5 bg-[#201813] border border-[#3a2d24] text-xs text-[#d4af37] rounded-lg font-mono hover:border-[#d4af37]"
              >
                {isPreviewMode ? 'Edit Mode' : 'Live Preview'}
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateEntrySubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#d4af37] mb-1">Select Journal Volume</label>
                <select
                  value={entryDiaryId}
                  onChange={(e) => setEntryDiaryId(e.target.value)}
                  className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2.5 text-xs text-[#f3efe6] focus:border-[#d4af37]"
                >
                  {diaries.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#d4af37] mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={entryTags}
                  onChange={(e) => setEntryTags(e.target.value)}
                  placeholder="CodersHigh, Reflect, AI"
                  className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2.5 text-xs text-[#f3efe6] focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#d4af37] mb-1">Entry Title</label>
              <input
                type="text"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                placeholder="e.g. Building My First Project"
                className="w-full bg-[#121013] border border-[#3a2d24] rounded-xl p-3 text-base font-cinzel font-bold text-[#f3efe6] focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#d4af37] mb-1">Subtitle / Epigraph</label>
              <input
                type="text"
                value={entrySubtitle}
                onChange={(e) => setEntrySubtitle(e.target.value)}
                placeholder="e.g. From empty folder to living software: lessons from the furnace of creation."
                className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2.5 text-xs font-serif-title italic text-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#d4af37] mb-1">Cover Image URL</label>
              <input
                type="text"
                value={entryCoverImage}
                onChange={(e) => setEntryCoverImage(e.target.value)}
                className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2.5 text-xs text-[#f3efe6] focus:border-[#d4af37]"
              />
            </div>

            {/* Markdown Editor / Preview Split */}
            <div>
              <label className="block text-xs font-mono text-[#d4af37] mb-1">
                Entry Content (Markdown, ```code, &gt; quotes, $$ math)
              </label>

              {isPreviewMode ? (
                <div className="bg-[#121013] border border-[#3a2d24] rounded-xl p-6 min-h-[300px] text-sm text-[#c5b8ab] leading-relaxed">
                  <h1 className="font-cinzel text-2xl font-bold text-[#f3efe6] mb-2">{entryTitle || 'Untitled'}</h1>
                  <p className="font-serif-title italic text-[#d4af37] mb-4">{entrySubtitle}</p>
                  <pre className="whitespace-pre-wrap font-sans-body">{entryContent}</pre>
                </div>
              ) : (
                <textarea
                  rows={14}
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  placeholder="Write your reflection page here... Use # for headings, ``` for code blocks, > for quotes."
                  className="w-full bg-[#121013] border border-[#3a2d24] rounded-xl p-4 text-xs sm:text-sm text-[#f3efe6] font-mono leading-relaxed focus:border-[#d4af37]"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#2d211a]">
              <span className="text-xs text-[#a3978c] font-mono">
                Words: {entryContent.trim().split(/\s+/).filter(Boolean).length}
              </span>

              <button
                type="submit"
                disabled={!entryTitle.trim() || !entryContent.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2b1e16] to-[#3a291e] border border-[#d4af37] text-[#f3efe6] font-cinzel font-bold text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {saveStatus === 'saved' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Page Bound to Journal!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#d4af37]" />
                    <span>Publish Page to Library</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: MANAGE ENTRIES */}
      {activeTab === 'entries' && (
        <div className="bg-[#18120e] rounded-2xl p-6 sm:p-8 border border-[#3a2d24] shadow-2xl">
          <h2 className="font-cinzel text-xl font-bold text-[#f3efe6] mb-6">Published Journal Entries ({entries.length})</h2>

          <div className="space-y-4">
            {entries.map(e => (
              <div key={e.id} className="p-4 rounded-xl bg-[#121013] border border-[#30231b] flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img src={e.coverImage} alt={e.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <span className="text-[10px] font-mono text-[#d4af37]">{e.entryNumber}</span>
                    <h3 className="font-cinzel text-sm font-bold text-[#f3efe6]">{e.title}</h3>
                    <p className="text-xs text-[#a3978c]">{e.publishedDate} • {e.likes} Likes</p>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteEntry(e.id)}
                  className="p-2 rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/60 transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE DIARIES */}
      {activeTab === 'diaries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create Diary Form */}
          <div className="bg-[#18120e] rounded-2xl p-6 border border-[#3a2d24] shadow-2xl">
            <h2 className="font-cinzel text-lg font-bold text-[#f3efe6] mb-4">Create New Diary Volume</h2>
            
            <form onSubmit={handleCreateDiarySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#d4af37] mb-1">Diary Title</label>
                <input
                  type="text"
                  value={newDiaryTitle}
                  onChange={(e) => setNewDiaryTitle(e.target.value)}
                  placeholder="e.g. System Design Journal"
                  className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2.5 text-xs text-[#f3efe6] focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#d4af37] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDiaryDesc}
                  onChange={(e) => setNewDiaryDesc(e.target.value)}
                  placeholder="Brief summary of what this volume covers..."
                  className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2.5 text-xs text-[#f3efe6] focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#d4af37] mb-1">Cover Leather Color</label>
                  <select
                    value={newDiaryColor}
                    onChange={(e) => setNewDiaryColor(e.target.value)}
                    className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2 text-xs text-[#f3efe6]"
                  >
                    <option value="#2b1b17">Mahogany Leather</option>
                    <option value="#1c2e3b">Sapphire Leather</option>
                    <option value="#1c3b28">Emerald Leather</option>
                    <option value="#3b201c">Chestnut Leather</option>
                    <option value="#2d1c3b">Amethyst Leather</option>
                    <option value="#1f1f2e">Onyx Leather</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#d4af37] mb-1">Icon Symbol</label>
                  <select
                    value={newDiaryIcon}
                    onChange={(e) => setNewDiaryIcon(e.target.value)}
                    className="w-full bg-[#121013] border border-[#3a2d24] rounded-lg p-2 text-xs text-[#f3efe6]"
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
                className="w-full py-2.5 bg-[#2b1e16] border border-[#d4af37] text-[#e5c158] rounded-xl font-cinzel font-bold text-xs hover:bg-[#38281d] transition-all cursor-pointer"
              >
                Bind New Volume
              </button>
            </form>
          </div>

          {/* List Existing Diaries */}
          <div className="bg-[#18120e] rounded-2xl p-6 border border-[#3a2d24] shadow-2xl">
            <h2 className="font-cinzel text-lg font-bold text-[#f3efe6] mb-4">Existing Volumes ({diaries.length})</h2>

            <div className="space-y-3">
              {diaries.map(d => (
                <div key={d.id} className="p-3.5 rounded-xl bg-[#121013] border border-[#30231b] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg text-[#d4af37]" style={{ backgroundColor: d.coverColor }}>
                      {renderDiaryIcon(d.icon, "w-4 h-4")}
                    </div>
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-[#f3efe6]">{d.title}</h4>
                      <span className="text-[11px] text-[#a3978c]">{d.entryCount} Pages</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDiary(d.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#18120e] border border-[#3a2d24]">
            <Eye className="w-6 h-6 text-[#d4af37] mb-2" />
            <span className="block font-cinzel text-3xl font-bold text-[#f3efe6]">{stats.totalViews}</span>
            <span className="text-xs text-[#a3978c]">Total Library Readers</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#18120e] border border-[#3a2d24]">
            <Heart className="w-6 h-6 text-rose-400 mb-2" />
            <span className="block font-cinzel text-3xl font-bold text-[#f3efe6]">{stats.totalLikes}</span>
            <span className="text-xs text-[#a3978c]">Applauds & Likes</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#18120e] border border-[#3a2d24]">
            <Users className="w-6 h-6 text-emerald-400 mb-2" />
            <span className="block font-cinzel text-3xl font-bold text-[#f3efe6]">{stats.followersCount}</span>
            <span className="text-xs text-[#a3978c]">Followers of Mahi 🦢</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#18120e] border border-[#3a2d24]">
            <Sparkles className="w-6 h-6 text-sky-400 mb-2" />
            <span className="block font-cinzel text-3xl font-bold text-[#f3efe6]">{stats.subscribersCount}</span>
            <span className="text-xs text-[#a3978c]">Quill Newsletter Subscribers</span>
          </div>

        </div>
      )}

      {/* TAB 5: COMMENTS MODERATION */}
      {activeTab === 'comments' && (
        <div className="bg-[#18120e] rounded-2xl p-6 border border-[#3a2d24]">
          <h2 className="font-cinzel text-lg font-bold text-[#f3efe6] mb-4">Reader Notes Moderation ({comments.length})</h2>

          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-[#121013] border border-[#30231b] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-serif-title font-bold text-[#f3efe6]">
                    <span>{c.authorName}</span>
                    <span className="text-[#a3978c] text-[10px] font-mono">• {c.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#c5b8ab] mt-1">{c.content}</p>
                </div>

                <button
                  onClick={() => onDeleteComment(c.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
