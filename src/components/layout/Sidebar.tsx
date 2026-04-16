'use client';

import { Target, LayoutDashboard, GitMerge, Code2, Video, BookOpen, Settings, Flame, Trophy, Layers, Sun, Moon, Pin, PinOff, LogIn, LogOut, Cloud, CloudOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { calcStreak, calcCurrentWeek, getStreakStatus } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export type TabId = 'dashboard' | 'roadmap' | 'dsa' | 'dsaSheet' | 'mocks' | 'notes' | 'projects';

const NAV_ITEMS: { id: TabId; icon: React.ElementType; label: string; badge?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'roadmap', icon: GitMerge, label: '3-Month Roadmap' },
  { id: 'dsa', icon: Target, label: 'Must Do List' },
  { id: 'dsaSheet', icon: Code2, label: 'DSA Sheet' },
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
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const collapsed = state.sidebarCollapsed;
  const isExpanded = !collapsed || isHovered;
  
  const streak = calcStreak(state.dailyLogs);
  const currentWeek = calcCurrentWeek(state.startDate);
  const progressPct = Math.round((currentWeek / 12) * 100);
  const totalDone = state.problems.filter((p) => p.status === 'Done').length;

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isExpanded ? '280px' : '80px',
        boxShadow: isHovered && collapsed ? '20px 0 50px rgba(0,0,0,0.3)' : '0 0 0 rgba(0,0,0,0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-0 top-0 h-screen glass border-r border-border/10 hidden md:flex flex-col z-50 select-none overflow-hidden"
    >
      {/* Logo Area */}
      <div className={`py-8 flex items-center border-b border-border/10 ${isExpanded ? 'px-6 justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5 flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Target className="w-6 h-6 text-primary relative z-10" />
          </div>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-foreground font-black text-xl tracking-tighter">PLACE</span>
                <span className="text-primary font-black text-xl tracking-tighter">PREP</span>
              </div>
              <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] -mt-1 opacity-60">Placement Portal</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-10 space-y-2 overflow-y-auto custom-scrollbar">
        {isExpanded && (
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] mb-6 px-4 opacity-40">Preferences</p>
        )}
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full group relative flex items-center gap-4 rounded-[18px] transition-all duration-300 text-left ${
              isExpanded ? 'px-4 py-3.5' : 'justify-center p-3'
            } ${
              activeTab === id
                ? 'bg-primary text-white shadow-[0_10px_25px_rgba(var(--primary-rgb),0.2)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
          >
            <div className={`relative transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
               <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === id ? 'text-white' : 'group-hover:text-primary'}`} />
            </div>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 text-sm font-bold tracking-tight whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
            {isExpanded && badge && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${activeTab === id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>{badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className={`border-t border-border/5 space-y-4 bg-background/20 backdrop-blur-xl ${collapsed ? 'p-2' : 'p-4'}`}>
        {/* Streak/Trophy Minimal Strip */}
        {isExpanded && (
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

        {/* Student Profile (Interactive) or Login */}
        {user ? (
          <button 
            onClick={onSettingsOpen}
            className={`group flex items-center transition-all duration-300 text-left border border-transparent hover:border-primary/10 hover:bg-primary/5 ${
              isExpanded ? 'gap-4 px-4 py-3 rounded-[18px]' : 'justify-center p-2 rounded-xl'
            }`}
            title="Edit Profile"
          >
            <div className="w-9 h-9 rounded-[14px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-white font-black text-[11px] shadow-lg shadow-primary/10 border-t border-white/20 group-hover:scale-105 transition-transform overflow-hidden">
              {user.user_metadata.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                (user.user_metadata.full_name || state.userName || 'S').charAt(0).toUpperCase()
              )}
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-foreground text-[11px] font-black truncate leading-none mb-1 group-hover:text-primary transition-colors">
                    {user.user_metadata.full_name || state.userName || 'Student'}
                  </p>
                  <Settings className="w-3 h-3 text-muted-foreground transition-all group-hover:rotate-90 group-hover:text-primary" />
                </div>
                <div className="flex items-center gap-1">
                  <Cloud className="w-2.5 h-2.5 text-emerald-500" />
                  <p className="text-muted-foreground text-[8px] font-black uppercase tracking-widest truncate opacity-50">Cloud Sync Active</p>
                </div>
              </div>
            )}
          </button>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className={`group flex items-center transition-all duration-300 text-left border border-dashed border-border/20 hover:border-primary/50 hover:bg-primary/5 ${
              isExpanded ? 'gap-4 px-4 py-3 rounded-[18px]' : 'justify-center p-2 rounded-xl'
            }`}
            title="Sign in with Google"
          >
            <div className="w-9 h-9 rounded-[14px] bg-muted/20 flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-[11px] font-black truncate leading-none mb-1 group-hover:text-primary transition-colors">Sign in to sync</p>
                <div className="flex items-center gap-1">
                  <CloudOff className="w-2.5 h-2.5 text-orange-500/50" />
                  <p className="text-muted-foreground text-[8px] font-black uppercase tracking-widest truncate opacity-50">Local Only</p>
                </div>
              </div>
            )}
          </button>
        )}

        {/* Theme Toggle & Pin Toggle */}
        <div className={`flex ${isExpanded ? 'gap-2' : 'flex-col items-center gap-4'}`}>
          <button 
            onClick={toggleTheme} 
            className={`rounded-[14px] text-muted-foreground bg-muted/5 hover:text-primary hover:bg-primary/10 transition-all border border-border/5 hover:border-primary/20 ${isExpanded ? 'px-4 py-3' : 'p-3'}`}
            title={`Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {state.theme === 'dark' ? <Sun className={`${isExpanded ? 'w-4 h-4' : 'w-5 h-5'} text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]`} /> : <Moon className={`${isExpanded ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />}
          </button>
          
          <button 
            onClick={toggleSidebar}
            className={`flex items-center justify-center gap-2 rounded-[14px] text-muted-foreground bg-muted/5 hover:text-foreground hover:bg-muted/20 transition-all border border-border/5 hover:border-border/10 font-black text-[9px] uppercase tracking-[0.3em] ${isExpanded ? 'flex-1 py-3' : 'p-3'}`}
            title={collapsed ? "Pin Sidebar" : "Unpin Sidebar"}
          >
            {collapsed ? <PinOff className={isExpanded ? 'w-3.5 h-3.5' : 'w-5 h-5'} /> : <Pin className={isExpanded ? 'w-3.5 h-3.5' : 'w-5 h-5'} />}
            {isExpanded && (collapsed ? "UNPINNED" : "PINNED")}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
