'use client';

import { useState } from 'react';
import { 
  Plus, Trash2, Library, X, Edit3, ChevronDown, ChevronRight, Save,
  Star, ShieldCheck, Database, Zap, BookOpen, Brain, Fingerprint,
  PenTool, Eye, Search, Layers, Activity, Lock, Unlock, Terminal,
  Cpu, LayoutDashboard, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { StarStory, KnowledgeCategory } from '@/lib/types';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

// ── STAR Story Form ────────────────────────────────────────────────────────────

function StarForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<StarStory>;
  onSave: (s: Omit<StarStory, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    tag: initial?.tag ?? 'Leadership',
    situation: initial?.situation ?? '',
    task: initial?.task ?? '',
    action: initial?.action ?? '',
    result: initial?.result ?? '',
  });
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.situation && form.task && form.action && form.result;

  const TAGS = ['Leadership', 'Problem Solving', 'Teamwork', 'Innovation', 'Conflict Resolution', 'Failure & Learning', 'Initiative'];

  return (
    <div className="bg-obsidian-surface-high/30 border border-obsidian-surface-highest/20 rounded-[32px] p-8 space-y-8 relative overflow-hidden group hover:border-neon-indigo/30 transition-all">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
         <Star className="w-12 h-12 text-neon-indigo" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Behavioral Vector</label>
           <select value={form.tag} onChange={(e) => set('tag', e.target.value)}
            className="w-full bg-obsidian-surface-high/50 border border-obsidian-surface-highest/10 rounded-2xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-neon-indigo/40 appearance-none transition-all">
            {TAGS.map((t) => <option key={t} className="bg-obsidian-surface">{t}</option>)}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { k: 'situation' as const, label: 'SITUATION', icon: Database, color: 'text-neon-cyan', placeholder: 'Standardized context/background reporting...' },
          { k: 'task' as const, label: 'TASK', icon: Target, color: 'text-neon-indigo', placeholder: 'Specific mission objectives and responsibilities...' },
          { k: 'action' as const, label: 'ACTION', icon: Zap, color: 'text-neon-purple', placeholder: 'Tactical execution steps taken...' },
          { k: 'result' as const, label: 'RESULT', icon: ShieldCheck, color: 'text-neon-emerald', placeholder: 'Quantified metrics and mission outcome...' },
        ].map(({ k, label, icon: Icon, color, placeholder }) => (
          <div key={k} className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
               <Icon className={`w-3.5 h-3.5 ${color}`} />
               <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</label>
            </div>
            <textarea
              value={form[k]}
              onChange={(e) => set(k, e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full bg-obsidian-surface-high/50 border border-obsidian-surface-highest/10 rounded-2xl px-5 py-4 text-slate-200 text-sm focus:outline-none focus:border-neon-indigo/40 resize-none transition-all placeholder:text-slate-700 font-medium"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onCancel} className="flex-1 py-4 rounded-2xl border border-obsidian-surface-highest/10 text-slate-500 hover:text-white hover:bg-obsidian-surface-high/20 text-[11px] font-black uppercase tracking-widest transition-all">Abort</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid}
          className="flex-[2] py-4 rounded-2xl bg-neon-indigo text-white disabled:opacity-30 text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-neon-indigo/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Commit Story to Vault
        </button>
      </div>
    </div>
  );
}

// ── Knowledge Base ─────────────────────────────────────────────────────────────

export default function NotesVaultView() {
  const { state, addStar, updateStar, deleteStar, updateKnowledgeItem, addKnowledgeItem, deleteKnowledgeItem } = useApp();
  const [tab, setTab] = useState<'star' | 'hr' | 'core' | 'aptitude'>('star');
  
  // STAR specific state
  const [showStarForm, setShowStarForm] = useState(false);
  const [editStarId, setEditStarId] = useState<string | null>(null);
  const [expandedStar, setExpandedStar] = useState<string | null>(null);
  
  // Knowledge Base specific state
  const [editKbId, setEditKbId] = useState<string | null>(null);
  const [kbDraft, setKbDraft] = useState('');
  const [newKbQ, setNewKbQ] = useState('');
  const [addingKb, setAddingKb] = useState(false);

  const TABS = [
    { id: 'star' as const, label: 'STAR Stories', icon: Star },
    { id: 'core' as const, label: 'Core Systems', filter: 'Core CS' as KnowledgeCategory, icon: Cpu },
    { id: 'aptitude' as const, label: 'Aptitude Lab', filter: 'Aptitude' as KnowledgeCategory, icon: Activity },
    { id: 'hr' as const, label: 'HR Protocol', filter: 'HR' as KnowledgeCategory, icon: Fingerprint },
  ];

  const currentTabConfig = TABS.find((t) => t.id === tab);
  const filteredKnowledge = currentTabConfig?.filter
    ? (state.knowledgeBase || []).filter((k) => k.category === currentTabConfig.filter)
    : [];

  const STORIES_COUNT = state.stars.length;
  const KB_COUNT = (state.knowledgeBase || []).length;

  return (
    <div className="grid grid-cols-12 gap-8">
      
      {/* Row 1: Hero & Density */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
            <div className="max-w-md">
               <div className="w-12 h-12 bg-neon-purple/20 rounded-2xl flex items-center justify-center mb-6 neon-glow-purple border border-neon-purple/30">
                  <Library className="w-6 h-6 text-neon-purple-tint" />
               </div>
               <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Intelligence Vault</h2>
               <p className="text-slate-500 text-sm font-medium">Currently documenting <span className="text-neon-purple font-bold">{STORIES_COUNT} tactical stories</span> and <span className="text-neon-purple font-bold">{KB_COUNT} knowledge nodes</span>.</p>
            </div>
            
            <div className="flex gap-12 items-center">
               <div className="text-center group">
                  <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-purple transition-all tabular-nums">{STORIES_COUNT}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-purple/30 decoration-2">Tactical</p>
               </div>
               <div className="text-center group">
                  <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-cyan transition-all tabular-nums">{KB_COUNT}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-cyan/30 decoration-2">Nodes</p>
               </div>
            </div>
         </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Memory Integrity">
         <div className="flex items-center justify-center h-full py-2">
            <ActivityRing value={Math.min(100, STORIES_COUNT * 10 + KB_COUNT * 2)} max={100} color="#a855f7" label="Vault Completion" />
         </div>
      </BentoCard>

      {/* Row 2: Navigation Segmented Control */}
      <div className="col-span-12 flex flex-col lg:flex-row items-center justify-between gap-6 pb-2">
         <div className="flex bg-obsidian-surface-high/50 border border-obsidian-surface-highest/20 rounded-2xl p-1.5 w-full lg:w-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
               <button
                  key={id}
                  onClick={() => { setTab(id); setAddingKb(false); setEditKbId(null); }}
                  className={`flex-1 lg:w-48 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-3 ${tab === id ? 'bg-neon-purple text-white shadow-xl shadow-neon-purple/30' : 'text-slate-500 hover:text-slate-300'}`}
               >
                  <Icon className="w-3.5 h-3.5" /> {label}
               </button>
            ))}
         </div>

         {tab === 'star' ? (
           !showStarForm && (
             <button
                onClick={() => { setShowStarForm(true); setEditStarId(null); }}
                className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-neon-indigo text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group shadow-xl shadow-neon-indigo/20 hover:scale-[1.02] active:scale-95"
             >
                <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" /> 
                New Tactical Story
             </button>
           )
         ) : (
           !addingKb && (
             <button
                onClick={() => setAddingKb(true)}
                className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-neon-cyan text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group shadow-xl shadow-neon-cyan/20 hover:scale-[1.02] active:scale-95"
             >
                <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" /> 
                Add Intelligence Node
             </button>
           )
         )}
      </div>

      {/* Main Content Area */}
      <div className="col-span-12 space-y-8">
        
        {/* STAR Stories Implementation */}
        {tab === 'star' && (
          <div className="space-y-6">
            <AnimatePresence>
              {showStarForm && editStarId === null && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <StarForm onSave={(s) => { addStar(s); setShowStarForm(false); }} onCancel={() => setShowStarForm(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {state.stars.map((story) => {
                const isOpen = expandedStar === story.id;
                return (
                  <div key={story.id} className="group min-w-0">
                    {editStarId === story.id ? (
                      <StarForm
                        initial={story}
                        onSave={(s) => { updateStar(story.id, s); setEditStarId(null); }}
                        onCancel={() => setEditStarId(null)}
                      />
                    ) : (
                      <motion.div 
                        layout 
                        className={`bg-obsidian-surface-high/20 border border-obsidian-surface-highest/10 rounded-[32px] overflow-hidden hover:border-neon-indigo/30 transition-all ${isOpen ? 'ring-1 ring-neon-indigo/20' : ''}`}
                      >
                        <button onClick={() => setExpandedStar(isOpen ? null : story.id)} className="w-full flex items-center gap-6 px-8 py-6 text-left">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-neon-indigo/30 bg-neon-indigo/20 text-neon-indigo-tint neon-glow-indigo transition-all`}>
                              <Star className="w-6 h-6" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-1">{story.tag} Story</span>
                              <h4 className="text-white text-lg font-black tracking-tight line-clamp-1">{story.situation}</h4>
                           </div>
                           <ChevronDown className={`w-5 h-5 text-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180 text-neon-indigo' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                               <div className="px-8 pb-8 pt-2 space-y-8">
                                  <div className="h-px bg-obsidian-surface-highest/10 w-full" />
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     {[
                                       { label: 'SITUATION', val: story.situation, color: 'text-neon-cyan' },
                                       { label: 'TASK', val: story.task, color: 'text-neon-indigo' },
                                       { label: 'ACTION', val: story.action, color: 'text-neon-purple' },
                                       { label: 'RESULT', val: story.result, color: 'text-neon-emerald' },
                                     ].map(({ label, val, color }) => (
                                       <div key={label} className="space-y-2">
                                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>{label}</p>
                                          <p className="text-slate-300 text-sm leading-relaxed font-medium bg-obsidian-surface-high/30 p-5 rounded-2xl border border-obsidian-surface-highest/5">
                                             {val}
                                          </p>
                                       </div>
                                     ))}
                                  </div>
                                  <div className="flex gap-4 pt-4">
                                     <button onClick={() => setEditStarId(story.id)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-obsidian-surface-high/40 border border-obsidian-surface-highest/10 text-slate-400 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest"><Edit3 className="w-4 h-4" /> Edit Record</button>
                                     <button onClick={() => deleteStar(story.id)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-[11px] font-black uppercase tracking-widest"><Trash2 className="w-4 h-4" /> Purge</button>
                                  </div>
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Knowledge Base Tabs Terminal Implementation */}
        {tab !== 'star' && currentTabConfig && (
          <div className="space-y-6">
            <AnimatePresence>
              {addingKb && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="bg-obsidian-surface-high/30 border border-neon-cyan/20 rounded-[32px] p-8 space-y-6">
                    <div className="flex items-center gap-3 text-neon-cyan mb-2">
                       <Terminal className="w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Initiation</span>
                    </div>
                    <input
                      autoFocus
                      value={newKbQ}
                      onChange={(e) => setNewKbQ(e.target.value)}
                      placeholder="Identify specific node topic (e.g. Virtual Memory, Deadlocks)..."
                      className="w-full bg-obsidian-surface-high/50 border border-obsidian-surface-highest/10 rounded-2xl px-6 py-4 text-slate-200 text-lg font-black focus:outline-none focus:border-neon-cyan/40 appearance-none transition-all placeholder:text-slate-700"
                    />
                    <div className="flex gap-4">
                      <button onClick={() => { if (newKbQ.trim() && currentTabConfig.filter) { addKnowledgeItem(newKbQ.trim(), currentTabConfig.filter); setNewKbQ(''); setAddingKb(false); } }}
                        className="px-8 py-4 bg-neon-cyan text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-neon-cyan/20 transition-all hover:scale-[1.02] active:scale-95">Open Node</button>
                      <button onClick={() => { setAddingKb(false); setNewKbQ(''); }}
                        className="px-8 py-4 border border-obsidian-surface-highest/10 text-slate-500 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all">Abort</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredKnowledge.map((qa) => (
                <div key={qa.id} className="bg-obsidian-surface-high/20 border border-obsidian-surface-highest/10 rounded-[32px] p-8 space-y-6 group hover:border-neon-cyan/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neon-cyan/10 rounded-xl flex items-center justify-center border border-neon-cyan/20">
                        <Terminal className="w-5 h-5 text-neon-cyan" />
                      </div>
                      <h4 className="text-white text-md font-black tracking-tight leading-snug">{qa.question}</h4>
                    </div>
                    <button onClick={() => deleteKnowledgeItem(qa.id)} className="p-2 text-slate-700 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  {editKbId === qa.id ? (
                    <div className="space-y-4">
                      <textarea
                        autoFocus
                        value={kbDraft}
                        onChange={(e) => setKbDraft(e.target.value)}
                        rows={8}
                        className="w-full bg-obsidian-surface-high/50 border border-neon-cyan/30 rounded-2xl px-5 py-4 text-neon-cyan-tint text-sm focus:outline-none resize-none font-mono leading-relaxed"
                      />
                      <div className="flex gap-3">
                        <button onClick={() => { updateKnowledgeItem(qa.id, kbDraft); setEditKbId(null); }}
                          className="px-6 py-2.5 bg-neon-cyan text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-neon-cyan/20">Save Protocol</button>
                        <button onClick={() => setEditKbId(null)} className="px-6 py-2.5 border border-obsidian-surface-highest/10 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Abort</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-obsidian-surface-high/40 rounded-2xl p-6 border border-obsidian-surface-highest/5 relative">
                        <p className="text-slate-400 text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
                          {qa.answer || 'NODE_EMPTY: No intelligence data mapped for this sector. Click edit to initiate data recording.'}
                        </p>
                      </div>
                      <button onClick={() => { setEditKbId(qa.id); setKbDraft(qa.answer); }}
                        className="flex items-center gap-2 text-slate-600 hover:text-neon-cyan transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                        <Edit3 className="w-4 h-4" /> Modify Protocol Data
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredKnowledge.length === 0 && !addingKb && (
               <div className="text-center py-20 border-2 border-dashed border-obsidian-surface-highest/10 rounded-[40px]">
                  <Cpu className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                  <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em]">No node mapped to this intelligence sector</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
