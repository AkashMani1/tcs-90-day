'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Target, Filter, Search, ChevronUp, ChevronDown, X, ShieldCheck, Zap, Activity, BookOpen, Star, AlertTriangle, FileText, LayoutGrid } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Problem, Difficulty, ProblemStatus, Platform } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

const APTITUDE_TOPIC_WEIGHT: Record<string, number> = {
  'Quant: Number System': 100, 'Quant: Percentages': 95, 'Quant: Time & Work': 90, 'Quant: Time Speed Distance': 85, 'Quant: Ratio & Proportion': 80, 'Quant: Profit & Loss': 75, 'Quant: Average': 70, 'Quant: Mixture & Allegation': 65, 'Quant: Algebra & Misc': 60, 'Logical: Seating Arrangement': 55, 'Logical: Series': 50, 'Logical: Syllogism': 45, 'Logical: Coding-Decoding': 40, 'Logical: Direction Sense': 35, 'Logical: Blood Relations': 30, 'Logical: Odd One Out': 25, 'Verbal: Reading Comprehension': 20, 'Verbal: Sentence Correction': 15, 'Verbal: Para Jumbles': 10, 'Verbal: Fill in the Blanks': 5, 'Verbal: Synonyms/Antonyms': 0,
};

const DSA_TOPIC_WEIGHT: Record<string, number> = {
  'Arrays': 100, 'Strings': 90, 'Recursion+Backtrack': 80, 'Search & Sort': 70, 'Linked List': 60, 'Stack & Queue': 50, 'Trees': 40, 'Basic Hashing': 30,
};

const DIFF_COLORS: Record<Difficulty, string> = {
  Easy: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20',
  Medium: 'text-neon-indigo bg-neon-indigo/10 border-neon-indigo/20',
  Hard: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
};

const STATUS_COLORS: Record<ProblemStatus, string> = {
  Done: 'text-neon-cyan-tint bg-neon-cyan/20 border-neon-cyan/30',
  Revisit: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Todo: 'text-slate-500 bg-obsidian-surface-highest/10 border-slate-700/50',
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
    <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-obsidian-surface border border-obsidian-surface-highest/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-obsidian-surface-highest/10 bg-obsidian-surface-high/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-neon-indigo/20 rounded-xl flex items-center justify-center border border-neon-indigo/30">
                <Target className="w-5 h-5 text-neon-indigo-tint" />
             </div>
             <h2 className="text-white font-black uppercase tracking-widest text-sm">Add New Target</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-obsidian-surface-highest/20 rounded-full transition-all">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Target Identity</label>
            <input
              autoFocus value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="Question name or ID..."
              className="w-full bg-obsidian-surface-high/20 border border-obsidian-surface-highest/20 rounded-2xl px-5 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-neon-indigo transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Difficulty Tier</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Difficulty)}
                className="w-full bg-obsidian-surface-high/20 border border-obsidian-surface-highest/20 rounded-2xl px-5 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-neon-indigo transition-all appearance-none cursor-pointer">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => <option key={d} className="bg-obsidian-surface text-white">{d}</option>)}
              </select>
            </div>
            <div className="col-span-1">
               <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Combat Platform</label>
               <select value={form.platform} onChange={(e) => set('platform', e.target.value as Platform)}
                 className="w-full bg-obsidian-surface-high/20 border border-obsidian-surface-highest/20 rounded-2xl px-5 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-neon-indigo transition-all appearance-none cursor-pointer">
                 {(['LeetCode', 'GFG', 'CodeVita', 'Other'] as Platform[]).map((p) => <option key={p} className="bg-obsidian-surface text-white">{p}</option>)}
               </select>
            </div>
          </div>

          <div>
             <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Strategic Topic</label>
             <input value={form.topic} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Arrays, Graph, P&L..."
               className="w-full bg-obsidian-surface-high/20 border border-obsidian-surface-highest/20 rounded-2xl px-5 py-3.5 text-slate-100 text-sm focus:outline-none focus:border-neon-indigo transition-all" />
          </div>

          <div>
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Strategic Notes</label>
            <textarea
              value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="Crucial insight or core logic..."
              rows={3}
              className="w-full bg-obsidian-surface-high/20 border border-obsidian-surface-highest/20 rounded-2xl px-5 py-4 text-slate-100 text-sm focus:outline-none focus:border-neon-indigo transition-all resize-none font-medium"
            />
          </div>
        </div>

        <div className="bg-obsidian-surface-high/20 p-8 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-obsidian-surface-highest/20 text-slate-500 font-black uppercase tracking-widest text-[11px] hover:bg-obsidian-surface-highest/10 transition-all">Abort</button>
           <button 
             onClick={submit} disabled={!form.name.trim() || !form.topic.trim()}
             className="flex-[2] py-4 rounded-2xl bg-neon-indigo text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-neon-indigo/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
           >
             Lock Target List
           </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── The Kill List View ────────────────────────────────────────────────────────

