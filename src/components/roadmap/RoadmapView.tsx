'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Check, Edit3, GitMerge, Target, ShieldCheck, Zap, Activity, BookOpen, ListTodo, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcCurrentWeek } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

const PHASE_CONFIG: Record<string, { badge: string; bg: string; bar: string; neon: string; tint: string }> = {
  Ninja: { badge: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/25', bg: 'bg-neon-cyan/5', bar: 'bg-neon-cyan', neon: '#06b6d4', tint: 'text-neon-cyan-tint' },
  Digital: { badge: 'bg-neon-indigo/15 text-neon-indigo border-neon-indigo/25', bg: 'bg-neon-indigo/5', bar: 'bg-neon-indigo', neon: '#6366f1', tint: 'text-neon-indigo-tint' },
  Prime: { badge: 'bg-neon-purple/15 text-neon-purple border-neon-purple/25', bg: 'bg-neon-purple/5', bar: 'bg-neon-purple', neon: '#a855f7', tint: 'text-neon-purple-tint' },
};

function WeekCard({ week, isExpanded, onToggle }: {
  week: ReturnType<typeof useApp>['state']['weeks'][0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { toggleWeekTask, addWeekTask, deleteWeekTask, updateWeekFocus, state } = useApp();
  const [newTask, setNewTask] = useState('');
  const [adding, setAdding] = useState(false);
  const [editFocus, setEditFocus] = useState(false);
  const [focusDraft, setFocusDraft] = useState(week.focus);

  const currentWeek = calcCurrentWeek(state.startDate);
  const done = week.tasks.filter((t) => t.done).length;
  const pct = week.tasks.length ? Math.round((done / week.tasks.length) * 100) : 0;
  const phase = PHASE_CONFIG[week.phase];
  const isActive = week.week === currentWeek;
  const isPast = week.week < currentWeek;

  const handleAddTask = () => {
    if (newTask.trim()) {
      addWeekTask(week.week, newTask.trim());
      setNewTask('');
      setAdding(false);
    }
  };

  return (
    <div 
      className={`bento-card overflow-hidden transition-all duration-500 hover:scale-[1.01] ${isActive ? 'border-neon-indigo/30 bg-neon-indigo/5 neon-glow-indigo' : 'border-obsidian-surface-highest/10 hover:border-slate-700/50'} ${isPast && pct === 100 ? 'opacity-80' : ''}`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-all ${isExpanded ? 'bg-obsidian-surface-highest/10' : 'hover:bg-obsidian-surface-highest/5'}`}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 border ${
          isActive 
            ? 'bg-neon-indigo/20 border-neon-indigo/50 text-white neon-glow-indigo' 
            : isPast ? 'bg-obsidian-surface-highest/20 border-slate-700 text-slate-400' : 'bg-obsidian-surface-highest/10 border-slate-800 text-slate-500'
        }`}>
          W{week.week}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className={`text-base font-black tracking-tight ${isActive ? 'text-white' : isPast ? 'text-slate-400' : 'text-slate-300'}`}>
              Week {week.week}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-md border font-black uppercase tracking-widest ${phase.badge}`}>
              {week.phase}
            </span>
            {isActive && (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-neon-indigo/20 text-neon-indigo-tint border border-neon-indigo/30 font-black uppercase tracking-widest animate-pulse">
                Active Sprint
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
             <Target className="w-3 h-3 text-slate-500" />
             <p className={`text-[11px] font-bold truncate tracking-wide ${isActive ? 'text-neon-indigo-tint' : 'text-slate-500'}`}>{week.focus}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[70px]">
            <span className={`text-[10px] font-black tracking-widest ${pct === 100 ? 'text-neon-cyan' : 'text-slate-600'}`}>{pct}% COMPLETED</span>
            <div className="w-20 h-1.5 bg-obsidian-surface-highest/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${pct}%` }}
                 className={`h-full ${phase.bar} rounded-full`} 
               />
            </div>
          </div>
          <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-90 bg-obsidian-surface-highest/30' : 'text-slate-700'}`}>
             <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-obsidian-surface-highest/10 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6">
              {/* Focus Section */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Mission Objective</p>
                {editFocus ? (
                  <div className="flex items-center gap-3">
                    <input
                      autoFocus
                      value={focusDraft}
                      onChange={(e) => setFocusDraft(e.target.value)}
                      onBlur={() => { updateWeekFocus(week.week, focusDraft); setEditFocus(false); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { updateWeekFocus(week.week, focusDraft); setEditFocus(false); } }}
                      className="flex-1 bg-obsidian-surface-highest/20 border border-obsidian-surface-highest/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-neon-indigo"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => { setFocusDraft(week.focus); setEditFocus(true); }}
                    className="group bg-obsidian-surface-high/30 hover:bg-obsidian-surface-highest/20 transition-all p-4 rounded-xl border border-obsidian-surface-highest/10 flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-bold text-slate-200">{week.focus}</span>
                    <Edit3 className="w-4 h-4 text-slate-600 group-hover:text-neon-indigo opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                )}
              </div>

              {/* Task Section */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Requirements</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {week.tasks.map((task) => (
                    <div key={task.id} className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      task.done 
                        ? 'bg-neon-cyan/5 border-neon-cyan/10 opacity-70' 
                        : 'bg-obsidian-surface-highest/5 border-obsidian-surface-highest/10 hover:border-slate-700'
                    }`}>
                      <button
                        onClick={() => toggleWeekTask(week.week, task.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          task.done 
                            ? 'bg-neon-cyan border-neon-cyan' 
                            : 'border-obsidian-surface-highest/30 hover:border-neon-indigo'
                        }`}
                      >
                        {task.done && <Check className="w-4 h-4 text-obsidian font-black" />}
                      </button>
                      <span className={`text-[13px] font-semibold flex-1 leading-tight ${task.done ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                        {task.label}
                      </span>
                      <button
                        onClick={() => deleteWeekTask(week.week, task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {adding ? (
                    <div className="flex gap-2 col-span-full">
                      <input
                        autoFocus
                        value={newTask}
                        placeholder="Define new task..."
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') setAdding(false); }}
                        className="flex-1 bg-obsidian-surface-highest/20 border border-obsidian-surface-highest/30 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-neon-indigo"
                      />
                      <button onClick={handleAddTask} className="px-5 py-3 bg-neon-indigo text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-neon-indigo/20">Add</button>
                      <button onClick={() => { setAdding(false); setNewTask(''); }} className="px-5 py-3 bg-obsidian-surface-highest/30 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdding(true)}
                      className="col-span-full py-4 border-2 border-dashed border-obsidian-surface-highest/20 rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:text-neon-indigo hover:border-neon-indigo/30 transition-all font-black text-[11px] uppercase tracking-[0.2em]"
                    >
                      <Plus className="w-4 h-4" /> Add Protocol Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapView() {
  const { state } = useApp();
  const currentWeek = calcCurrentWeek(state.startDate);
  const [expanded, setExpanded] = useState<number>(currentWeek);

  const totalTasks = state.weeks.reduce((s, w) => s + w.tasks.length, 0);
  const doneTasks = state.weeks.reduce((s, w) => s + w.tasks.filter((t) => t.done).length, 0);
  const overallPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Header / Intro Card */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
           <div className="max-w-md">
              <div className="w-12 h-12 bg-neon-purple/20 rounded-2xl flex items-center justify-center mb-6 neon-glow-purple border border-neon-purple/30">
                 <GitMerge className="w-6 h-6 text-neon-purple-tint" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">PROGRESSROADMAP</h2>
              <p className="text-slate-500 text-sm font-medium">Your 12-week strategic journey from <span className="text-neon-cyan font-bold">Ninja Base</span> to <span className="text-neon-purple font-bold">Prime Mastery</span>.</p>
           </div>
           
           <div className="flex gap-12 items-center">
              <div className="text-center group">
                 <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-purple transition-all tabular-nums">{overallPct}<span className="text-lg opacity-50 ml-1">%</span></p>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-purple/30 decoration-2">Sprint Load</p>
              </div>
           </div>
         </div>
      </BentoCard>

      {/* Completion Dashboard */}
      <BentoCard className="col-span-12 lg:col-span-4" title="Sprint Vitals">
         <div className="flex items-center justify-center h-full py-2">
            <ActivityRing value={doneTasks} max={totalTasks} color="#a855f7" label="Global Progress" />
         </div>
      </BentoCard>

      {/* Phase Trackers */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['Ninja', 'Digital', 'Prime'] as const).map((l) => {
            const config = PHASE_CONFIG[l];
            const ws = state.weeks.filter((w) => w.phase === l);
            const d = ws.reduce((s, w) => s + w.tasks.filter((t) => t.done).length, 0);
            const total = ws.reduce((s, w) => s + w.tasks.length, 0);
            const p = total ? Math.round((d / total) * 100) : 0;
            
            return (
              <BentoCard key={l} className="group overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} blur-3xl opacity-30 group-hover:scale-150 transition-all duration-1000`} />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-black uppercase tracking-[0.2em] border ${config.badge}`}>
                      {l} Tier
                    </span>
                    <span className={`text-2xl font-black ${config.tint} tabular-nums`}>{p}%</span>
                  </div>
                  <div className="w-full h-2 bg-obsidian-surface-highest/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${p}%` }}
                      className={`h-full ${config.bar} rounded-full`} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{d} of {total} targets hit</p>
                </div>
              </BentoCard>
            );
          })}
      </div>

      {/* Main Roadmap Sequential Stack */}
      <div className="col-span-12 lg:col-span-9 space-y-4">
         <div className="flex items-center gap-3 mb-6 px-1">
            <ShieldCheck className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Operational Sequential Stack</h3>
         </div>
         <div className="space-y-4">
            {state.weeks.map((week) => (
              <WeekCard
                key={week.week}
                week={week}
                isExpanded={expanded === week.week}
                onToggle={() => setExpanded(expanded === week.week ? 0 : week.week)}
              />
            ))}
         </div>
      </div>

      {/* Side Utilities */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
         <BentoCard title="Legend" className="bg-obsidian-surface-high/30 h-fit">
            <div className="space-y-4 py-2">
               {[
                 { label: 'Current Sprint', icon: Zap, color: 'text-neon-indigo' },
                 { label: 'Verified Target', icon: Check, color: 'text-neon-cyan' },
                 { label: 'Phase Milestone', icon: Star, color: 'text-neon-purple' },
                 { label: 'Knowledge Base', icon: BookOpen, color: 'text-slate-200' },
               ].map((item) => (
                 <div key={item.label} className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg bg-obsidian-surface-highest/30 flex items-center justify-center border border-obsidian-surface-highest/10`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                   </div>
                   <span className="text-[11px] font-bold text-slate-400 leading-none">{item.label}</span>
                 </div>
               ))}
            </div>
         </BentoCard>

         <BentoCard className="bg-obsidian-surface-high/30 aspect-square flex flex-col justify-center items-center text-center p-8">
            <Activity className="w-12 h-12 text-slate-700 mb-6 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">Weekly Review</p>
            <p className="text-xs font-medium text-slate-500 italic px-4 leading-relaxed">"The difference between who you are and who you want to be is what you do."</p>
         </BentoCard>
      </div>
    </div>
  );
}

