# Supabase setup (media tracker)

1. Create a free project at https://supabase.com
2. Open **SQL Editor** and run [`schema.sql`](./schema.sql)
3. In **Authentication → Users**, create one email/password user (your admin login)
4. Connect the project in **Vercel → Settings → Environment Variables** (Supabase integration), or set manually:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. For local dev, copy `.env.example` to `.env.local` with the same two names
6. Restart `npm start`, then open `/admin` to sign in and manage entries
7. Public visitors see the tracker on `/about` (bio/experience/projects stay hardcoded)

## Vercel notes

- After importing/changing env vars, **redeploy** so Create React App can bake them into the build
- Root Directory should be `my-portfolio`
- `npm run build` maps `SUPABASE_*` → `REACT_APP_*` via `scripts/with-supabase-env.js`
- Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend

## Auth URLs

In Supabase → Authentication → URL Configuration:

- Site URL: `https://colbyfrison.com`
- Redirect URLs: `https://colbyfrison.com/**`, `http://localhost:3000/**`

Optional: under Authentication → Providers, keep Email enabled and disable public sign-ups if available, so only the user you create can log in.
