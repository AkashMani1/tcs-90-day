'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
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
  if (count === 0) return `bg-[#2b2b2b] border-[#2b2b2b] ${isToday ? 'ring-1 ring-[#ff7a59]/35' : ''}`;
  if (count <= 2) return `bg-[#315834] border-[#315834] ${isToday ? 'ring-1 ring-[#7fd46a]/45' : ''}`;
  if (count <= 4) return `bg-[#4f8b49] border-[#4f8b49] ${isToday ? 'ring-1 ring-[#8ce46c]/50' : ''}`;
  if (count <= 7) return `bg-[#6bc35f] border-[#6bc35f] ${isToday ? 'ring-1 ring-[#b9f77c]/55' : ''}`;
  return `bg-[#8cf06a] border-[#8cf06a] shadow-[0_0_14px_rgba(140,240,106,0.22)] ${isToday ? 'ring-1 ring-white/30' : ''}`;
}

function getYearRange(selectedYear: number) {
  const start = new Date(selectedYear, 0, 1);
  const end = new Date(selectedYear, 11, 31);

  const startPadding = (start.getDay() + 6) % 7;
  const rangeStart = new Date(start);
  rangeStart.setDate(start.getDate() - startPadding);

  const endPadding = 6 - ((end.getDay() + 6) % 7);
  const rangeEnd = new Date(end);
  rangeEnd.setDate(end.getDate() + endPadding);

  return { start, end, rangeStart, rangeEnd };
}

