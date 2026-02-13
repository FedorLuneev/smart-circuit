import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  user_id: string | null;
  name: string;
  building_type: 'apartment' | 'house' | 'commercial';
  phase: '1 phase' | '3 phases';
  wooden_construction: boolean;
  created_at: string;
  updated_at: string;
}

export interface PowerLine {
  id: string;
  project_id: string;
  name: string;
  icon: string;
  power_kw: number;
  length_m: number;
  breaker: string;
  cable: string;
  rcd: string;
  afdd: 'yes' | 'no';
  order_index: number;
  created_at: string;
}
