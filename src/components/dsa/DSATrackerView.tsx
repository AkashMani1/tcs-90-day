'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Target, Filter, Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Problem, Difficulty, ProblemStatus, Platform } from '@/lib/types';

const APTITUDE_TOPIC_WEIGHT: Record<string, number> = {
  'Quant: Number System': 100,
  'Quant: Percentages': 95,
  'Quant: Time & Work': 90,
  'Quant: Time Speed Distance': 85,
  'Quant: Ratio & Proportion': 80,
  'Quant: Profit & Loss': 75,
  'Quant: Average': 70,
  'Quant: Mixture & Allegation': 65,
  'Quant: Algebra & Misc': 60,
  'Logical: Seating Arrangement': 55,
  'Logical: Series': 50,
  'Logical: Syllogism': 45,
  'Logical: Coding-Decoding': 40,
  'Logical: Direction Sense': 35,
  'Logical: Blood Relations': 30,
  'Logical: Odd One Out': 25,
  'Verbal: Reading Comprehension': 20,
  'Verbal: Sentence Correction': 15,
  'Verbal: Para Jumbles': 10,
  'Verbal: Fill in the Blanks': 5,
  'Verbal: Synonyms/Antonyms': 0,
};

const DSA_TOPIC_WEIGHT: Record<string, number> = {
  'Arrays': 100,
  'Strings': 90,
  'Recursion+Backtrack': 80,
  'Search & Sort': 70,
  'Linked List': 60,
  'Stack & Queue': 50,
  'Trees': 40,
  'Basic Hashing': 30,
};

const DIFF_COLORS: Record<Difficulty, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/25',
};
const STATUS_COLORS: Record<ProblemStatus, string> = {
  Done: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  Revisit: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  Todo: 'text-slate-400 bg-slate-700/30 border-slate-600/30',
};

