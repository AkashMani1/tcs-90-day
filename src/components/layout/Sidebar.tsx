'use client';

/* Developed by Akash Mani - This site is developed by Akash Mani. Original watermark of Akash Mani. */

/* Developed by Akash Mani - This site is developed by Akash Mani. Original watermark of Akash Mani. */

import { Target, LayoutDashboard, Compass, ListChecks, Code2, PlayCircle, Library, FlaskConical, Settings, Sun, Moon, Cloud, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { calcStreak, calcCurrentWeek, getStreakStatus } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export type TabId = 'dashboard' | 'roadmap' | 'dsa' | 'dsaSheet' | 'mocks' | 'notes' | 'projects';

const NAV_ITEMS: { id: TabId; icon: React.ElementType; label: string; badge?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'roadmap', icon: Compass, label: '3-Month Roadmap' },
  { id: 'dsa', icon: ListChecks, label: 'Must Do List' },
  { id: 'dsaSheet', icon: Code2, label: 'DSA Sheet' },
  { id: 'mocks', icon: PlayCircle, label: 'Mock Hub' },
  { id: 'notes', icon: Library, label: 'Knowledge Base' },
  { id: 'projects', icon: FlaskConical, label: 'Project Lab' },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  onSettingsOpen: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onSettingsOpen }: SidebarProps) {
  const { state, toggleSidebar, toggleTheme } = useApp();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isHovered; // Purely hover-based expansion
  
  const streak = calcStreak(state.dailyLogs);
  const currentWeek = calcCurrentWeek(state.startDate);
  const goalWeeks = (state.goalDurationMonths || 3) * 4;
  const progressPct = Math.min(100, Math.round((currentWeek / goalWeeks) * 100));
  const totalDone = state.problems.filter((p) => p.status === 'Done').length;

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isExpanded ? '280px' : '80px',
        boxShadow: isHovered ? '20px 0 50px rgba(0,0,0,0.3)' : '0 0 0 rgba(0,0,0,0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-0 top-0 h-screen glass border-r border-border/10 hidden md:flex flex-col z-50 select-none overflow-hidden"
    >
      {/* Logo Area */}
      <div className="py-8 flex items-center border-b border-border/10 px-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5 flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Target className="w-6 h-6 text-primary relative z-10" />
          </div>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap ml-1"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-foreground font-black text-xl tracking-tighter">PLACE</span>
                <span className="text-primary font-black text-xl tracking-tighter">PREP</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-10 space-y-2 overflow-y-auto custom-scrollbar pt-12">
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
          <Link
            key={id}
            href={id === 'dashboard' ? '/' : `/${id}`}
            onClick={(e) => {
              onTabChange(id);
            }}
            className={`w-full group relative flex items-center rounded-[18px] transition-all duration-300 text-left px-3 ${
              activeTab === id
                ? 'bg-primary text-white shadow-[0_10px_25px_rgba(var(--primary-rgb),0.2)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
          >
            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
               <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'group-hover:text-primary'}`} />
            </div>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex-1 text-sm font-bold tracking-tight whitespace-nowrap ml-1"
              >
                {label}
              </motion.span>
            )}
            {isExpanded && badge && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ml-auto mr-1 ${activeTab === id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}
              >
                {badge}
              </motion.span>
            )}
          </Link>
        ))}
      </nav>
      {/* ── Control Hub (Professional Grade Footer) ─────────────────────────────────── */}
      <div className={`mt-auto border-t border-white/[0.03] transition-all duration-500 bg-white/[0.01] backdrop-blur-3xl py-3 px-0 gap-3 flex flex-col`}>
        
        {/* Profile Control Hub */}
        <button 
          onClick={onSettingsOpen}
          className={`group flex items-center transition-all duration-500 text-left relative overflow-hidden px-3 ${
            isExpanded 
              ? 'py-3 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.06] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' 
              : 'w-full py-3 rounded-2xl bg-white/[0.03] hover:bg-primary/5'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Avatar & Status Pip - Standardized Rail */}
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center relative">
             <div className="w-10 h-10 rounded-[18px] bg-gradient-to-tr from-primary via-primary/80 to-secondary flex items-center justify-center text-white font-black text-[13px] shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-[5deg] overflow-hidden border border-white/10">
                {user?.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="opacity-90">{(user?.user_metadata.full_name || state.userName || 'S').charAt(0).toUpperCase()}</span>
                )}
             </div>
             {/* Dynamic Status Indicator */}
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }} 
               transition={{ duration: 4, repeat: Infinity }}
               className={`absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-[#09090b] ${user ? 'bg-emerald-500' : 'bg-orange-500'} shadow-[0_0_10px_rgba(16,185,129,0.3)]`} 
             />
          </div>

          {isExpanded && (
            <div className="flex-1 min-w-0 relative z-10 ml-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-foreground text-[14px] font-bold truncate tracking-tight group-hover:text-primary transition-colors duration-300">
                  {user?.user_metadata.full_name || state.userName || 'Student'}
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 mr-4">
                  <Settings className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-primary animate-[spin_4s_linear_infinite]" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 overflow-hidden">
                 <p className={`text-[9.5px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-colors duration-500 ${user ? 'text-emerald-500/80' : 'text-orange-500/80 shadow-[0_0_10px_rgba(var(--orange-rgb),0.2)]'}`}>
                   {user ? 'Verified Access' : 'Local Instance'}
                 </p>
                 {!user && <span className="w-1 h-1 rounded-full bg-white/10" />}
                 {!user && <button onClick={(e) => { e.stopPropagation(); signInWithGoogle(); }} className="text-[9px] font-bold text-primary hover:underline underline-offset-2">CONNECT</button>}
              </div>
            </div>
          )}
        </button>

        {/* Action Controls Strip */}
        <div className="flex items-center px-3">
          <button 
            onClick={toggleTheme} 
            className={`flex items-center justify-start rounded-[20px] bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-300 group/ctrl w-full ${isExpanded ? 'py-3' : 'h-12'}`}
            title="Switch Theme"
          >
            <div className="w-12 h-full flex-shrink-0 flex items-center justify-center">
              {state.theme === 'dark' ? (
                <Sun className={`w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]`} />
              ) : (
                <Moon className={`w-4 h-4 text-sh-blue-400 group-hover:-rotate-12 transition-transform duration-500`} />
              )}
            </div>
            {isExpanded && <span className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors ml-1">{state.theme === 'dark' ? 'Day' : 'Night'}</span>}
          </button>
        </div>

        {/* Simplified Brand Signature */}
        {isExpanded && (
          <div className="pt-2 px-1 flex items-center justify-center gap-2 group/sig">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/[0.03]" />
            <p className="text-[8.5px] font-black uppercase tracking-[0.5em] text-white/10 group-hover/sig:text-white/30 transition-colors duration-1000">
              AKASH MANI
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/[0.03]" />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
