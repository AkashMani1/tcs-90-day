'use client';

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Clock, TrendingUp, CalendarDays, CheckCircle2, Circle, 
  Save, CheckCheck, Activity, ShieldCheck, AlertTriangle, 
  Plus, Minus, CheckSquare, Square, BookOpen, PenTool, Lightbulb, 
  Code, UploadCloud, Eye, BookMarked, BarChart3, ListTodo, Target,
  Heart, Zap, Shield, Timer, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcTotalHours, calcCurrentWeek, today, toDateStr, getStreakStatus, getHoursUntilMidnight } from '@/lib/utils';
import { DEFAULT_HABIT_GROUPS } from '@/lib/defaultData';

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
  "CONSISTENCY EXECUTED OVER TIME IS THE ULTIMATE ADVANTAGE.",
  "EVERY DSA PROBLEM SOLVED IS A STEP CLOSER TO YOUR DREAM OFFER.",
  "PREPARATION ELIMINATES THE ELEMENT OF SURPRISE IN INTERVIEWS.",
  "ELEVATE YOUR SKILLS BY OPTIMIZING YOUR STUDY HABITS EVERY DAY.",
  "THE BEST CANDIDATES ARE THE ONES WHO OUTWORK THEIR OWN UNCERTAINTY.",
  "SUCCESS IN PLACEMENTS IS A PRODUCT OF FOCUSED, DISCIPLINED EFFORT.",
  "DO NOT WAIT FOR MOTIVATION; RELY ON YOUR DAILY SYSTEMS."
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
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Daily Motivation</span>
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

type DashboardDailyLog = {
  date: string;
  completedHabits?: string[];
  problemsSolved?: { easy: number; medium: number; hard: number };
};

function getDailySubmissionCount(log: DashboardDailyLog) {
  const solved = log.problemsSolved;
  const solvedCount = solved ? (solved.easy || 0) + (solved.medium || 0) + (solved.hard || 0) : 0;
  return solvedCount > 0 ? solvedCount : log.completedHabits?.length || 0;
}

function getLeetCodeHeatColor(count: number, isToday: boolean) {
  if (count === 0) return `bg-muted/60 dark:bg-white/5 border-border/40 dark:border-white/5 ${isToday ? 'ring-1 ring-orange-400/35' : ''}`;
  if (count <= 2) return `bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-900/30 ${isToday ? 'ring-1 ring-indigo-400/45' : ''}`;
  if (count <= 4) return `bg-indigo-300 dark:bg-indigo-700/50 border-indigo-300 dark:border-indigo-700/50 ${isToday ? 'ring-1 ring-indigo-400/50' : ''}`;
  if (count <= 7) return `bg-indigo-500 dark:bg-indigo-500/80 border-indigo-500 dark:border-indigo-500/80 ${isToday ? 'ring-1 ring-indigo-400/55' : ''}`;
  return `bg-cyan-400 dark:bg-cyan-400 border-cyan-400 dark:border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.4)] ${isToday ? 'ring-1 ring-white/30' : ''}`;
}

// ── Monthly heatmap builder ────────────────────────────────────────────────────

interface HeatCell {
  date: Date;
  key: string;
  count: number;
  isToday: boolean;
}

interface MonthGroup {
  name: string;    // e.g. "January"
  short: string;   // e.g. "Jan"
  weeks: (HeatCell | null)[][];  // weeks[weekIdx][dow 0=Mon..6=Sun]
}

