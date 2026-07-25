import { createClient } from '@supabase/supabase-js';

// Values come from SUPABASE_URL / SUPABASE_ANON_KEY (Vercel Supabase integration
// and .env.local). scripts/with-supabase-env.js maps them to REACT_APP_* so CRA
// can inline them into the client bundle.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
