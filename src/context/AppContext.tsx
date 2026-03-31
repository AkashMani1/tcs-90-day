'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { AppState, Problem, MockInterview, WeekTask, StarStory, KnowledgeItem, DailyLog, KnowledgeCategory } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  DEFAULT_WEEKS,
  DEFAULT_MOCKS,
  DEFAULT_STARS,
  DEFAULT_KNOWLEDGE,
  HABIT_TEMPLATES,
} from '@/lib/defaultData';
import { KILL_LIST_PROBLEMS } from '@/lib/killListData';
import { today, generateId } from '@/lib/utils';

const INITIAL_STATE: AppState = {
  weeks: DEFAULT_WEEKS,
  problems: KILL_LIST_PROBLEMS,
  mocks: DEFAULT_MOCKS,
  stars: DEFAULT_STARS,
  knowledgeBase: DEFAULT_KNOWLEDGE,
  dailyLogs: [],
  startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks ago
  userName: 'Student',
  targetRole: 'TCS Digital',
};

interface AppContextType {
  state: AppState;
  initialized: boolean;

  // Profile
  updateProfile: (name: string, role: string, startDate: string) => void;

  // Daily Log
  getTodayLog: () => DailyLog;
  toggleHabit: (habitId: string) => void;
  updateEnergy: (val: number) => void;
  updateConfidence: (val: number) => void;
  updateHours: (val: number) => void;
  updateDailyLog: (updates: Partial<DailyLog>) => void;

  // Roadmap
  toggleWeekTask: (week: number, taskId: string) => void;
  updateWeekFocus: (week: number, focus: string) => void;
  addWeekTask: (week: number, label: string) => void;
  deleteWeekTask: (week: number, taskId: string) => void;

  // DSA Problems
  addProblem: (p: Omit<Problem, 'id' | 'addedAt'>) => void;
  updateProblem: (id: string, updates: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;

  // Mocks
  addMock: (m: Omit<MockInterview, 'id'>) => void;
  updateMock: (id: string, updates: Partial<MockInterview>) => void;
  deleteMock: (id: string) => void;

  // Stars
  addStar: (s: Omit<StarStory, 'id'>) => void;
  updateStar: (id: string, updates: Partial<StarStory>) => void;
  deleteStar: (id: string) => void;

  // Knowledge Base
  updateKnowledgeItem: (id: string, answer: string) => void;
  addKnowledgeItem: (question: string, category: KnowledgeCategory) => void;
  deleteKnowledgeItem: (id: string) => void;

  // Utility
  touchToday: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState, initialized] = useLocalStorage<AppState>('placeprep_v5', INITIAL_STATE);

  const mutate = useCallback((updater: (s: AppState) => AppState) => {
    setState((prev: AppState) => updater(prev));
  }, [setState]);

  // ── Profile ──────────────────────────────────────────────────────────────
  const updateProfile = useCallback((name: string, role: string, startDate: string) => {
    mutate((s) => ({ ...s, userName: name, targetRole: role, startDate }));
  }, [mutate]);

  // ── Daily Log helpers ─────────────────────────────────────────────────────
  const getTodayLog = useCallback((): DailyLog => {
    const t = today();
    const existing = state.dailyLogs.find((l) => l.date === t);
    return {
      date: t,
      completedHabits: [],
      energy: 7,
      confidence: 6,
      hours: 0,
      problemsSolved: { easy: 0, medium: 0, hard: 0 },
      conceptsLearned: ['', '', ''],
      struggles: '',
      tomorrowPlan: { morning: '', afternoon: '' },
      ...existing,
    };
  }, [state.dailyLogs]);

  const upsertTodayLog = useCallback((updater: (log: DailyLog) => DailyLog) => {
    const t = today();
    mutate((s) => {
      const existing = s.dailyLogs.find((l) => l.date === t);
      const base: DailyLog = {
        date: t,
        completedHabits: [],
        energy: 7,
        confidence: 6,
        hours: 0,
        problemsSolved: { easy: 0, medium: 0, hard: 0 },
        conceptsLearned: ['', '', ''],
        struggles: '',
        tomorrowPlan: { morning: '', afternoon: '' },
        ...existing,
      };
      const updated = updater(base);
      const others = s.dailyLogs.filter((l) => l.date !== t);
      return { ...s, dailyLogs: [...others, updated] };
    });
  }, [mutate]);

  const toggleHabit = useCallback((habitId: string) => {
    upsertTodayLog((log) => {
      const has = log.completedHabits.includes(habitId);
      return {
        ...log,
        completedHabits: has
          ? log.completedHabits.filter((h) => h !== habitId)
          : [...log.completedHabits, habitId],
      };
    });
  }, [upsertTodayLog]);

  const updateEnergy = useCallback((val: number) => {
    upsertTodayLog((log) => ({ ...log, energy: val }));
  }, [upsertTodayLog]);

  const updateConfidence = useCallback((val: number) => {
    upsertTodayLog((log) => ({ ...log, confidence: val }));
  }, [upsertTodayLog]);

  const updateHours = useCallback((val: number) => {
    upsertTodayLog((log) => ({ ...log, hours: val }));
  }, [upsertTodayLog]);

