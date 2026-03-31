'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Clock, TrendingUp, CalendarDays, CheckCircle2, Circle, 
  Save, CheckCheck, Activity, ShieldCheck, AlertTriangle, 
  Plus, Minus, CheckSquare, Square, BookOpen, PenTool, Lightbulb, 
  Code, UploadCloud, Eye, BookMarked, BarChart3, ListTodo, Target,
  Heart, Zap, Shield, Timer, Settings
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcTotalHours, calcCurrentWeek, today, getStreakStatus, getHoursUntilMidnight } from '@/lib/utils';

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

// ── Biometric Monitor components ─────────────────────────────────────────────

const COMMAND_QUOTES = [
  "THE ARCHITECT OF THE SYSTEM BUILDS FROM THE UNCERTAINTY.",
  "DIGITAL MASTERY IS BORN FROM THE REPETITION OF THE FUNDAMENTALS.",
  "THE SYSTEM DOES NOT REWARD SPEED; IT REWARDS CONSISTENCY UNDER PRESSURE.",
  "ELEVATE TO PRIME BY OPTIMIZING YOUR INTERNAL PROTOCOLS EVERY DAY.",
  "TCS DIGITAL ACCEPTS ONLY THOSE WHO OUTWORK THEIR OWN UNCERTAINTY.",
  "SUCCESS IN THE SYSTEM IS A PRODUCT OF 90 DAYS OF DISCIPLINED EXECUTION.",
  "THE ARCHITECT DOES NOT WAIT FOR MOTIVATION; THEY RELY ON THE PROTOCOL."
];

function QuoteCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % COMMAND_QUOTES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-3 py-2 px-1">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-3.5 h-3.5 text-primary opacity-50" />
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">System Intent</span>
      </div>
      <div className="relative min-h-[45px] flex items-center">
        <div className="absolute -left-2 top-0 w-[1px] h-full bg-gradient-to-b from-primary/50 to-transparent" />
        <AnimatePresence mode="wait">
          <motion.p 
            key={index}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 0.9, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-bold text-foreground leading-[1.5] italic tracking-tight"
          >
            "{COMMAND_QUOTES[index]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Bento Card ─────────────────────────────────────────────────────────────

