import { z } from 'zod';

export const DifficultySchema = z.enum(['Easy', 'Medium', 'Hard']);

export const DSASheetItemSchema = z.object({
  id: z.string(),
  section: z.string().min(1),
  subgroup: z.string().optional(),
  sectionOrder: z.number().int().nonnegative(),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  difficulty: DifficultySchema,
  practiceLinks: z.array(z.string().url()),
  resourceLinks: z.array(z.string().url()),
  videoUrl: z.string().url().or(z.literal('')),
  companies: z.array(z.string()),
  notes: z.string(),
  completed: z.boolean(),
  saved: z.boolean(),
  source: z.enum(['admin', 'user']),
  hidden: z.boolean(),
  submissionDate: z.string().optional(),
  revisionDate: z.string().optional(),
});

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  completed: z.record(z.string(), z.boolean()),
  streak: z.number().int().nonnegative(),
  lastCompleted: z.string().optional(),
});

export const DailyLogSchema = z.object({
  date: z.string(),
  tasks: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })),
  mood: z.string().optional(),
  notes: z.string().optional(),
});

export const AppStateSchema = z.object({
  dsaItems: z.array(DSASheetItemSchema),
  habits: z.array(HabitSchema),
  logs: z.array(DailyLogSchema),
  lastSync: z.string().optional(),
});

export type Difficulty = z.infer<typeof DifficultySchema>;
export type DSASheetItem = z.infer<typeof DSASheetItemSchema>;
export type Habit = z.infer<typeof HabitSchema>;
export type DailyLog = z.infer<typeof DailyLogSchema>;
export type AppState = z.infer<typeof AppStateSchema>;
