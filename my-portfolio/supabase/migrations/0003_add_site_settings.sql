-- Run this in the Supabase SQL Editor if you already have media_items set
-- up. Adds a single-row settings table used to toggle the tracker section
-- on the About page without touching any tracked entries.

create table if not exists public.site_settings (
  id boolean primary key default true,
  tracker_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, tracker_visible)
values (true, true)
on conflict (id) do nothing;

create or replace function public.set_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_site_settings_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated update site_settings" on public.site_settings;
create policy "Authenticated update site_settings"
  on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);
