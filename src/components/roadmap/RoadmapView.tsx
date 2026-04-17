/* Developed by Akash Mani - This site is developed by Akash Mani. Original watermark of Akash Mani. */
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Check, Edit3, GitMerge, Target, ShieldCheck, Zap, Activity, BookOpen, ListTodo, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcCurrentWeek } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const PHASE_CONFIG: Record<string, { badge: string; bg: string; bar: string; neon: string; tint: string }> = {
  Ninja: { badge: 'border-secondary/30 text-secondary bg-secondary/10', bg: 'bg-secondary/5', bar: 'bg-secondary', neon: 'var(--secondary)', tint: 'text-secondary' },
  Digital: { badge: 'border-primary/30 text-primary bg-primary/10', bg: 'bg-primary/5', bar: 'bg-primary', neon: 'var(--primary)', tint: 'text-primary' },
  Prime: { badge: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10', bg: 'bg-emerald-500/5', bar: 'bg-emerald-500', neon: '#10b981', tint: 'text-emerald-500' },
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
    <motion.div 
      variants={itemVariants}
      className={`bento-card overflow-hidden transition-all duration-500 ${isActive ? 'border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'border-border/10'} ${isPast && pct === 100 ? 'opacity-80' : ''}`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-6 px-8 py-6 text-left transition-all ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 border transition-all ${
          isActive 
            ? 'bg-primary/20 border-primary/50 text-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' 
            : isPast ? 'bg-muted border-border text-muted-foreground' : 'bg-muted/40 border-border/10 text-muted-foreground'
        }`}>
          W{week.week}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-lg font-black tracking-tight ${isActive ? 'text-foreground' : isPast ? 'text-muted-foreground' : 'text-foreground'}`}>
              Week {week.week}
            </span>
            <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${phase.badge}`}>
              {week.phase}
            </span>
            {isActive && (
              <span className="text-[10px] px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-black uppercase tracking-widest animate-pulse">
                Active Sprint
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 opacity-70">
             <Target className="w-3.5 h-3.5 text-muted-foreground" />
             <p className={`text-xs font-bold truncate tracking-tight ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{week.focus}</p>
          </div>
        </div>

        <div className="flex items-center gap-8 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-2 min-w-[80px]">
            <span className={`text-[10px] font-black tracking-widest ${pct === 100 ? 'text-emerald-500' : 'text-muted-foreground'}`}>{pct}% DONE</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden border border-border/5">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${pct}%` }}
                 className={`h-full ${phase.bar} rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]`} 
               />
            </div>
          </div>
          <div className={`p-2.5 rounded-xl transition-transform duration-500 ${isExpanded ? 'rotate-90 bg-muted text-primary' : 'text-muted-foreground'}`}>
             <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/10 overflow-hidden"
          >
            <div className="px-8 py-8 space-y-8 bg-muted/5">
              {/* Focus Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Objective</p>
                {editFocus ? (
                  <div className="flex items-center gap-4">
                    <input
                      autoFocus
                      value={focusDraft}
                      onChange={(e) => setFocusDraft(e.target.value)}
                      onBlur={() => { updateWeekFocus(week.week, focusDraft); setEditFocus(false); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { updateWeekFocus(week.week, focusDraft); setEditFocus(false); } }}
                      className="flex-1 bg-card border border-primary/50 rounded-2xl px-5 py-3 text-sm text-foreground focus:outline-none shadow-xl shadow-primary/5"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => { setFocusDraft(week.focus); setEditFocus(true); }}
                    className="group bg-card/60 hover:bg-card transition-all p-5 rounded-[24px] border border-border/10 flex items-center justify-between text-left w-full"
                  >
                    <span className="text-sm font-bold text-foreground leading-relaxed">{week.focus}</span>
                    <Edit3 className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                )}
              </div>

              {/* Task Section */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Requirements</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {week.tasks.map((task) => (
                    <motion.div 
                      key={task.id} 
                      layout
                      className={`group flex items-center gap-4 p-4 rounded-[20px] border transition-all ${
                        task.done 
                          ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70' 
                          : 'bg-card border-border/10 hover:border-primary/20'
                      }`}
                    >
                      <button
                        onClick={() => toggleWeekTask(week.week, task.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                          task.done 
                            ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                            : 'border-muted hover:border-primary'
                        }`}
                      >
                        {task.done && <Check className="w-4 h-4 text-white font-black" />}
                      </button>
                      <span className={`text-[14px] font-bold flex-1 leading-snug tracking-tight ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.label}
                      </span>
                      <button
                        onClick={() => deleteWeekTask(week.week, task.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  
                  {adding ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3 col-span-full">
                      <input
                        autoFocus
                        value={newTask}
                        placeholder="Define new task vector..."
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') setAdding(false); }}
                        className="flex-1 bg-card border border-primary/50 border-dashed rounded-2xl px-6 py-4 text-sm text-foreground placeholder:opacity-30 focus:outline-none"
                      />
                      <button onClick={handleAddTask} className="px-6 py-4 bg-primary text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95">Add</button>
                      <button onClick={() => { setAdding(false); setNewTask(''); }} className="px-6 py-4 border border-border text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-foreground transition-all">Abort</button>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setAdding(true)}
                      className="col-span-full py-5 border-2 border-dashed border-muted rounded-[20px] flex items-center justify-center gap-3 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all font-black text-[11px] uppercase tracking-[0.2em] bg-card/20"
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
    </motion.div>
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-8"
    >
      {/* Header / Intro Card */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 py-4">
           <div className="max-w-md">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] border border-primary/30">
                 <GitMerge className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-4xl font-black text-foreground mb-4 tracking-tight leading-none uppercase">PROGRESS ROADMAP</h2>
              <p className="text-muted-foreground text-md font-medium leading-relaxed">
                Strategic {(state.goalDurationMonths || 3) * 4}-week deployment. Transitioning from <span className="text-secondary font-black">Ninja Fundamentals</span> to <span className="text-primary font-black">Prime Production Readiness</span>.
              </p>
           </div>
           
           <div className="flex gap-12 items-center">
              <div className="text-center group">
                 <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl font-black text-foreground mb-4 tabular-nums"
                  >
                   {overallPct}<span className="text-xl opacity-30 ml-1">%</span>
                 </motion.p>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-primary/30 decoration-4">Sprint Load</p>
              </div>
           </div>
         </div>
      </BentoCard>

      {/* Completion Dashboard */}
      <BentoCard className="col-span-12 lg:col-span-4" title="Sprint Vitals">
         <div className="flex items-center justify-center h-full py-4">
            <ActivityRing value={doneTasks} max={totalTasks} color="var(--primary)" label="Global Alignment" />
         </div>
      </BentoCard>

      {/* Phase Trackers */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {(['Ninja', 'Digital', 'Prime'] as const).map((l) => {
            const config = PHASE_CONFIG[l];
            const ws = state.weeks.filter((w) => w.phase === l);
            const d = ws.reduce((s, w) => s + w.tasks.filter((t) => t.done).length, 0);
            const total = ws.reduce((s, w) => s + w.tasks.length, 0);
            const p = total ? Math.round((d / total) * 100) : 0;
            
            return (
              <BentoCard key={l} className="group overflow-hidden relative">
                <div className={`absolute -top-10 -right-10 w-40 h-40 ${config.bg} blur-[60px] opacity-40 group-hover:scale-150 transition-all duration-1000`} />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] px-3.5 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border ${config.badge}`}>
                      {l} Tier
                    </span>
                    <span className={`text-3xl font-black ${config.tint} tabular-nums tracking-tighter`}>{p}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${p}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${config.bar} rounded-full`} 
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">{d} / {total} TARGETS NEUTRALIZED</p>
                </div>
              </BentoCard>
            );
          })}
      </div>

      {/* Main Roadmap Sequential Stack */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
         <div className="flex items-center gap-4 mb-8 px-2">
            <div className="w-2 h-8 bg-secondary rounded-full shadow-[0_0_10px_rgba(var(--secondary-rgb),0.4)]" />
            <h3 className="text-[13px] font-black text-foreground uppercase tracking-[0.4em]">Strategic Operations Queue</h3>
         </div>
         <div className="space-y-6">
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
      <div className="col-span-12 lg:col-span-3 space-y-8">
         <BentoCard title="Mission Legend" icon={ShieldCheck} className="h-fit">
            <div className="space-y-6 py-2">
               {[
                 { label: 'Primary Objective', icon: Zap, color: 'text-primary' },
                 { label: 'Secure Verification', icon: Check, color: 'text-emerald-500' },
                 { label: 'Tier Milestone', icon: Star, color: 'text-secondary' },
                 { label: 'Intelligence Vault', icon: BookOpen, color: 'text-foreground' },
               ].map((item) => (
                 <div key={item.label} className="flex items-center gap-4 group/item">
                   <div className={`w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/10 group-hover/item:border-primary/30 transition-all`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                   </div>
                   <span className="text-xs font-black text-muted-foreground tracking-tight group-hover/item:text-foreground transition-all">{item.label}</span>
                 </div>
               ))}
            </div>
         </BentoCard>

         <BentoCard className="aspect-square flex flex-col justify-center items-center text-center p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
            <Activity className="w-16 h-16 text-muted-foreground mb-8 opacity-10 group-hover:opacity-30 transition-all duration-700" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 relative z-10">Oracle Briefing</p>
            <p className="text-sm font-bold text-foreground italic px-2 leading-relaxed relative z-10 tracking-tight">"The difference between the mediocre and the elite is the obsession with technical consistency."</p>
         </BentoCard>
      </div>
    </motion.div>
  );
}
