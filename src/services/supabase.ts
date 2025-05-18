import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables should be set up in your project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const checkIsAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};