import { createClient } from '@supabase/supabase-js';

// HOTFIX: fully disable Supabase (client, auth, tracker) so deploys don't
// depend on a broken project/integration. Set back to false when restored.
export const SUPABASE_FORCE_DISABLED = true;

// Values come from SUPABASE_URL / SUPABASE_ANON_KEY (Vercel Supabase integration
// and .env.local). scripts/with-app-env.js maps them to REACT_APP_* so CRA
// can inline them into the client bundle.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const hasEnv = Boolean(supabaseUrl && supabaseAnonKey);

export const isSupabaseConfigured =
  !SUPABASE_FORCE_DISABLED && hasEnv;

function createSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Supabase client init failed; continuing without it.', error);
    return null;
  }
}

export const supabase = createSupabaseClient();