  const updateDailyLog = useCallback((updates: Partial<DailyLog>) => {
    upsertTodayLog((log) => ({ ...log, ...updates }));
  }, [upsertTodayLog]);

  const touchToday = useCallback(() => {
    upsertTodayLog((log) => log);
  }, [upsertTodayLog]);

  // ── Roadmap ───────────────────────────────────────────────────────────────
  const toggleWeekTask = useCallback((week: number, taskId: string) => {
    mutate((s) => ({
      ...s,
      weeks: s.weeks.map((w) =>
        w.week === week
          ? { ...w, tasks: w.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : w
      ),
    }));
  }, [mutate]);

  const updateWeekFocus = useCallback((week: number, focus: string) => {
    mutate((s) => ({ ...s, weeks: s.weeks.map((w) => w.week === week ? { ...w, focus } : w) }));
  }, [mutate]);

  const addWeekTask = useCallback((week: number, label: string) => {
    mutate((s) => ({
      ...s,
      weeks: s.weeks.map((w) =>
        w.week === week
          ? { ...w, tasks: [...w.tasks, { id: generateId(), label, done: false }] }
          : w
      ),
    }));
  }, [mutate]);

  const deleteWeekTask = useCallback((week: number, taskId: string) => {
    mutate((s) => ({
      ...s,
      weeks: s.weeks.map((w) =>
        w.week === week ? { ...w, tasks: w.tasks.filter((t) => t.id !== taskId) } : w
      ),
    }));
  }, [mutate]);

  // ── DSA Problems ──────────────────────────────────────────────────────────
  const addProblem = useCallback((p: Omit<Problem, 'id' | 'addedAt'>) => {
    mutate((s) => ({ ...s, problems: [{ ...p, id: generateId(), addedAt: today() }, ...s.problems] }));
  }, [mutate]);

  const updateProblem = useCallback((id: string, updates: Partial<Problem>) => {
    mutate((s) => ({ ...s, problems: s.problems.map((p) => (p.id === id ? { ...p, ...updates } : p)) }));
  }, [mutate]);

  const deleteProblem = useCallback((id: string) => {
    mutate((s) => ({ ...s, problems: s.problems.filter((p) => p.id !== id) }));
  }, [mutate]);

  // ── Mocks ──────────────────────────────────────────────────────────────────
  const addMock = useCallback((m: Omit<MockInterview, 'id'>) => {
    mutate((s) => ({ ...s, mocks: [{ ...m, id: generateId() }, ...s.mocks] }));
  }, [mutate]);

  const updateMock = useCallback((id: string, updates: Partial<MockInterview>) => {
    mutate((s) => ({ ...s, mocks: s.mocks.map((m) => (m.id === id ? { ...m, ...updates } : m)) }));
  }, [mutate]);

  const deleteMock = useCallback((id: string) => {
    mutate((s) => ({ ...s, mocks: s.mocks.filter((m) => m.id !== id) }));
  }, [mutate]);

  // ── Stars ──────────────────────────────────────────────────────────────────
  const addStar = useCallback((s: Omit<StarStory, 'id'>) => {
    mutate((state) => ({ ...state, stars: [{ ...s, id: generateId() }, ...state.stars] }));
  }, [mutate]);

  const updateStar = useCallback((id: string, updates: Partial<StarStory>) => {
    mutate((s) => ({ ...s, stars: s.stars.map((st) => (st.id === id ? { ...st, ...updates } : st)) }));
  }, [mutate]);

  const deleteStar = useCallback((id: string) => {
    mutate((s) => ({ ...s, stars: s.stars.filter((st) => st.id !== id) }));
  }, [mutate]);

  // ── Knowledge Base ────────────────────────────────────────────────────────
  const updateKnowledgeItem = useCallback((id: string, answer: string) => {
    mutate((s) => ({ ...s, knowledgeBase: (s.knowledgeBase || []).map((h) => (h.id === id ? { ...h, answer } : h)) }));
  }, [mutate]);

  const addKnowledgeItem = useCallback((question: string, category: KnowledgeCategory) => {
    mutate((s) => ({ ...s, knowledgeBase: [...(s.knowledgeBase || []), { id: generateId(), question, answer: '', category }] }));
  }, [mutate]);

  const deleteKnowledgeItem = useCallback((id: string) => {
    mutate((s) => ({ ...s, knowledgeBase: (s.knowledgeBase || []).filter((h) => h.id !== id) }));
  }, [mutate]);

  const value: AppContextType = {
    state,
    initialized,
    updateProfile,
    getTodayLog,
    toggleHabit,
    updateEnergy,
    updateConfidence,
    updateHours,
    updateDailyLog,
    toggleWeekTask,
    updateWeekFocus,
    addWeekTask,
    deleteWeekTask,
    addProblem,
    updateProblem,
    deleteProblem,
    addMock,
    updateMock,
    deleteMock,
    addStar,
    updateStar,
    deleteStar,
    updateKnowledgeItem,
    addKnowledgeItem,
    deleteKnowledgeItem,
    touchToday,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
