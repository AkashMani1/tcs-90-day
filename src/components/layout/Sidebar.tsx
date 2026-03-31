'use client';

import { Target, LayoutDashboard, GitMerge, Code2, Video, BookOpen, Settings, ChevronRight, Flame, Trophy, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcCurrentWeek, getStreakStatus } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { state, toggleSidebar } = useApp();
  const collapsed = state.sidebarCollapsed;
  const streak = calcStreak(state.dailyLogs);
  const currentWeek = calcCurrentWeek(state.startDate);
  const progressPct = Math.round((currentWeek / 12) * 100);
  const totalDone = state.problems.filter((p) => p.status === 'Done').length;

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? '80px' : '260px' }}
      className="fixed left-0 top-0 h-screen bg-obsidian-surface border-r border-obsidian-surface-highest/20 flex flex-col z-40 select-none overflow-hidden"
    >
      {/* Logo Area */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-obsidian-surface-highest/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-indigo/20 to-neon-cyan/20 border border-neon-indigo/30 rounded-xl flex items-center justify-center shadow-lg shadow-neon-indigo/5 flex-shrink-0 neon-glow-indigo">
            <Target className="w-5 h-5 text-neon-indigo-tint" />
          </div>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-slate-100 font-black text-lg tracking-tight">Study</span>
                <span className="text-neon-indigo font-black text-lg tracking-tight">OS</span>
              </div>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider -mt-0.5">Placement Pro</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-3">Terminal</p>
        )}
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-left ${
              activeTab === id
                ? 'bg-neon-indigo/10 text-white shadow-xl shadow-neon-indigo/5 border border-neon-indigo/20'
                : 'text-slate-500 hover:text-slate-200 hover:bg-obsidian-surface-high/40 border border-transparent'
            }`}
          >
            {activeTab === id && (
              <motion.div 
                layoutId="active-tab"
                className="absolute left-0 w-1 h-5 bg-neon-indigo rounded-full"
              />
            )}
            <motion.div
               animate={activeTab === id ? {
                  opacity: [1, 0.8, 1, 0.9, 1],
                  filter: [
                    'drop-shadow(0 0 2px rgba(99,102,241,0.5))',
                    'drop-shadow(0 0 5px rgba(99,102,241,0.8))',
                    'drop-shadow(0 0 2px rgba(99,102,241,0.5))'
                  ]
               } : {}}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
               <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${activeTab === id ? 'text-neon-indigo scale-110' : 'text-slate-600 group-hover:text-slate-300'}`} />
            </motion.div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 text-sm font-semibold whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
            {!collapsed && badge && (
              <span className="text-[10px] bg-neon-indigo/20 text-neon-indigo-tint px-1.5 py-0.5 rounded-md font-bold">{badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className="p-3 border-t border-obsidian-surface-highest/10 space-y-4 bg-obsidian-surface/60 backdrop-blur-md">
        {/* Streak/Trophy Minimal Strip */}
        <div className={`flex gap-2 ${collapsed ? 'flex-col items-center' : ''}`}>
           <div className="flex-1 bg-obsidian-surface-high/40 rounded-xl p-2.5 flex items-center justify-center gap-2 border border-obsidian-surface-highest/10 group relative">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
              {!collapsed && <span className="text-xs font-bold text-slate-200">{streak}d</span>}
           </div>
           {!collapsed && (
             <div className="flex-1 bg-obsidian-surface-high/40 rounded-xl p-2.5 flex items-center justify-center gap-2 border border-obsidian-surface-highest/10">
                <Trophy className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs font-bold text-slate-200">{totalDone}</span>
             </div>
           )}
        </div>

        {/* User Card */}
        <div className={`flex items-center gap-3 p-1.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-purple flex items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-lg shadow-neon-indigo/20">
            {(state.userName || 'S').charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex-1 min-w-0"
            >
              <p className="text-slate-100 text-sm font-bold truncate leading-tight">{state.userName || 'Student'}</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate">{state.targetRole}</p>
            </motion.div>
          )}
          {!collapsed && (
            <button onClick={onSettingsOpen} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-obsidian-surface-highest/20 transition-all">
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all border border-transparent hover:border-neon-cyan/20"
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"><PanelLeftClose className="w-4 h-4" /> Collapse</div>}
        </button>
      </div>
    </motion.aside>
  );
}

