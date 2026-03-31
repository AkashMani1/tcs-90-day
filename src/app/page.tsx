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

const TAB_LABELS: Record<TabId, { label: string; icon: React.ElementType }> = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  roadmap: { label: '3-Month Roadmap', icon: GitMerge },
  dsa: { label: 'The Kill List', icon: Target },
  mocks: { label: 'Mock Hub', icon: Video },
  notes: { label: 'Knowledge Base', icon: BookOpen },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { label, icon: Icon } = TAB_LABELS[activeTab];

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onSettingsOpen={() => setSettingsOpen(true)} />

      {/* Main content */}
      <main className="flex-1 ml-[248px] min-h-screen">
        {/* Subtle dot grid bg */}
        <div
          className="fixed inset-0 ml-[248px] pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-slate-600 text-xs">
            <span>PlacePrep</span>
            <span>/</span>
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
        <footer className="relative z-10 border-t border-slate-800 mt-12 px-6 py-4 flex items-center justify-between">
          <p className="text-slate-700 text-xs">
            PlacePrep © 2026 · Built for TCS placement aspirants 🎯
          </p>
          <p className="text-slate-700 text-xs">All data stored locally. 100% private.</p>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex md:hidden z-50">
        {(Object.entries(TAB_LABELS) as [TabId, { label: string; icon: React.ElementType }][]).map(([id, { label, icon: Icon }]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${activeTab === id ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <Icon className="w-5 h-5" />
            {label.split(' ')[0]}
          </button>
        ))}
      </nav>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
