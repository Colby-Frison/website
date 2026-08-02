# Supabase setup (media tracker)

1. Create a free project at https://supabase.com
2. Open **SQL Editor** and run [`schema.sql`](./schema.sql) for a fresh project. If you
   already have `media_items`, run whichever migrations you're missing instead (each is
   safe to run multiple times and never touches existing rows):
   - [`migrations/0002_add_media_metadata.sql`](./migrations/0002_add_media_metadata.sql) -
     poster/episode columns and anime/manga types
   - [`migrations/0003_add_site_settings.sql`](./migrations/0003_add_site_settings.sql) -
     the `site_settings` table used by the admin "show tracker on About" toggle
3. In **Authentication → Users**, create one email/password user (your admin login)
4. Connect the project in **Vercel → Settings → Environment Variables** (Supabase integration), or set manually:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Get a free OMDB key at https://www.omdbapi.com/apikey.aspx and add it as `OMDB_API_KEY`
   (used for poster + episode/season lookups for shows, movies, and anime in the admin
   page; manga/book/music stay manual-entry only). **OMDB emails a confirmation link - the
   key returns 401 until you click it.** If search still fails with a 401 after activating,
   re-copy the key (watch for stray spaces) and redeploy.
6. For local dev, copy `.env.example` to `.env.local` with the same names
7. Restart `npm start`, then open `/admin` to sign in and manage entries
8. Public visitors see the tracker on `/about` (bio/experience/projects stay hardcoded)

## Vercel notes

- After importing/changing env vars, **redeploy** so Create React App can bake them into the build
- Root Directory should be `my-portfolio`
- `npm run build` maps `SUPABASE_*` and `OMDB_API_KEY` → `REACT_APP_*` via `scripts/with-app-env.js`
- Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend

## Auth URLs

In Supabase → Authentication → URL Configuration:

- Site URL: `https://colbyfrison.com`
- Redirect URLs: `https://colbyfrison.com/**`, `http://localhost:3000/**`

Optional: under Authentication → Providers, keep Email enabled and disable public sign-ups if available, so only the user you create can log in.

## Poster / episode metadata

The admin page can search OMDB (shows, movies, and anime - anime is searched without
restricting to movie or series, since a title can be either) and save the chosen
poster, episode/season counts, and a link back to the source directly onto the entry.
Manga, books, and music are manual-entry only (no matching API). The public tracker
only ever reads this cached data from Supabase - it never calls OMDB itself, so
visitor traffic can't hit third-party rate limits.

OMDB is a small, free, volunteer-run service, so occasional errors are expected:

- **401** - almost always an unactivated/incorrect key. See the setup step above.
- **502/503/504** - transient upstream issue; the admin search retries once
  automatically, so most of these resolve without you doing anything.
- **429 / "Request limit reached!"** - the free tier caps at 1,000 requests/day;
  wait until the next day or upgrade the key.

## Hiding the tracker

The admin dashboard's Media Tracker view has a "Show the tracker section on the About
page" checkbox. It reads/writes a single row in `site_settings` (`tracker_visible`),
which the About page checks before rendering the section at all - turning it off hides
the section (and its entry in the vertical nav) for visitors without deleting any
tracked entries. Requires `migrations/0003_add_site_settings.sql` to have been run.
