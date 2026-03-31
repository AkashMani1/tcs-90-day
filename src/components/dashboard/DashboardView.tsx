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
    <div className="flex flex-col gap-8 h-full py-2">
      <HeartbeatVisual value={log.energy} />
      <ConfidenceGauge value={log.confidence} />
      <div className="mt-auto">
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-12 h-12 bg-muted/40 rounded-2xl flex items-center justify-center border border-border/10 group-hover:border-primary/30 transition-all group-hover:scale-110">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="text-foreground font-black text-sm uppercase tracking-widest leading-none mb-1.5">{title}</h3>
              {badge && <p className="text-muted-foreground text-[10px] font-bold tracking-tight">{badge}</p>}
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
    const key = d.toISOString().split('T')[0];
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

  useEffect(() => {
    setProbs(log.problemsSolved || { easy: 0, medium: 0, hard: 0 });
    setConcepts(log.conceptsLearned || ['', '', '']);
    setStruggles(log.struggles || '');
    setHrs(log.hours || 0);
    setEnergy(log.energy || 5);
    setConfidence(log.confidence || 5);
  }, [log.date]);

  const handleSave = () => {
    updateDailyLog({ 
      problemsSolved: probs, 
      conceptsLearned: concepts, 
      struggles, 
      hours: hrs,
      energy,
      confidence
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const CHECKBOX_SYSTEM = [
     { id: 'm_theory', label: 'Theory Deep-Dive', block: 'Morning', icon: BookOpen },
     { id: 'a_solve', label: 'Kill List Targets', block: 'Afternoon', icon: Target },
     { id: 'e_review', label: 'Nightly Extraction', block: 'Evening', icon: ShieldCheck },
     { id: 'aptitude', label: 'Aptitude Lab', block: 'Core', icon: Activity },
     { id: 'revise', label: 'System Recovery', block: 'Night', icon: Zap }
  ];

  const doneCount = log.completedHabits.length;
  const pct = Math.round((doneCount / CHECKBOX_SYSTEM.length) * 100);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between px-2">
         <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Mission Persistence</p>
            <div className="flex items-center gap-4">
               <div className="h-2.5 w-64 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }} 
                    className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                  />
               </div>
               <span className="text-sm font-black text-primary tabular-nums">{pct}%</span>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Active Window</p>
            <p className="text-sm font-black text-foreground uppercase tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {CHECKBOX_SYSTEM.map((t) => {
          const isChecked = log.completedHabits.includes(t.id);
          const Icon = t.icon;
          return (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleHabit(t.id)}
              className={`p-6 rounded-[32px] border text-left flex flex-col gap-5 transition-all relative overflow-hidden group ${
                isChecked ? 'bg-primary/10 border-primary/30' : 'bg-muted/10 border-border/10 hover:border-muted-foreground/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                 isChecked ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]' : 'bg-muted/30 text-muted-foreground'
              }`}>
                 <Icon className="w-6 h-6" />
              </div>
              <div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">{t.block}</span>
                 <span className={`text-[15px] font-black leading-tight tracking-tight ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>{t.label}</span>
              </div>
              {isChecked && (
                <motion.div 
                  layoutId={t.id}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-10">
           <div className="bg-muted/5 rounded-[40px] p-8 border border-border/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                   <Target className="w-4 h-4 text-primary" /> Target Neutralization
                 </h4>
                 <div className="text-[10px] font-black text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">DSA Core Protocol</div>
              </div>
              <div className="grid grid-cols-3 gap-8 relative z-10">
                 {(['easy', 'medium', 'hard'] as const).map(diff => (
                   <div key={diff} className="flex flex-col items-center bg-card/40 rounded-3xl p-6 border border-border/5 group hover:border-primary/20 transition-all shadow-lg hover:shadow-primary/5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 group-hover:text-primary transition-colors">{diff}</span>
                      <div className="flex items-center justify-between w-full px-2">
                        <button onClick={() => setProbs(p => {
                          const prev = p || { easy: 0, medium: 0, hard: 0 };
                          return { ...prev, [diff]: Math.max(0, prev[diff] - 1) };
                        })} className="w-8 h-8 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"><Minus className="w-4 h-4"/></button>
                        <span className="text-3xl font-black text-foreground tabular-nums">{(probs?.[diff] || 0)}</span>
                        <button onClick={() => setProbs(p => {
                          const prev = p || { easy: 0, medium: 0, hard: 0 };
                          return { ...prev, [diff]: prev[diff] + 1 };
                        })} className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"><Plus className="w-4 h-4"/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="bg-muted/5 rounded-[40px] p-8 border border-border/10 flex flex-col justify-between group hover:border-secondary/30 transition-all">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Focus Hours Recorded</span>
                 <div className="flex items-end justify-between">
                    <Clock className="w-8 h-8 text-secondary mb-2" />
                    <input type="number" step="0.5" value={hrs} onChange={(e) => setHrs(Number(e.target.value))} className="w-24 bg-transparent text-right font-black text-secondary text-5xl focus:outline-none tabular-nums" />
                 </div>
              </div>
              <div className="bg-muted/5 rounded-[40px] p-8 border border-border/10 flex flex-col justify-between group hover:border-primary/30 transition-all">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Physiology Snapshot</span>
                 <div className="flex gap-6 items-center justify-end">
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-black text-muted-foreground mb-2">NRG</span>
                       <button onClick={() => setEnergy(e => Math.min(10, e + 1))} className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${energy > 7 ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-muted/40 text-muted-foreground'}`}>{energy}</button>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-black text-muted-foreground mb-2">CON</span>
                       <button onClick={() => setConfidence(c => Math.min(10, c + 1))} className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${confidence > 7 ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted/40 text-muted-foreground'}`}>{confidence}</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
           <div className="bg-muted/5 rounded-[40px] p-8 border border-border/10 h-full flex flex-col relative overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-secondary/5 to-transparent pointer-events-none" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-3 relative z-10">
                <PenTool className="w-4 h-4 text-secondary" /> Tactical Extraction
              </h4>
              <div className="space-y-6 flex-1 relative z-10">
                 <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-3 ml-1">Critical Intelligence Gathered</label>
                    <div className="space-y-3">
                       {(concepts || []).map((c, i) => (
                          <input 
                            key={i} type="text" value={c}
                            onChange={(e) => {
                               const n = [...(concepts || ['', '', ''])];
                               n[i] = e.target.value;
                               setConcepts(n);
                            }}
                            placeholder={`Intelligence Node ${i+1}...`}
                            className="w-full bg-card/60 border border-border/10 rounded-2xl px-5 py-4 text-foreground text-sm focus:outline-none focus:border-secondary/40 transition-all font-medium placeholder:opacity-30"
                          />
                       ))}
                    </div>
                 </div>
                 <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-3 ml-1">Blockers & System Failures</label>
                    <textarea 
                       value={struggles} onChange={(e) => setStruggles(e.target.value)} 
                       className="w-full h-32 bg-card/60 border border-border/10 rounded-[28px] px-5 py-4 text-foreground text-sm focus:outline-none focus:border-secondary/40 transition-all resize-none font-medium placeholder:opacity-30"
                       placeholder="Log any system inhibitors or technical debt encountered..."
                    />
                 </div>
              </div>

              <div className="pt-8 relative z-10">
                 <button
                   onClick={handleSave}
                   className={`w-full py-6 rounded-[28px] font-black uppercase tracking-[0.4em] text-[11px] transition-all flex items-center justify-center gap-4 ${
                     saved ? 'bg-secondary/20 text-secondary border border-secondary/40 shadow-[0_0_20px_rgba(var(--secondary-rgb),0.2)]' : 'bg-primary text-foreground shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95'
                   }`}
                 >
                   {saved ? <><ShieldCheck className="w-4 h-4" /> SECURED</> : <><Save className="w-4 h-4" /> COMMIT DATA</>}
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-8"
    >
      
      {/* ROW 1: Hero & Quick Stats */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 py-4">
           <div className="max-w-md">
              <h2 className="text-4xl font-black text-foreground mb-4 leading-none tracking-tight">TACTICAL OVERVIEW</h2>
              <p className="text-muted-foreground text-md font-medium leading-relaxed">
                Platform operational. Currently in <span className="text-primary font-black">Week {currentWeek}</span> of the 12-week Placement Cycle. 
                System deployment is <span className="text-primary font-black">{progressPct}% effective</span> against regional benchmarks.
              </p>
           </div>
           <div className="flex gap-12">
              <div className="text-center group">
                 <p className="text-5xl font-black text-foreground mb-2 group-hover:text-primary transition-colors tabular-nums">{streak}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-[12px] decoration-primary/30 decoration-4">Day Streak</p>
              </div>
              <div className="text-center group">
                 <p className="text-5xl font-black text-foreground mb-2 group-hover:text-secondary transition-colors tabular-nums">{totalDone}</p>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-[12px] decoration-secondary/30 decoration-4">Nodes Mastered</p>
              </div>
           </div>
        </div>
      </BentoCard>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
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
        <div className="py-6">
           <Heatmap dailyLogs={state.dailyLogs} />
        </div>
      </BentoCard>

    </motion.div>
  );
}
