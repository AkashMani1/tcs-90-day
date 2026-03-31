'use client';

import { useState } from 'react';
import { 
  Plus, Trash2, Layers, X, Edit3, ChevronDown, ChevronRight, Save,
  Cpu, Zap, ShieldCheck, Target, ExternalLink, Github, Globe,
  Layout, Kanban, Database, BarChart3, AlertCircle, CheckCircle2,
  Trophy, MessageSquare, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { ProjectRecord, ProjectChallenge } from '@/lib/types';
import { BentoCard, ActivityRing } from '@/components/ui/Bento';

// ── Project Modal Form ────────────────────────────────────────────────────────

function AddProjectModal({ onClose }: { onClose: () => void }) {
  const { addProject } = useApp();
  const [techInput, setTechInput] = useState('');
  const [form, setForm] = useState<Omit<ProjectRecord, 'id' | 'readinessScore' | 'challenges'>>({
    name: '',
    description: '',
    role: 'Full Stack Developer',
    techStack: [],
    metrics: [],
    status: 'Development',
  });

  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }));
  
  const addTech = (t: string) => {
    const val = t.trim();
    if (val && !form.techStack.includes(val)) {
      set('techStack', [...form.techStack, val]);
      setTechInput('');
    }
  };

  const removeTech = (t: string) => {
    set('techStack', form.techStack.filter((x) => x !== t));
  };

  const save = () => {
    if (form.name && form.description) {
      addProject({ ...form, challenges: [] });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-obsidian-surface border border-obsidian-surface-highest/20 rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-obsidian-surface-highest/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neon-cyan/20 rounded-xl flex items-center justify-center border border-neon-cyan/30 neon-glow-cyan">
              <Layers className="w-5 h-5 text-neon-cyan-tint" />
            </div>
            <h2 className="text-white font-black uppercase tracking-widest text-sm">Initiate Project Node</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-obsidian-surface-high/40 transition-all"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Project Identifier</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Distributed Task Orchestrator"
                className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-2xl px-5 py-3.5 text-slate-200 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all placeholder:text-slate-700" />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Operational Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
                placeholder="Core mission and technical value proposition..."
                className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-2xl px-5 py-3.5 text-slate-200 text-sm focus:outline-none focus:border-neon-cyan/40 resize-none transition-all placeholder:text-slate-700" />
            </div>

            <div>
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Tier / Role</label>
              <input type="text" value={form.role} onChange={(e) => set('role', e.target.value)}
                className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-2xl px-5 py-3.5 text-slate-200 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all" />
            </div>

            <div>
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Current Sector Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-2xl px-5 py-3.5 text-slate-200 text-sm focus:outline-none focus:border-neon-cyan/40 appearance-none transition-all">
                <option value="Development" className="bg-obsidian-surface">In Development</option>
                <option value="Completed" className="bg-obsidian-surface">Production Ready</option>
                <option value="Live" className="bg-obsidian-surface">Live Operation</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Technology Stack</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.techStack.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan-tint text-[10px] font-black uppercase flex items-center gap-2 group">
                    {t}
                    <button onClick={() => removeTech(t)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={techInput} 
                  onChange={(e) => setTechInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && addTech(techInput)}
                  placeholder="Add Tech Node (e.g. React, Go, Kafka)..."
                  className="flex-1 bg-obsidian-surface-high/30 border border-obsidian-surface-highest/10 rounded-2xl px-5 py-3 text-slate-200 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all placeholder:text-slate-700" 
                />
                <button onClick={() => addTech(techInput)} className="px-5 py-3 bg-obsidian-surface-highest/20 text-white rounded-2xl hover:bg-obsidian-surface-highest/40 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-8 pb-8 pt-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-obsidian-surface-highest/10 text-slate-500 hover:text-white hover:bg-obsidian-surface-high/20 text-[11px] font-black uppercase tracking-widest transition-all">Abort</button>
          <button onClick={save}
            className="flex-[2] py-4 rounded-2xl bg-neon-cyan text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-neon-cyan/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Finalize Node
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Challenge SAR Editor ──────────────────────────────────────────────────────

function ChallengeItem({ 
  challenge, 
  onUpdate, 
  onDelete 
}: { 
  challenge: ProjectChallenge; 
  onUpdate: (updates: Partial<ProjectChallenge>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-obsidian-surface-high/20 border border-obsidian-surface-highest/5 rounded-3xl p-6 space-y-6 group/item hover:border-neon-purple/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <MessageSquare className="w-3.5 h-3.5 text-neon-purple" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SAR Vector</span>
        </div>
        <button onClick={onDelete} className="opacity-0 group-hover/item:opacity-100 p-1.5 text-slate-700 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { k: 'problem' as const, label: 'SITUATION', color: 'text-neon-cyan' },
          { k: 'solution' as const, label: 'ACTION', color: 'text-neon-indigo' },
          { k: 'result' as const, label: 'RESULT', color: 'text-neon-emerald' },
        ].map(({ k, label, color }) => (
          <div key={k} className="space-y-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
            <textarea
              value={challenge[k]}
              onChange={(e) => onUpdate({ [k]: e.target.value })}
              className="w-full bg-obsidian-surface-high/30 border border-obsidian-surface-highest/5 rounded-xl px-4 py-3 text-slate-300 text-xs focus:outline-none focus:border-neon-purple/30 resize-none min-h-[100px] font-medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────

export default function ProjectLabView() {
  const { state, addProject, updateProject, deleteProject } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const projects = state.projects || [];
  const readinessCount = projects.filter(p => p.readinessScore >= 80).length;
  const avgReadiness = projects.length ? Math.round(projects.reduce((s, p) => s + p.readinessScore, 0) / projects.length) : 0;

  const addNewChallenge = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const newChallenge: ProjectChallenge = {
        id: Math.random().toString(36).substr(2, 9),
        problem: '',
        solution: '',
        result: ''
      };
      updateProject(projectId, { challenges: [...project.challenges, newChallenge] });
    }
  };

  const updateChallenge = (projectId: string, challengeId: string, updates: Partial<ProjectChallenge>) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const newChallenges = project.challenges.map(c => c.id === challengeId ? { ...c, ...updates } : c);
      
      // Auto-calculate readiness score based on filled challenges
      const validChallenges = newChallenges.filter(c => c.problem && c.solution && c.result).length;
      const newReadiness = Math.min(100, (validChallenges * 25) + (project.techStack.length * 5) + (project.description ? 10 : 0));
      
      updateProject(projectId, { challenges: newChallenges, readinessScore: newReadiness });
    }
  };

  const deleteChallenge = (projectId: string, challengeId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      updateProject(projectId, { challenges: project.challenges.filter(c => c.id !== challengeId) });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      {showModal && <AddProjectModal onClose={() => setShowModal(false)} />}

      {/* Row 1: Hero & Readiness */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
            <div className="max-w-md">
               <div className="w-12 h-12 bg-neon-cyan/20 rounded-2xl flex items-center justify-center mb-6 neon-glow-cyan border border-neon-cyan/30">
                  <Database className="w-6 h-6 text-neon-cyan-tint" />
               </div>
               <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase tracking-tighter">Project Lab</h2>
               <p className="text-slate-500 text-sm font-medium">Preparing <span className="text-neon-cyan font-bold">{projects.length} architectural nodes</span>. {readinessCount} are currently optimized for interview deployment.</p>
            </div>
            
            <div className="flex gap-12 items-center">
               <div className="text-center group">
                  <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-cyan transition-all tabular-nums">{projects.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-cyan/30 decoration-2">Nodes Map</p>
               </div>
               <div className="text-center group">
                  <p className="text-5xl font-black text-white mb-2 group-hover:text-neon-emerald transition-all tabular-nums">{readinessCount}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 underline underline-offset-8 decoration-neon-emerald/30 decoration-2">Ready</p>
               </div>
            </div>
         </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Interview Ready">
         <div className="flex items-center justify-center h-full py-2">
            <ActivityRing value={avgReadiness} max={100} color="#06b6d4" label="Global Readiness" />
         </div>
      </BentoCard>

      {/* Row 2: Navigation & Action */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
         <div className="flex bg-obsidian-surface-high/50 border border-obsidian-surface-highest/20 rounded-2xl p-1.5 w-full md:w-auto">
            <div className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
               <Kanban className="w-4 h-4 text-neon-cyan" /> Repository Stream
            </div>
         </div>

         <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-neon-cyan text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group shadow-xl shadow-neon-cyan/20 hover:scale-[1.02] active:scale-95"
         >
            <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" /> 
            Initiate Architecture Node
         </button>
      </div>

      {/* Row 3: Projects Grid */}
      <div className="col-span-12 space-y-6">
        {projects.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-obsidian-surface-highest/10 rounded-[40px]">
            <Cpu className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
            <p className="text-slate-600 text-xs font-black uppercase tracking-[0.3em]">No project nodes mapped to this sector</p>
            <button onClick={() => setShowModal(true)} className="mt-8 text-neon-cyan text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Run Initialization Protocol</button>
          </div>
        ) : (
          projects.map((project) => {
            const isOpen = expandedId === project.id;
            const scoreColor = project.readinessScore >= 80 ? 'text-neon-emerald' : project.readinessScore >= 40 ? 'text-neon-indigo' : 'text-neon-purple';
            
            return (
              <motion.div 
                key={project.id} 
                layout 
                className={`bg-obsidian-surface-high/20 border border-obsidian-surface-highest/10 rounded-[32px] overflow-hidden hover:border-neon-cyan/30 transition-all ${isOpen ? 'ring-1 ring-neon-cyan/20' : ''}`}
              >
                <button onClick={() => setExpandedId(isOpen ? null : project.id)} className="w-full flex flex-col md:flex-row md:items-center gap-6 px-8 py-8 text-left group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-neon-cyan/30 bg-neon-cyan/20 text-neon-cyan-tint neon-glow-cyan transition-all flex-shrink-0`}>
                    <Cpu className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{project.role}</span>
                      <div className="h-1 w-1 rounded-full bg-slate-800" />
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-black uppercase tracking-widest ${
                        project.status === 'Live' ? 'border-neon-emerald text-neon-emerald bg-neon-emerald/5' : 'border-slate-800 text-slate-500'
                      }`}>{project.status}</span>
                    </div>
                    <h4 className="text-white text-xl font-black tracking-tight mb-2 group-hover:text-neon-cyan transition-colors">{project.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map(t => (
                        <span key={t} className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-2 py-1 bg-obsidian-surface-high/40 rounded-lg"># {t}</span>
                      ))}
                      {project.techStack.length > 4 && <span className="text-[9px] font-black text-slate-700">+{project.techStack.length - 4} MORE</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-12 flex-shrink-0 md:border-l border-obsidian-surface-highest/10 md:pl-12">
                    <div className="text-center">
                       <span className={`text-4xl font-black ${scoreColor} tabular-nums mb-1 block`}>{project.readinessScore}%</span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Readiness</span>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180 text-neon-cyan' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div className="px-8 pb-10 pt-2 space-y-10">
                        <div className="h-px bg-obsidian-surface-highest/10 w-full" />
                        
                        {/* Description & Links */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                           <div className="lg:col-span-2 space-y-4">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                 <Layout className="w-4 h-4 text-neon-cyan" /> Core Overview
                              </h5>
                              <p className="text-slate-300 text-[13px] leading-relaxed font-medium bg-obsidian-surface-high/30 p-6 rounded-[28px] border border-obsidian-surface-highest/5">
                                 {project.description}
                              </p>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-4">
                                 <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Nodes</h5>
                                 <div className="space-y-2">
                                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-obsidian-surface-high/30 border border-obsidian-surface-highest/5 hover:border-neon-cyan/20 transition-all group/link">
                                       <div className="flex items-center gap-3">
                                          <Github className="w-4 h-4 text-slate-500 group-hover/link:text-white transition-colors" />
                                          <span className="text-xs font-bold text-slate-300">Repository</span>
                                       </div>
                                       <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-obsidian-surface-high/30 border border-obsidian-surface-highest/5 hover:border-neon-cyan/20 transition-all group/link">
                                       <div className="flex items-center gap-3">
                                          <Globe className="w-4 h-4 text-slate-500 group-hover/link:text-white transition-colors" />
                                          <span className="text-xs font-bold text-slate-300">Live Operation</span>
                                       </div>
                                       <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Challenges Section */}
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                 <Briefcase className="w-4 h-4 text-neon-purple" /> Strategic Context (SAR)
                              </h5>
                              <button 
                                onClick={() => addNewChallenge(project.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-purple/20 border border-neon-purple/30 text-neon-purple-tint text-[10px] font-black uppercase tracking-widest hover:bg-neon-purple hover:text-white transition-all shadow-lg shadow-neon-purple/20"
                              >
                                 <Plus className="w-3.5 h-3.5" /> Log Challenge
                              </button>
                           </div>
                           
                           {project.challenges.length === 0 ? (
                              <div className="bg-obsidian-surface-high/10 border-2 border-dashed border-obsidian-surface-highest/5 rounded-[32px] py-12 text-center">
                                 <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest leading-loose">No strategic vectors logged.<br />Prepare your SAR responses for interviews.</p>
                              </div>
                           ) : (
                              <div className="space-y-6">
                                 {project.challenges.map((challenge) => (
                                    <ChallengeItem 
                                       key={challenge.id} 
                                       challenge={challenge} 
                                       onUpdate={(upd) => updateChallenge(project.id, challenge.id, upd)}
                                       onDelete={() => deleteChallenge(project.id, challenge.id)}
                                    />
                                 ))}
                              </div>
                           )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center gap-4 pt-4">
                           <button onClick={() => deleteProject(project.id)} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/20 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all text-[11px] font-black uppercase tracking-widest"><Trash2 className="w-4 h-4" /> Finalize Destruction</button>
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
  );
}