function BentoCard({ children, className = '', title = '', icon: Icon, badge = '', delay = 0 }: { children: React.ReactNode; className?: string; title?: string; icon?: any; badge?: string; delay?: number }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={`bento-card p-6 flex flex-col group ${className}`}
    >
      {(title || Icon) && (
        <div className={`flex items-center justify-between ${badge ? 'mb-8' : 'mb-6'}`}>
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-10 h-10 bg-muted/40 rounded-xl flex items-center justify-center border border-border/10 group-hover:border-primary/30 transition-all group-hover:scale-110">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-foreground font-black text-xs uppercase tracking-[0.2em] leading-none mb-1">{title}</h3>
              {badge && <p className="text-muted-foreground text-[9px] font-bold tracking-tight">{badge}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────

function getHeatColor(count: number) {
  if (count === 0) return 'bg-muted/10 border-border/5';
  if (count === 1) return 'bg-primary/20 border-primary/20 text-primary';
  if (count === 2) return 'bg-primary/40 border-primary/30';
  if (count === 3) return 'bg-primary/60 border-primary/40';
  return 'bg-primary border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]';
}

function Heatmap({ dailyLogs, compact = false }: { dailyLogs: { date: string; completedHabits: string[] }[]; compact?: boolean }) {
  const DAYS = compact ? 70 : 140; 
  const ref = new Date();
  const logMap = new Map(dailyLogs.map((l) => [l.date, l.completedHabits.length]));

  const cells: { date: Date; count: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    const real = logMap.get(key);
    cells.push({ date: d, count: real !== undefined ? real : 0 });
  }

  const weeks: typeof cells[] = [];
  let col: typeof cells = [];
  cells.forEach((c) => {
    col.push(c);
    if (col.length === 7) { weeks.push(col); col = []; }
  });

  return (
    <div className="w-full flex">
      <div className={`flex flex-1 justify-between ${compact ? 'gap-1' : 'gap-1.5'} w-full overflow-hidden`}>
        {weeks.map((week, wi) => (
          <div key={wi} className={`flex flex-col ${compact ? 'gap-1' : 'gap-1.5'} flex-1`}>
            {week.map((c, di) => (
              <motion.div
                key={di}
                whileHover={{ scale: 1.5, zIndex: 50 }}
                className={`w-full aspect-square rounded-[2px] border transition-all duration-300 ${getHeatColor(c.count)}`}
                title={`${c.date.toDateString()}: ${c.count} tasks`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Streak Guard ─────────────────────────────────────────────────────────────

function StreakGuard() {
  const { state } = useApp();
  const status = getStreakStatus(state.dailyLogs);
  const [timeLeft, setTimeLeft] = useState(getHoursUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getHoursUntilMidnight()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'None') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-5 rounded-[24px] border flex items-center justify-between transition-all ${
        status === 'Protected' ? 'bg-secondary/5 border-secondary/20 text-secondary' : 'bg-primary/5 border-primary/20 text-primary'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${status === 'Protected' ? 'bg-secondary/20 shadow-[0_0_15px_rgba(var(--secondary-rgb),0.3)]' : 'bg-primary/20 animate-pulse'}`}>
          {status === 'Protected' ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Mission Integrity</p>
          <p className="text-md font-black tracking-tight">{status === 'Protected' ? 'STREAK SECURED' : 'STREAK AT RISK'}</p>
        </div>
      </div>
      {status === 'At Risk' && (
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5">Expiring In</p>
          <p className="text-sm font-black tabular-nums">{timeLeft}</p>
        </div>
      )}
    </motion.div>
  );
}

// ── Daily Accountability Console ─────────────────────────────────────────────

function DailyTaskChecklist() {
  const { 
    state, updateDailyLog, toggleHabit, 
    addHabitItem, updateHabitItem, deleteHabitItem, updateHabitGroupTitle 
  } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const todayStr = today();
  const log = state.dailyLogs.find(l => l.date === todayStr) || {
    date: todayStr,
    completedHabits: [],
    problemsSolved: { easy: 0, medium: 0, hard: 0 },
    hours: 0,
    energy: 5,
    confidence: 5,
    conceptsLearned: ['', '', ''],
    struggles: '',
    tomorrowPlan: { morning: '', afternoon: '' }
  };

  const habitGroups = state.habitGroups || [];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateProbs = (diff: 'easy' | 'medium' | 'hard', delta: number) => {
    const current = log.problemsSolved ?? { easy: 0, medium: 0, hard: 0 };
    const nextProbs = { ...current, [diff]: Math.max(0, current[diff] + delta) };
    updateDailyLog({ ...log, problemsSolved: nextProbs });
  };

  const updateVitals = (key: string, val: number) => {
    updateDailyLog({ ...log, [key]: val });
  };

  const updateConcepts = (idx: number, val: string) => {
    const next = [...(log.conceptsLearned || ['', '', ''])];
    next[idx] = val;
    updateDailyLog({ ...log, conceptsLearned: next });
  };

  const updatePlan = (key: 'morning' | 'afternoon', val: string) => {
    const currentPlan = log.tomorrowPlan ?? { morning: '', afternoon: '' };
    updateDailyLog({ ...log, tomorrowPlan: { ...currentPlan, [key]: val } });
  };

  const currentWeek = calcCurrentWeek(state.startDate);
  const totalTasks = habitGroups.reduce((acc, g) => acc + g.items.length, 0);
  const doneCount = log.completedHabits.length;
  const pct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Worksheet Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 py-4 border-b border-border/10">
         <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Date</span>
              <span className="text-xs font-black text-foreground">{todayStr}</span>
            </div>
            <div className="w-[1px] h-6 bg-border/20" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Week #</span>
              <span className="text-xs font-black text-primary uppercase">W{currentWeek} / 12</span>
            </div>
            <div className="w-[1px] h-6 bg-border/20 hidden sm:block" />
            <div className="hidden sm:flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Efficiency</span>
              <span className="text-xs font-black text-foreground tabular-nums">{pct}%</span>
            </div>
         </div>
         
         <button 
           onClick={() => setIsEditing(!isEditing)}
           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
             isEditing ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'
           }`}
         >
           {isEditing ? <CheckSquare className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
           {isEditing ? 'Save Protocol' : 'Configure Protocol'}
         </button>
      </div>

      <div className="max-w-3xl space-y-12">
        {/* Task Blocks (Stacked Vertically) */}
        {habitGroups.map((group) => (
          <div key={group.id} className="space-y-4">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <input 
                  type="text" 
                  value={group.title} 
                  onChange={(e) => updateHabitGroupTitle(group.id, e.target.value)}
                  className="bg-muted/10 border border-border/10 rounded-lg px-2 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-primary focus:outline-none w-64"
                />
              ) : (
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-3">
                  {group.title}
                </h4>
              )}
            </div>
            
            <div className="flex flex-col gap-1 pl-4">
              {group.items.map((item) => {
                const isChecked = log.completedHabits.includes(item.id);
                return (
                  <div key={item.id} className="group relative flex items-center gap-3 py-1.5">
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-3 bg-muted/5 p-2 rounded-lg border border-border/5">
                         <div className="w-4 h-4 border border-muted-foreground/30 rounded flex-shrink-0" />
                         <div className="flex-1 space-y-1">
                            <input 
                              type="text" value={item.label} 
                              onChange={(e) => updateHabitItem(group.id, item.id, { label: e.target.value })}
                              className="bg-transparent text-[12px] font-bold tracking-tight w-full focus:outline-none text-foreground"
                            />
                            <input 
                              type="text" value={item.detail} 
                              onChange={(e) => updateHabitItem(group.id, item.id, { detail: e.target.value })}
                              className="bg-transparent text-[9px] font-medium opacity-50 w-full focus:outline-none"
                            />
                         </div>
                         <button onClick={() => deleteHabitItem(group.id, item.id)} className="text-rose-500 p-1"><Minus className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 group/item">
                         <button 
                           onClick={() => toggleHabit(item.id)}
                           className="mt-0.5 w-4.5 h-4.5 rounded-sm border flex items-center justify-center transition-all border-muted-foreground/30 hover:border-primary/50"
                         >
                           {isChecked ? <CheckSquare className="w-4.5 h-4.5 text-primary" /> : <Square className="w-4.5 h-4.5 opacity-20" />}
                         </button>
                         <div className="flex flex-col">
                           <span className={`text-[12px] font-medium tracking-tight ${isChecked ? 'line-through opacity-40' : 'text-foreground/90'}`}>{item.label}</span>
                           {item.detail && <span className="text-[10px] opacity-40 font-medium tracking-tight">{item.detail}</span>}
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {isEditing && (
                <button onClick={() => addHabitItem(group.id, 'New Target', '')} className="mt-2 text-primary/60 hover:text-primary transition-colors flex items-center gap-2 text-[9px] font-black uppercase tracking-widest pl-1">
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Data Sections Stacked Vertically */}
        <div className="space-y-12 pt-10 border-t border-border/10">
           {/* Problems Solved */}
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Target className="w-4 h-4 text-primary" />
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Target Neutralization:</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pl-4 max-w-xl">
                 {(['easy', 'medium', 'hard'] as const).map(diff => (
                   <div key={diff} className="flex flex-col gap-2.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">- {diff} problems</span>
                      <div className="flex items-center gap-4">
                         <button onClick={() => updateProbs(diff, -1)} className="w-7 h-7 rounded-sm border border-border/10 bg-muted/5 hover:bg-muted/20 flex items-center justify-center text-muted-foreground"><Minus className="w-2.5 h-2.5"/></button>
                         <span className="text-sm font-black text-foreground tabular-nums w-4 text-center">{(log.problemsSolved ?? { easy: 0, medium: 0, hard: 0 })[diff]}</span>
                         <button onClick={() => updateProbs(diff, 1)} className="w-7 h-7 rounded-sm border border-primary/20 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"><Plus className="w-2.5 h-2.5"/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Concepts Learned */}
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <PenTool className="w-4 h-4 text-secondary" />
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Extraction Log (Insights):</h4>
              </div>
              <div className="space-y-3 pl-4">
                 {[0, 1, 2].map(i => (
                   <div key={i} className="flex items-center gap-4 group">
                      <span className="text-[10px] font-black text-muted-foreground opacity-30">{i+1}.</span>
                      <input 
                         type="text" 
                         value={(log.conceptsLearned ?? [])[i] || ''}
                         onChange={(e) => updateConcepts(i, e.target.value)}
                         className="flex-1 bg-transparent border-b border-border/20 py-1.5 text-[12px] font-medium text-foreground focus:outline-none focus:border-primary/50 placeholder:opacity-10 transition-colors"
                         placeholder="__________________________________________________________"
                      />
                   </div>
                 ))}
              </div>
           </div>

           {/* Vitals */}
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Activity className="w-4 h-4 text-rose-500" />
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Biometric Sync:</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pl-4">
                 <div className="space-y-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Energy (1-10)</p>
                    <button onClick={() => updateVitals('energy', (log.energy % 10) + 1)} className="text-2xl font-black text-rose-500 tabular-nums tracking-tighter">
                       {log.energy < 10 ? `0${log.energy}` : '10'}
                    </button>
                 </div>
                 <div className="space-y-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Confidence (1-10)</p>
                    <button onClick={() => updateVitals('confidence', (log.confidence % 10) + 1)} className="text-2xl font-black text-primary tabular-nums tracking-tighter">
                       {log.confidence < 10 ? `0${log.confidence}` : '10'}
                    </button>
                 </div>
                 <div className="space-y-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Hours Logged</p>
                    <div className="flex items-baseline gap-1">
                       <input type="number" step="0.5" value={log.hours} onChange={(e) => updateVitals('hours', Number(e.target.value))} className="bg-transparent font-black text-foreground text-2xl focus:outline-none w-14 tracking-tighter" />
                       <span className="text-[10px] font-black text-muted-foreground opacity-40 uppercase">HR</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Tomorrow's Plan */}
           <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3">
                 <CalendarDays className="w-4 h-4 text-primary" />
                 <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Mission Deck (Tomorrow):</h4>
              </div>
              <div className="space-y-3 pl-4 max-w-xl">
                 <div className="flex items-center gap-4 group">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-20">- Morning:</span>
                    <input type="text" value={(log.tomorrowPlan ?? { morning: '', afternoon: '' }).morning} onChange={(e) => updatePlan('morning', e.target.value)} className="flex-1 bg-transparent border-b border-border/20 py-1 text-[12px] font-medium focus:outline-none focus:border-primary/50 transition-colors" placeholder="_____________________________________" />
                 </div>
                 <div className="flex items-center gap-4 group">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-20">- Afternoon:</span>
                    <input type="text" value={(log.tomorrowPlan ?? { morning: '', afternoon: '' }).afternoon} onChange={(e) => updatePlan('afternoon', e.target.value)} className="flex-1 bg-transparent border-b border-border/20 py-1 text-[12px] font-medium focus:outline-none focus:border-primary/50 transition-colors" placeholder="_____________________________________" />
                 </div>
              </div>
           </div>

           <div className="pt-12">
              <button
                onClick={handleSave}
                className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all ${
                  saved ? 'bg-secondary/20 text-secondary border border-secondary/40' : 'bg-primary text-foreground shadow-lg hover:scale-[1.02] active:scale-95'
                }`}
              >
                {saved ? <ShieldCheck className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? 'Protocol Secured' : 'Commit Daily Log'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardView() {
  const { state, initialized } = useApp();
  if (!initialized) return null;

  const streak = calcStreak(state.dailyLogs);
  const totalHours = calcTotalHours(state.dailyLogs);
  const currentWeek = calcCurrentWeek(state.startDate);
  const totalDone = state.problems.filter((p) => p.status === 'Done').length;
  const progressPct = Math.round((currentWeek / 12) * 100);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.03),transparent_70%)] pointer-events-none" />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-6 relative z-10"
      >
        
        {/* TOP ROW: Tactical Overview & Streak Protection */}
        <BentoCard className="col-span-12 lg:col-span-9 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
             <div className="space-y-4">
                <div>
                   <h2 className="text-3xl font-black text-foreground mb-1 leading-none tracking-tight">TACTICAL OVERVIEW</h2>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Platform Operational</p>
                   </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                   <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-primary text-[11px] font-black uppercase tracking-[0.2em]">Week {currentWeek} <span className="opacity-40">/ 12</span></p>
                   </div>
                   <div className="w-[1px] h-4 bg-border/20 mx-1" />
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/10 rounded-lg border border-border/10 group-hover:border-primary/20 transition-all">
                      <Timer className="w-3.5 h-3.5 text-primary opacity-60" />
                      <p className="text-foreground text-[11px] font-black tabular-nums">{totalHours.toFixed(1)}<span className="text-muted-foreground text-[8px] font-bold uppercase ml-1">Hrs Logged</span></p>
                   </div>
                </div>
             </div>
             
             <div className="flex flex-wrap items-center gap-10 md:gap-16">
                <div className="group">
                   <p className="text-4xl font-black text-foreground group-hover:text-primary transition-colors tabular-nums leading-none mb-2">{streak}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Days Streak</p>
                </div>
                <div className="group">
                   <p className="text-4xl font-black text-foreground group-hover:text-secondary transition-colors tabular-nums leading-none mb-2">{totalDone}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Nodes Mastery</p>
                </div>
                <div className="group">
                   <p className="text-4xl font-black text-foreground/50 tabular-nums leading-none mb-2">{progressPct}%</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Effective</p>
                </div>
             </div>
          </div>
        </BentoCard>

        <div className="col-span-12 lg:col-span-3">
           <StreakGuard />
        </div>

        {/* MAIN ROW: Workspace & Stats Sidebar */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
           <BentoCard className="flex-1" title="Accountability Log" icon={CheckCheck}>
             <DailyTaskChecklist />
           </BentoCard>
        </div>

        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
           <BentoCard title="Mission Integrity" icon={BarChart3}>
              <Heatmap dailyLogs={state.dailyLogs} compact />
           </BentoCard>

           <BentoCard title="Command Intent" icon={Target}>
              <QuoteCard />
           </BentoCard>
        </aside>

      </motion.div>
    </div>
  );
}
