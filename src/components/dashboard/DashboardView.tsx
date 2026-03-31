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

// ── Biometric Monitor components ─────────────────────────────────────────────

function HeartbeatVisual({ value }: { value: number }) {
  const pulseScale = 1 + (value / 10) * 0.2;
  return (
    <div className="relative w-full h-16 flex items-center justify-center overflow-hidden bg-muted/10 rounded-2xl border border-border/5 group">
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30">
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      <motion.div
        animate={{ 
          scale: [1, pulseScale, 1],
          opacity: [0.4, 0.8, 0.4] 
        }}
        transition={{ 
          duration: Math.max(0.4, 1.5 - (value / 10)), 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10"
      >
        <Heart className="w-8 h-8 text-amber-500 fill-amber-500/20" />
      </motion.div>
      
      <div className="absolute bottom-2 right-4 flex items-baseline gap-1">
        <span className="text-xs font-black text-amber-500">{value}</span>
        <span className="text-[8px] font-bold text-muted-foreground tracking-widest uppercase">NRG</span>
      </div>
    </div>
  );
}

function ConfidenceGauge({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Confidence Scale</span>
        <span className="text-sm font-black text-primary">{value * 10}%</span>
      </div>
      <div className="h-6 w-full bg-muted/20 rounded-lg p-1 flex gap-1 border border-border/5">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: i < value ? 1 : 0.1,
              backgroundColor: i < value ? 'var(--neon-indigo)' : 'currentColor'
            }}
            className={`flex-1 rounded-sm transition-colors ${i < value ? 'bg-primary neon-glow-indigo' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    </div>
  );
}

function TimeMatrix({ hours }: { hours: number }) {
  return (
    <div className="bg-muted/10 rounded-2xl p-4 border border-border/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-3 h-3 text-secondary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Focus Matrix</span>
        </div>
        <span className="text-xs font-black tabular-nums">{hours.toFixed(1)}h</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i < Math.floor(hours) ? 'bg-secondary' : 'bg-muted/30'}`} />
        ))}
      </div>
    </div>
  );
}

function BiometricMonitor({ log, totalHours }: { log: any; totalHours: number }) {
  return (
    <div className="flex flex-col gap-6 h-full py-2">
      <HeartbeatVisual value={log.energy} />
      <ConfidenceGauge value={log.confidence} />
      <div className="mt-auto">
        <TimeMatrix hours={totalHours} />
      </div>
    </div>
  );
}

// ── Bento Card ─────────────────────────────────────────────────────────────

function BentoCard({ children, className = '', title = '', icon: Icon, badge = '' }: { children: React.ReactNode; className?: string; title?: string; icon?: any; badge?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`bento-card p-6 flex flex-col ${className}`}
    >
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-obsidian-surface-highest/30 rounded-xl flex items-center justify-center border border-obsidian-surface-highest/20">
                <Icon className="w-5 h-5 text-neon-indigo-tint" />
              </div>
            )}
            <div>
              <h3 className="text-slate-200 font-black text-sm uppercase tracking-widest">{title}</h3>
              {badge && <p className="text-slate-600 text-[10px] font-bold">{badge}</p>}
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
  if (count === 0) return 'bg-obsidian-surface-highest/10 border-obsidian-surface-highest/5';
  if (count === 1) return 'bg-neon-indigo/20 border-neon-indigo/20 text-neon-indigo-tint';
  if (count === 2) return 'bg-neon-indigo/40 border-neon-indigo/30';
  if (count === 3) return 'bg-neon-indigo/60 border-neon-indigo/40';
  return 'bg-neon-indigo border-neon-indigo-tint/50 neon-glow-indigo';
}

