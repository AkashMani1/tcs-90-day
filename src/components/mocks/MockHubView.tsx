'use client';

import { useState } from 'react';
import { 
  Plus, Trash2, Video, X, Award, TrendingUp, MessageSquare, 
  ChevronRight, Calendar, Target, ShieldCheck, Zap, BarChart3,
  Search, Filter, ChevronDown, CheckCircle2, Save, PlayCircle,
  Lightbulb, Activity, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { MockInterview } from '@/lib/types';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

// ── Mock Data & Config ────────────────────────────────────────────────────────

const MOCK_TYPES = [
  'Aptitude Round',
  'Technical (DSA)',
  'HR Round',
  'Technical Interview',
  'System Design',
  'Behavioral',
  'Full Loop Mock',
];

const TIPS: Record<string, string[]> = {
  'Aptitude Round': ['Practice 30 aptitude questions in 30 min daily', 'Focus on verbal reasoning (4-5 questions)', 'Programming MCQ needs C/Java/Python proficiency'],
  'Technical (DSA)': ['Master graph and tree transversals', 'Practice 2 Medium level questions daily', 'Focus on time complexity optimization'],
  'Technical Interview': ['Prepare object-oriented programming concepts', 'Know your resume inside out', 'Be ready to explain your projects deeply'],
  'HR Round': ['Prepare 3 STAR stories for different traits', 'Research the company values and programs', 'Have 2-3 questions ready to ask the interviewer'],
  'System Design': ['Understand load balancing and caching', 'Practice designing scalability for high traffic', 'Draw the architecture diagrams clearly'],
};

// ── Modal Form ───────────────────────────────────────────────────────────────

function AddMockModal({ onClose }: { onClose: () => void }) {
  const { addMock } = useApp();
  const [form, setForm] = useState<Omit<MockInterview, 'id'>>({
    type: 'Technical (DSA)', score: 0, maxScore: 50, date: new Date().toISOString().split('T')[0], feedback: '',
  });
  const set = (k: keyof typeof form, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border/20 rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-border/10 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-foreground font-black uppercase tracking-[0.2em] text-sm">Start Interview Practice</h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Interview Module</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}
                className="w-full bg-muted/40 border border-border/10 rounded-[24px] px-6 py-4 text-foreground text-md font-bold focus:outline-none focus:border-primary appearance-none cursor-pointer">
                {MOCK_TYPES.map((t) => <option key={t} className="bg-card text-foreground">{t}</option>)}
              </select>
            </div>

            <div>
               <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Practice Score</label>
               <input type="number" value={form.score} onChange={(e) => set('score', Number(e.target.value))} min={0} max={form.maxScore}
                className="w-full bg-muted/40 border border-border/10 rounded-[20px] px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary transition-all" />
            </div>
            <div>
               <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Maximum Capacity</label>
               <input type="number" value={form.maxScore} onChange={(e) => set('maxScore', Number(e.target.value))} min={1}
                className="w-full bg-muted/40 border border-border/10 rounded-[20px] px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary transition-all" />
            </div>
          </div>

          <div>
             <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Practice Date</label>
             <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                  className="w-full bg-muted/40 border border-border/10 rounded-[20px] pl-16 pr-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary appearance-none transition-all cursor-pointer" />
             </div>
          </div>

          <div>
            <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Interview Debrief (Self Feedback)</label>
            <textarea value={form.feedback} onChange={(e) => set('feedback', e.target.value)} rows={4}
              placeholder="Identify core blockers, mistakes, and areas for improvement..."
              className="w-full bg-muted/40 border border-border/10 rounded-[28px] px-6 py-5 text-foreground text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none leading-relaxed placeholder:opacity-30" />
          </div>
        </div>

        <div className="flex gap-6 px-10 pb-10 pt-6 bg-muted/20">
          <button onClick={onClose} className="flex-1 py-5 rounded-[24px] border border-border/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 text-[11px] font-black uppercase tracking-[0.3em] transition-all">Cancel</button>
          <button onClick={() => { addMock(form); onClose(); }}
            className="flex-[2] py-5 rounded-[24px] bg-primary text-foreground text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
            <Save className="w-5 h-5" /> Save Mock Result
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function MockHubView() {
  const { state, deleteMock } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState('Technical');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mocks = [...state.mocks].sort((a, b) => b.date.localeCompare(a.date));
  const avgScore = mocks.length ? Math.round(mocks.reduce((s, m) => s + (m.score / m.maxScore) * 100, 0) / mocks.length) : 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-10"
    >
      {showModal && <AddMockModal onClose={() => setShowModal(false)} />}

      {/* Hero Header */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events_none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 py-4">
            <div className="max-w-md">
               <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
                  <PlayCircle className="w-7 h-7 text-primary" />
               </div>
               <h2 className="text-4xl font-black text-foreground mb-4 leading-none tracking-tight uppercase">INTERVIEW INSIGHTS</h2>
               <p className="text-muted-foreground text-md font-medium leading-relaxed">
                  Refining interview skills through realistic practice. Documenting <span className="text-primary font-black">{mocks.length} completed sessions</span>. Goal: 7 high-quality mock interviews.
               </p>
            </div>
            
            <div className="flex gap-14 items-center">
               <div className="text-center group">
                  <p className="text-6xl font-black text-foreground mb-4 group-hover:text-primary transition-all tabular-nums tracking-tighter">{mocks.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-primary/30 decoration-4">Practice Sessions</p>
               </div>
               <div className="text-center group">
                  <p className="text-6xl font-black text-foreground mb-4 group-hover:text-secondary transition-all tabular-nums tracking-tighter">{7 - mocks.length > 0 ? 7 - mocks.length : 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-secondary/30 decoration-4">Required</p>
               </div>
            </div>
         </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Average Precision">
         <div className="flex items-center justify-center h-full py-4">
            <ActivityRing value={avgScore} max={100} color="var(--primary)" label="Preparation Score" />
         </div>
      </BentoCard>

      {/* Row 2: Action Grid */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-8 pb-4">
         <div className="flex bg-muted/40 backdrop-blur-md rounded-[28px] p-2 w-full md:w-auto border border-border/10 shadow-lg px-8 py-3">
            <div className="rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-foreground/70 flex items-center gap-3">
               <BarChart3 className="w-5 h-5 text-primary" /> ANALYTICS STREAM ENABLED
            </div>
         </div>

         <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-primary text-foreground rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all group shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.03] active:scale-95"
         >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> 
            START NEW MOCK
         </button>
      </div>

      {/* Row 3: Logs & Feedback */}
      <div className="col-span-12 lg:col-span-8 space-y-10">
         <div className="space-y-6">
            {mocks.length === 0 ? (
               <motion.div variants={itemVariants} className="py-40 text-center border-2 border-dashed border-muted rounded-[48px] bg-muted/5">
                  <Video className="w-20 h-20 text-muted-foreground mx-auto mb-8 opacity-10" />
                  <p className="text-muted-foreground text-[13px] font-black uppercase tracking-[0.4em]">No practice sessions found in history</p>
               </motion.div>
            ) : (
               mocks.map((m, idx) => {
                  const pct = Math.round((m.score / m.maxScore) * 100);
                  const isOpen = expandedId === m.id;
                  const colorClass = pct >= 75 ? 'text-secondary' : pct >= 50 ? 'text-primary' : 'text-rose-500';
                  
                  return (
                    <motion.div 
                      key={m.id} 
                      layout
                      variants={itemVariants}
                      className={`bg-card border border-border/10 rounded-[40px] overflow-hidden hover:border-primary/30 transition-all shadow-2xl shadow-black/5 ${isOpen ? 'ring-2 ring-primary/10' : ''}`}
                    >
                      <button onClick={() => setExpandedId(isOpen ? null : m.id)} className="w-full flex items-center gap-8 px-10 py-10 text-left group/btn">
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center flex-shrink-0 border transition-all duration-500 ${
                           pct >= 75 ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-primary/10 border-primary/30 text-primary'
                        }`}>
                           {pct >= 75 ? <Award className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-4 mb-2 flex-wrap">
                              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">Session #{mocks.length - idx}</span>
                              <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground decoration-primary/20 underline underline-offset-4">{new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                           </div>
                           <h4 className="text-foreground text-2xl font-black tracking-tight uppercase group-hover/btn:text-primary transition-colors">{m.type}</h4>
                        </div>
                        <div className="hidden md:flex items-center gap-10 border-l border-border/10 pl-10 pr-4">
                           <div className="text-center">
                              <span className={`text-4xl font-black ${colorClass} tabular-nums mb-1 block tracking-tighter`}>{pct}%</span>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">Accuracy</span>
                           </div>
                           <div className={`p-4 rounded-2xl bg-muted/30 text-muted-foreground transition-all duration-500 ${isOpen ? 'rotate-180 text-primary bg-primary/10' : ''}`}>
                             <ChevronDown className="w-6 h-6" />
                           </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                             layout
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          >
                             <div className="px-10 pb-12 pt-4 space-y-10">
                                <div className="h-px bg-border/10 w-full" />
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                   <div className="md:col-span-8 space-y-6">
                                      <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 px-1">
                                         <MessageSquare className="w-5 h-5 text-primary" /> Session Performance Review
                                      </h5>
                                      <p className="text-foreground text-[15px] leading-relaxed font-bold bg-muted/10 p-8 rounded-[32px] border border-border/5 shadow-inner">
                                         {m.feedback || 'No feedback was recorded for this test.'}
                                      </p>
                                   </div>
                                   <div className="md:col-span-4 flex flex-col justify-between items-end gap-10">
                                      <div className="bg-muted/10 p-8 rounded-[32px] border border-border/10 w-full text-center relative overflow-hidden group/ring ring-inset ring-1 ring-white/5">
                                         <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/ring:opacity-100 transition-opacity" />
                                         <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground block mb-6 px-1">Score Analysis</span>
                                         <div className="flex items-baseline justify-center gap-2">
                                            <span className={`text-6xl font-black ${colorClass} tracking-tighter`}>{pct}</span>
                                            <span className="text-muted-foreground font-black text-2xl">%</span>
                                         </div>
                                      </div>
                                      <button 
                                        onClick={() => deleteMock(m.id)}
                                        className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-rose-500/20 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
                                      >
                                         <Trash2 className="w-4 h-4" /> REMOVE LOG
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

      {/* Sidebar Insights */}
      <div className="col-span-12 lg:col-span-4 space-y-10">
         <BentoCard title="Preparation Briefing" icon={Lightbulb} badge="Expert Tips">
            <div className="space-y-10 py-4">
               <div className="flex gap-2.5 flex-wrap">
                 {Object.keys(TIPS).map((key) => (
                   <button key={key} onClick={() => setSelectedTip(key)}
                     className={`text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-xl border transition-all ${selectedTip === key ? 'bg-primary text-foreground shadow-[0_5px_15px_rgba(var(--primary-rgb),0.3)] border-primary' : 'bg-muted/40 border-border/10 text-muted-foreground hover:bg-muted/60'}`}>
                     {key}
                   </button>
                 ))}
               </div>
               <div className="h-px bg-border/10 w-full" />
               <ul className="space-y-6">
                 {(TIPS[selectedTip] ?? []).map((tip, i) => (
                   <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-5 p-6 bg-muted/20 border border-border/5 rounded-[28px] group/tip hover:border-primary/20 transition-all shadow-lg"
                   >
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20 group-hover/tip:scale-110 group-hover/tip:bg-primary/20 transition-all duration-500">
                        <ChevronRight className="w-6 h-6 text-primary" />
                     </div>
                     <span className="text-[14px] font-bold text-foreground leading-snug opacity-80 group-hover/tip:opacity-100 transition-opacity">{tip}</span>
                   </motion.li>
                 ))}
               </ul>
            </div>
         </BentoCard>

         <BentoCard className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border-secondary/20 h-fit !p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="flex flex-col items-center text-center gap-10 relative z-10">
               <div className="w-20 h-20 bg-secondary/20 rounded-[28px] flex items-center justify-center border border-secondary/30 shadow-[0_0_30px_rgba(var(--secondary-rgb),0.2)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                  <TrendingUp className="w-10 h-10 text-secondary" />
               </div>
               <div>
                  <h4 className="text-foreground font-black text-3xl mb-4 tracking-tighter uppercase">SKILL GROWTH</h4>
                  <p className="text-muted-foreground text-md font-medium leading-relaxed">
                     Practice consistency improved by <span className="text-secondary font-black">12%</span> this cycle. Complete 2 more sessions to reach <span className="text-secondary font-black">Platinum Readiness</span>.
                  </p>
               </div>
               <button className="w-full py-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-foreground transition-all">View Leaderboard</button>
            </div>
         </BentoCard>
      </div>
    </motion.div>
  );
}
