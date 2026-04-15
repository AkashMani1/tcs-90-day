'use client';

import { FormEvent, useDeferredValue, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  BookMarked,
  ChevronDown,
  ChevronUp,
  Circle,
  Code2,
  ExternalLink,
  Pencil,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Link2,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DSASheetItem, Difficulty } from '@/lib/types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1T5-nGsJ9WNwna44e9WWRD0jlZIT5KxVOGvylcvvVrY8/edit?gid=0#gid=0';

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy: 'bg-emerald-500/16 text-emerald-300',
  Medium: 'bg-amber-500/16 text-amber-300',
  Hard: 'bg-rose-500/16 text-rose-300',
};

const TIMER_STYLE: Record<Difficulty, string> = {
  Easy: '30 Min',
  Medium: '45 Min',
  Hard: '60 Min',
};

const FEATURE_CHIPS = [
  'All DSA topics covered',
  'Questions grouped by section and subtopic',
  'Add, edit, save, and track your progress',
];

type FormState = {
  title: string;
  section: string;
  subgroup: string;
  difficulty: Difficulty;
  practiceUrl: string;
  resourceLinks: string;
  videoUrl: string;
  companies: string;
  notes: string;
};

function NoteEditor({
  item,
  onClose,
  onSave,
}: {
  item: DSASheetItem;
  onClose: () => void;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(item.notes || '');

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#11141b] overflow-hidden"
      >
        <div className="px-7 py-5 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-200">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Question Notes</p>
              <p className="text-xs text-slate-500 mt-1">{item.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300">
            Close
          </button>
        </div>

        <div className="p-7">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write trigger points, approach hints, edge cases, or what you want to remember next time..."
            className="w-full min-h-[220px] rounded-[24px] bg-white/[0.03] border border-white/10 px-5 py-4 text-sm leading-7 text-slate-100 focus:outline-none focus:border-[#ff7a59]/40"
          />
        </div>

        <div className="px-7 py-5 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300">Cancel</button>
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white"
          >
            Save Note
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function NoteButton({
  item,
  onClick,
}: {
  item: DSASheetItem;
  onClick: () => void;
}) {
  const hasNote = Boolean(item.notes?.trim());

  return (
    <button
      onClick={onClick}
      title={hasNote ? 'View or edit note' : 'Add note'}
      className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
        hasNote
          ? 'border-[#ff7a59]/40 bg-[#ff7a59]/10 text-[#ff7a59]'
          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-[#ff7a59]/30 hover:text-white'
      }`}
    >
      <BookMarked className="w-4 h-4" />
      {hasNote ? <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#17191f]" /> : null}
    </button>
  );
}

function normalizeCompanyName(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

const COMPANY_DOMAIN_MAP: Record<string, string> = {
  amazon: 'amazon.com',
  microsoft: 'microsoft.com',
  google: 'google.com',
  tcs: 'tcs.com',
  'tata consultancy services': 'tcs.com',
  infosys: 'infosys.com',
  wipro: 'wipro.com',
  accenture: 'accenture.com',
  cognizant: 'cognizant.com',
  ibm: 'ibm.com',
  oracle: 'oracle.com',
  adobe: 'adobe.com',
  flipkart: 'flipkart.com',
  uber: 'uber.com',
  meta: 'meta.com',
  facebook: 'facebook.com',
  apple: 'apple.com',
  netflix: 'netflix.com',
  zoho: 'zoho.com',
  samsung: 'samsung.com',
  paypal: 'paypal.com',
  deloitte: 'deloitte.com',
  capgemini: 'capgemini.com',
  hcl: 'hcltech.com',
  techmahindra: 'techmahindra.com',
};

function getCompanyLogoUrl(company: string) {
  const normalized = normalizeCompanyName(company).toLowerCase();
  const domain = COMPANY_DOMAIN_MAP[normalized];
  if (!domain) return '';
  return `https://logo.clearbit.com/${domain}`;
}

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function parseCompanyList(value: string) {
  return Array.from(
    new Set(
      value
        .split(',')
        .map(normalizeCompanyName)
        .filter(Boolean)
    )
  );
}

function isExternalUrl(value: string) {
  return /^https?:\/\//.test(value);
}

function toFormState(item?: DSASheetItem): FormState {
  return {
    title: item?.title || '',
    section: item?.section || '',
    subgroup: item?.subgroup || '',
    difficulty: item?.difficulty || 'Medium',
    practiceUrl: item?.practiceLinks[0] || '',
    resourceLinks: item?.resourceLinks.join('\n') || '',
    videoUrl: item?.videoUrl || '',
    companies: item?.companies.join(', ') || '',
    notes: item?.notes || '',
  };
}

function getCompanyMonogram(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

function CompanyBadge({ company }: { company: string }) {
  const logoUrl = getCompanyLogoUrl(company);

  if (logoUrl) {
    return (
      <div title={company} className="w-11 h-11 rounded-full border-2 border-[#17191f] bg-white overflow-hidden flex items-center justify-center">
        <img
          src={logoUrl}
          alt={company}
          className="w-7 h-7 object-contain"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
            const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-full items-center justify-center text-[11px] font-black text-[#111319]">
          {getCompanyMonogram(company)}
        </div>
      </div>
    );
  }

  return (
    <div title={company} className="w-11 h-11 rounded-full border-2 border-[#17191f] bg-white text-[#111319] flex items-center justify-center text-[11px] font-black">
      {getCompanyMonogram(company)}
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-48 h-48 -rotate-90">
        <circle cx="96" cy="96" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="rgb(16 185 129)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-emerald-400">{progress}%</span>
        <span className="text-[11px] tracking-[0.28em] uppercase text-slate-500 font-black mt-2">Progress</span>
      </div>
    </div>
  );
}

function SheetEditor({
  item,
  sections,
  onSave,
  onClose,
}: {
  item?: DSASheetItem;
  sections: string[];
  onSave: (form: FormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(item));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.section.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.form
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onSubmit={submit}
        className="w-full max-w-3xl max-h-[90vh] rounded-[30px] border border-white/10 bg-[#101218] overflow-hidden flex flex-col"
      >
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#101218] z-10">
          <div>
            <p className="text-[11px] font-black tracking-[0.28em] uppercase text-primary">DSA Sheet</p>
            <h2 className="text-2xl font-black text-white mt-2">{item ? 'Edit Question' : 'Add Question'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:text-white">
            Close
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto">
          <label className="md:col-span-2">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Problem</span>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" />
          </label>

          <label>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Section</span>
            <input list="dsa-sections" value={form.section} onChange={(e) => update('section', e.target.value)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" />
            <datalist id="dsa-sections">
              {sections.map((section) => (
                <option key={section} value={section} />
              ))}
            </datalist>
          </label>

          <label>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Sub Topic</span>
            <input value={form.subgroup} onChange={(e) => update('subgroup', e.target.value)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" placeholder="Traversal, 2 Heaps, Mirror and Symmetry..." />
          </label>

          <label>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Difficulty</span>
            <select value={form.difficulty} onChange={(e) => update('difficulty', e.target.value as Difficulty)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          <label>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Practice URL</span>
            <input value={form.practiceUrl} onChange={(e) => update('practiceUrl', e.target.value)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" placeholder="https://leetcode.com/..." />
          </label>

          <label>
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Video URL</span>
            <input value={form.videoUrl} onChange={(e) => update('videoUrl', e.target.value)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" placeholder="https://youtube.com/..." />
          </label>

          <label className="md:col-span-2">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Interview Companies</span>
            <input value={form.companies} onChange={(e) => update('companies', e.target.value)} className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" placeholder="Amazon, Google, TCS, Infosys" />
          </label>

          <label className="md:col-span-2">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Resource Links</span>
            <textarea value={form.resourceLinks} onChange={(e) => update('resourceLinks', e.target.value)} className="w-full min-h-[110px] rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" placeholder="One link per line" />
          </label>

          <label className="md:col-span-2">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-500 font-black mb-2">Notes</span>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="w-full min-h-[96px] rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-primary/40" placeholder="Personal notes or admin hints" />
          </label>
        </div>

        <div className="px-8 py-6 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-[#101218] z-10">
          <button type="button" onClick={onClose} className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300">Cancel</button>
          <button type="submit" className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white">Save</button>
        </div>
      </motion.form>
    </div>
  );
}

export default function DSASheetView() {
  const { state, addDsaSheetItem, updateDsaSheetItem, deleteDsaSheetItem } = useApp();
  const items = (state.dsaSheetItems || []).filter((item) => !item.hidden);

  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [savedOnly, setSavedOnly] = useState(false);
  const [completedOnly, setCompletedOnly] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [editingItem, setEditingItem] = useState<DSASheetItem | null>(null);
  const [noteItem, setNoteItem] = useState<DSASheetItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const sections = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.section))).sort((a, b) => {
      const aOrder = items.find((item) => item.section === a)?.sectionOrder ?? 0;
      const bOrder = items.find((item) => item.section === b)?.sectionOrder ?? 0;
      return aOrder - bOrder;
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const query = deferredSearch.trim().toLowerCase();
        const matchesSearch =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query) ||
          item.companies.some((company) => company.toLowerCase().includes(query));

        return (
          matchesSearch &&
          (difficultyFilter === 'All' || item.difficulty === difficultyFilter) &&
          (sectionFilter === 'All' || item.section === sectionFilter) &&
          (!savedOnly || item.saved) &&
          (!completedOnly || item.completed)
        );
      })
      .sort((a, b) => (a.sectionOrder === b.sectionOrder ? a.order - b.order : a.sectionOrder - b.sectionOrder));
  }, [completedOnly, deferredSearch, difficultyFilter, items, savedOnly, sectionFilter]);

  const groupedItems = useMemo(() => {
    const map = new Map<string, DSASheetItem[]>();
    for (const item of filteredItems) {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section)!.push(item);
    }
    return Array.from(map.entries());
  }, [filteredItems]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => item.completed).length;
    const easy = items.filter((item) => item.difficulty === 'Easy').length;
    const medium = items.filter((item) => item.difficulty === 'Medium').length;
    const hard = items.filter((item) => item.difficulty === 'Hard').length;
    const progress = Math.round((completed / total) * 100 || 0);
    return { total, completed, easy, medium, hard, progress };
  }, [items]);

  const openCreate = () => {
    setEditingItem(null);
    setShowEditor(true);
  };

  const openEdit = (item: DSASheetItem) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setEditingItem(null);
    setShowEditor(false);
  };

  const handleSave = (form: FormState) => {
    const resourceLinks = form.resourceLinks
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      section: form.section.trim(),
      subgroup: form.subgroup.trim() || undefined,
      sectionOrder: items.find((item) => item.section === form.section)?.sectionOrder ?? sections.length,
      order:
        editingItem && editingItem.section === form.section
          ? editingItem.order
          : Math.max(-1, ...items.filter((item) => item.section === form.section).map((item) => item.order)) + 1,
      difficulty: form.difficulty,
      practiceLinks: form.practiceUrl.trim() ? [form.practiceUrl.trim()] : [],
      resourceLinks,
      videoUrl: form.videoUrl.trim(),
      companies: parseCompanyList(form.companies),
      notes: form.notes.trim(),
      completed: editingItem?.completed ?? false,
      saved: editingItem?.saved ?? false,
      source: editingItem?.source ?? 'user',
      hidden: false,
    } satisfies Omit<DSASheetItem, 'id'>;

    if (editingItem) {
      updateDsaSheetItem(editingItem.id, payload);
    } else {
      addDsaSheetItem(payload);
    }

    closeEditor();
  };

  return (
    <div className="space-y-8">
      {showEditor && <SheetEditor item={editingItem || undefined} sections={sections} onSave={handleSave} onClose={closeEditor} />}
      {noteItem && (
        <NoteEditor
          item={noteItem}
          onClose={() => setNoteItem(null)}
          onSave={(value) => updateDsaSheetItem(noteItem.id, { notes: value })}
        />
      )}

      <section className="rounded-[34px] border border-white/10 bg-[#090b12] overflow-hidden relative">
        <div className="absolute inset-0 opacity-35 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '86px 86px' }} />
        <div className="relative z-10 px-8 md:px-10 py-10 md:py-12 flex flex-col xl:flex-row gap-10 xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-[48px] md:text-[58px] leading-[1.02] font-black tracking-tight text-white">
              <span className="text-[#ff7a59]">DSA Sheet</span> - Most Important
              <br />
              Interview Questions
            </h2>

            <div className="mt-8 space-y-4 text-slate-200 text-xl">
              {FEATURE_CHIPS.map((line) => (
                <p key={line} className="leading-relaxed">• {line}</p>
              ))}
              <p className="leading-relaxed">• Easy: {stats.easy} | Medium: {stats.medium} | Hard: {stats.hard}</p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['A', 'D', 'S', '+'].map((label, index) => (
                  <div key={label} className={`w-12 h-12 rounded-full border-2 border-[#090b12] flex items-center justify-center font-black text-sm ${index === 3 ? 'bg-[#ff7a59] text-white' : 'bg-white text-[#111319]'}`}>
                    {label}
                  </div>
                ))}
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}+ questions ready to practice</p>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <button onClick={openCreate} className="rounded-full border border-white/14 px-5 py-3 text-sm font-bold text-white hover:border-[#ff7a59]/50">
                <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add Question</span>
              </button>
              <a href={SHEET_URL} target="_blank" rel="noreferrer" className="rounded-full border border-white/14 px-5 py-3 text-sm font-bold text-white hover:border-[#ff7a59]/50">
                <span className="inline-flex items-center gap-2"><Link2 className="w-4 h-4" /> Source Sheet</span>
              </a>
              <button onClick={() => setSavedOnly((prev) => !prev)} className={`rounded-full border px-5 py-3 text-sm font-bold ${savedOnly ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-white/14 text-white'}`}>
                <span className="inline-flex items-center gap-2"><BookmarkCheck className="w-4 h-4" /> Saved Questions</span>
              </button>
            </div>
          </div>

          <div className="xl:min-w-[260px] xl:pt-2 flex flex-col items-center xl:items-end gap-5">
            <ProgressRing progress={stats.progress} />
            <div className="text-center xl:text-right">
              <p className="text-6xl font-black text-white">{stats.completed} <span className="text-slate-500 text-4xl">/ {stats.total}</span></p>
              <p className="text-[13px] uppercase tracking-[0.22em] text-slate-500 font-black mt-2">Problems Solved</p>
              <p className="text-sm text-slate-400 mt-3">Save important questions, add your own picks, and practice pattern by pattern.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[30px] border border-white/10 bg-[#0d1016] p-5 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_repeat(4,auto)] gap-3">
          <label className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search problem, company, notes, section"
              className="w-full rounded-2xl bg-white/[0.03] border border-white/10 pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-[#ff7a59]/40"
            />
          </label>

          <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | 'All')} className="rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3.5 text-white focus:outline-none focus:border-[#ff7a59]/40">
            <option value="All">All levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)} className="rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3.5 text-white focus:outline-none focus:border-[#ff7a59]/40">
            <option value="All">All sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>

          <button onClick={() => setSavedOnly((prev) => !prev)} className={`rounded-2xl px-4 py-3.5 text-sm font-bold border ${savedOnly ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-slate-300'}`}>
            Saved only
          </button>

          <button onClick={() => setCompletedOnly((prev) => !prev)} className={`rounded-2xl px-4 py-3.5 text-sm font-bold border ${completedOnly ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 text-slate-300'}`}>
            Completed only
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {groupedItems.map(([section, sectionItems]) => {
          const collapsed = collapsedSections[section];
          const solved = sectionItems.filter((item) => item.completed).length;

          return (
            <div key={section} className="rounded-[30px] border border-white/10 bg-[#12141a] overflow-hidden">
              <button onClick={() => setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))} className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left">
                <div>
                  <p className="text-3xl font-black text-[#ff7a59]">{section}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-slate-300">{solved}/{sectionItems.length}</span>
                  {collapsed ? <ChevronDown className="w-5 h-5 text-[#ff7a59]" /> : <ChevronUp className="w-5 h-5 text-[#ff7a59]" />}
                </div>
              </button>

              {!collapsed && (
                <div className="px-4 md:px-6 pb-6">
                  <div className="overflow-x-auto lg:overflow-x-visible">
                  <div className="hidden lg:grid grid-cols-[56px_minmax(260px,2.4fr)_88px_96px_92px_108px_120px_72px_72px] gap-4 px-5 py-5 border border-white/10 bg-[#0f1117] text-white text-[12px] font-black rounded-t-[18px] uppercase tracking-[0.16em]">
                    <span></span>
                    <span>Problem</span>
                    <span>Youtube</span>
                    <span>Practice</span>
                    <span>Level</span>
                    <span>Timer</span>
                    <span>Company</span>
                    <span>Notes</span>
                    <span>Save</span>
                  </div>

                  <div className="space-y-0 border-x border-b border-white/10 rounded-b-[18px] overflow-hidden">
                    {Object.entries(
                      sectionItems.reduce<Record<string, DSASheetItem[]>>((acc, item) => {
                        const key = item.subgroup || 'Core Problems';
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(item);
                        return acc;
                      }, {})
                    ).map(([subgroup, subgroupItems], subgroupIndex) => (
                      <div key={`${section}-${subgroup}`}>
                        <div className={`px-5 py-4 bg-[#14171d] ${subgroupIndex > 0 ? 'border-t border-white/10' : ''}`}>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">{subgroup}</p>
                        </div>
                        {subgroupItems.map((item) => {
                          return (
                            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-[56px_minmax(260px,2.4fr)_88px_96px_92px_108px_120px_72px_72px] gap-4 items-center px-5 py-5 border-t border-white/8 bg-[#17191f]">
                          <button onClick={() => updateDsaSheetItem(item.id, { completed: !item.completed })} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400">
                            {item.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className={`text-[17px] font-bold leading-snug ${item.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{item.title}</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-black ${item.source === 'admin' ? 'bg-white/8 text-slate-300' : 'bg-primary/10 text-primary'}`}>
                                {item.source === 'admin' ? 'Suggested' : 'Custom'}
                              </span>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => openEdit(item)} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-white">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteDsaSheetItem(item.id)} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-rose-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex lg:justify-center">
                            {item.videoUrl ? (
                              <a
                                href={item.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                title={isYouTubeUrl(item.videoUrl) ? 'Open YouTube video' : 'Open video link'}
                                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${
                                  isYouTubeUrl(item.videoUrl)
                                    ? 'border-red-500/30 bg-red-500/12 text-red-300 hover:bg-red-500/18'
                                    : 'border-white/10 text-slate-200 hover:border-white/20'
                                }`}
                              >
                                <PlayCircle className="w-5 h-5" />
                              </a>
                            ) : (
                              <button onClick={() => openEdit(item)} className="w-14 h-14 rounded-full border border-dashed border-white/10 flex items-center justify-center text-slate-500">
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="flex lg:justify-center">
                            {item.practiceLinks[0] ? (
                              <a href={item.practiceLinks[0]} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-slate-200">
                                <Code2 className="w-5 h-5" />
                              </a>
                            ) : (
                              <button onClick={() => openEdit(item)} className="w-14 h-14 rounded-full border border-dashed border-white/10 flex items-center justify-center text-slate-500">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div>
                            <span className={`inline-flex rounded-full px-3 py-2 text-sm font-black ${DIFFICULTY_STYLE[item.difficulty]}`}>{item.difficulty}</span>
                          </div>

                          <div className="flex items-center gap-3 text-white">
                            <span className="text-lg font-black">{TIMER_STYLE[item.difficulty]}</span>
                          </div>

                          <div className="flex items-center">
                            {item.companies.length ? (
                              <div className="flex -space-x-2">
                                {item.companies.slice(0, 4).map((company) => (
                                  <CompanyBadge key={`${item.id}-${company}`} company={company} />
                                ))}
                                {item.companies.length > 4 ? (
                                  <div className="w-11 h-11 rounded-full border-2 border-[#17191f] bg-[#111319] text-white flex items-center justify-center text-sm font-black">
                                    +{item.companies.length - 4}
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <button onClick={() => openEdit(item)} className="inline-flex items-center gap-2 text-sm text-slate-500">
                                <Building2 className="w-4 h-4" />
                                Add
                              </button>
                            )}
                          </div>

                          <div className="flex lg:justify-center">
                            <NoteButton item={item} onClick={() => setNoteItem(item)} />
                          </div>

                          <div>
                            <button onClick={() => updateDsaSheetItem(item.id, { saved: !item.saved })} className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-slate-200">
                              {item.saved ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!groupedItems.length ? (
          <div className="rounded-[30px] border border-dashed border-white/10 bg-[#0e1016] py-16 text-center">
            <p className="text-2xl font-black text-white">No matching questions found</p>
            <p className="text-slate-500 mt-2">Try another filter or add a new personal question.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
