# Supabase setup (media tracker)

1. Create a free project at https://supabase.com
2. Open **SQL Editor** and run [`schema.sql`](./schema.sql)
3. In **Authentication → Users**, create one email/password user (your admin login)
4. In **Project Settings → API**, copy the Project URL and `anon` `public` key
5. In `my-portfolio/`, copy `.env.example` to `.env.local` and fill those values:
   ```
   REACT_APP_SUPABASE_URL=...
   REACT_APP_SUPABASE_ANON_KEY=...
   ```
6. Restart `npm start`, then open `/admin` to sign in and manage entries
7. Public visitors see the tracker on `/about` (bio/experience/projects stay hardcoded)

Optional: under Authentication → Providers, keep Email enabled and disable public sign-ups if available, so only the user you create can log in.
