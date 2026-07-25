/**
 * Create React App only inlines REACT_APP_* into the browser bundle.
 * Vercel's Supabase integration provides SUPABASE_URL and SUPABASE_ANON_KEY.
 * This wrapper copies those onto REACT_APP_* before start/build/test.
 *
 * Never map SUPABASE_SERVICE_ROLE_KEY (or other secrets) into REACT_APP_* —
 * that key bypasses RLS and must stay server-side only.
 */
const { spawn } = require('child_process');

const env = { ...process.env };

// Prefer the standard Supabase / Vercel integration names when present.
if (env.SUPABASE_URL) {
  env.REACT_APP_SUPABASE_URL = env.SUPABASE_URL;
}
if (env.SUPABASE_ANON_KEY) {
  env.REACT_APP_SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;
}

// Fallbacks for Next.js-style public aliases if those were imported instead.
if (!env.REACT_APP_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_URL) {
  env.REACT_APP_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
}
if (!env.REACT_APP_SUPABASE_ANON_KEY && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  env.REACT_APP_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/with-supabase-env.js <command> [args...]');
  process.exit(1);
}

const child = spawn(args[0], args.slice(1), {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code == null ? 1 : code);
});
