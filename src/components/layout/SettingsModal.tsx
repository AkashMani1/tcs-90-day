'use client';

import { useState, useEffect } from 'react';
import { X, Settings, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { state, updateProfile } = useApp();
  const [name, setName] = useState(state.userName);
  const [role, setRole] = useState(state.targetRole);
  const [startDate, setStartDate] = useState(state.startDate);

  const save = () => {
    updateProfile(name.trim() || 'Student', role, startDate);
    onClose();
  };

  const resetAll = () => {
    if (confirm('⚠️ This will delete ALL your data and reset to defaults. Are you sure?')) {
      localStorage.removeItem('placeprep_v1');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <h2 className="text-slate-100 font-bold">Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Target Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
              <option>Software Engineer</option>
              <option>SDE 1</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Data Analyst</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Prep Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            <p className="text-slate-600 text-xs mt-1">Used to calculate which week of the roadmap you are on.</p>
          </div>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <button onClick={save}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
            Save Changes
          </button>
          <button onClick={resetAll}
            className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}
