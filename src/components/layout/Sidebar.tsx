'use client';

import { Target, LayoutDashboard, GitMerge, Code2, Video, BookOpen, Settings, ChevronRight, Flame, Trophy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcCurrentWeek, getStreakStatus } from '@/lib/utils';

export type TabId = 'dashboard' | 'roadmap' | 'dsa' | 'mocks' | 'notes';

const NAV_ITEMS: { id: TabId; icon: React.ElementType; label: string; badge?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'roadmap', icon: GitMerge, label: '3-Month Roadmap' },
  { id: 'dsa', icon: Target, label: 'The Kill List' },
  { id: 'mocks', icon: Video, label: 'Mock Hub' },
  { id: 'notes', icon: BookOpen, label: 'Knowledge Base' },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  onSettingsOpen: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onSettingsOpen }: SidebarProps) {
  const { state } = useApp();
  const streak = calcStreak(state.dailyLogs);
  const currentWeek = calcCurrentWeek(state.startDate);
  const progressPct = Math.round((currentWeek / 12) * 100);

  const totalDone = state.problems.filter((p) => p.status === 'Done').length;

  return (
    <aside className="fixed left-0 top-0 h-screen w-62 bg-[#0a0f1e] border-r border-slate-800 flex flex-col z-40 select-none" style={{ width: '248px' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-white font-black text-[18px] tracking-tight">Place</span>
              <span className="text-indigo-400 font-black text-[18px] tracking-tight">Prep</span>
            </div>
            <p className="text-slate-600 text-[11px] font-medium -mt-0.5">Crack TCS in 3 Months</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-3 py-2.5 border-b border-slate-800 flex gap-2">
        <div className="flex-1 bg-slate-800/60 rounded-lg px-3 py-1.5 flex items-center gap-1.5 group relative cursor-default">
          <div className="relative">
            <Flame className={`w-3.5 h-3.5 flex-shrink-0 ${streak === 0 ? 'text-slate-600' : 'text-amber-400'}`} />
            {getStreakStatus(state.dailyLogs) === 'At Risk' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
            )}
          </div>
          <span className={`${streak === 0 ? 'text-slate-600' : 'text-amber-400'} text-xs font-bold`}>{streak}d</span>
          <span className="text-slate-600 text-xs">streak</span>
          
          {/* Status Tooltip-like tooltip */}
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-900 border border-slate-700 text-[10px] px-2 py-1 rounded shadow-xl z-50">
            {getStreakStatus(state.dailyLogs) === 'Protected' ? (
              <span className="text-emerald-400 font-bold">Protected ✅</span>
            ) : getStreakStatus(state.dailyLogs) === 'At Risk' ? (
              <span className="text-orange-400 font-bold">At Risk ⏳</span>
            ) : (
              <span className="text-slate-500">No active streak</span>
            )}
          </div>
        </div>
        <div className="flex-1 bg-slate-800/60 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-400 text-xs font-bold">{totalDone}</span>
          <span className="text-slate-600 text-xs">solved</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-2 px-2">Menu</p>
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
              activeTab === id
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 shadow-sm'
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-300'}`} />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full">{badge}</span>
            )}
            {activeTab === id && <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />}
          </button>
        ))}

        {/* Target Roles */}
        <div className="mt-5 px-2">
          <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-2">Target Roles</p>
          <div className="space-y-1.5">
            {[
              { label: 'TCS Ninja', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { label: 'TCS Digital', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
              { label: 'TCS Prime', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            ].map(({ label, color }) => (
              <div key={label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${color}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User + Week Progress */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-3">
        {/* Week progress */}
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
          <div className="flex justify-between mb-2">
            <span className="text-slate-400 text-xs font-semibold">12-Week Sprint</span>
            <span className="text-indigo-400 text-xs font-bold">Week {currentWeek}/12</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-slate-600 text-[11px] mt-1.5 text-right">{12 - currentWeek} weeks left</p>
        </div>

        {/* Profile + Settings */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {(state.userName || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-semibold truncate">{state.userName || 'Student'}</p>
            <p className="text-slate-600 text-xs truncate">{state.targetRole}</p>
          </div>
          <button
            onClick={onSettingsOpen}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