function Heatmap({ dailyLogs }: { dailyLogs: { date: string; completedHabits: string[] }[] }) {
  const DAYS = 140; // 20 weeks
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
      <div className="flex flex-1 justify-between gap-1 w-full overflow-hidden">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5 flex-1">
            {week.map((c, di) => (
              <div
                key={di}
                className={`w-full aspect-square rounded-[3px] border transit hover:scale-150 z-10 ${getHeatColor(c.count)}`}
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
    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
      status === 'Protected' ? 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan-tint' : 'bg-neon-indigo/5 border-neon-indigo/20 text-neon-indigo-tint'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${status === 'Protected' ? 'bg-neon-cyan/20 neon-glow-cyan' : 'bg-neon-indigo/20'}`}>
          {status === 'Protected' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5 animate-pulse" />}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status</p>
          <p className="text-sm font-black">{status === 'Protected' ? 'STREAK SECURED' : 'STREAK AT RISK'}</p>
        </div>
      </div>
      {status === 'At Risk' && (
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Resets In</p>
          <p className="text-xs font-black tabular-nums">{timeLeft}</p>
        </div>
      )}
    </div>
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
    <div className="space-y-10">
      <div className="flex items-center justify-between px-2">
         <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Mission Persistence</p>
            <div className="flex items-center gap-3">
               <div className="h-2 w-48 bg-obsidian-surface-highest/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }} 
                    className="h-full bg-neon-indigo shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  />
               </div>
               <span className="text-xs font-black text-neon-indigo tabular-nums">{pct}%</span>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Active Window</p>
            <p className="text-xs font-black text-white uppercase">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {CHECKBOX_SYSTEM.map((t) => {
          const isChecked = log.completedHabits.includes(t.id);
          const Icon = t.icon;
          return (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleHabit(t.id)}
              className={`p-5 rounded-3xl border text-left flex flex-col gap-4 transition-all relative overflow-hidden group ${
                isChecked ? 'bg-neon-indigo/10 border-neon-indigo/30' : 'bg-obsidian-surface-high/20 border-obsidian-surface-highest/10 hover:border-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                 isChecked ? 'bg-neon-indigo/20 text-neon-indigo-tint neon-glow-indigo' : 'bg-obsidian-surface-highest/20 text-slate-600'
              }`}>
                 <Icon className="w-5 h-5" />
              </div>
              <div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block mb-1">{t.block}</span>
                 <span className={`text-[13px] font-black leading-tight ${isChecked ? 'text-slate-100' : 'text-slate-400'}`}>{t.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
           <div className="bg-obsidian-surface-high/20 rounded-[32px] p-8 border border-obsidian-surface-highest/10">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                   <Target className="w-4 h-4 text-neon-purple" /> Target Neutralization
                 </h4>
                 <div className="text-[10px] font-black text-neon-purple uppercase bg-neon-purple/10 px-3 py-1 rounded-full border border-neon-purple/20">DSA Core</div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                 {(['easy', 'medium', 'hard'] as const).map(diff => (
                   <div key={diff} className="flex flex-col items-center bg-obsidian-surface-high/30 rounded-2xl p-4 border border-obsidian-surface-highest/5 group hover:border-neon-indigo/20 transition-all">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-4 group-hover:text-slate-400 transition-colors">{diff}</span>
                      <div className="flex items-center justify-between w-full px-2">
                        <button onClick={() => setProbs(p => {
                          const prev = p || { easy: 0, medium: 0, hard: 0 };
                          return { ...prev, [diff]: Math.max(0, prev[diff] - 1) };
                        })} className="w-6 h-6 rounded-lg bg-obsidian-surface-highest/20 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Minus className="w-3 h-3"/></button>
                        <span className="text-2xl font-black text-white tabular-nums">{(probs?.[diff] || 0)}</span>
                        <button onClick={() => setProbs(p => {
                          const prev = p || { easy: 0, medium: 0, hard: 0 };
                          return { ...prev, [diff]: prev[diff] + 1 };
                        })} className="w-6 h-6 rounded-lg bg-obsidian-surface-highest/20 flex items-center justify-center text-slate-500 hover:text-white transition-all"><Plus className="w-3 h-3"/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-obsidian-surface-high/20 rounded-[32px] p-6 border border-obsidian-surface-highest/10 flex flex-col justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Focus Hours</span>
                 <div className="flex items-end justify-between">
                    <Clock className="w-5 h-5 text-neon-cyan mb-1.5" />
                    <input type="number" step="0.5" value={hrs} onChange={(e) => setHrs(Number(e.target.value))} className="w-20 bg-transparent text-right font-black text-neon-cyan text-4xl focus:outline-none tabular-nums" />
                 </div>
              </div>
              <div className="bg-obsidian-surface-high/20 rounded-[32px] p-6 border border-obsidian-surface-highest/10 flex flex-col justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Vibe Check</span>
                 <div className="flex gap-4 items-center justify-end">
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-bold text-slate-600 mb-1">NRG</span>
                       <button onClick={() => setEnergy(e => Math.min(10, e + 1))} className={`w-8 h-8 rounded-lg font-black text-xs ${energy > 7 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>{energy}</button>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-bold text-slate-600 mb-1">CON</span>
                       <button onClick={() => setConfidence(c => Math.min(10, c + 1))} className={`w-8 h-8 rounded-lg font-black text-xs ${confidence > 7 ? 'bg-neon-indigo/20 text-neon-indigo-tint' : 'bg-slate-800 text-slate-500'}`}>{confidence}</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-obsidian-surface-high/20 rounded-[32px] p-8 border border-obsidian-surface-highest/10 h-full flex flex-col">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-3">
                <PenTool className="w-4 h-4 text-neon-cyan" /> Intelligence Report
              </h4>
              <div className="space-y-4 flex-1">
                 <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block mb-2 ml-1">Key Technical Insights</label>
                    <div className="space-y-2">
                       {(concepts || []).map((c, i) => (
                          <input 
                            key={i} type="text" value={c}
                            onChange={(e) => {
                               const n = [...(concepts || ['', '', ''])];
                               n[i] = e.target.value;
                               setConcepts(n);
                            }}
                            placeholder={`Insight ${i+1}...`}
                            className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/5 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-neon-indigo/30 transition-all font-medium"
                          />
                       ))}
                    </div>
                 </div>
                 <div className="flex-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block mb-2 ml-1">Daily Reflection / Blockers</label>
                    <textarea 
                       value={struggles} onChange={(e) => setStruggles(e.target.value)} 
                       className="w-full h-24 bg-obsidian-surface-high/30 border border-obsidian-surface-highest/5 rounded-2xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-neon-indigo/30 transition-all resize-none font-medium"
                       placeholder="What system failures did we encounter today?"
                    />
                 </div>
              </div>

              <div className="pt-6">
                 <button
                   onClick={handleSave}
                   className={`w-full h-[74px] rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-4 ${
                     saved ? 'bg-neon-cyan/20 text-neon-cyan-tint border border-neon-cyan/40 neon-glow-cyan' : 'bg-neon-indigo text-white shadow-2xl shadow-neon-indigo/40 hover:scale-[1.02] active:scale-95'
                   }`}
                 >
                   {saved ? <><CheckCircle2 className="w-4 h-4" /> Logged</> : <><Save className="w-4 h-4" /> Save Record</>}
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
    <div className="flex flex-col justify-center h-full gap-4 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-8 h-8 bg-neon-indigo/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
      <Zap className="w-6 h-6 text-neon-indigo relative z-10" />
      <p className="text-lg font-medium leading-tight text-white italic relative z-10">&ldquo;{q.text}&rdquo;</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 relative z-10">— {q.author}</p>
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
    <div className="grid grid-cols-12 gap-6">
      
      {/* ROW 1: Hero & Quick Stats */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
           <div className="max-w-sm">
              <h2 className="text-3xl font-black text-white mb-2 leading-none whitespace-nowrap">MISSION COMMAND</h2>
              <p className="text-slate-500 text-sm font-medium">You are in <span className="text-neon-indigo font-bold">Week {currentWeek}</span> of the 12-week Placement Sprint. Your progress is current at {progressPct}% total completion.</p>
           </div>
           <div className="flex gap-10">
              <div className="text-center group">
                 <p className="text-4xl font-black text-white mb-1 group-hover:text-neon-indigo transition-colors">{streak}</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 underline underline-offset-4 decoration-neon-indigo/30 decoration-2">Day Streak</p>
              </div>
              <div className="text-center group">
                 <p className="text-4xl font-black text-white mb-1 group-hover:text-neon-cyan transition-colors">{totalDone}</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 underline underline-offset-4 decoration-neon-cyan/30 decoration-2">DSA Solved</p>
              </div>
           </div>
        </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Streak Status">
        <StreakGuard />
      </BentoCard>

      {/* ROW 2: The Core Checklist */}
      <BentoCard className="col-span-12 lg:col-span-9" title="Daily Accountability Log" icon={CheckCheck}>
        <DailyTaskChecklist />
      </BentoCard>

      {/* ROW 2 RIGHT: Biometric Vitals */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
         <BentoCard className="flex-1" title="Vitals Monitor" icon={Activity}>
            <BiometricMonitor log={log} totalHours={totalHours} />
         </BentoCard>
      </div>

      {/* ROW 3: Consistency & Quotes */}
      <BentoCard className="col-span-12 lg:col-span-8" title="12-Week Consistency Graph" icon={BarChart3} badge="Last 140 days of technical activity">
        <div className="py-2">
           <Heatmap dailyLogs={state.dailyLogs} />
        </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4 bg-neon-indigo/5">
        <QuoteCard />
      </BentoCard>

    </div>
  );
}