export default function DSATrackerView() {
  const { state, updateProblem, deleteProblem } = useApp();
  const [activeTab, setActiveTab] = useState<'Aptitude' | 'DSA'>('DSA');
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<ProblemStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<'name' | 'difficulty' | 'status' | 'addedAt'>('addedAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

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
        let wA = (a.category === 'Aptitude' ? APTITUDE_TOPIC_WEIGHT[a.topic] : DSA_TOPIC_WEIGHT[a.topic]) ?? 0;
        let wB = (b.category === 'Aptitude' ? APTITUDE_TOPIC_WEIGHT[b.topic] : DSA_TOPIC_WEIGHT[b.topic]) ?? 0;
        if (wA !== wB) return wB - wA;
        const aPrio = a.isPriority ? 1 : 0;
        const bPrio = b.isPriority ? 1 : 0;
        if (aPrio !== bPrio) return bPrio - aPrio; 
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

  const stats = {
    total: tabProblems.length,
    done: tabProblems.filter((p) => p.status === 'Done').length,
    prio: tabProblems.filter((p) => p.isPriority && p.status !== 'Done').length,
    easy: tabProblems.filter((p) => p.difficulty === 'Easy' && p.status === 'Done').length,
    medium: tabProblems.filter((p) => p.difficulty === 'Medium' && p.status === 'Done').length,
    hard: tabProblems.filter((p) => p.difficulty === 'Hard' && p.status === 'Done').length,
  };

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-12 gap-8">
      {showModal && <AddProblemModal onClose={() => setShowModal(false)} activeCategory={activeTab} />}

      {/* Hero Stats */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
           <div className="max-w-md">
              <div className="w-12 h-12 bg-neon-indigo/20 rounded-2xl flex items-center justify-center mb-6 neon-glow-indigo border border-neon-indigo/30">
                 <Target className="w-6 h-6 text-neon-indigo-tint" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Kill List Console</h2>
              <p className="text-slate-500 text-sm font-medium">Currently tracking <span className="text-neon-indigo font-bold">{stats.total} total targets</span> across the recruitment pipeline.</p>
           </div>
           
           <div className="flex gap-12 items-center">
              <div className="text-center group">
                 <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-indigo transition-all tabular-nums">{stats.done}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-indigo/30 decoration-2">Neutralized</p>
              </div>
              <div className="text-center group">
                 <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-purple transition-all tabular-nums">{stats.prio}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-purple/30 decoration-2">High Priority</p>
              </div>
           </div>
        </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Overall Accuracy">
         <div className="flex items-center justify-center h-full py-2">
            <ActivityRing value={stats.done} max={stats.total} color="#6366f1" label="Mission Completion" />
         </div>
      </BentoCard>

      {/* Category Segmented Control */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
         <div className="flex bg-obsidian-surface-high/50 border border-obsidian-surface-highest/20 rounded-2xl p-1.5 w-full md:w-auto">
            <button
               onClick={() => setActiveTab('DSA')}
               className={`flex-1 md:w-48 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'DSA' ? 'bg-neon-indigo text-white shadow-xl shadow-neon-indigo/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <Zap className="w-3.5 h-3.5" /> DSA Console
            </button>
            <button
               onClick={() => setActiveTab('Aptitude')}
               className={`flex-1 md:w-48 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'Aptitude' ? 'bg-neon-cyan text-white shadow-xl shadow-neon-cyan/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <Activity className="w-3.5 h-3.5" /> Aptitude Lab
            </button>
         </div>

         <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-obsidian-surface-high border border-obsidian-surface-highest/20 hover:border-neon-indigo/50 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group"
         >
            <Plus className="w-4 h-4 text-neon-indigo group-hover:scale-125 transition-transform" /> 
            Identify New Target
         </button>
      </div>

      {/* Main List Console */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
         {/* Filters Bento */}
         <BentoCard className="bg-obsidian-surface-high/30 !p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Scan target repository..."
                    className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-neon-indigo/50 transition-all font-medium"
                  />
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                  <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}
                    className="bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-xl px-4 py-3 text-slate-400 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-neon-indigo/40 appearance-none flex-1 min-w-[120px]">
                    <option value="All">All Sectors</option>
                    {uniqueTopics.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value as Difficulty | 'All')}
                    className="bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-xl px-4 py-3 text-slate-400 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-neon-indigo/40 appearance-none flex-1 min-w-[120px]">
                    <option value="All">All Tiers</option>
                    {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
                  </select>
               </div>
            </div>
         </BentoCard>

         {/* Problem Bento List */}
         <div className="space-y-4">
            <AnimatePresence mode="popLayout">
               {problems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-20 text-center border-2 border-dashed border-obsidian-surface-highest/10 rounded-3xl"
                  >
                     <AlertTriangle className="w-10 h-10 text-slate-800 mx-auto mb-4 opacity-20" />
                     <p className="text-slate-600 text-xs font-black uppercase tracking-widest">No active targets in current sector</p>
                  </motion.div>
               ) : (
                  groupedProblems.map(([topic, groupProps]) => (
                     <div key={topic} className="space-y-3">
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 px-2 py-2"
                        >
                           <div className="w-1.5 h-6 bg-neon-indigo rounded-full" />
                           <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{topic} <span className="opacity-40 ml-1">[{groupProps.length}]</span></span>
                        </motion.div>
                        <AnimatePresence mode="popLayout">
                           {groupProps.map((p) => (
                              <motion.div 
                                key={p.id} 
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="bento-card !p-5 hover:border-slate-700/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                              >
                           <div className="flex items-start gap-5 flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                                 p.status === 'Done' ? 'bg-neon-cyan/20 border-neon-cyan/30 text-neon-cyan-tint' : 'bg-obsidian-surface-highest/20 border-slate-700/50 text-slate-600'
                              }`}>
                                 {p.status === 'Done' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-3 mb-1">
                                    <h4 className={`text-sm font-black tracking-tight truncate ${p.status === 'Done' ? 'text-slate-400' : 'text-slate-200'}`}>{p.name}</h4>
                                    {p.isPriority && (
                                       <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-[1px] rounded text-[8px] font-black uppercase tracking-widest animate-pulse">Critical</span>
                                    )}
                                 </div>
                                 {editingNote === p.id ? (
                                    <input
                                      autoFocus value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                                      onBlur={() => { updateProblem(p.id, { notes: noteDraft }); setEditingNote(null); }}
                                      onKeyDown={(e) => { if (e.key === 'Enter') { updateProblem(p.id, { notes: noteDraft }); setEditingNote(null); } }}
                                      className="w-full bg-obsidian-surface-highest/20 border border-obsidian-surface-highest/30 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-neon-indigo"
                                    />
                                 ) : (
                                    <p onClick={() => { setEditingNote(p.id); setNoteDraft(p.notes); }} className="text-[11px] font-medium text-slate-600 hover:text-slate-400 transition-colors cursor-pointer truncate max-w-sm italic">
                                       {p.notes || '+ Strategy Note'}
                                    </p>
                                 )}
                              </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-4 md:gap-8 flex-shrink-0">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${DIFF_COLORS[p.difficulty]}`}>
                                 {p.difficulty}
                              </span>
                              
                              <div className="flex items-center">
                                 <select 
                                   value={p.status} onChange={(e) => updateProblem(p.id, { status: e.target.value as ProblemStatus })}
                                   className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border bg-transparent cursor-pointer transition-all ${STATUS_COLORS[p.status]}`}
                                 >
                                    {(['Todo', 'Done', 'Revisit'] as ProblemStatus[]).map(s => <option key={s} value={s} className="bg-obsidian-surface text-white">{s}</option>)}
                                 </select>
                              </div>

                              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                 <button onClick={() => deleteProblem(p.id)} className="p-2 text-slate-700 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            ))
         )}
      </AnimatePresence>
   </div>
</div>

      {/* Sidebar Metrics */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
         <BentoCard title="Sector Load" icon={BookOpen} className="bg-obsidian-surface-high/30 h-fit">
            <div className="space-y-6 py-2">
               {[
                 { label: 'Neutralized', count: stats.done, color: 'text-neon-cyan', total: stats.total },
                 { label: 'Priority', count: stats.prio, color: 'text-neon-purple', total: stats.total },
                 { label: 'Pending', count: stats.total - stats.done, color: 'text-slate-400', total: stats.total },
               ].map((item) => {
                 const percentage = item.total ? Math.round((item.count / item.total) * 100) : 0;
                 return (
                   <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                         <span className={`text-xs font-black ${item.color}`}>{item.count}</span>
                      </div>
                      <div className="w-full h-1 bg-obsidian-surface-highest/20 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={`h-full ${item.color.replace('text', 'bg')} rounded-full`} />
                      </div>
                   </div>
                 );
               })}
            </div>
         </BentoCard>

         <BentoCard className="bg-obsidian-surface-high/30 flex flex-col justify-center gap-6 !p-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-neon-purple/20 rounded-xl flex items-center justify-center border border-neon-purple/30">
                  <Star className="w-5 h-5 text-neon-purple-tint" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Top Sectors</p>
                  <p className="text-xs font-bold text-white">Critical Mastery</p>
               </div>
            </div>
            <div className="space-y-3">
               {uniqueTopics.slice(0, 4).map(t => (
                  <div key={t} className="flex items-center justify-between p-3 rounded-xl bg-obsidian-surface/30 border border-obsidian-surface-highest/10">
                     <span className="text-[11px] font-bold text-slate-400 truncate pr-2">{t}</span>
                     <LayoutGrid className="w-3 h-3 text-slate-700" />
                  </div>
               ))}
            </div>
         </BentoCard>
      </div>
    </div>
  );
}
