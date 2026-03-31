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
      className="fixed left-0 top-0 h-screen glass border-r border-border/10 hidden md:flex flex-col z-50 select-none overflow-hidden"
    >
      {/* Logo Area */}
      <div className={`py-8 flex items-center border-b border-border/5 ${collapsed ? 'justify-center' : 'px-6 justify-between'}`}>
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
            className={`w-full group relative flex items-center gap-4 rounded-[18px] transition-all duration-300 text-left ${
              collapsed ? 'justify-center p-3' : 'px-4 py-3.5'
            } ${
              activeTab === id
                ? 'bg-primary text-white shadow-[0_10px_25px_rgba(var(--primary-rgb),0.2)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
          >
            <div className={`relative transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
               <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === id ? 'text-white' : 'group-hover:text-primary'}`} />
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
      <div className={`border-t border-border/5 space-y-4 bg-background/20 backdrop-blur-xl ${collapsed ? 'p-2' : 'p-4'}`}>
        {/* Streak/Trophy Minimal Strip */}
        {!collapsed && (
          <div className="bg-muted/10 rounded-[20px] p-1.5 flex gap-1.5 border border-border/5">
             <div className="flex-1 bg-card/40 rounded-[16px] py-2 flex flex-col items-center justify-center gap-1 border border-border/5 group relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Flame className={`w-4 h-4 relative z-10 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground opacity-40'}`} />
                <span className="text-[10px] font-black text-foreground relative z-10 tabular-nums">{streak}d</span>
             </div>
             <div className="flex-1 bg-card/40 rounded-[16px] py-2 flex flex-col items-center justify-center gap-1 border border-border/5 group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Trophy className="w-4 h-4 text-primary relative z-10" />
                <span className="text-[10px] font-black text-foreground relative z-10 tabular-nums">{totalDone}</span>
             </div>
          </div>
        )}

        {/* Student Profile (Interactive) */}
        <button 
          onClick={onSettingsOpen}
          className={`group flex items-center transition-all duration-300 text-left border border-transparent hover:border-primary/10 hover:bg-primary/5 ${
            collapsed ? 'justify-center p-2 rounded-xl' : 'gap-4 px-4 py-3 rounded-[18px]'
          }`}
          title="Edit Tactical Profile"
        >
          <div className="w-9 h-9 rounded-[14px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-white font-black text-[11px] shadow-lg shadow-primary/10 border-t border-white/20 group-hover:scale-105 transition-transform">
            {(state.userName || 'S').charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-foreground text-[11px] font-black truncate leading-none mb-1 group-hover:text-primary transition-colors">{state.userName || 'Student'}</p>
                <Settings className="w-3 h-3 text-muted-foreground transition-all group-hover:rotate-90 group-hover:text-primary" />
              </div>
              <p className="text-muted-foreground text-[8px] font-black uppercase tracking-widest truncate opacity-50">{state.targetRole}</p>
            </div>
          )}
        </button>

        {/* Theme Toggle & Collapse Toggle */}
        <div className={`flex ${collapsed ? 'flex-col items-center gap-4' : 'gap-2'}`}>
          {!collapsed ? (
            <>
              <button 
                onClick={toggleTheme} 
                className="px-4 py-3 rounded-[14px] text-muted-foreground bg-muted/5 hover:text-primary hover:bg-primary/10 transition-all border border-border/5 hover:border-primary/20"
                title={`Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {state.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" /> : <Moon className="w-4 h-4 text-primary" />}
              </button>
              <button 
                onClick={toggleSidebar}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-muted-foreground bg-muted/5 hover:text-foreground hover:bg-muted/20 transition-all border border-border/5 hover:border-border/10 font-black text-[9px] uppercase tracking-[0.3em]"
              >
                <PanelLeftClose className="w-3.5 h-3.5" /> SECURE
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
               <button 
                 onClick={toggleTheme} 
                 className="p-3 rounded-2xl bg-muted/5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-border/5"
               >
                 {state.theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-primary" />}
               </button>
               <button 
                 onClick={toggleSidebar}
                 className="p-3 rounded-2xl bg-muted/5 text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all border border-border/5"
               >
                 <PanelLeftOpen className="w-5 h-5" />
               </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

