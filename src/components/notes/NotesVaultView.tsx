'use client';

import { useState } from 'react';
import { Plus, Trash2, Library, X, Edit3, ChevronDown, ChevronRight, Save } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StarStory, KnowledgeCategory } from '@/lib/types';

// ── STAR Story Form ────────────────────────────────────────────────────────────
function StarForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<StarStory>;
  onSave: (s: Omit<StarStory, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    tag: initial?.tag ?? 'Leadership',
    situation: initial?.situation ?? '',
    task: initial?.task ?? '',
    action: initial?.action ?? '',
    result: initial?.result ?? '',
  });
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.situation && form.task && form.action && form.result;

  const TAGS = ['Leadership', 'Problem Solving', 'Teamwork', 'Innovation', 'Conflict Resolution', 'Failure & Learning', 'Initiative'];

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5 space-y-4">
      <div>
        <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Tag</label>
        <select value={form.tag} onChange={(e) => set('tag', e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 w-auto">
          {TAGS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      {[
        { k: 'situation' as const, label: '🔵 Situation', placeholder: 'What was the context/background?' },
        { k: 'task' as const, label: '🟡 Task', placeholder: 'What was your responsibility?' },
        { k: 'action' as const, label: '🟠 Action', placeholder: 'What specific steps did YOU take?' },
        { k: 'result' as const, label: '🟢 Result', placeholder: 'What was the outcome? Include metrics if possible.' },
      ].map(({ k, label, placeholder }) => (
        <div key={k}>
          <label className="text-slate-400 text-xs font-semibold mb-1.5 block">{label}</label>
          <textarea
            value={form[k]}
            onChange={(e) => set(k, e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none transition-colors"
          />
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors">Cancel</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid}
          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Save Story
        </button>
      </div>
    </div>
  );
}

// ── Knowledge Base ─────────────────────────────────────────────────────────────
export default function NotesVaultView() {
  const { state, addStar, updateStar, deleteStar, updateKnowledgeItem, addKnowledgeItem, deleteKnowledgeItem } = useApp();
  const [tab, setTab] = useState<'star' | 'hr' | 'core' | 'aptitude'>('star');
  
  // STAR specific state
  const [showStarForm, setShowStarForm] = useState(false);
  const [editStarId, setEditStarId] = useState<string | null>(null);
  const [expandedStar, setExpandedStar] = useState<string | null>(null);
  
  // Knowledge Base specific state
  const [editKbId, setEditKbId] = useState<string | null>(null);
  const [kbDraft, setKbDraft] = useState('');
  const [newKbQ, setNewKbQ] = useState('');
  const [addingKb, setAddingKb] = useState(false);

  // Tab configurations
  const TABS = [
    { id: 'star' as const, label: '⭐ STAR Stories', filter: null },
    { id: 'core' as const, label: '💻 Core CS (OS/DBMS)', filter: 'Core CS' as KnowledgeCategory },
    { id: 'aptitude' as const, label: '📊 Aptitude Tricks', filter: 'Aptitude' as KnowledgeCategory },
    { id: 'hr' as const, label: '🎙️ HR Q&A', filter: 'HR' as KnowledgeCategory },
  ];

  const currentTabConfig = TABS.find((t) => t.id === tab);
  const filteredKnowledge = currentTabConfig?.filter
    ? (state.knowledgeBase || []).filter((k) => k.category === currentTabConfig.filter)
    : [];

  const TAG_COLORS: Record<string, string> = {
    Leadership: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
    'Problem Solving': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    Teamwork: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    Innovation: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    'Conflict Resolution': 'bg-red-500/15 text-red-400 border-red-500/25',
    'Failure & Learning': 'bg-orange-500/15 text-orange-400 border-orange-500/25',
    Initiative: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
    default: 'bg-slate-700/50 text-slate-400 border-slate-600/50',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <Library className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-100">Knowledge Base</h1>
          <p className="text-slate-500 text-sm">
            {state.stars.length} STAR stories · {(state.knowledgeBase || []).length} Flashcards
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 gap-1">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => { setTab(id); setAddingKb(false); setEditKbId(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === id ? 'bg-slate-700 text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* STAR Stories Tab */}
      {tab === 'star' && (
        <div className="space-y-4">
          {!showStarForm && (
            <button onClick={() => { setShowStarForm(true); setEditStarId(null); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 w-fit">
              <Plus className="w-4 h-4" /> Add STAR Story
            </button>
          )}

          {showStarForm && editStarId === null && (
            <StarForm
              onSave={(s) => { addStar(s); setShowStarForm(false); }}
              onCancel={() => setShowStarForm(false)}
            />
          )}

          {state.stars.map((story) => {
            const tagColor = TAG_COLORS[story.tag] ?? TAG_COLORS.default;
            const isOpen = expandedStar === story.id;
            return (
              <div key={story.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
                {editStarId === story.id ? (
                  <div className="p-4">
                    <StarForm
                      initial={story}
                      onSave={(s) => { updateStar(story.id, s); setEditStarId(null); }}
                      onCancel={() => setEditStarId(null)}
                    />
                  </div>
                ) : (
                  <>
                    <button onClick={() => setExpandedStar(isOpen ? null : story.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-800/60 transition-colors">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex-shrink-0 ${tagColor}`}>{story.tag}</span>
                      <p className="text-slate-300 text-sm flex-1 line-clamp-1">{story.situation}</p>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-slate-700/40 pt-4 space-y-3">
                        {[
                          { label: '🔵 Situation', val: story.situation },
                          { label: '🟡 Task', val: story.task },
                          { label: '🟠 Action', val: story.action },
                          { label: '🟢 Result', val: story.result },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <p className="text-slate-500 text-xs font-semibold mb-1">{label}</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{val}</p>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setEditStarId(story.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors">
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => deleteStar(story.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Knowledge Base Tabs (Core CS, Aptitude, HR) */}
      {tab !== 'star' && currentTabConfig && (
        <div className="space-y-4">
          {addingKb ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-3">
              <input
                autoFocus
                value={newKbQ}
                onChange={(e) => setNewKbQ(e.target.value)}
                placeholder="Enter question or topic..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button onClick={() => { if (newKbQ.trim() && currentTabConfig.filter) { addKnowledgeItem(newKbQ.trim(), currentTabConfig.filter); setNewKbQ(''); setAddingKb(false); } }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors">Add</button>
                <button onClick={() => { setAddingKb(false); setNewKbQ(''); }}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-sm transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingKb(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 w-fit">
              <Plus className="w-4 h-4" /> Add Idea / Question
            </button>
          )}

          {filteredKnowledge.map((qa) => (
            <div key={qa.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-500/20">
                  <span className="text-purple-400 text-xs font-bold">Q</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-200 text-sm font-semibold leading-relaxed">{qa.question}</p>
                </div>
                <button onClick={() => deleteKnowledgeItem(qa.id)} className="text-slate-700 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {editKbId === qa.id ? (
                <div className="space-y-2">
                  <textarea
                    autoFocus
                    value={kbDraft}
                    onChange={(e) => setKbDraft(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none font-mono text-[13px] leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { updateKnowledgeItem(qa.id, kbDraft); setEditKbId(null); }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors">Save</button>
                    <button onClick={() => setEditKbId(null)} className="px-3 py-1.5 border border-slate-700 text-slate-400 rounded-lg text-xs transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/40">
                    {qa.answer ? (
                      <p className="text-slate-300 text-[13px] leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
                    ) : (
                      <p className="text-slate-600 text-sm italic">No answer or notes yet. Click edit to add focus points.</p>
                    )}
                  </div>
                  <button onClick={() => { setEditKbId(qa.id); setKbDraft(qa.answer); }}
                    className="mt-2.5 flex items-center gap-1.5 text-slate-500 hover:text-indigo-400 text-xs font-medium transition-colors">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Answer
                  </button>
                </>
              )}
            </div>
          ))}
          {filteredKnowledge.length === 0 && !addingKb && (
             <p className="text-slate-500 text-sm py-4">No content in this category yet. Add a new topic to test your knowledge.</p>
          )}
        </div>
      )}
    </div>
  );
}