function buildMonthlyGroups(logs: DashboardDailyLog[], year: number): MonthGroup[] {
  const logMap = new Map(logs.map((log) => [log.date, getDailySubmissionCount(log)]));
  const todayStr = today();

  return Array.from({ length: 12 }, (_, m) => {
    const firstDay   = new Date(year, m, 1);
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    // Mon=0 … Sun=6
    const startDow   = (firstDay.getDay() + 6) % 7;
    const numWeeks   = Math.ceil((startDow + daysInMonth) / 7);

    // weeks[w][d] = HeatCell | null (null = padding)
    const weeks: (HeatCell | null)[][] = Array.from({ length: numWeeks }, () =>
      Array<HeatCell | null>(7).fill(null)
    );

    for (let d = 0; d < daysInMonth; d++) {
      const ci   = startDow + d;
      const w    = Math.floor(ci / 7);
      const dow  = ci % 7;
      const date = new Date(year, m, d + 1);
      const key  = toDateStr(date);
      weeks[w][dow] = {
        date,
        key,
        count: logMap.get(key) ?? 0,
        isToday: key === todayStr,
      };
    }

    return {
      name:  firstDay.toLocaleString('default', { month: 'long' }),
      short: firstDay.toLocaleString('default', { month: 'short' }),
      weeks,
    };
  });
}