function buildYearlyHeatmap(logs: DashboardDailyLog[], selectedYear: number) {
  const logMap = new Map(logs.map((log) => [log.date, getDailySubmissionCount(log)]));
  const todayStr = today();
  const { start, end, rangeStart, rangeEnd } = getYearRange(selectedYear);
  const cells: { date: Date; count: number | null; key: string; isToday: boolean; inYear: boolean }[] = [];

  for (let cursor = new Date(rangeStart); cursor <= rangeEnd; cursor.setDate(cursor.getDate() + 1)) {
    const current = new Date(cursor);
    const key = toDateStr(current);
    const inYear = current >= start && current <= end;

    cells.push({
      date: current,
      key,
      inYear,
      isToday: key === todayStr,
      count: inYear ? logMap.get(key) ?? 0 : null,
    });
  }

  const weeks: typeof cells[] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  const monthLabels = Array.from({ length: 12 }, (_, month) => {
    const monthStart = new Date(selectedYear, month, 1);
    const diff = Math.floor((monthStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    return {
      label: monthStart.toLocaleString('default', { month: 'short' }),
      column: Math.floor(diff / 7),
    };
  });

  const monthStartColumns = new Set(monthLabels.map((month) => month.column).filter((column) => column > 0));

  return { weeks, monthLabels, monthStartColumns };
}

function DeploymentLogPanel() {
  const { state } = useApp();
  const dailyLogs = state.dailyLogs as DashboardDailyLog[];
  const currentYear = new Date().getFullYear();
  const availableYears = useMemo(() => {
    const years = new Set<number>([currentYear]);
    for (const log of dailyLogs) {
      years.add(new Date(log.date).getFullYear());
    }
    return Array.from(years).sort((a, b) => a - b);
  }, [dailyLogs, currentYear]);
  const [selectedYear, setSelectedYear] = useState(() => currentYear);

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(currentYear);
    }
  }, [availableYears, selectedYear, currentYear]);

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
  const heatmap = useMemo(() => buildYearlyHeatmap(logsForYear, selectedYear), [logsForYear, selectedYear]);
  const currentYearIndex = availableYears.indexOf(selectedYear);
  const canGoPrev = currentYearIndex > 0;
  const canGoNext = currentYearIndex < availableYears.length - 1;

  return (
    <motion.div variants={itemVariants} className="col-span-12 rounded-[30px] border border-white/10 bg-[#1b1d22] px-6 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)] overflow-visible">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-[18px] md:text-[20px] font-black tracking-[-0.03em] text-[#ff7a59]">Submission</h3>
          <p className="text-[13px] md:text-[14px] text-[#ff6c61]">{totalSubmissions} submissions in {selectedYear}</p>
        </div>

        <div className="flex items-center gap-5 text-[13px] md:text-[14px] text-slate-400 flex-wrap">
          <p>Total active days: <span className="font-semibold text-white">{totalActiveDays}</span></p>
          <p>Max streak: <span className="font-semibold text-white">{maxStreak}</span></p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="relative">
            <div className="flex gap-1">
              {heatmap.weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className={`flex flex-col gap-1 ${heatmap.monthStartColumns.has(weekIndex) ? 'ml-2.5' : ''}`}
                >
                  {week.map((cell) => (
                    <motion.div
                      key={cell.key}
                      whileHover={cell.inYear ? { scale: 1.35, zIndex: 20 } : undefined}
                      className={`group relative h-4 w-4 rounded-[2px] border transition-all duration-200 ${
                        cell.inYear ? getLeetCodeHeatColor(cell.count || 0, cell.isToday) : 'border-transparent bg-transparent'
                      }`}
                    >
                      {cell.inYear ? (
                        <div
                          className={`pointer-events-none absolute bottom-full z-20 mb-3 hidden whitespace-nowrap rounded-md border border-white/10 bg-[#101216] px-3 py-1.5 text-[11px] text-white shadow-2xl group-hover:block ${
                            weekIndex <= 1
                              ? 'left-0'
                              : weekIndex >= heatmap.weeks.length - 2
                                ? 'right-0'
                                : 'left-1/2 -translate-x-1/2'
                          }`}
                        >
                          <span className="font-semibold">{cell.count || 0} submissions</span>
                          <span className="mx-2 text-white/30">|</span>
                          <span className="text-white/75">{cell.date.toLocaleDateString()}</span>
                        </div>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            <div className="relative mt-4 h-7">
              {heatmap.monthLabels.map((month) => (
                <span
                  key={`${selectedYear}-${month.label}-${month.column}`}
                  className="absolute text-[12px] md:text-[13px] font-medium text-white/85"
                  style={{ left: `${month.column * 20 + Math.max(0, month.column - 1) * 4}px` }}
                >
                  {month.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-3">
        <button
          onClick={() => canGoPrev && startTransition(() => setSelectedYear(availableYears[currentYearIndex - 1]))}
          disabled={!canGoPrev}
          className="text-slate-300 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-[96px] rounded-full border border-[#6b3b34] bg-[#2a2220] px-4 py-1.5 text-center text-[15px] font-black tracking-[0.04em] text-[#ff7a59]">
          {selectedYear}
        </div>
        <button
          onClick={() => canGoNext && startTransition(() => setSelectedYear(availableYears[currentYearIndex + 1]))}
          disabled={!canGoNext}
          className="text-slate-300 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
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

  const rings = [
    { radius: 78, color: '#36b4b8', solved: easySolved, total: easyTotal },
    { radius: 56, color: '#c7992d', solved: mediumSolved, total: mediumTotal },
    { radius: 34, color: '#c44343', solved: hardSolved, total: hardTotal },
  ];

  return (
    <BentoCard className="col-span-12 lg:col-span-5 overflow-hidden relative !p-0 min-h-[250px]">
      <div className="px-6 py-6 h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#ff7a59]">DSA Sheet Progress</h3>
            <p className="text-[11px] text-slate-500 mt-1">Live sync from your sheet tracker</p>
          </div>
          <div className="text-right">
            <p className="text-[28px] font-black text-white leading-none">{solved}<span className="text-slate-500">/{total}</span></p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-1">Solved</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col xl:flex-row items-center gap-6">
          <div className="relative w-[158px] h-[158px] shrink-0">
            <svg className="w-full h-full -rotate-90">
              {rings.map((ring) => {
                const circumference = 2 * Math.PI * ring.radius;
                const progress = ring.total > 0 ? ring.solved / ring.total : 0;
                return (
                  <g key={ring.radius}>
                    <circle cx="79" cy="79" r={ring.radius * 0.75} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
                    <circle
                      cx="79"
                      cy="79"
                      r={ring.radius * 0.75}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * (ring.radius * 0.75)}
                      strokeDashoffset={2 * Math.PI * (ring.radius * 0.75) * (1 - progress)}
                    />
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[18px] font-black text-white">{solved}<span className="text-slate-400">/{total}</span></p>
              <p className="text-[12px] text-slate-300">Solved</p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            {[
              { label: 'Easy', color: '#36b4b8', solved: easySolved, total: easyTotal },
              { label: 'Medium', color: '#c7992d', solved: mediumSolved, total: mediumTotal },
              { label: 'Hard', color: '#c44343', solved: hardSolved, total: hardTotal },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-[74px_minmax(0,1fr)_58px] items-center gap-4">
                <span className="text-[15px] font-semibold text-white">{row.label}</span>
                <div className="h-3 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${row.total > 0 ? (row.solved / row.total) * 100 : 0}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
                <span className="text-[15px] font-semibold text-white text-right">{row.solved}/{row.total}</span>
              </div>
            ))}

            <div className="flex items-center justify-end gap-4 pt-1 text-[12px] text-slate-300 flex-wrap">
              {[
                { label: 'Easy', color: '#36b4b8' },
                { label: 'Medium', color: '#c7992d' },
                { label: 'Hard', color: '#c44343' },
              ].map((legend) => (
                <div key={legend.label} className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: legend.color }} />
                  <span>{legend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-0.5">Persistence Shield</p>
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

// ── Default Protocols ────────────────────────────────────────────────────────

const INITIAL_HABIT_GROUPS = [
  {
    id: 'morning',
    title: 'Morning Block',
    items: [
      { id: 'm_watched', label: 'Theory Deep-Dive', detail: 'Watched/Read Concept' },
      { id: 'm_notes', label: 'Synthesized Data', detail: 'Made Notes/Flashcards' },
      { id: 'm_understood', label: 'Logical Lock', detail: 'Understood Topic Fully' },
    ]
  },
  {
    id: 'afternoon',
    title: 'Afternoon Block',
    items: [
      { id: 'a_solved', label: 'Neutralized Targets', detail: 'Solved 3-4 Problems' },
      { id: 'a_submit', label: 'Uplink Established', detail: 'Submitted on Platform' },
      { id: 'a_review', label: 'Solution Extraction', detail: 'Reviewed Hard Cases' },
    ]
  },
  {
    id: 'evening',
    title: 'Evening Review',
    items: [
      { id: 'e_noted', label: 'Intelligence Log', detail: 'Noted Key Learnings' },
      { id: 'e_progress', label: 'Telemetry Update', detail: 'Sync Progress Tracker' },
      { id: 'e_plan', label: 'Next-Day Intent', detail: 'Planned Next Topics' },
    ]
  }
];

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
    : INITIAL_HABIT_GROUPS;

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
           {isEditing ? 'SAVE DEPLOYMENT' : 'CONFIGURE PROTOCOL'}
         </button>
      </div>

      {/* 3-COLUMN TASK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
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
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Target Neutralization:</h4>
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

           {/* Concepts Learned */}
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <PenTool className="w-5 h-5 text-secondary" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Extraction Log (Insights):</h4>
              </div>
              <div className="space-y-3 pl-4">
                 {[0, 1, 2].map(i => (
                   <div key={i} className="flex items-center gap-5">
                      <span className="text-[11px] font-black text-muted-foreground opacity-20">{i+1}.</span>
                      <input 
                         type="text" 
                         value={(log.conceptsLearned ?? [])[i] || ''}
                         onChange={(e) => updateConcepts(i, e.target.value)}
                         className="flex-1 bg-transparent border-b border-border/10 py-1.5 text-[12px] font-medium text-foreground focus:outline-none focus:border-primary/50 placeholder:opacity-5 transition-colors"
                         placeholder="__________________________________________________________"
                      />
                   </div>
                 ))}
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

           {/* Tomorrow's Plan */}
           <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                 <CalendarDays className="w-5 h-5 text-primary" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Mission Deck (Tomorrow):</h4>
              </div>
              <div className="space-y-4 pl-4">
                 <div className="flex items-center gap-6 group max-w-xl">
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-24">- Morning:</span>
                    <input type="text" value={(log.tomorrowPlan ?? { morning: '', afternoon: '' }).morning} onChange={(e) => updatePlan('morning', e.target.value)} className="flex-1 bg-transparent border-b border-border/10 py-2 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" placeholder="_____________________________________" />
                 </div>
                 <div className="flex items-center gap-6 group max-w-xl">
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-40 w-24">- Afternoon:</span>
                    <input type="text" value={(log.tomorrowPlan ?? { morning: '', afternoon: '' }).afternoon} onChange={(e) => updatePlan('afternoon', e.target.value)} className="flex-1 bg-transparent border-b border-border/10 py-2 text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors" placeholder="_____________________________________" />
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
        
        {/* TOP ROW: Tactical Overview & DSA Sheet Progress */}
        <BentoCard className="col-span-12 lg:col-span-7 overflow-hidden relative min-h-[250px] !p-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 h-full px-6 py-6 flex flex-col justify-between gap-6">
             <div className="space-y-4">
                <div>
                   <h2 className="text-[12px] font-black uppercase tracking-[0.22em] text-foreground mb-2 leading-none">Tactical Overview</h2>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.18em] opacity-60">Platform Operational</p>
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
             
             <div className="grid grid-cols-3 gap-6 md:gap-8">
                <div className="group">
                   <p className="text-[36px] font-black text-foreground group-hover:text-primary transition-colors tabular-nums leading-none mb-2">{streak}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground opacity-40">Days Streak</p>
                </div>
                <div className="group">
                   <p className="text-[36px] font-black text-foreground group-hover:text-secondary transition-colors tabular-nums leading-none mb-2">{totalDone}</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground opacity-40">Nodes Mastery</p>
                </div>
                <div className="group">
                   <p className="text-[36px] font-black text-foreground/50 tabular-nums leading-none mb-2">{progressPct}%</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.24em] text-muted-foreground opacity-40">Effective</p>
                </div>
             </div>
          </div>
        </BentoCard>

        <DSASheetProgressCard />

        <div className="col-span-12">
           <StreakGuard />
        </div>

        <DeploymentLogPanel />

        {/* MAIN ROW: Workspace & Stats Sidebar */}
        <div className="col-span-12 flex flex-col gap-6">
           <BentoCard className="flex-1" title="Accountability Log" icon={CheckCheck}>
             <DailyTaskChecklist />
           </BentoCard>
        </div>

      </motion.div>
    </div>
  );
}
