'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, TrendingUp, CalendarDays, CheckCircle2, Circle, Save, CheckCheck, Activity, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcTotalHours, calcCurrentWeek, today, getStreakStatus, getHoursUntilMidnight } from '@/lib/utils';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { HABIT_TEMPLATES, QUOTES } from '@/lib/defaultData';

// ── Heatmap ───────────────────────────────────────────────────────────────────

function getHeatColor(count: number) {
  if (count === 0) return 'bg-slate-800 border-slate-700/40';
  if (count === 1) return 'bg-emerald-900/70 border-emerald-800/50';
  if (count === 2) return 'bg-emerald-700/80 border-emerald-600/50';
  if (count === 3) return 'bg-emerald-500/80 border-emerald-400/50';
  return 'bg-emerald-400 border-emerald-300/50';
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
function Heatmap({ dailyLogs }: { dailyLogs: { date: string; completedHabits: string[] }[] }) {
  const DAYS = 182; // 26 weeks (half a year) to fill horizontal UI natively
  const ref = new Date(); // Safe on client since we wait for initialized flag
  const logMap = new Map(dailyLogs.map((l) => [l.date, l.completedHabits.length]));

  const cells: { date: Date; count: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const real = logMap.get(key);
    cells.push({ date: d, count: real !== undefined ? real : 0 });
  }

  const weeks: typeof cells[] = [];
  const start = (cells[0].date.getDay() + 6) % 7;
  let col: typeof cells = [];
  for (let i = 0; i < start; i++) col.push({ date: new Date(0), count: -1 });
  cells.forEach((c) => {
    col.push(c);
    if (col.length === 7) { weeks.push(col); col = []; }
  });
  if (col.length) weeks.push(col);

  const activeDays = cells.filter((c) => c.count > 0).length;

  return (
    <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-slate-100 font-bold text-base">12-Week Sprint Consistency</h2>
          <p className="text-slate-500 text-xs">{activeDays} active days tracked</p>
        </div>
        <div className="flex items-center gap-4 text-center">
          {[
            { val: calcStreak(dailyLogs), label: 'Streak', color: 'text-amber-400' },
            { val: activeDays, label: 'Active', color: 'text-emerald-400' },
          ].map(({ val, label, color }) => (
            <div key={label}>
              <p className={`text-xl font-bold ${color}`}>{val}</p>
              <p className="text-slate-600 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex">
        <div className="flex flex-1 justify-between gap-1 w-full">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {Array.from({ length: 7 }).map((_, di) => {
                const c = week[di];
                if (!c || c.count === -1) return <div key={di} className="w-3 h-3 rounded-sm opacity-0" />;
                return (
                  <div
                    key={di}
                    className={`w-full aspect-square md:w-3 md:h-3 rounded-[2px] border cursor-pointer hover:scale-125 transition-transform ${getHeatColor(c.count)}`}
                    title={`${c.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${c.count} habits`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-3 border-t border-slate-700/30 pt-3">
        <span className="text-slate-700 text-xs">Tracking Last 182 days (26 Weeks)</span>
        <div className="flex items-center gap-1">
          <span className="text-slate-600 text-xs mr-1">Activity:</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`w-2.5 h-2.5 rounded-sm border ${getHeatColor(l)}`} />
          ))}
          <span className="text-slate-600 text-xs">More</span>
        </div>
      </div>
    </section>
  );
}

// ── Streak Guard ─────────────────────────────────────────────────────────────
function StreakGuard() {
  const { state } = useApp();
  const status = getStreakStatus(state.dailyLogs);
  const [timeLeft, setTimeLeft] = useState(getHoursUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getHoursUntilMidnight());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  if (status === 'None') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-3 rounded-xl border flex items-center justify-between transition-all ${
        status === 'Protected'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${status === 'Protected' ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
          {status === 'Protected' ? (
            <ShieldCheck className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4 animate-pulse" />
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">
            Streak {status}
          </p>
          <p className="text-[10px] opacity-80">
            {status === 'Protected'
              ? 'Great job! Your streak is secured for today.'
              : 'Complete a task to keep your momentum alive!'}
          </p>
        </div>
      </div>
      
      {status === 'At Risk' && (
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase opacity-60">Resets in</p>
          <p className="text-sm font-black tabular-nums">{timeLeft}</p>
        </div>
      )}
    </motion.div>
  );
}

// ── Today's Habits ────────────────────────────────────────────────────────────
function TodayHabits() {
  const { getTodayLog, toggleHabit, touchToday, initialized } = useApp();
  const log = getTodayLog();

  // "Proper functional" entry logic: visiting the dashboard ensures today's log exists
  useEffect(() => {
    if (initialized) {
      touchToday();
    }
  }, [initialized, touchToday]);
  const done = log.completedHabits.length;
  const pct = Math.round((done / HABIT_TEMPLATES.length) * 100);

  return (
    <motion.div layout className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 lg:col-span-2">
      <StreakGuard />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <CheckCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-slate-100 font-bold text-sm">Today&apos;s Habits</h3>
            <p className="text-slate-500 text-xs">{done}/{HABIT_TEMPLATES.length} completed</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-slate-100">{pct}%</span>
        </div>
      </div>

      <div className="w-full bg-slate-700/50 h-1.5 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {HABIT_TEMPLATES.map((habit) => {
          const checked = log.completedHabits.includes(habit.id);
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-xl border transition-all duration-200 ${
                checked
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-slate-400'
                  : 'bg-slate-900/40 border-slate-700/40 text-slate-300 hover:border-slate-600 hover:text-slate-100'
              }`}
            >
              {checked ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
              )}
              <span className={`text-xs font-medium ${checked ? 'line-through text-slate-600' : ''}`}>
                {habit.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Daily Metrics ─────────────────────────────────────────────────────────────
function DailyMetricsWidget() {
  const { getTodayLog, updateEnergy, updateConfidence, updateHours } = useApp();
  const [saved, setSaved] = useState(false);
  const log = getTodayLog();
  const [energy, setEnergy] = useState(log.energy);
  const [conf, setConf] = useState(log.confidence);
  const [hrs, setHrs] = useState(log.hours);

  const save = () => {
    updateEnergy(energy);
    updateConfidence(conf);
    updateHours(hrs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getLabel = (v: number) =>
    v <= 3 ? { t: 'Low', c: 'text-red-400' }
    : v <= 6 ? { t: 'Mod', c: 'text-amber-400' }
    : v <= 8 ? { t: 'High', c: 'text-emerald-400' }
    : { t: 'Peak', c: 'text-indigo-400' };

  const grad = (v: number, col: string) => {
    const p = ((v - 1) / 9) * 100;
    return `linear-gradient(to right, ${col} ${p}%, #334155 ${p}%)`;
  };

  return (
    <motion.div layout className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
          <Activity className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-slate-100 font-bold text-sm">Daily Metrics</h3>
          <p className="text-slate-500 text-xs">Track your state</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {[
          { label: 'Energy', val: energy, set: setEnergy, color: '#f59e0b' },
          { label: 'Confidence', val: conf, set: setConf, color: '#6366f1' },
        ].map(({ label, val, set, color }) => {
          const lv = getLabel(val);
          return (
            <div key={label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-300 text-xs font-medium">{label}</span>
                <div className="flex gap-1 items-center">
                  <span className="text-slate-100 text-xs font-bold">{val}/10</span>
                  <span className={`text-xs ${lv.c}`}>· {lv.t}</span>
                </div>
              </div>
              <input
                type="range" min={1} max={10} value={val}
                onChange={(e) => set(Number(e.target.value))}
                style={{ background: grad(val, color) }}
                className="w-full"
              />
            </div>
          );
        })}

        <div>
          <label className="text-slate-300 text-xs font-medium block mb-1.5">Hours Today</label>
          <input
            type="number" min={0} max={16} step={0.5} value={hrs}
            onChange={(e) => setHrs(Number(e.target.value))}
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
        </div>
      </div>

      <button
        onClick={save}
        className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
               : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
        }`}
      >
        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Log</>}
      </button>
    </motion.div>
  );
}

// ── Quote Card ────────────────────────────────────────────────────────────────
function QuoteCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((p) => (p + 1) % QUOTES.length), 8000);
    return () => clearInterval(i);
  }, []);
  const q = QUOTES[idx];
  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 rounded-2xl p-5 flex flex-col justify-center">
      <Zap className="w-5 h-5 text-indigo-400 mb-3" />
      <p className="text-slate-200 text-sm font-medium leading-relaxed italic">&ldquo;{q.text}&rdquo;</p>
      <p className="text-slate-500 text-xs mt-2">— {q.author}</p>
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
  const overallPct = Math.round((currentWeek / 12) * 100);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{dateStr}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-50">
            Hey, <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">{state.userName}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Week {currentWeek} of 12 · {state.targetRole} preparation</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[
            { icon: Flame, label: 'Streak', val: `${streak}d`, color: 'amber', border: 'hover:border-amber-500/30' },
            { icon: Clock, label: 'Total Hours', val: `${totalHours.toFixed(1)}h`, color: 'emerald', border: 'hover:border-emerald-500/30' },
            { icon: TrendingUp, label: 'Progress', val: `${overallPct}%`, color: 'indigo', border: 'hover:border-indigo-500/30' },
            { icon: CheckCircle2, label: 'Solved', val: String(totalDone), color: 'purple', border: 'hover:border-purple-500/30' },
          ].map(({ icon: Icon, label, val, color, border }) => (
            <div key={label} className={`flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 ${border} transition-colors`}>
              <div className={`w-7 h-7 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 text-${color}-400`} />
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">{label}</p>
                <p className={`text-${color}-400 text-base font-bold leading-tight`}>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <Heatmap dailyLogs={state.dailyLogs} />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TodayHabits />
        <DailyMetricsWidget />
        <QuoteCard />
      </div>
    </div>
  );
}
