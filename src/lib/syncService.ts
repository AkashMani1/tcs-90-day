/* Developed by Akash Mani - This site is developed by Akash Mani. Original watermark of Akash Mani. */
import { supabase } from './supabase';
import { AppState, DailyLog, Problem, DSASheetItem } from './types';

export const syncService = {
  /**
   * Pushes entire local state to Supabase.
   * Useful for initial migration.
   */
  async pushLocalState(userId: string, state: AppState) {
    try {
      // 1. Sync DSA Sheet Items
      if (state.dsaSheetItems) {
        const dsaData = state.dsaSheetItems.map(item => ({
          user_id: userId,
          problem_slug: item.id,
          status: item.completed ? 'solved' : 'unsolved',
          submission_date: item.submissionDate || null,
          revision_date: item.revisionDate || null,
          notes: item.notes || null,
        }));

        const { error: dsaError } = await supabase
          .from('dsa_progress')
          .upsert(dsaData, { onConflict: 'user_id,problem_slug' });
        
        if (dsaError) throw dsaError;
      }

      // 2. Sync Daily Logs
      if (state.dailyLogs) {
        const logData = state.dailyLogs.map(log => ({
          user_id: userId,
          log_date: log.date,
          content: log.struggles || '',
          tasks: log.completedHabits || [],
          mood: log.confidence.toString(), // Mapping confidence to mood for now
          productivity_score: log.energy,
        }));

        const { error: logError } = await supabase
          .from('daily_logs')
          .upsert(logData, { onConflict: 'user_id,log_date' });
        
        if (logError) throw logError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Sync Error:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetches data from Supabase and merges into state
   */
  async fetchCloudState(userId: string) {
    // This will be used to hydrate the state from cloud on login/refresh
    const { data: dsa, error: dsaError } = await supabase
      .from('dsa_progress')
      .select('*')
      .eq('user_id', userId);
    
    const { data: logs, error: logError } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId);

    if (dsaError || logError) {
      return { success: false, error: dsaError?.message || logError?.message };
    }

    return { success: true, dsa, logs };
  }
};
