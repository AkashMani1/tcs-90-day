'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, TrendingUp, CalendarDays, CheckCircle2, Circle, Save, CheckCheck, Activity, Zap, ShieldCheck, AlertTriangle, Plus, Minus, CheckSquare, Square, BookOpen, PenTool, Lightbulb, Code, UploadCloud, Eye, BookMarked, BarChart3, ListTodo, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcTotalHours, calcCurrentWeek, today, getStreakStatus, getHoursUntilMidnight } from '@/lib/utils';
import { QUOTES } from '@/lib/defaultData';

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

// ── Daily Task Checklist Template ───────────────────────────────────────────
function DailyTaskChecklist() {
  const { getTodayLog, updateDailyLog, toggleHabit, touchToday, initialized } = useApp();
  const log = getTodayLog();
  const [saved, setSaved] = useState(false);

  // Local state for smooth typing without constant re-renders from context
  const [currentDate, setCurrentDate] = useState(log.date);
  
  const [energy, setEnergy] = useState(log.energy);
  const [conf, setConf] = useState(log.confidence);
  const [hrs, setHrs] = useState(log.hours);
  const [probs, setProbs] = useState(log.problemsSolved || { easy: 0, medium: 0, hard: 0 });
  const [concepts, setConcepts] = useState(log.conceptsLearned || ['', '', '']);
  const [struggles, setStruggles] = useState(log.struggles || '');
  const [tomorrow, setTomorrow] = useState(log.tomorrowPlan || { morning: '', afternoon: '' });

  // Reset local state if day changes
  useEffect(() => {
    if (log.date !== currentDate) {
      setCurrentDate(log.date);
      setEnergy(log.energy);
      setConf(log.confidence);
      setHrs(log.hours);
      setProbs(log.problemsSolved || { easy: 0, medium: 0, hard: 0 });
      setConcepts(log.conceptsLearned || ['', '', '']);
      setStruggles(log.struggles || '');
      setTomorrow(log.tomorrowPlan || { morning: '', afternoon: '' });
    }
  }, [log, currentDate]);

  useEffect(() => {
    if (initialized) touchToday();
  }, [initialized, touchToday]);

  const handleSave = () => {
    updateDailyLog({
      energy,
      confidence: conf,
      hours: hrs,
      problemsSolved: probs,
      conceptsLearned: concepts,
      struggles,
      tomorrowPlan: tomorrow
    });
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

  const syncLog = (updates: Partial<typeof log>) => updateDailyLog(updates);

  // Checkbox config mapping closely to image layout
  const CHECKBOX_SYSTEM = [
    {
      title: 'Morning Block (2.5-3 hours)', icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      tasks: [
        { id: 'm_theory', label: 'Watched theory video/read concept' },
        { id: 'm_notes', label: 'Made notes/flashcards' },
        { id: 'm_understand', label: 'Understood topic before practice' }
      ]
    },
    {
      title: 'Afternoon Block (2-2.5 hours)', icon: <Code className="w-4 h-4 text-amber-400" />,
      tasks: [
        { id: 'a_solve', label: 'Solved target problems (3-4)' },
        { id: 'a_submit', label: 'Submitted code on platform' },
        { id: 'a_review', label: 'Reviewed solutions for unsolved problems' }
      ]
    },
    {
      title: 'Evening Review (30-60 minutes)', icon: <ListTodo className="w-4 h-4 text-indigo-400" />,
      tasks: [
        { id: 'e_learn', label: 'Noted down learnings' },
        { id: 'e_tracker', label: 'Updated progress tracker' },
        { id: 'e_plan', label: "Planned tomorrow's topics" }
      ]
    }
  ];

  const doneCount = log.completedHabits.length;
  const totalTasks = 9;
  const pct = Math.round((doneCount / totalTasks) * 100);

  return (
    <motion.div layout className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 lg:col-span-3">
      {/* Header section with StreakGuard seamlessly integrated */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 relative">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <CheckCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-slate-100 font-black text-xl flex items-center gap-2">
                Daily Task Checklist
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Accountability</span>
              </h3>
              <p className="text-slate-500 text-sm">Print this in your mind and use daily</p>
            </div>
          </div>
        </div>
        <div className="md:max-w-[280px] w-full">
           <StreakGuard />
        </div>
      </div>

      <div className="w-full bg-slate-700/50 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Checklist & Counters */}
        <div className="space-y-6">
          
          {/* Checkboxes */}
          <div className="space-y-4">
            {CHECKBOX_SYSTEM.map((block) => (
              <div key={block.title} className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
                <h4 className="text-slate-200 text-sm font-bold flex items-center gap-2 mb-3">
                  {block.icon} {block.title}
                </h4>
                <div className="space-y-2">
                  {block.tasks.map((t) => {
                    const isChecked = log.completedHabits.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleHabit(t.id)}
                        className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          isChecked ? 'bg-emerald-500/10 text-slate-400' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${isChecked ? 'line-through text-slate-500' : ''}`}>
                          {t.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Problems Solved */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
             <h4 className="text-slate-200 text-sm font-bold flex items-center gap-2 mb-4">
               <Target className="w-4 h-4 text-rose-400" /> Problems Solved Today
             </h4>
             <div className="grid grid-cols-3 gap-3">
               {(['easy', 'medium', 'hard'] as const).map(diff => (
                 <div key={diff} className="flex flex-col items-center bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-2">{diff}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setProbs(p => ({...p, [diff]: Math.max(0, p[diff] - 1)}))} className="text-slate-500 hover:text-white"><Minus className="w-3.5 h-3.5"/></button>
                      <span className="text-xl font-black text-slate-200 w-6 text-center">{probs[diff]}</span>
                      <button onClick={() => setProbs(p => ({...p, [diff]: p[diff] + 1}))} className="text-slate-500 hover:text-white"><Plus className="w-3.5 h-3.5"/></button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Logging */}
        <div className="space-y-6">
          
          {/* Concepts Learned */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
            <h4 className="text-slate-200 text-sm font-bold flex items-center gap-2 mb-3">
               <Lightbulb className="w-4 h-4 text-yellow-400" /> Concepts Learned:
            </h4>
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-600 text-sm font-bold w-4">{i + 1}.</span>
                  <input 
                    type="text" 
                    value={concepts[i]}
                    onChange={(e) => {
                      const newC = [...concepts];
                      newC[i] = e.target.value;
                      setConcepts(newC);
                    }}
                    onBlur={() => syncLog({ conceptsLearned: concepts })}
                    placeholder="Enter concept..."
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Struggles / Doubts */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
            <h4 className="text-slate-200 text-sm font-bold flex items-center gap-2 mb-3">
               <Activity className="w-4 h-4 text-orange-400" /> Struggles / Doubts:
            </h4>
            <textarea 
              value={struggles}
              onChange={(e) => setStruggles(e.target.value)}
              onBlur={() => syncLog({ struggles })}
              placeholder="What blocked you today?"
              rows={2}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          {/* Core Metrics */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-3">
                {[
                  { label: 'Energy Level', val: energy, set: setEnergy, color: '#f59e0b', max: 10 },
                  { label: 'Confidence', val: conf, set: setConf, color: '#6366f1', max: 10 },
                ].map(({ label, val, set, color, max }) => {
                  const lv = getLabel(val);
                  return (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300 text-[11px] font-bold uppercase tracking-wide">{label}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-100 text-xs font-bold">{val}/{max}</span>
                        </div>
                      </div>
                      <input
                        type="range" min={1} max={max} value={val}
                        onChange={(e) => set(Number(e.target.value))}
                        onBlur={() => syncLog({ energy, confidence: conf })}
                        style={{ background: grad(val, color) }}
                        className="w-full h-1.5"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="w-24 text-center border-l border-slate-700/50 pl-6">
                <span className="text-slate-300 text-[11px] font-bold uppercase tracking-wide mb-1 block">Hours</span>
                <input 
                  type="number" min={0} max={24} step={0.5} value={hrs}
                  onChange={(e) => setHrs(Number(e.target.value))}
                  onBlur={() => syncLog({ hours: hrs })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-1.5 text-emerald-400 font-bold text-center text-lg focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Tomorrow's Plan */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-4">
             <h4 className="text-slate-200 text-sm font-bold flex items-center gap-2 mb-3">
               <CalendarDays className="w-4 h-4 text-purple-400" /> Tomorrow's Plan:
            </h4>
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                 <span className="text-slate-500 text-xs font-bold w-16 uppercase tracking-wider">Morning</span>
                 <input type="text" value={tomorrow.morning} onChange={(e) => setTomorrow(p => ({...p, morning: e.target.value}))} onBlur={() => syncLog({ tomorrowPlan: tomorrow })} className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50" />
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-slate-500 text-xs font-bold w-16 uppercase tracking-wider">Afternoon</span>
                 <input type="text" value={tomorrow.afternoon} onChange={(e) => setTomorrow(p => ({...p, afternoon: e.target.value}))} onBlur={() => syncLog({ tomorrowPlan: tomorrow })} className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500/50" />
               </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                   : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Form Saved to Log</> : <><Save className="w-4 h-4" /> Save Daily Log</>}
          </button>

        </div>
      </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <DailyTaskChecklist />
        <div className="lg:col-span-1 hidden lg:block">
          <QuoteCard />
        </div>
      </div>
    </div>
  );
}
