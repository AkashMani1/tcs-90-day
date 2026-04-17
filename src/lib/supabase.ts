/* Developed by Akash Mani - This site is developed by Akash Mani. Original watermark of Akash Mani. */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Supabase environment variables are missing. Database features will be disabled.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dsa_progress: {
        Row: {
          id: string;
          user_id: string;
          problem_slug: string;
          status: string | null;
          submission_date: string | null;
          revision_date: string | null;
          notes: string | null;
          difficulty_override: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_slug: string;
          status?: string | null;
          submission_date?: string | null;
          revision_date?: string | null;
          notes?: string | null;
          difficulty_override?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_slug?: string;
          status?: string | null;
          submission_date?: string | null;
          revision_date?: string | null;
          notes?: string | null;
          difficulty_override?: string | null;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string | null;
          color: string | null;
          streak_count: number | null;
          completion_history: Json | null;
          is_archived: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string | null;
          color?: string | null;
          streak_count?: number | null;
          completion_history?: Json | null;
          is_archived?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          icon?: string | null;
          color?: string | null;
          streak_count?: number | null;
          completion_history?: Json | null;
          is_archived?: boolean | null;
          created_at?: string;
        };
      };
    };
  };
}
