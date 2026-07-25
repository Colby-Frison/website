-- Run this in the Supabase SQL Editor if you already created media_items
-- from an earlier version of schema.sql. Safe to run multiple times and
-- does not touch existing rows.

alter table public.media_items
  add column if not exists poster_url text,
  add column if not exists episode_count integer,
  add column if not exists season_count integer,
  add column if not exists release_year integer,
  add column if not exists external_source text,
  add column if not exists external_id text,
  add column if not exists external_url text;

alter table public.media_items
  drop constraint if exists media_items_media_type_check;

alter table public.media_items
  add constraint media_items_media_type_check
  check (media_type in ('show', 'movie', 'book', 'music', 'anime', 'manga'));

alter table public.media_items
  drop constraint if exists media_items_external_source_check;

alter table public.media_items
  add constraint media_items_external_source_check
  check (external_source is null or external_source in ('jikan', 'omdb'));
