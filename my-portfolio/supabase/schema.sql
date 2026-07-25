-- Media tracker schema for the portfolio About section.
-- Run this in the Supabase SQL Editor after creating a project.
-- Then create one Auth user (email/password) in Authentication → Users
-- for admin login at /admin.

create extension if not exists "pgcrypto";

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  media_type text not null
    check (media_type in ('show', 'movie', 'book', 'music')),
  status text not null
    check (status in ('planning', 'in_progress', 'completed', 'dropped', 'on_hold')),
  rating numeric(3, 1)
    check (rating is null or (rating >= 0 and rating <= 10)),
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_items_type_status_idx
  on public.media_items (media_type, status);

create index if not exists media_items_sort_idx
  on public.media_items (sort_order desc, updated_at desc);

create or replace function public.set_media_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists media_items_set_updated_at on public.media_items;
create trigger media_items_set_updated_at
  before update on public.media_items
  for each row
  execute function public.set_media_items_updated_at();

alter table public.media_items enable row level security;

-- Anyone can read the tracker (public About page).
drop policy if exists "Public read media_items" on public.media_items;
create policy "Public read media_items"
  on public.media_items
  for select
  to anon, authenticated
  using (true);

-- Only signed-in admin users can write.
drop policy if exists "Authenticated insert media_items" on public.media_items;
create policy "Authenticated insert media_items"
  on public.media_items
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated update media_items" on public.media_items;
create policy "Authenticated update media_items"
  on public.media_items
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated delete media_items" on public.media_items;
create policy "Authenticated delete media_items"
  on public.media_items
  for delete
  to authenticated
  using (true);
