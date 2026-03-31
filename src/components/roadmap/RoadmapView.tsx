'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Check, Edit3, GitMerge } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcCurrentWeek } from '@/lib/utils';

const PHASE_COLORS: Record<string, { badge: string; bg: string; bar: string }> = {
  Ninja: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', bg: 'bg-emerald-500/5', bar: 'bg-emerald-500' },
  Digital: { badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25', bg: 'bg-indigo-500/5', bar: 'bg-indigo-500' },
  Prime: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25', bg: 'bg-amber-500/5', bar: 'bg-amber-500' },
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
  const phase = PHASE_COLORS[week.phase];
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
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isActive ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'border-slate-700/50'} ${isPast && pct === 100 ? 'opacity-75' : ''}`}>
      {/* Week Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${isExpanded ? 'bg-slate-800/70' : 'bg-slate-800/30 hover:bg-slate-800/50'}`}
      >
        {/* Week number */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : isPast ? 'bg-slate-700 text-slate-400' : 'bg-slate-800 text-slate-500'}`}>
          W{week.week}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold ${isActive ? 'text-slate-100' : isPast ? 'text-slate-400' : 'text-slate-300'}`}>
              Week {week.week}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${phase.badge}`}>
              {week.phase}
            </span>
            {isActive && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold animate-pulse">
                Current
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs truncate">{week.focus}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:block w-24">
            <div className="flex justify-between mb-1">
              <span className="text-slate-600 text-[10px]">{done}/{week.tasks.length}</span>
              <span className={`text-[10px] font-bold ${pct === 100 ? 'text-emerald-400' : 'text-slate-400'}`}>{pct}%</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${phase.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className={`px-5 py-4 border-t border-slate-700/40 ${phase.bg}`}>
          {/* Focus edit */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Focus:</span>
            {editFocus ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  autoFocus
                  value={focusDraft}
                  onChange={(e) => setFocusDraft(e.target.value)}
                  onBlur={() => { updateWeekFocus(week.week, focusDraft); setEditFocus(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { updateWeekFocus(week.week, focusDraft); setEditFocus(false); } }}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <button
                onClick={() => { setFocusDraft(week.focus); setEditFocus(true); }}
                className="text-slate-300 text-sm font-medium hover:text-indigo-300 transition-colors flex items-center gap-1 group"
              >
                {week.focus}
                <Edit3 className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            )}
          </div>

          {/* Tasks */}
          <ul className="space-y-2 mb-3">
            {week.tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-2.5 group">
                <button
                  onClick={() => toggleWeekTask(week.week, task.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.done ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 hover:border-emerald-500 transition-colors" />
                  )}
                </button>
                <span className={`text-sm flex-1 leading-tight ${task.done ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                  {task.label}
                </span>
                <button
                  onClick={() => deleteWeekTask(week.week, task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>

          {/* Add task */}
          {adding ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={newTask}
                placeholder="Add a task..."
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') setAdding(false); }}
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleAddTask} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">Add</button>
              <button onClick={() => { setAdding(false); setNewTask(''); }} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-400 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add task
            </button>
          )}
        </div>
      )}
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <GitMerge className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100">3-Month Roadmap</h1>
            <p className="text-slate-500 text-sm">TCS Ninja → Digital → Prime progression</p>
          </div>
        </div>
        <div className="flex gap-3">
          {[{ l: 'Ninja', c: 'text-emerald-400' }, { l: 'Digital', c: 'text-indigo-400' }, { l: 'Prime', c: 'text-amber-400' }].map(({ l, c }) => {
            const ws = state.weeks.filter((w) => w.phase === l);
            const d = ws.reduce((s, w) => s + w.tasks.filter((t) => t.done).length, 0);
            const total = ws.reduce((s, w) => s + w.tasks.length, 0);
            return (
              <div key={l} className="text-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2">
                <p className={`text-lg font-bold ${c}`}>{total ? Math.round((d / total) * 100) : 0}%</p>
                <p className="text-slate-500 text-xs">{l}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400 text-sm font-semibold">Overall Progress</span>
          <span className="text-indigo-400 font-bold text-sm">{doneTasks}/{totalTasks} tasks · {overallPct}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* Week cards */}
      <div className="space-y-3">
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
  );
}
