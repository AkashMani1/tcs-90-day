/* Developed by Akash Mani - This site is developed by Akash Mani. Original watermark of Akash Mani. */
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
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.6, 
      ease: 'easeOut'
    }
  }
};

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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border/20 rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-border/10 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-foreground font-black uppercase tracking-[0.2em] text-sm">Add New Project</h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Project Title</label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Distributed Task Orchestrator v2.0"
                className="w-full bg-muted/40 border border-border/10 rounded-2xl px-6 py-4 text-foreground text-md font-bold focus:outline-none focus:border-primary/50 transition-all placeholder:opacity-30" />
            </div>

            <div className="md:col-span-2">
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Project Summary</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
                placeholder="Key highlights and core technical value of this project..."
                className="w-full bg-muted/40 border border-border/10 rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-primary/50 resize-none transition-all placeholder:opacity-30 font-medium leading-relaxed" />
            </div>

            <div>
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">My Role</label>
              <input type="text" value={form.role} onChange={(e) => set('role', e.target.value)}
                className="w-full bg-muted/40 border border-border/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary/50 transition-all" />
            </div>

            <div>
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Project Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full bg-muted/40 border border-border/10 rounded-2xl px-6 py-4 text-foreground text-sm font-bold focus:outline-none focus:border-primary/50 appearance-none transition-all cursor-pointer">
                <option value="Development" className="bg-card">Phase: In Development</option>
                <option value="Completed" className="bg-card">Phase: Optimization Ready</option>
                <option value="Live" className="bg-card">Phase: Live Operation</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1">Tech Stack</label>
              <div className="flex flex-wrap gap-3 mb-4">
                <AnimatePresence>
                  {form.techStack.map((t) => (
                    <motion.span 
                      key={t}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                    >
                      {t}
                      <button onClick={() => removeTech(t)} className="hover:text-foreground transition-all duration-300"><X className="w-3.5 h-3.5" /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={techInput} 
                  onChange={(e) => setTechInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && addTech(techInput)}
                  placeholder="Add technology (React, Go, AWS)..."
                  className="flex-1 bg-muted/40 border border-border/10 rounded-2xl px-6 py-4 text-foreground text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:opacity-30 font-medium" 
                />
                <button onClick={() => addTech(techInput)} className="px-6 py-4 bg-muted hover:bg-muted-foreground/10 text-foreground rounded-2xl transition-all border border-border/10">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 px-10 pb-10 pt-6 bg-muted/20">
          <button onClick={onClose} className="flex-1 py-5 rounded-[24px] border border-border/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 text-[11px] font-black uppercase tracking-[0.3em] transition-all">Cancel</button>
          <button onClick={save}
            className="flex-[2] py-5 rounded-[24px] bg-primary text-foreground text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
            <Save className="w-5 h-5" /> Save Project
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
    <motion.div 
      variants={itemVariants}
      className="bg-card border border-border/10 rounded-[32px] p-8 space-y-8 group/item hover:border-primary/30 transition-all shadow-xl shadow-black/5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <MessageSquare className="w-4 h-4 text-secondary" />
           </div>
           <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Technical Implementation</span>
        </div>
        <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-rose-500 transition-all bg-muted/40 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {[
          { k: 'problem' as const, label: 'SITUATION & CHALLENGE', icon: Layout, color: 'text-secondary' },
          { k: 'solution' as const, label: 'MY ACTIONS', icon: Zap, color: 'text-primary' },
          { k: 'result' as const, label: 'QUANTIFIED OUTCOME', icon: Trophy, color: 'text-emerald-500' },
        ].map(({ k, label, icon: Icon, color }) => (
          <div key={k} className="space-y-4">
            <div className="flex items-center gap-2 px-1">
               <Icon className={`w-3.5 h-3.5 ${color}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>{label}</span>
            </div>
            <textarea
              value={challenge[k]}
              onChange={(e) => onUpdate({ [k]: e.target.value })}
              placeholder={`Describe the ${k}...`}
              className="w-full bg-muted/30 border border-border/5 rounded-[24px] px-6 py-5 text-foreground text-sm focus:outline-none focus:border-primary/30 focus:bg-muted/50 resize-none min-h-[160px] font-medium leading-relaxed transition-all placeholder:opacity-30"
            />
          </div>
        ))}
      </div>
    </motion.div>
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-10"
    >
      {showModal && <AddProjectModal onClose={() => setShowModal(false)} />}

      {/* Row 1: Hero & Readiness */}
      <BentoCard className="col-span-12 lg:col-span-8 overflow-hidden relative">
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-secondary/5 to-transparent pointer-events_none" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10 py-4">
            <div className="max-w-md">
               <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-8 border border-secondary/30 shadow-[0_0_20px_rgba(var(--secondary-rgb),0.2)]">
                  <Database className="w-7 h-7 text-secondary" />
               </div>
               <h2 className="text-4xl font-black text-foreground mb-4 leading-none tracking-tight uppercase">PROJECT LABORATORY</h2>
               <p className="text-muted-foreground text-md font-medium leading-relaxed">
                  Comprehensive project portfolio. Currently maintaining <span className="text-secondary font-black">{projects.length} project modules</span>. 
                  <span className="text-secondary font-black">{readinessCount} project modules</span> are interview-optimized.
               </p>
            </div>
            
            <div className="flex gap-12 items-center">
               <div className="text-center group">
                  <p className="text-6xl font-black text-foreground mb-4 group-hover:text-secondary transition-all tabular-nums tracking-tighter">{projects.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-secondary/30 decoration-4">Project Map</p>
               </div>
               <div className="text-center group">
                  <p className="text-6xl font-black text-foreground mb-4 group-hover:text-emerald-500 transition-all tabular-nums tracking-tighter">{readinessCount}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground underline underline-offset-[14px] decoration-emerald-500/30 decoration-4">Deployed</p>
               </div>
            </div>
         </div>
      </BentoCard>

      <BentoCard className="col-span-12 lg:col-span-4" title="Reliability Index">
         <div className="flex items-center justify-center h-full py-4">
            <ActivityRing value={avgReadiness} max={100} color="var(--secondary)" label="Readiness Index" />
         </div>
      </BentoCard>

      {/* Row 2: Navigation & Action */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between gap-8 pb-4">
         <div className="flex bg-muted/40 backdrop-blur-md rounded-[24px] p-2 w-full md:w-auto border border-border/10 shadow-lg">
            <div className="px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-foreground/70 flex items-center gap-3">
               <Kanban className="w-5 h-5 text-secondary" /> PORTFOLIO VIEW ENABLED
            </div>
         </div>

         <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-primary text-foreground rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all group shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.03] active:scale-95"
         >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> 
            ADD PROJECT
         </button>
      </div>

      {/* Row 3: Projects Grid */}
      <div className="col-span-12 space-y-10">
        {projects.length === 0 ? (
          <motion.div variants={itemVariants} className="py-40 text-center border-2 border-dashed border-muted rounded-[48px] bg-muted/5">
            <Cpu className="w-20 h-20 text-muted-foreground mx-auto mb-8 opacity-10" />
            <p className="text-muted-foreground text-[13px] font-black uppercase tracking-[0.4em]">No projects found in this collection</p>
            <button onClick={() => setShowModal(true)} className="mt-10 bg-primary/10 border border-primary/20 text-primary px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-foreground transition-all">Add Your First Project</button>
          </motion.div>
        ) : (
          projects.map((project) => {
            const isOpen = expandedId === project.id;
            const scoreColor = project.readinessScore >= 80 ? 'text-emerald-500' : project.readinessScore >= 40 ? 'text-primary' : 'text-muted-foreground';
            
            return (
              <motion.div 
                key={project.id} 
                layout 
                variants={itemVariants}
                className={`bg-card border border-border/10 rounded-[40px] overflow-hidden hover:border-primary/20 transition-all shadow-2xl shadow-black/5 ${isOpen ? 'ring-2 ring-primary/10' : ''}`}
              >
                <button onClick={() => setExpandedId(isOpen ? null : project.id)} className="w-full flex flex-col lg:flex-row lg:items-center gap-10 px-10 py-10 text-left group">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border border-primary/20 bg-primary/5 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] group-hover:scale-110 transition-all flex-shrink-0`}>
                    <Cpu className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                       <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{project.role}</span>
                       <div className="h-1.5 w-1.5 rounded-full bg-muted" />
                       <span className={`text-[10px] px-3 py-1 rounded-full border font-black uppercase tracking-widest ${
                         project.status === 'Live' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-border/10 text-muted-foreground bg-muted/10'
                       }`}>{project.status}</span>
                    </div>
                    <h4 className="text-foreground text-3xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors uppercase">{project.name}</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {project.techStack.map(t => (
                        <span key={t} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3.5 py-1.5 bg-muted/40 rounded-xl border border-border/5"># {t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-12 flex-shrink-0 lg:border-l border-border/10 lg:pl-12">
                    <div className="text-center">
                       <motion.span 
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`text-6xl font-black ${scoreColor} tabular-nums mb-1 block tracking-tighter`}
                        >
                         {project.readinessScore}%
                       </motion.span>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Ready Score</span>
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
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-10 pb-12 pt-4 space-y-12">
                        <div className="h-px bg-border/10 w-full" />
                        
                        {/* Description & Links */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                           <div className="lg:col-span-8 space-y-6">
                              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 ml-1">
                                 <Layout className="w-4 h-4 text-primary" /> System Architecture Overview
                              </h5>
                              <p className="text-foreground text-[15px] leading-relaxed font-medium bg-muted/10 p-8 rounded-[32px] border border-border/5 shadow-inner">
                                 {project.description}
                              </p>
                           </div>
                           <div className="lg:col-span-4 space-y-8">
                              <div className="space-y-4">
                                 <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Resource Handshake</h5>
                                 <div className="space-y-3">
                                    <button className="w-full h-[72px] flex items-center justify-between px-6 rounded-[24px] bg-card border border-border/10 hover:border-primary/40 hover:bg-muted/30 transition-all group/link shadow-lg">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/10 group-hover/link:bg-primary/20 group-hover/link:border-primary/30 transition-all">
                                             <Github className="w-5 h-5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                                          </div>
                                          <span className="text-[11px] font-black uppercase tracking-widest text-foreground">View Repository</span>
                                       </div>
                                       <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="w-full h-[72px] flex items-center justify-between px-6 rounded-[24px] bg-card border border-border/10 hover:border-secondary/40 hover:bg-muted/30 transition-all group/link shadow-lg">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/10 group-hover/link:bg-secondary/20 group-hover/link:border-secondary/30 transition-all">
                                             <Globe className="w-5 h-5 text-muted-foreground group-hover/link:text-secondary transition-colors" />
                                          </div>
                                          <span className="text-[11px] font-black uppercase tracking-widest text-foreground">Operational Endpoint</span>
                                       </div>
                                       <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Challenges Section */}
                        <div className="space-y-8">
                           <div className="flex items-center justify-between px-1">
                              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
                                 <Briefcase className="w-5 h-5 text-primary" /> Interview Scenario Analysis (STAR)
                              </h5>
                              <button 
                                onClick={() => addNewChallenge(project.id)}
                                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary shadow-[0_5px_15px_rgba(var(--primary-rgb),0.2)] text-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
                              >
                                 <Plus className="w-4 h-4" /> Log Scenario
                              </button>
                           </div>
                           
                           {project.challenges.length === 0 ? (
                              <div className="bg-muted/5 border-2 border-dashed border-border/10 rounded-[40px] py-20 text-center">
                                 <p className="text-muted-foreground text-[13px] font-bold uppercase tracking-[0.2em] leading-relaxed opacity-60">No project modules documented yet.<br />Add project modules for interview preparation.</p>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 gap-10">
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
                        <div className="flex items-center gap-6 pt-6 px-1">
                           <button onClick={() => deleteProject(project.id)} className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-rose-500/20 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-[11px] font-black uppercase tracking-[0.3em]"><Trash2 className="w-4 h-4" /> DELETE PROJECT</button>
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
    </motion.div>
  );
}
