'use client';

import { useState } from 'react';
import { Plus, Trash2, Video, X, Award, TrendingUp, MessageSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MockInterview } from '@/lib/types';

const MOCK_TYPES = [
  'TCS NQT Pattern',
  'Technical (DSA)',
  'HR Round',
  'TCS Digital Coding',
  'System Design',
  'Behavioral',
  'Full Loop Mock',
];

const TIPS: Record<string, string[]> = {
  'TCS NQT Pattern': ['Practice 30 aptitude questions in 30 min daily', 'Focus on verbal reasoning (4-5 questions)', 'Programming MCQ needs C/Java/Python proficiency'],
  'Technical (DSA)': ['Always explain your thought process aloud', 'Start with brute force, then optimize', 'Ask clarifying questions before coding'],
  'HR Round': ['Prepare 3 STAR stories for different traits', 'Research TCS values and programs', 'Have 2-3 questions ready to ask the interviewer'],
  'TCS Digital Coding': ['Practice medium-hard LeetCode under time pressure', 'Know space-time complexity cold', 'CodeVita problems are 2-3 hour marathons'],
};

function AddMockModal({ onClose }: { onClose: () => void }) {
  const { addMock } = useApp();
  const [form, setForm] = useState<Omit<MockInterview, 'id'>>({
    type: 'Technical (DSA)', score: 0, maxScore: 50, date: new Date().toISOString().split('T')[0], feedback: '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const pct = form.maxScore > 0 ? Math.round((form.score / form.maxScore) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-slate-100 font-bold">Log Mock Interview</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Interview Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500">
              {MOCK_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Score</label>
              <input type="number" value={form.score} onChange={(e) => set('score', Number(e.target.value))} min={0} max={form.maxScore}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Out of</label>
              <input type="number" value={form.maxScore} onChange={(e) => set('maxScore', Number(e.target.value))} min={1}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="text-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
              <p className={`text-xl font-black ${pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</p>
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Date</label>
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold mb-1.5 block">Feedback / Notes</label>
            <textarea value={form.feedback} onChange={(e) => set('feedback', e.target.value)} rows={3}
              placeholder="What went well? What needs improvement?"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold">Cancel</button>
          <button onClick={() => { addMock(form); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
            Log Mock
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct >= 75 ? 'from-emerald-500 to-emerald-400' : pct >= 50 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-slate-300 text-xs font-bold w-12 text-right">{score}/{max}</span>
      <span className={`text-xs font-bold w-9 text-right ${pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{Math.round(pct)}%</span>
    </div>
  );
}

export default function MockHubView() {
  const { state, deleteMock } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState('Technical (DSA)');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mocks = [...state.mocks].sort((a, b) => b.date.localeCompare(a.date));
  const avgScore = mocks.length ? Math.round(mocks.reduce((s, m) => s + (m.score / m.maxScore) * 100, 0) / mocks.length) : 0;
  const best = mocks.reduce((best, m) => (m.score / m.maxScore > (best?.score ?? 0) / (best?.maxScore ?? 1) ? m : best), mocks[0]);

  return (
    <div className="space-y-5">
      {showModal && <AddMockModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100">Mock Hub</h1>
            <p className="text-slate-500 text-sm">{mocks.length} mocks logged · Target: 7</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" /> Log Mock
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Mocks Done', val: mocks.length, icon: Video, color: 'indigo' },
          { label: 'Avg Score', val: `${avgScore}%`, icon: TrendingUp, color: 'emerald' },
          { label: 'Best Score', val: best ? `${Math.round((best.score / best.maxScore) * 100)}%` : '—', icon: Award, color: 'amber' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center">
            <div className={`w-10 h-10 bg-${color}-500/10 rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <p className={`text-2xl font-black text-${color}-400`}>{val}</p>
            <p className="text-slate-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress toward 7 */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400 text-sm font-semibold">Progress to 7 Mocks</span>
          <span className="text-indigo-400 text-sm font-bold">{mocks.length}/7</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex-1 h-3 rounded-full transition-all duration-500 ${i < mocks.length ? 'bg-indigo-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* Mock list */}
      <div className="space-y-3">
        {mocks.length === 0 ? (
          <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl py-16 text-center">
            <Video className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No mocks logged yet.</p>
            <p className="text-slate-600 text-xs mt-1">Log your first mock interview to start tracking.</p>
          </div>
        ) : (
          mocks.map((m, idx) => {
            const pct = Math.round((m.score / m.maxScore) * 100);
            const isOpen = expandedId === m.id;
            return (
              <div key={m.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedId(isOpen ? null : m.id)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-800/60 transition-colors text-left">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${pct >= 75 ? 'bg-emerald-500/20 text-emerald-400' : pct >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                    #{mocks.length - idx}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-bold">{m.type}</p>
                    <p className="text-slate-500 text-xs">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="w-48 hidden sm:block">
                    <ScoreBar score={m.score} max={m.maxScore} />
                  </div>
                </button>
                {isOpen && m.feedback && (
                  <div className="px-5 pb-4 border-t border-slate-700/40 pt-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-400 text-sm leading-relaxed">{m.feedback}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between px-5 pb-4">
                  <div className="sm:hidden"><ScoreBar score={m.score} max={m.maxScore} /></div>
                  <button onClick={() => deleteMock(m.id)} className="ml-auto text-slate-700 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tips section */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="text-slate-200 font-bold text-sm mb-3">Interview Tips</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(TIPS).map((key) => (
            <button key={key} onClick={() => setSelectedTip(key)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${selectedTip === key ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}>
              {key}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {(TIPS[selectedTip] ?? []).map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
