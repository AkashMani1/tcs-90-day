'use client';

import { Target, LayoutDashboard, GitMerge, Code2, Video, BookOpen, Settings, ChevronRight, Flame, Trophy, PanelLeftClose, PanelLeftOpen, Layers, Sun, Moon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calcStreak, calcCurrentWeek, getStreakStatus } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type TabId = 'dashboard' | 'roadmap' | 'dsa' | 'mocks' | 'notes' | 'projects';

const NAV_ITEMS: { id: TabId; icon: React.ElementType; label: string; badge?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'roadmap', icon: GitMerge, label: '3-Month Roadmap' },
  { id: 'dsa', icon: Target, label: 'The Kill List' },
  { id: 'mocks', icon: Video, label: 'Mock Hub' },
  { id: 'notes', icon: BookOpen, label: 'Knowledge Base' },
  { id: 'projects', icon: Layers, label: 'Project Lab' },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  onSettingsOpen: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onSettingsOpen }: SidebarProps) {
  const { state, toggleSidebar, toggleTheme } = useApp();
  const collapsed = state.sidebarCollapsed;
  const streak = calcStreak(state.dailyLogs);
  const currentWeek = calcCurrentWeek(state.startDate);
  const progressPct = Math.round((currentWeek / 12) * 100);
  const totalDone = state.problems.filter((p) => p.status === 'Done').length;

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? '80px' : '280px' }}
      className="fixed left-0 top-0 h-screen glass border-r border-border/10 flex flex-col z-50 select-none overflow-hidden"
    >
      {/* Logo Area */}
      <div className="px-6 py-8 flex items-center justify-between border-b border-border/5">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5 flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Target className="w-6 h-6 text-primary relative z-10" />
          </div>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-foreground font-black text-xl tracking-tighter">PLACE</span>
                <span className="text-primary font-black text-xl tracking-tighter">PREP</span>
              </div>
              <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] -mt-1 opacity-60">Architect v1.0</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-10 space-y-2 overflow-y-auto custom-scrollbar">
        {!collapsed && (
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] mb-6 px-4 opacity-40">Tactical Control</p>
        )}
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full group relative flex items-center gap-4 px-4 py-4 rounded-[20px] transition-all duration-500 text-left ${
              activeTab === id
                ? 'bg-primary text-white shadow-[0_10px_25px_rgba(var(--primary-rgb),0.3)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <div className={`relative transition-transform duration-500 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
               <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === id ? 'text-white' : 'group-hover:text-primary'}`} />
               {activeTab === id && (
                 <motion.div 
                   layoutId="nav-pulse"
                   className="absolute -inset-1.5 bg-white/20 rounded-lg blur opacity-50"
                 />
               )}
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 text-sm font-bold tracking-tight whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
            {!collapsed && badge && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${activeTab === id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>{badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-border/5 space-y-5 bg-background/20 backdrop-blur-xl">
        {/* Streak/Trophy Minimal Strip */}
        {!collapsed && (
          <div className="bg-muted/20 rounded-[22px] p-2 flex gap-2 border border-border/5">
             <div className="flex-1 bg-card/40 rounded-[18px] py-2.5 flex flex-col items-center justify-center gap-1 border border-border/5 group relative overflow-hidden">
                <div className={`absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <Flame className={`w-4 h-4 relative z-10 ${streak > 0 ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'text-muted-foreground opacity-40'}`} />
                <span className="text-[10px] font-black text-foreground relative z-10 tabular-nums">{streak}d</span>
             </div>
             <div className="flex-1 bg-card/40 rounded-[18px] py-2.5 flex flex-col items-center justify-center gap-1 border border-border/5 group relative overflow-hidden">
                <div className={`absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                <Trophy className="w-4 h-4 text-primary relative z-10 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" />
                <span className="text-[10px] font-black text-foreground relative z-10 tabular-nums">{totalDone}</span>
             </div>
          </div>
        )}

        {/* Theme Toggle & Collapse Toggle */}
        <div className="flex gap-2">
          {!collapsed && (
            <button 
              onClick={toggleTheme} 
              className="px-4 py-4 rounded-[20px] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-border/10"
              title={`Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {state.theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-primary" />}
            </button>
          )}
          <button 
            onClick={toggleSidebar}
            className="flex-1 flex items-center justify-center py-4 rounded-[20px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all border border-transparent hover:border-border/10 font-black text-[10px] uppercase tracking-[0.3em]"
          >
            {collapsed ? <div className="flex flex-col gap-4 items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleTheme(); }} 
                className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                {state.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
              </button>
              <PanelLeftOpen className="w-5 h-5" />
            </div> : <div className="flex items-center gap-3"><PanelLeftClose className="w-4 h-4" /> SECURE CONSOLE</div>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