// ── Add Problem Modal ─────────────────────────────────────────────────────────
function AddProblemModal({ onClose, activeCategory }: { onClose: () => void, activeCategory: 'Aptitude' | 'DSA' }) {
  const { addProblem } = useApp();
  const [form, setForm] = useState<Omit<Problem, 'id' | 'addedAt'>>({
    name: '', category: activeCategory, topic: activeCategory === 'DSA' ? 'Arrays' : 'Quant: Percentages', difficulty: 'Medium', platform: activeCategory === 'DSA' ? 'LeetCode' : 'Other', status: 'Todo', notes: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.topic.trim()) return;
    addProblem(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-slate-100 font-bold">Add to Kill List</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Question Name *</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Find Missing Number"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value as 'Aptitude' | 'DSA')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
                <option value="Aptitude">Aptitude</option>
                <option value="DSA">DSA</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Topic (Free Text)</label>
              <input value={form.topic} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Arrays, Number System"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Difficulty)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
             <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Platform</label>
              <select value={form.platform} onChange={(e) => set('platform', e.target.value as Platform)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
                {(['LeetCode', 'GFG', 'CodeVita', 'Other'] as Platform[]).map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value as ProblemStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
                {(['Todo', 'Done', 'Revisit'] as ProblemStatus[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Notes (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Key insight or approach..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors">Cancel</button>
          <button onClick={submit} disabled={!form.name.trim() || !form.topic.trim()} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">Add to List</button>
        </div>
      </div>
    </div>
  );
}

// ── The Kill List View ────────────────────────────────────────────────────────
export default function DSATrackerView() {
  const { state, updateProblem, deleteProblem } = useApp();
  const [activeTab, setActiveTab] = useState<'Aptitude' | 'DSA'>('Aptitude');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<'name' | 'difficulty' | 'status' | 'addedAt'>('addedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Extract total categories for dynamic drop-downs and counting
  const tabProblems = state.problems.filter(p => p.category === activeTab);
  const uniqueTopics = useMemo(() => Array.from(new Set(tabProblems.map(p => p.topic))).sort(), [tabProblems]);

  const problems = useMemo(() => {
    let list = tabProblems;
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase()));
    if (filterTopic !== 'All') list = list.filter((p) => p.topic === filterTopic);
    if (filterDiff !== 'All') list = list.filter((p) => p.difficulty === filterDiff);
    if (filterStatus !== 'All') list = list.filter((p) => p.status === filterStatus);
    const diffOrder = { Easy: 0, Medium: 1, Hard: 2 };
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'addedAt') {
        // Master Sort: Group sequentially by Topic Weight (High to Low)
        let wA = 0;
        let wB = 0;
        if (a.category === 'Aptitude') {
          wA = APTITUDE_TOPIC_WEIGHT[a.topic] ?? 0;
          wB = APTITUDE_TOPIC_WEIGHT[b.topic] ?? 0;
        } else {
          wA = DSA_TOPIC_WEIGHT[a.topic] ?? 0;
          wB = DSA_TOPIC_WEIGHT[b.topic] ?? 0;
        }
        
        if (wA !== wB) return wB - wA; // Highest topic weight chunks first
        
        // Secondary Sort: Inside the Topic chunk, float 🔥 Priority items to the absolute top
        const aPrio = a.isPriority ? 1 : 0;
        const bPrio = b.isPriority ? 1 : 0;
        if (aPrio !== bPrio) return bPrio - aPrio; 

        // Fallback to insertion/ID
        cmp = a.addedAt.localeCompare(b.addedAt);
      } else if (sortKey === 'difficulty') {
        cmp = diffOrder[a.difficulty] - diffOrder[b.difficulty];
      } else if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [tabProblems, search, filterTopic, filterDiff, filterStatus, sortKey, sortAsc]);

  const groupedProblems = useMemo(() => {
    const map = new Map<string, typeof problems>();
    problems.forEach(p => {
      if (!map.has(p.topic)) map.set(p.topic, []);
      map.get(p.topic)!.push(p);
    });
    return Array.from(map.entries());
  }, [problems]);

  const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button onClick={() => { if (sortKey === k) setSortAsc((p) => !p); else { setSortKey(k); setSortAsc(true); } }}
      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${sortKey === k ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
      {label}
      {sortKey === k ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}
    </button>
  );

  const stats = {
    done: tabProblems.filter((p) => p.status === 'Done').length,
    revisit: tabProblems.filter((p) => p.status === 'Revisit').length,
    todo: tabProblems.filter((p) => p.status === 'Todo').length,
    easy: tabProblems.filter((p) => p.difficulty === 'Easy' && p.status === 'Done').length,
    medium: tabProblems.filter((p) => p.difficulty === 'Medium' && p.status === 'Done').length,
    hard: tabProblems.filter((p) => p.difficulty === 'Hard' && p.status === 'Done').length,
  };

  const aptCount = state.problems.filter(p => p.category === 'Aptitude').length;
  const dsaCount = state.problems.filter(p => p.category === 'DSA').length;

  return (
    <div className="space-y-5">
      {showModal && <AddProblemModal onClose={() => setShowModal(false)} activeCategory={activeTab} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100">The Kill List</h1>
            <p className="text-slate-500 text-sm">Target {state.problems.length} problems for TCS Domination</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Problem
        </button>
      </div>

      {/* Segmented Master Tabs */}
      <div className="flex bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 w-full md:w-auto">
        <button
          onClick={() => { setActiveTab('Aptitude'); setFilterTopic('All'); }}
          className={`flex-1 md:w-48 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex justify-center items-center gap-2 ${activeTab === 'Aptitude' ? 'bg-slate-700 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          📊 Aptitude ({aptCount})
        </button>
        <button
          onClick={() => { setActiveTab('DSA'); setFilterTopic('All'); }}
          className={`flex-1 md:w-48 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex justify-center items-center gap-2 ${activeTab === 'DSA' ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          💻 DSA ({dsaCount})
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Done', val: stats.done, color: 'emerald' },
          { label: 'Revisit', val: stats.revisit, color: 'amber' },
          { label: 'Todo', val: stats.todo, color: 'slate' },
          { label: '✅ Easy', val: stats.easy, color: 'emerald' },
          { label: '🟡 Medium', val: stats.medium, color: 'amber' },
          { label: '🔴 Hard', val: stats.hard, color: 'red' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
            <p className={`text-2xl font-black text-${color}-400`}>{val}</p>
            <p className="text-slate-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab} Kill List...`}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-indigo-500 max-w-xs">
            <option value="All">All Topics</option>
            {uniqueTopics.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value as Difficulty | 'All')}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-indigo-500">
            <option value="All">All Difficulties</option>
            {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ProblemStatus | 'All')}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-indigo-500">
            <option value="All">All Status</option>
            {['Todo', 'Done', 'Revisit'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/60">
          <div className="col-span-4"><SortBtn k="name" label="Problem" /></div>
          <div className="col-span-2"><SortBtn k="difficulty" label="Difficulty" /></div>
          <div className="col-span-2 hidden sm:block"><Filter className="w-3 h-3 text-slate-600 inline mr-1" /><span className="text-slate-500 text-xs">Topic</span></div>
          <div className="col-span-2"><SortBtn k="status" label="Status" /></div>
          <div className="col-span-2 text-slate-500 text-xs text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto">
          {problems.length === 0 ? (
            <div className="py-12 text-center text-slate-600">No {activeTab} problems match your filters.</div>
          ) : (
            groupedProblems.map(([topic, groupProps]) => (
              <div key={topic} className="contents">
                {/* Topic Header Wrapper */}
                {sortKey === 'addedAt' && (
                  <div className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur border-y border-indigo-500/20 px-4 py-2 font-bold text-indigo-400 text-xs tracking-wider uppercase shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    {topic} <span className="text-slate-500 font-medium lowercase">({groupProps.length})</span>
                  </div>
                )}
                {/* Topic Rows */}
                {groupProps.map((p) => (
                  <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-slate-700/30 transition-colors items-start">
                    {/* Name + notes */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-200 text-sm font-medium">{p.name}</p>
                    {p.isPriority && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 whitespace-nowrap">
                        🔥 Must Do
                      </span>
                    )}
                  </div>
                  {editingNote === p.id ? (
                    <input
                      autoFocus
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      onBlur={() => { updateProblem(p.id, { notes: noteDraft }); setEditingNote(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { updateProblem(p.id, { notes: noteDraft }); setEditingNote(null); } }}
                      className="mt-1 w-full bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <p
                      className="text-slate-600 text-xs mt-0.5 cursor-pointer hover:text-slate-400 transition-colors"
                      onClick={() => { setEditingNote(p.id); setNoteDraft(p.notes); }}
                    >
                      {p.notes || <span className="italic">+ add note</span>}
                    </p>
                  )}
                </div>

                {/* Difficulty */}
                <div className="col-span-2 flex items-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFF_COLORS[p.difficulty]}`}>{p.difficulty}</span>
                </div>

                {/* Topic */}
                <div className="col-span-2 hidden sm:flex items-center pr-2">
                  <span className="text-slate-400 text-xs truncate" title={p.topic}>{p.topic}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <select
                    value={p.status}
                    onChange={(e) => updateProblem(p.id, { status: e.target.value as ProblemStatus })}
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border bg-transparent cursor-pointer focus:outline-none ${STATUS_COLORS[p.status]}`}
                  >
                    {(['Todo', 'Done', 'Revisit'] as ProblemStatus[]).map((s) => <option key={s} value={s} className="bg-slate-900 text-slate-100">{s}</option>)}
                  </select>
                </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-3 text-right">
                      {p.platform !== 'Other' && (
                        <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 whitespace-nowrap hidden lg:inline">
                          {p.platform}
                        </span>
                      )}
                      <button onClick={() => deleteProblem(p.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-slate-600 text-xs text-center font-medium">Tracking {problems.length} of {tabProblems.length} {activeTab} problems</p>
    </div>
  );
}