function DeploymentLogPanel() {
  const { state } = useApp();
  const dailyLogs = state.dailyLogs as DashboardDailyLog[];
  const currentYear = new Date().getFullYear();

  // ── Free year navigation ──────────────────────────────────────────────────
  const [selectedYear, setSelectedYear] = useState(() => currentYear);
  const canGoNext = selectedYear < currentYear;

  // ── Tooltip via React state + fixed position ───────────────────────────────
  const [tooltip, setTooltip] = useState<{ count: number; date: Date; x: number; y: number } | null>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, cell: HeatCell) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({ count: cell.count, date: cell.date, x: rect.left + rect.width / 2, y: rect.top });
    },
    []
  );
  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  const logsForYear = useMemo(
    () => dailyLogs.filter((log) => new Date(log.date).getFullYear() === selectedYear),
    [dailyLogs, selectedYear]
  );
  const totalSubmissions = useMemo(
    () => logsForYear.reduce((sum, log) => sum + getDailySubmissionCount(log), 0),
    [logsForYear]
  );
  const totalActiveDays = useMemo(
    () => logsForYear.filter((log) => getDailySubmissionCount(log) > 0).length,
    [logsForYear]
  );
  const maxStreak = useMemo(
    () =>
      logsForYear.reduce(
        (acc, log) => {
          const hasActivity = getDailySubmissionCount(log) > 0;
          const current = hasActivity ? acc.current + 1 : 0;
          return { current, best: Math.max(acc.best, current) };
        },
        { current: 0, best: 0 }
      ).best,
    [logsForYear]
  );

  const monthGroups = useMemo(
    () => buildMonthlyGroups(logsForYear, selectedYear),
    [logsForYear, selectedYear]
  );

  return (
    <motion.div variants={itemVariants} className="col-span-12 rounded-[30px] border border-border/30 dark:border-white/10 bg-card dark:bg-[#1b1d22] px-6 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.3)]">

      {/* Header — title, stats, year switcher all in one row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <h3 className="text-[16px] font-black tracking-[-0.03em] text-[#ff7a59]">Activity Log</h3>
            <p className="text-[12px] text-[#ff6c61]">{totalSubmissions} contributions in {selectedYear}</p>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <p>Active days: <span className="font-semibold text-foreground">{totalActiveDays}</span></p>
            <p>Max streak: <span className="font-semibold text-foreground">{maxStreak}</span></p>
          </div>
        </div>

        {/* Year switcher — top right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => startTransition(() => setSelectedYear((y) => y - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-border/30 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-border/60 dark:hover:border-white/25 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="rounded-full border border-[#6b3b34] bg-[#2a2220] px-3 py-1 text-[13px] font-black tracking-[0.04em] text-[#ff7a59]">
            {selectedYear}
          </div>
          <button
            onClick={() => canGoNext && startTransition(() => setSelectedYear((y) => y + 1))}
            disabled={!canGoNext}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-border/30 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-border/60 dark:hover:border-white/25 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly heatmap grid */}
      <div className="mt-3 overflow-x-auto" style={{ overflowY: 'visible' }}>
        <div className="flex w-full justify-between gap-1">
          {monthGroups.map((month) => (
            <div key={month.name} className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-muted-foreground mb-0.5 tracking-wide">{month.name}</span>
              <div className="flex gap-[3px]">
                {month.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((cell, di) =>
                      cell ? (
                        <motion.div
                          key={cell.key}
                          whileHover={{ scale: 1.4, zIndex: 20 }}
                          onMouseEnter={(e) => handleMouseEnter(e, cell)}
                          onMouseLeave={handleMouseLeave}
                          className={`h-[13px] w-[13px] rounded-[2px] border cursor-default transition-all duration-150 ${getLeetCodeHeatColor(cell.count, cell.isToday)}`}
                        />
                      ) : (
                        <div key={`pad-${wi}-${di}`} className="h-[13px] w-[13px]" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed-position tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[999] whitespace-nowrap rounded-xl border border-border/20 bg-card px-3 py-2 text-[11px] text-foreground shadow-2xl"
          style={{
            left: Math.min(
              Math.max(tooltip.x, 80),
              typeof window !== 'undefined' ? window.innerWidth - 160 : tooltip.x
            ),
            top: tooltip.y - 48,
            transform: 'translateX(-50%)',
          }}
        >
          <span className="font-bold">{tooltip.count} submissions</span>
          <span className="mx-2 text-muted-foreground/50">|</span>
          <span className="text-muted-foreground">
            {tooltip.date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      )}
    </motion.div>
  );
}


function DSASheetProgressCard() {
  const { state } = useApp();
  const items = (state.dsaSheetItems || []).filter((item) => !item.hidden);
  const total = items.length;
  const solved = items.filter((item) => item.completed).length;
  const easyTotal = items.filter((item) => item.difficulty === 'Easy').length;
  const mediumTotal = items.filter((item) => item.difficulty === 'Medium').length;
  const hardTotal = items.filter((item) => item.difficulty === 'Hard').length;
  const easySolved = items.filter((item) => item.difficulty === 'Easy' && item.completed).length;
  const mediumSolved = items.filter((item) => item.difficulty === 'Medium' && item.completed).length;
  const hardSolved = items.filter((item) => item.difficulty === 'Hard' && item.completed).length;

  const SVG = 140;
  const cx = SVG / 2;
  const cy = SVG / 2;

  const diffRows = [
    { label: 'Easy',   color: '#36b4b8', solved: easySolved,   total: easyTotal   },
    { label: 'Medium', color: '#c7992d', solved: mediumSolved, total: mediumTotal },
    { label: 'Hard',   color: '#c44343', solved: hardSolved,   total: hardTotal   },
  ];

  // Ring radii and stroke – outer→Easy, middle→Medium, inner→Hard
  const ringDefs = [
    { r: 60, sw: 8, color: '#36b4b8', solved: easySolved,   total: easyTotal   },
    { r: 44, sw: 8, color: '#c7992d', solved: mediumSolved, total: mediumTotal },
    { r: 28, sw: 8, color: '#c44343', solved: hardSolved,   total: hardTotal   },
  ];

  return (
    <BentoCard className="col-span-12 lg:col-span-5 overflow-hidden relative !p-0">
      <div className="px-6 pt-4 pb-4 h-full flex flex-col gap-3">

        {/* Title */}
        <h3 className="text-[17px] font-black text-[#ff7a59] leading-none">DSA Sheet Progress</h3>

        {/* Rings + Bars row */}
        <div className="flex items-center gap-4 flex-1">

          {/* ── Concentric Rings ── */}
          <div className="relative shrink-0" style={{ width: SVG, height: SVG }}>
            <svg width={SVG} height={SVG} className="-rotate-90" style={{ overflow: 'visible' }}>
              {ringDefs.map((ring) => {
                const circ = 2 * Math.PI * ring.r;
                const prog = ring.total > 0 ? ring.solved / ring.total : 0;
                return (
                  <g key={ring.r}>
                    {/* Track */}
                    <circle
                      cx={cx} cy={cy} r={ring.r}
                      fill="none"
                      stroke="rgba(128,128,128,0.15)"
                      strokeWidth={ring.sw}
                      strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    <circle
                      cx={cx} cy={cy} r={ring.r}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth={ring.sw}
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - prog)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <p className="leading-none">
                <span className="text-[20px] font-black text-foreground">{solved}</span>
                <span className="text-[13px] font-bold text-muted-foreground">/{total}</span>
              </p>
              <p className="text-[10px] font-semibold text-muted-foreground mt-1">Solved</p>
            </div>
          </div>

          {/* ── Progress Bars ── */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            {diffRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-[15px] font-semibold text-foreground w-[58px] shrink-0">{row.label}</span>
                <div className="flex-1 h-[10px] rounded-full overflow-hidden bg-muted/50">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${row.total > 0 ? (row.solved / row.total) * 100 : 0}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
                <span className="text-[15px] font-semibold text-foreground w-[58px] shrink-0 text-right">
                  {row.solved}/{row.total}
                </span>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-end gap-4 pt-1">
              {diffRows.map((d) => (
                <div key={d.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[12px] text-muted-foreground font-medium">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </BentoCard>
  );
}


// ── Streak Pill (inline inside Session Overview) ────────────────────────────

function StreakPill() {
  const { state } = useApp();
  const status = getStreakStatus(state.dailyLogs);
  const [timeLeft, setTimeLeft] = useState(getHoursUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getHoursUntilMidnight()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'None') return null;

  const isProtected = status === 'Protected';

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-black shrink-0 ${
        isProtected
          ? 'bg-secondary/10 border-secondary/25 text-secondary'
          : 'bg-primary/10 border-primary/25 text-primary animate-pulse'
      }`}
    >
      {isProtected
        ? <ShieldCheck className="w-3.5 h-3.5" />
        : <AlertTriangle className="w-3.5 h-3.5" />
      }
      <span className="uppercase tracking-wider">
        {isProtected ? 'Secured' : 'At Risk'}
      </span>
      {!isProtected && (
        <span className="opacity-60 font-bold tabular-nums">{timeLeft}</span>
      )}
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-0.5">Focus Shield</p>
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

  const habitGroups = state.habitGroups && state.habitGroups.length > 0 
    ? state.habitGroups 
    : DEFAULT_HABIT_GROUPS;

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
    <div className="flex flex-col gap-8">
      {/* Worksheet Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 py-4 border-b border-border/10 px-2">
         <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Date Status</span>
              <span className="text-sm font-black text-foreground">{todayStr}</span>
            </div>
            <div className="w-[1px] h-6 bg-border/20" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Phase Progress</span>
              <span className="text-sm font-black text-primary uppercase">Week {currentWeek} / 12</span>
            </div>
            <div className="w-[1px] h-6 bg-border/20 hidden sm:block" />
            <div className="hidden sm:flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Efficiency Rating</span>
               <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 bg-muted/20 rounded-full overflow-hidden">
                     <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] font-black text-primary tabular-nums">{pct}%</span>
               </div>
            </div>
         </div>
         
         <button 
           onClick={() => setIsEditing(!isEditing)}
           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
             isEditing ? 'bg-primary text-white' : 'bg-muted/10 text-muted-foreground hover:bg-muted-foreground/20'
           }`}
         >
           {isEditing ? <CheckSquare className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
           {isEditing ? 'SAVE SESSION' : 'CONFIGURE PLAN'}
         </button>
      </div>

      {/* 3-COLUMN TASK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 items-start">
        {habitGroups.map((group) => (
          <div key={group.id} className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/5 pb-2">
              {isEditing ? (
                  <input 
                  type="text" 
                  value={group.title} 
                  onChange={(e) => updateHabitGroupTitle(group.id, e.target.value)}
                  className="bg-muted/10 border border-border/10 rounded-lg px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary focus:outline-none w-full mr-2"
                />
              ) : (
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {group.title}
                </h4>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {group.items.map((item) => {
                const isChecked = log.completedHabits.includes(item.id);
                return (
                  <div key={item.id} className="group relative">
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-muted/5 border border-border/5">
                         <div className="flex items-center justify-between">
                            <input 
                              type="text" value={item.label} 
                              onChange={(e) => updateHabitItem(group.id, item.id, { label: e.target.value })}
                              className="bg-transparent text-[11px] font-bold tracking-tight w-full focus:outline-none text-foreground"
                            />
                            <button onClick={() => deleteHabitItem(group.id, item.id)} className="text-rose-500 opacity-40 hover:opacity-100 transition-opacity"><Minus className="w-3 h-3" /></button>
                         </div>
                         <input 
                           type="text" value={item.detail} 
                           onChange={(e) => updateHabitItem(group.id, item.id, { detail: e.target.value })}
                           className="bg-transparent text-[9px] font-medium opacity-50 w-full focus:outline-none"
                           placeholder="Short strategy..."
                         />
                      </div>
                    ) : (
                      <button 
                        onClick={() => toggleHabit(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                          isChecked 
                            ? 'bg-primary/5 border-primary/20 text-foreground' 
                            : 'bg-muted/5 border-border/5 hover:border-primary/20 text-muted-foreground'
                        }`}
                      >
                         <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30'
                         }`}>
                           {isChecked && <CheckCheck className="w-3 h-3" />}
                         </div>
                         <div>
                           <p className="text-sm font-bold tracking-tight leading-tight">{item.label}</p>
                           {item.detail && <p className="text-[11px] opacity-40 font-medium tracking-tight mt-1">{item.detail}</p>}
                         </div>
                      </button>
                    )}
                  </div>
                );
              })}
              {isEditing && (
                <button onClick={() => addHabitItem(group.id, 'New Target', '')} className="p-3.5 rounded-xl border border-dashed border-border/10 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-widest">
                  <Plus className="w-4 h-4" /> ADD OBJECTIVE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VERTICAL WORKSHEET DATA */}
      <div className="space-y-12 pt-10 border-t border-border/5 px-2 max-w-4xl">
           {/* Problems Solved */}
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <Target className="w-5 h-5 text-primary" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Problem Mastery:</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pl-4">
                 {(['easy', 'medium', 'hard'] as const).map(diff => (
                   <div key={diff} className="flex flex-col gap-3">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-40">{diff} Problems Solved</span>
                      <div className="flex items-center gap-5">
                         <button onClick={() => updateProbs(diff, -1)} className="w-8 h-8 rounded border border-border/5 bg-muted/5 hover:bg-muted/20 flex items-center justify-center text-muted-foreground"><Minus className="w-3 h-3"/></button>
                         <span className="text-lg font-black text-foreground tabular-nums w-6 text-center">{(log.problemsSolved ?? { easy: 0, medium: 0, hard: 0 })[diff]}</span>
                         <button onClick={() => updateProbs(diff, 1)} className="w-8 h-8 rounded border border-primary/20 bg-primary/10 flex items-center justify-center text-primary transition-colors"><Plus className="w-3 h-3"/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

            {/* Learning Insights + Action Plan — side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

               {/* Concepts Learned */}
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <PenTool className="w-5 h-5 text-secondary" />
                     <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Learning Insights (Notes):</h4>
                  </div>
                  <div className="pl-4">
                     <textarea 
                        value={(log.conceptsLearned ?? [])[0] || ''}
                        onChange={(e) => updateConcepts(0, e.target.value)}
                        className="w-full bg-transparent border-b border-border/10 py-1.5 text-[12px] font-medium text-foreground focus:outline-none focus:border-primary/50 placeholder:opacity-5 transition-colors resize-y min-h-[120px]"
                        placeholder="• Write your learnings here...&#10;• You can press enter for new lines..."
                     />
                  </div>
               </div>

               {/* Tomorrow's Plan */}
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <CalendarDays className="w-5 h-5 text-primary" />
                     <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Action Plan (Tomorrow):</h4>
                  </div>
                  <div className="space-y-4 pl-4">
                     <div className="flex flex-col gap-2 group">
                        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-80">- Morning:</span>
                        <textarea 
                           value={(log.tomorrowPlan ?? { morning: '', afternoon: '' }).morning} 
                           onChange={(e) => updatePlan('morning', e.target.value)} 
                           className="w-full bg-transparent border-b border-border/10 py-2 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors resize-y min-h-[60px]" 
                           placeholder="Key objectives..." 
                        />
                     </div>
                     <div className="flex flex-col gap-2 group">
                        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-80">- Afternoon:</span>
                        <textarea 
                           value={(log.tomorrowPlan ?? { morning: '', afternoon: '' }).afternoon} 
                           onChange={(e) => updatePlan('afternoon', e.target.value)} 
                           className="w-full bg-transparent border-b border-border/10 py-2 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors resize-y min-h-[60px]" 
                           placeholder="Key objectives..." 
                        />
                     </div>
                  </div>
               </div>
            </div>

           {/* Vitals */}
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <Activity className="w-5 h-5 text-rose-500" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Biometric Sync:</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pl-4">
                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Energy (1-10)</p>
                    <button onClick={() => updateVitals('energy', (log.energy % 10) + 1)} className="text-3xl font-black text-rose-500 tabular-nums">
                       {log.energy < 10 ? `0${log.energy}` : '10'}
                    </button>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Confidence (1-10)</p>
                    <button onClick={() => updateVitals('confidence', (log.confidence % 10) + 1)} className="text-3xl font-black text-primary tabular-nums">
                       {log.confidence < 10 ? `0${log.confidence}` : '10'}
                    </button>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Hours Logged</p>
                    <div className="flex items-baseline gap-2">
                       <input type="number" step="0.5" value={log.hours} onChange={(e) => updateVitals('hours', Number(e.target.value))} className="bg-transparent font-black text-foreground text-3xl focus:outline-none w-16" />
                       <span className="text-[11px] font-black text-muted-foreground opacity-40 uppercase">HR</span>
                    </div>
                 </div>
              </div>
           </div>

            <div className="pt-12">
              <button
                onClick={handleSave}
                className={`flex items-center gap-5 px-12 py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] transition-all ${
                  saved ? 'bg-secondary/20 text-secondary border border-secondary/40' : 'bg-primary text-foreground shadow-lg hover:translate-y-[-2px] active:translate-y-0'
                }`}
              >
                {saved ? <ShieldCheck className="w-6 h-6" /> : <Save className="w-6 h-6" />}
                {saved ? 'DATA COMMITTED' : 'COMMIT DAILY LOG'}
              </button>
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
        
        {/* TOP ROW: Session Overview & DSA Sheet Progress */}
        <BentoCard className="col-span-12 lg:col-span-7 overflow-hidden relative !p-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 h-full px-6 py-4 flex flex-col justify-between gap-4">
             <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                   <div>
                     <h2 className="text-[12px] font-black uppercase tracking-[0.22em] text-foreground mb-1.5 leading-none">Preparation Overview</h2>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.18em] opacity-80">Placement Portal</p>
                     </div>
                   </div>
                   {/* Inline Streak Shield */}
                   <StreakPill />
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
             
             <div className="grid grid-cols-3 gap-6 md:gap-8">
                <div className="group">
                   <p className="text-[28px] font-black text-foreground group-hover:text-primary transition-colors tabular-nums leading-none mb-1">{streak}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground">Current Streak</p>
                </div>
                <div className="group">
                   <p className="text-[28px] font-black text-foreground group-hover:text-secondary transition-colors tabular-nums leading-none mb-1">{totalDone}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground">Problems Solved</p>
                </div>
                <div className="group">
                   <p className="text-[28px] font-black text-foreground/50 tabular-nums leading-none mb-1">{progressPct}%</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground opacity-40">Effective</p>
                </div>
             </div>
          </div>
        </BentoCard>

        <DSASheetProgressCard />

        <DeploymentLogPanel />

        {/* MAIN ROW: Workspace & Stats Sidebar */}
        <div className="col-span-12 flex flex-col gap-6">
           <BentoCard className="flex-1" title="Daily action plan" icon={CheckCheck}>
             <DailyTaskChecklist />
           </BentoCard>
        </div>

      </motion.div>
    </div>
  );
}
