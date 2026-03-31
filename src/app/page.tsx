'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar, { TabId } from '@/components/layout/Sidebar';
import SettingsModal from '@/components/layout/SettingsModal';
import DashboardView from '@/components/dashboard/DashboardView';
import RoadmapView from '@/components/roadmap/RoadmapView';
import DSATrackerView from '@/components/dsa/DSATrackerView';
import MockHubView from '@/components/mocks/MockHubView';
import NotesVaultView from '@/components/notes/NotesVaultView';
import { LayoutDashboard, GitMerge, Code2, Video, BookOpen, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const TAB_LABELS: Record<TabId, { label: string; icon: React.ElementType }> = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  roadmap: { label: '3-Month Roadmap', icon: GitMerge },
  dsa: { label: 'The Kill List', icon: Target },
  mocks: { label: 'Mock Hub', icon: Video },
  notes: { label: 'Knowledge Base', icon: BookOpen },
};

export default function Home() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { label, icon: Icon } = TAB_LABELS[activeTab];
  const collapsed = state.sidebarCollapsed;

  return (
    <div className="flex min-h-screen bg-obsidian selection:bg-neon-indigo/30 selection:text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onSettingsOpen={() => setSettingsOpen(true)} />

      {/* Main content */}
      <motion.main 
        initial={false}
        animate={{ marginLeft: collapsed ? '80px' : '260px' }}
        className="flex-1 min-h-screen relative"
      >
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-indigo/5 blur-[120px] rounded-full" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-10">
          {/* Header / Breadcrumb Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="hover:text-neon-indigo transition-colors cursor-pointer">PlacePrep</span>
                <span className="text-obsidian-surface-highest">/</span>
                <div className="flex items-center gap-1.5 text-neon-indigo-tint font-black">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </div>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                {activeTab === 'dashboard' ? (
                  <>Morning, <span className="bg-gradient-to-r from-neon-indigo-tint to-neon-cyan-tint bg-clip-text text-transparent">{state.userName}</span></>
                ) : label}
              </h1>
            </div>
            
            {/* Global Actions can go here */}
          </header>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'roadmap' && <RoadmapView />}
              {activeTab === 'dsa' && <DSATrackerView />}
              {activeTab === 'mocks' && <MockHubView />}
              {activeTab === 'notes' && <NotesVaultView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-obsidian-surface-highest/10 mt-20 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">
            StudyOS / PlacePrep © 2026
          </p>
          <div className="flex items-center gap-6">
             <span className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Encrypted Local Storage</span>
             <span className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">v5.4.0-obsidian</span>
          </div>
        </footer>
      </motion.main>

      {/* Mobile bottom nav - hidden by CSS but here for structure */}
      <nav className="fixed bottom-0 left-0 right-0 bg-obsidian/95 backdrop-blur-xl border-t border-obsidian-surface-highest/20 flex md:hidden z-50">
        {(Object.entries(TAB_LABELS) as [TabId, { label: string; icon: React.ElementType }][]).map(([id, { label, icon: Icon }]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === id ? 'text-neon-indigo' : 'text-slate-600'}`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            {label.split(' ')[0]}
          </button>
        ))}
      </nav>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

