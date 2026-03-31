'use client';

import { useState } from 'react';
import { 
  Plus, Trash2, Video, X, Award, TrendingUp, MessageSquare, 
  ChevronRight, Calendar, Target, ShieldCheck, Zap, BarChart3,
  Search, Filter, ChevronDown, CheckCircle2, Save, PlayCircle,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { MockInterview } from '@/lib/types';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

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
    <div className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border/20 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 neon-glow-indigo">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-foreground font-black uppercase tracking-widest text-sm">Log Mission Performance</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Mission Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}
                className="w-full bg-muted/30 border border-border/10 rounded-2xl px-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-primary/40 appearance-none transition-all">
                {MOCK_TYPES.map((t) => <option key={t} className="bg-card text-foreground">{t}</option>)}
              </select>
            </div>

            <div>
               <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Raw Score</label>
               <input type="number" value={form.score} onChange={(e) => set('score', Number(e.target.value))} min={0} max={form.maxScore}
                className="w-full bg-muted/30 border border-border/10 rounded-2xl px-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-all" />
            </div>
            <div>
               <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Max Potential</label>
               <input type="number" value={form.maxScore} onChange={(e) => set('maxScore', Number(e.target.value))} min={1}
                className="w-full bg-muted/30 border border-border/10 rounded-2xl px-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-primary/40 transition-all" />
            </div>
          </div>

          <div>
             <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Execution Date</label>
             <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                  className="w-full bg-muted/30 border border-border/10 rounded-2xl pl-12 pr-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-primary/40 appearance-none transition-all" />
             </div>
          </div>

          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Debrief / Intelligence</label>
            <textarea value={form.feedback} onChange={(e) => set('feedback', e.target.value)} rows={4}
              placeholder="Record any critical failures or successful strategies..."
              className="w-full bg-muted/30 border border-border/10 rounded-2xl px-4 py-3.5 text-foreground text-sm focus:outline-none focus:border-primary/40 resize-none transition-all placeholder:text-muted-foreground font-medium" />
          </div>
        </div>

        <div className="flex gap-4 px-8 pb-8">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/20 text-[11px] font-black uppercase tracking-widest transition-all">Abort</button>
          <button onClick={() => { addMock(form); onClose(); }}
            className="flex-[2] py-4 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Finalize Record
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct >= 75 ? 'bg-secondary' : pct >= 50 ? 'bg-primary' : 'bg-primary-foreground';
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          className={`h-full ${color} rounded-full transition-all duration-1000`} 
        />
      </div>
      <div className="flex items-baseline gap-1 min-w-[60px] justify-end">
         <span className="text-foreground text-sm font-black tabular-nums">{score}</span>
         <span className="text-muted-foreground text-[10px] font-bold">/{max}</span>
      </div>
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
    <div className="grid grid-cols-12 gap-8">
      {showModal && <AddMockModal onClose={() => setShowModal(false)} />}

      {/* Row 1: Hero & Accuracy */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
            <div className="max-w-md">
               <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 neon-glow-indigo border border-primary/30">
                  <PlayCircle className="w-6 h-6 text-primary" />
               </div>
               <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight uppercase">Mock Intelligence</h2>
               <p className="text-muted-foreground text-sm font-medium">Currently documenting <span className="text-primary font-bold">{mocks.length} completed sessions</span>. Goal: 7 high-fidelity simulations for peak readiness.</p>
            </div>
            
            <div className="flex gap-12 items-center">
               <div className="text-center group">
                  <p className="text-5xl font-black text-foreground mb-2 group-hover:text-primary transition-all tabular-nums">{mocks.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 decoration-primary/30 decoration-2">Executed</p>
               </div>
               <div className="text-center group">
                  <p className="text-5xl font-black text-foreground mb-2 group-hover:text-secondary transition-all tabular-nums">{7 - mocks.length > 0 ? 7 - mocks.length : 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 decoration-secondary/30 decoration-2">Remaining</p>
               </div>
            </div>
         </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Performance Index">
         <div className="flex items-center justify-center h-full py-2">
            <ActivityRing value={avgScore} max={100} color="var(--primary)" label="Average Accuracy" />
         </div>
      </BentoCard>

      {/* Row 2: Navigation & Action */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
         <div className="flex bg-muted rounded-2xl p-1.5 w-full md:w-auto border border-border/10">
            <div className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <BarChart3 className="w-4 h-4 text-primary" /> Analytics Stream
            </div>
         </div>

         <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
         >
            <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" /> 
            Initiate New Simulation
         </button>
      </div>

      {/* Row 3: Logs & Tips */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
         <div className="space-y-4">
            {mocks.length === 0 ? (
               <div className="py-24 text-center border-2 border-dashed border-muted rounded-[32px]">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">No active logs in mission history</p>
               </div>
            ) : (
               mocks.map((m, idx) => {
                  const pct = Math.round((m.score / m.maxScore) * 100);
                  const isOpen = expandedId === m.id;
                  const colorClass = pct >= 75 ? 'text-secondary' : pct >= 50 ? 'text-primary' : 'text-primary-foreground';
                  const bgClass = pct >= 75 ? 'bg-secondary/20 border-secondary/30 text-secondary' : pct >= 50 ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground';
                  
                  return (
                    <motion.div 
                      key={m.id} 
                      layout
                      className="bg-card border border-border rounded-[32px] overflow-hidden group hover:border-primary/30 transition-all"
                    >
                      <button onClick={() => setExpandedId(isOpen ? null : m.id)} className="w-full flex items-center gap-6 px-8 py-6 text-left relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 border transition-all ${bgClass}`}>
                           {pct >= 75 ? <Award className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sim #{mocks.length - idx}</span>
                              <div className="h-1 w-1 rounded-full bg-muted" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground underline decoration-muted underline-offset-4">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                           </div>
                           <h4 className="text-foreground text-lg font-black tracking-tight">{m.type}</h4>
                        </div>
                        <div className="w-64 hidden md:block">
                           <ScoreBar score={m.score} max={m.maxScore} />
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-muted/30"
                          >
                             <div className="px-8 pb-8 pt-2 space-y-6">
                                <div className="h-px bg-border/50 w-full" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="space-y-4">
                                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                         <MessageSquare className="w-3.5 h-3.5 text-primary" /> Mission Intelligence
                                      </h5>
                                      <p className="text-foreground text-sm leading-relaxed font-medium bg-card p-5 rounded-2xl border border-border/10">
                                         {m.feedback || 'No debrief recorded for this simulation module.'}
                                      </p>
                                   </div>
                                   <div className="flex flex-col justify-between items-end">
                                      <div className="bg-card p-6 rounded-[24px] border border-border/10 w-full md:w-auto min-w-[200px]">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-4">Diagnostic Score</span>
                                         <div className="flex items-baseline gap-2">
                                            <span className={`text-5xl font-black ${colorClass}`}>{pct}</span>
                                            <span className="text-muted-foreground font-bold text-xl">%</span>
                                         </div>
                                      </div>
                                      <button 
                                        onClick={() => deleteMock(m.id)}
                                        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/20"
                                      >
                                         <Trash2 className="w-3.5 h-3.5" /> Purge Record
                                      </button>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
               })
            )}
         </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-8">
         <BentoCard title="Tactical Briefing" icon={Lightbulb} badge="Expert Insights">
            <div className="space-y-6 py-2">
               <div className="flex gap-2 flex-wrap">
                 {Object.keys(TIPS).map((key) => (
                   <button key={key} onClick={() => setSelectedTip(key)}
                     className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${selectedTip === key ? 'bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10' : 'bg-muted/50 border-border/10 text-muted-foreground hover:text-foreground'}`}>
                     {key.split(' ')[0]}
                   </button>
                 ))}
               </div>
               <div className="h-px bg-border/50 w-full" />
               <ul className="space-y-4">
                 {(TIPS[selectedTip] ?? []).map((tip, i) => (
                   <motion.li 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="flex items-start gap-4 p-4 bg-muted/40 border border-border/10 rounded-[24px] group hover:border-primary/20 transition-all"
                   >
                     <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/20 group-hover:neon-glow-indigo transition-all">
                        <ChevronRight className="w-3.5 h-3.5 text-primary" />
                     </div>
                     <span className="text-[13px] font-medium text-foreground leading-snug">{tip}</span>
                   </motion.li>
                 ))}
               </ul>
            </div>
         </BentoCard>

         <BentoCard className="bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
            <div className="flex flex-col items-center text-center py-6 gap-6">
               <div className="w-16 h-16 bg-secondary/20 rounded-[24px] flex items-center justify-center neon-glow-cyan border border-secondary/30">
                  <TrendingUp className="w-8 h-8 text-secondary" />
               </div>
               <div>
                  <h4 className="text-foreground font-black text-xl mb-2 tracking-tight uppercase">System Peak</h4>
                  <p className="text-muted-foreground text-xs font-medium leading-relaxed px-4">Your diagnostic accuracy has improved by <span className="text-secondary font-bold">12%</span> this week. Neutralize 2 more targets to reach Platinum readiness.</p>
               </div>
            </div>
         </BentoCard>
      </div>
    </div>
  );
}
