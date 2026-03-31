'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Clock, TrendingUp, CalendarDays, CheckCircle2, Circle, 
  Save, CheckCheck, Activity, ShieldCheck, AlertTriangle, 
  Plus, Minus, CheckSquare, Square, BookOpen, PenTool, Lightbulb, 
  Code, UploadCloud, Eye, BookMarked, BarChart3, ListTodo, Target,
  Heart, Zap, Shield, Timer
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcTotalHours, calcCurrentWeek, today, getStreakStatus, getHoursUntilMidnight } from '@/lib/utils';
import { QUOTES } from '@/lib/defaultData';

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

function HeartbeatVisual({ value }: { value: number }) {
  const pulseScale = 1 + (value / 10) * 0.2;
  return (
    <div className="relative w-full h-20 flex items-center justify-center overflow-hidden bg-muted/10 rounded-2xl border border-border/5 group">
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30">
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      <motion.div
        animate={{ 
          scale: [1, pulseScale, 1],
          opacity: [0.6, 1, 0.6] 
        }}
        transition={{ 
          duration: Math.max(0.4, 1.5 - (value / 10)), 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        <Heart className="w-10 h-10 text-rose-500 fill-rose-500/20 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
      </motion.div>
      
      <div className="absolute bottom-2 right-4 flex items-baseline gap-1">
        <span className="text-xs font-black text-rose-500">{value}</span>
        <span className="text-[8px] font-bold text-muted-foreground tracking-widest uppercase">NRG</span>
      </div>
    </div>
  );
}

function ConfidenceGauge({ value }: { value: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Confidence Scale</span>
        <span className="text-sm font-black text-primary">{value * 10}%</span>
      </div>
      <div className="h-8 w-full bg-muted/20 rounded-xl p-1.5 flex gap-1.5 border border-border/5">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, scale: 0.8 }}
            animate={{ 
              opacity: i < value ? 1 : 0.1,
              scale: i < value ? 1 : 0.9,
              backgroundColor: i < value ? 'var(--primary)' : 'currentColor'
            }}
            className={`flex-1 rounded-md transition-all ${i < value ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    </div>
  );
}

function TimeMatrix({ hours }: { hours: number }) {
  return (
    <div className="bg-muted/10 rounded-2xl p-5 border border-border/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Focus Matrix</span>
        </div>
        <span className="text-xs font-black tabular-nums">{hours.toFixed(1)}h</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[...Array(10)].map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`h-2 rounded-full transition-all ${i < Math.floor(hours) ? 'bg-secondary' : 'bg-muted/30'}`} 
          />
        ))}
      </div>
    </div>
  );
}

function BiometricMonitor({ log, totalHours }: { log: any; totalHours: number }) {
  return (
    <div className="flex flex-col gap-10 h-full py-4">
      <div className="space-y-10">
        <HeartbeatVisual value={log.energy} />
        <ConfidenceGauge value={log.confidence} />
      </div>
      <div className="mt-auto pt-6 border-t border-border/10">
        <TimeMatrix hours={totalHours} />
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

function Heatmap({ dailyLogs }: { dailyLogs: { date: string; completedHabits: string[] }[] }) {
  const DAYS = 140; 
  const ref = new Date();
  const logMap = new Map(dailyLogs.map((l) => [l.date, l.completedHabits.length]));

  const cells: { date: Date; count: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - i);
    // CRITICAL: Use the same local date string format as the app handles
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
      <div className="flex flex-1 justify-between gap-1.5 w-full overflow-hidden">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5 flex-1">
            {week.map((c, di) => (
              <motion.div
                key={di}
                whileHover={{ scale: 1.5, zIndex: 50 }}
                className={`w-full aspect-square rounded-[4px] border transition-all duration-300 ${getHeatColor(c.count)}`}
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
  const { getTodayLog, updateDailyLog, toggleHabit } = useApp();
  const log = getTodayLog();
  const [saved, setSaved] = useState(false);

  // Sync local state
  const [probs, setProbs] = useState(log.problemsSolved || { easy: 0, medium: 0, hard: 0 });
  const [concepts, setConcepts] = useState(log.conceptsLearned || ['', '', '']);
  const [struggles, setStruggles] = useState(log.struggles || '');
  const [hrs, setHrs] = useState(log.hours || 0);
  const [energy, setEnergy] = useState(log.energy || 5);
  const [confidence, setConfidence] = useState(log.confidence || 5);
  const [tmrw, setTmrw] = useState(log.tomorrowPlan || { morning: '', afternoon: '' });

  useEffect(() => {
    setProbs(log.problemsSolved || { easy: 0, medium: 0, hard: 0 });
    setConcepts(log.conceptsLearned || ['', '', '']);
    setStruggles(log.struggles || '');
    setHrs(log.hours || 0);
    setEnergy(log.energy || 5);
    setConfidence(log.confidence || 5);
    setTmrw(log.tomorrowPlan || { morning: '', afternoon: '' });
  }, [log.date]);

  const handleSave = () => {
    updateDailyLog({ 
      problemsSolved: probs, 
      conceptsLearned: concepts, 
      struggles, 
      hours: hrs,
      energy,
      confidence,
      tomorrowPlan: tmrw
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const CHECKBOX_GROUPS = [
    {
      title: 'Morning Block (2.5-3h)',
      items: [
        { id: 'm_watched', label: 'Theory Deep-Dive', detail: 'Watched/Read Concept' },
        { id: 'm_notes', label: 'Synthesized Data', detail: 'Made Notes/Flashcards' },
        { id: 'm_understood', label: 'Logical Lock', detail: 'Understood Topic Fully' },
      ]
    },
    {
      title: 'Afternoon Block (2-2.5h)',
      items: [
        { id: 'a_solved', label: 'Neutralized Targets', detail: 'Solved 3-4 Problems' },
        { id: 'a_submit', label: 'Uplink Established', detail: 'Submitted on Platform' },
        { id: 'a_review', label: 'Solution Extraction', detail: 'Reviewed Hard Cases' },
      ]
    },
    {
      title: 'Evening Review (30-60m)',
      items: [
        { id: 'e_noted', label: 'Intelligence Log', detail: 'Noted Key Learnings' },
        { id: 'e_progress', label: 'Telemetry Update', detail: 'Sync Progress Tracker' },
        { id: 'e_plan', label: 'Next-Day Intent', detail: 'Planned Next Topics' },
      ]
    }
  ];

  const totalTasks = CHECKBOX_GROUPS.reduce((acc, g) => acc + g.items.length, 0);
  const doneCount = log.completedHabits.length;
  const pct = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
         <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Efficiency Rating</p>
            <div className="flex items-center gap-3">
               <div className="h-1.5 w-48 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }} 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                  />
               </div>
               <span className="text-xs font-black text-primary tabular-nums">{pct}%</span>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Operational Sync</p>
            <p className="text-xs font-black text-foreground uppercase tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHECKBOX_GROUPS.map((group, gi) => (
          <div key={gi} className="space-y-3">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70 mb-4 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" /> {group.title}
            </h4>
            <div className="flex flex-col gap-2">
              {group.items.map((item) => {
                const isChecked = log.completedHabits.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleHabit(item.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all group ${
                      isChecked 
                        ? 'bg-primary/5 border-primary/20 text-foreground' 
                        : 'bg-muted/10 border-border/10 hover:border-muted-foreground/30 text-muted-foreground'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isChecked ? 'bg-primary border-primary text-white scale-110' : 'border-muted-foreground/20'
                    }`}>
                      {isChecked && <CheckSquare className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-black tracking-tight leading-tight mb-0.5">{item.label}</p>
                      <p className="text-[9px] font-bold opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-muted/5 rounded-3xl p-6 border border-border/10">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                   <Target className="w-3.5 h-3.5 text-primary" /> Target Neutralization
                 </h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 {(['easy', 'medium', 'hard'] as const).map(diff => (
                   <div key={diff} className="flex flex-col items-center bg-card/40 rounded-2xl p-4 border border-border/5 group hover:border-primary/20 transition-all">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">{diff}</span>
                      <div className="flex items-center justify-between w-full">
                        <button onClick={() => setProbs(p => ({ ...p, [diff]: Math.max(0, p[diff] - 1) }))} className="w-6 h-6 rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground hover:bg-muted-foreground/20"><Minus className="w-2.5 h-2.5"/></button>
                        <span className="text-xl font-black text-foreground">{probs[diff]}</span>
                        <button onClick={() => setProbs(p => ({ ...p, [diff]: p[diff] + 1 }))} className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white"><Plus className="w-2.5 h-2.5"/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/5 rounded-3xl p-6 border border-border/10 flex flex-col justify-between group hover:border-secondary/30 transition-all">
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Focus Hours</span>
                 <div className="flex items-end justify-between">
                    <Clock className="w-6 h-6 text-secondary mb-1" />
                    <input type="number" step="0.5" value={hrs} onChange={(e) => setHrs(Number(e.target.value))} className="w-16 bg-transparent text-right font-black text-secondary text-3xl focus:outline-none" />
                 </div>
              </div>
              <div className="bg-muted/5 rounded-3xl p-6 border border-border/10 flex flex-col justify-between group hover:border-primary/30 transition-all">
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Vitals (NRG/CON)</span>
                 <div className="flex gap-3 items-center justify-end">
                    <div className="flex flex-col items-center">
                       <button onClick={() => setEnergy(e => (e % 10) + 1)} className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 font-black text-xs border border-rose-500/20">{energy}</button>
                    </div>
                    <div className="flex flex-col items-center">
                       <button onClick={() => setConfidence(c => (c % 10) + 1)} className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-black text-xs border border-primary/20">{confidence}</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
           <div className="bg-muted/5 rounded-3xl p-6 border border-border/10 h-full flex flex-col relative overflow-hidden">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-3">
                <PenTool className="w-3.5 h-3.5 text-secondary" /> Extraction Log
              </h4>
              
              <div className="space-y-4 flex-1">
                 <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2 ml-1">Insights</label>
                    <div className="space-y-1.5">
                       {concepts.map((c, i) => (
                          <input 
                            key={i} type="text" value={c}
                            onChange={(e) => {
                               const n = [...concepts];
                               n[i] = e.target.value;
                               setConcepts(n);
                            }}
                            placeholder={`Concept ${i+1}`}
                            className="w-full bg-card/60 border border-border/10 rounded-lg px-3 py-2 text-foreground text-xs focus:outline-none focus:border-secondary/40 font-medium placeholder:opacity-20"
                          />
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2 ml-1">Plan</label>
                    <div className="grid grid-cols-2 gap-2">
                       <input 
                         type="text" value={tmrw.morning} 
                         onChange={(e) => setTmrw(t => ({ ...t, morning: e.target.value }))}
                         placeholder="AM Plan"
                         className="bg-card/60 border border-border/10 rounded-lg px-3 py-2 text-foreground text-xs focus:outline-none border-primary/20 font-medium placeholder:opacity-20"
                       />
                       <input 
                         type="text" value={tmrw.afternoon} 
                         onChange={(e) => setTmrw(t => ({ ...t, afternoon: e.target.value }))}
                         placeholder="PM Plan"
                         className="bg-card/60 border border-border/10 rounded-lg px-3 py-2 text-foreground text-xs focus:outline-none border-primary/20 font-medium placeholder:opacity-20"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2 ml-1">Struggles</label>
                    <textarea 
                       value={struggles} onChange={(e) => setStruggles(e.target.value)} 
                       className="w-full h-20 bg-card/60 border border-border/10 rounded-xl px-3 py-2 text-foreground text-xs focus:outline-none focus:border-secondary/40 resize-none font-medium placeholder:opacity-20"
                       placeholder="..."
                    />
                 </div>
              </div>

              <div className="pt-6">
                 <button
                   onClick={handleSave}
                   className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-4 ${
                     saved ? 'bg-secondary/20 text-secondary border border-secondary/40' : 'bg-primary text-foreground shadow-lg hover:scale-[1.02] active:scale-95'
                   }`}
                 >
                   {saved ? <><ShieldCheck className="w-4 h-4" /> SECURED</> : <><Save className="w-4 h-4" /> COMMIT SESSION</>}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ── Quote Card ────────────────────────────────────────────────────────────────

function QuoteCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((p) => (p + 1) % QUOTES.length), 10000);
    return () => clearInterval(i);
  }, []);
  const q = QUOTES[idx];
  return (
    <div className="flex flex-col justify-center h-full gap-6 relative overflow-hidden group p-2">
      <div className="absolute top-0 left-0 w-16 h-16 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      <Zap className="w-8 h-8 text-primary relative z-10 mb-2" />
      <AnimatePresence mode="wait">
        <motion.div
           key={idx}
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           transition={{ duration: 0.5 }}
           className="relative z-10"
        >
          <p className="text-xl font-black leading-tight text-foreground tracking-tight">&ldquo;{q.text}&rdquo;</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4">— Oracle Protocol {idx + 1} / {q.author}</p>
        </motion.div>
      </AnimatePresence>
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
  const log = state.dailyLogs.find(l => l.date === today()) || { energy: 5, confidence: 5 };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.05),transparent_50%)] pointer-events-none" />
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-6 relative z-10"
      >
        
        {/* ROW 1: Hero & Quick Stats */}
        <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 py-2">
             <div className="md:col-span-3">
                <h2 className="text-3xl font-black text-foreground mb-3 leading-none tracking-tight">TACTICAL OVERVIEW</h2>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed opacity-80">
                  Platform operational. Currently in <span className="text-primary font-black">Week {currentWeek}</span> of the 12-week Placement Cycle. 
                  System deployment is <span className="text-primary font-black">{progressPct}% effective</span> against regional benchmarks.
                </p>
             </div>
             <div className="md:col-span-2 flex items-center justify-end gap-10 border-l border-border/10 pl-10">
                <div className="text-center group">
                   <p className="text-4xl font-black text-foreground mb-1 group-hover:text-primary transition-colors tabular-nums">{streak}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-[10px] decoration-primary/30 decoration-4">Day Streak</p>
                </div>
                <div className="text-center group">
                   <p className="text-4xl font-black text-foreground mb-1 group-hover:text-secondary transition-colors tabular-nums">{totalDone}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-[10px] decoration-secondary/30 decoration-4">Nodes Mastered</p>
                </div>
             </div>
          </div>
        </BentoCard>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <StreakGuard />
          <BentoCard className="flex-1" title="Protocol Focus" icon={Target}>
             <QuoteCard />
          </BentoCard>
        </div>

        {/* ROW 2: The Core Checklist */}
        <BentoCard className="col-span-12 lg:col-span-9" title="Accountability Log" icon={CheckCheck}>
          <DailyTaskChecklist />
        </BentoCard>

        {/* ROW 2 RIGHT: Biometric Vitals */}
        <div className="col-span-12 lg:col-span-3">
           <BentoCard className="h-full" title="Biometric Monitor" icon={Activity}>
              <BiometricMonitor log={log} totalHours={totalHours} />
           </BentoCard>
        </div>

        {/* ROW 3: Consistency */}
        <BentoCard className="col-span-12" title="Mission Consistency" icon={BarChart3} badge="Technical activity logs over the last 140 operational cycles">
          <div className="py-2">
             <Heatmap dailyLogs={state.dailyLogs} />
          </div>
        </BentoCard>

      </motion.div>
    </div>
  );
}

