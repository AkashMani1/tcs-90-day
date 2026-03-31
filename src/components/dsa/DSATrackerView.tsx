'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Target, Filter, Search, ChevronUp, ChevronDown, X, ShieldCheck, Zap, Activity, BookOpen, Star, AlertTriangle, FileText, LayoutGrid } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Problem, Difficulty, ProblemStatus, Platform } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 15 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const DIFF_COLORS: Record<Difficulty, string> = {
  Easy: 'text-secondary bg-secondary/10 border-secondary/20',
  Medium: 'text-primary bg-primary/10 border-primary/20',
  Hard: 'text-foreground bg-primary/40 border-primary/50 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]',
};

const STATUS_COLORS: Record<ProblemStatus, string> = {
  Done: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
  Revisit: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  Todo: 'text-muted-foreground bg-muted/20 border-border/10',
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-card border border-border/20 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-border/10 bg-muted/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                <Target className="w-6 h-6 text-primary" />
             </div>
             <h2 className="text-foreground font-black uppercase tracking-[0.2em] text-sm">Target Identity Log</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-muted/50 rounded-2xl transition-all">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-10 space-y-8">
          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Target Designation</label>
            <input
              autoFocus value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. 4Sum, LRU Cache, Number System Phase 1..."
              className="w-full bg-muted/40 border border-border/10 rounded-[20px] px-6 py-4 text-foreground text-md font-bold focus:outline-none focus:border-primary transition-all placeholder:opacity-30"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-1">
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Difficulty Tier</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value as Difficulty)}
                className="w-full bg-muted/40 border border-border/10 rounded-[20px] px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary appearance-none cursor-pointer">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => <option key={d} className="bg-card text-foreground">{d} Level</option>)}
              </select>
            </div>
            <div className="col-span-1">
               <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Execution Source</label>
               <select value={form.platform} onChange={(e) => set('platform', e.target.value as Platform)}
                 className="w-full bg-muted/40 border border-border/10 rounded-[20px] px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary appearance-none cursor-pointer">
                 {(['LeetCode', 'GFG', 'CodeVita', 'Other'] as Platform[]).map((p) => <option key={p} className="bg-card text-foreground">{p} Protocol</option>)}
               </select>
            </div>
          </div>

          <div>
             <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Sector / Topic</label>
             <input value={form.topic} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Dynamic Programming, Graph Theory..."
               className="w-full bg-muted/40 border border-border/10 rounded-[20px] px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary transition-all" />
          </div>

          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Strategic Intelligence Report</label>
            <textarea
              value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="Record the core algorithmic realization or mission-critical blockers encountered..."
              rows={3}
              className="w-full bg-muted/40 border border-border/10 rounded-[24px] px-6 py-5 text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none leading-relaxed placeholder:opacity-30"
            />
          </div>
        </div>

        <div className="bg-muted/20 p-10 flex gap-6">
           <button onClick={onClose} className="flex-1 py-5 rounded-[24px] border border-border/10 text-muted-foreground font-black uppercase tracking-[0.3em] text-[11px] hover:text-foreground hover:bg-muted/40 transition-all">Abort Log</button>
           <button 
             onClick={submit} disabled={!form.name.trim() || !form.topic.trim()}
             className="flex-[2] py-5 rounded-[24px] bg-primary text-foreground font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
           >
             Neutralize & Commit
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
    
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'addedAt') cmp = a.addedAt.localeCompare(b.addedAt);
      else if (sortKey === 'difficulty') cmp = (a.difficulty === 'Easy' ? 0 : a.difficulty === 'Medium' ? 1 : 2) - (b.difficulty === 'Easy' ? 0 : b.difficulty === 'Medium' ? 1 : 2);
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
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
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-10"
    >
      {showModal && <AddProblemModal onClose={() => setShowModal(false)} activeCategory={activeTab} />}

      {/* Hero Stats */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 py-4">
           <div className="max-w-md">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                 <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-4xl font-black text-foreground mb-4 leading-none tracking-tight uppercase">THE KILL LIST</h2>
              <p className="text-muted-foreground text-md font-medium leading-relaxed">
                 Active recruitment pipeline. Currently tracking <span className="text-primary font-black">{stats.total} tactical targets</span>. 
                 Mastery level is currently at <span className="text-primary font-black">{Math.round((stats.done / stats.total) * 100 || 0)}% neutralization</span>.
              </p>
           </div>
           
           <div className="flex gap-14 items-center">
              <div className="text-center group">
                 <p className="text-6xl font-black text-foreground mb-4 group-hover:text-primary transition-all tabular-nums tracking-tighter">{stats.done}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-primary/30 decoration-4">Neutralized</p>
              </div>
              <div className="text-center group">
                 <p className="text-6xl font-black text-foreground mb-4 group-hover:text-amber-500 transition-all tabular-nums tracking-tighter">{stats.prio}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-amber-500/30 decoration-4">High Risk</p>
              </div>
           </div>
        </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Mission Accuracy">
         <div className="flex items-center justify-center h-full py-4">
            <ActivityRing value={stats.done} max={stats.total} color="var(--primary)" label="Sector Mastery" />
         </div>
      </BentoCard>

      {/* Category Segmented Control - Notion Style */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
         <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/20 border border-border/5">
            {['DSA', 'Aptitude'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                  activeTab === tab 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                }`}
              >
                {tab === 'DSA' ? <Zap className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                <span>{tab} Console</span>
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-primary/10 border-b-2 border-primary rounded-lg -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
         </div>

         <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-card border border-border/10 hover:border-primary/40 text-foreground rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all group shadow-xl"
         >
            <Plus className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-500" /> 
            IDENTIFY NEW TARGET
         </button>
      </div>

      {/* Main List Console */}
      <div className="col-span-12 lg:col-span-9 space-y-8">
         {/* Filters Bento */}
         <motion.div variants={itemVariants} className="bento-card !p-6 bg-muted/10 backdrop-blur-sm">
            <div className="flex flex-col xl:flex-row gap-6 items-center">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
                  <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Scan secure target repository..."
                    className="w-full bg-card/60 border border-border/10 rounded-[20px] pl-16 pr-6 py-4 text-md text-foreground focus:outline-none focus:border-primary/40 transition-all font-bold placeholder:opacity-20"
                  />
               </div>
               <div className="flex gap-4 w-full xl:w-auto">
                  <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}
                    className="bg-card/60 border border-border/10 rounded-[18px] px-6 py-4 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-primary/40 appearance-none flex-1 min-w-[160px] cursor-pointer">
                    <option value="All">Sector: Global</option>
                    {uniqueTopics.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <select value={filterDiff} onChange={(e) => setFilterDiff(e.target.value as Difficulty | 'All')}
                    className="bg-card/60 border border-border/10 rounded-[18px] px-6 py-4 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-primary/40 appearance-none flex-1 min-w-[160px] cursor-pointer">
                    <option value="All">Tier: Dynamic</option>
                    {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d} Alert</option>)}
                  </select>
               </div>
            </div>
         </motion.div>

         {/* Problem Bento List */}
         <div className="space-y-6">
            <AnimatePresence mode="popLayout">
               {problems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-32 text-center border-2 border-dashed border-border/10 rounded-[40px] bg-muted/5"
                  >
                     <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-10" />
                     <p className="text-muted-foreground text-[13px] font-black uppercase tracking-[0.4em]">No active targets in terminal sector</p>
                  </motion.div>
               ) : (
                  groupedProblems.map(([topic, groupProps]) => (
                     <div key={topic} className="space-y-4">
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 px-4 py-2"
                        >
                           <div className="w-2.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
                           <span className="text-[13px] font-black text-foreground uppercase tracking-[0.3em]">{topic} <span className="opacity-30 ml-2 font-bold">[{groupProps.length} NODES]</span></span>
                        </motion.div>
                        <div className="space-y-4">
                           {groupProps.map((p) => (
                              <motion.div 
                                key={p.id} 
                                layout
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                className="bento-card !p-6 hover:border-primary/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group/card relative overflow-hidden"
                              >
                                {p.status === 'Done' && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events_none" />
                                )}
                                <div className="flex items-start gap-6 flex-1 min-w-0 relative z-10">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-500 ${
                                      p.status === 'Done' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-muted/40 border-border/10 text-muted-foreground'
                                   }`}>
                                      {p.status === 'Done' ? <ShieldCheck className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                                         <h4 className={`text-xl font-black tracking-tight truncate ${p.status === 'Done' ? 'text-muted-foreground/50' : 'text-foreground'}`}>{p.name}</h4>
                                         {p.isPriority && (
                                            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Critical Vector</span>
                                         )}
                                      </div>
                                      {editingNote === p.id ? (
                                         <input
                                           autoFocus value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                                           onBlur={() => { updateProblem(p.id, { notes: noteDraft }); setEditingNote(null); }}
                                           onKeyDown={(e) => { if (e.key === 'Enter') { updateProblem(p.id, { notes: noteDraft }); setEditingNote(null); } }}
                                           className="w-full bg-muted/50 border border-primary/30 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground focus:outline-none"
                                         />
                                      ) : (
                                         <p onClick={() => { setEditingNote(p.id); setNoteDraft(p.notes); }} className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer truncate max-w-xl italic opacity-60 hover:opacity-100">
                                            {p.notes || '+ Deploy Strategic Note'}
                                         </p>
                                      )}
                                   </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 lg:gap-10 pb_4 relative z-10">
                                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${DIFF_COLORS[p.difficulty]}`}>
                                      {p.difficulty} TIER
                                   </span>
                                   
                                   <div className="flex items-center">
                                      <select 
                                        value={p.status} onChange={(e) => updateProblem(p.id, { status: e.target.value as ProblemStatus })}
                                        className={`text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl border bg-card/60 backdrop-blur-sm cursor-pointer transition-all shadow-sm ${STATUS_COLORS[p.status]}`}
                                      >
                                         {(['Todo', 'Done', 'Revisit'] as ProblemStatus[]).map(s => <option key={s} value={s} className="bg-card text-foreground">{s} Status</option>)}
                                      </select>
                                   </div>

                                   <div className="flex items-center gap-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                                      <button onClick={() => deleteProblem(p.id)} className="p-3 bg-rose-500/10 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all border border-transparent hover:border-rose-500/30">
                                         <Trash2 className="w-5 h-5" />
                                      </button>
                                   </div>
                                </div>
                              </motion.div>
                           ))}
                        </div>
                     </div>
                  ))
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* Sidebar Metrics */}
      <div className="col-span-12 lg:col-span-3 space-y-10">
         <BentoCard title="Operational Load" icon={BookOpen} className="h-fit">
            <div className="space-y-8 py-4">
               {[
                 { label: 'Neutralized', count: stats.done, color: 'text-emerald-500', total: stats.total },
                 { label: 'High Priority', count: stats.prio, color: 'text-primary', total: stats.total },
                 { label: 'Active Targets', count: stats.total - stats.done, color: 'text-muted-foreground', total: stats.total },
               ].map((item) => {
                 const percentage = item.total ? Math.round((item.count / item.total) * 100) : 0;
                 return (
                   <div key={item.label} className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{item.label}</span>
                         <span className={`text-md font-black ${item.color} tabular-nums`}>{item.count}</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/5">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${percentage}%` }} 
                           className={`h-full ${item.color.replace('text', 'bg')} rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.2)]`} 
                         />
                      </div>
                   </div>
                 );
               })}
            </div>
         </BentoCard>

         <BentoCard className="aspect-square flex flex-col justify-center gap-8 !p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
               <div className="w-12 h-12 bg-primary/20 rounded-[20px] flex items-center justify-center border border-primary/30 shadow-xl group-hover:scale-110 transition-all">
                  <Star className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Elite Mastery</p>
                  <p className="text-sm font-black text-foreground">Critical Vectors</p>
               </div>
            </div>
            <div className="space-y-4 relative z-10">
               {uniqueTopics.slice(0, 4).map((t, i) => (
                  <motion.div 
                    key={t}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-[20px] bg-muted/40 border border-border/10 hover:border-primary/30 transition-all group/item"
                  >
                     <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider truncate pr-4 group-hover/item:text-foreground">{t}</span>
                     <LayoutGrid className="w-4 h-4 text-primary opacity-20 group-hover/item:opacity-100 transition-all" />
                  </motion.div>
               ))}
            </div>
         </BentoCard>
      </div>
    </motion.div>
  );
}
