import { useCallback, useEffect, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const SELECT_COLUMNS = [
  'id',
  'title',
  'media_type',
  'status',
  'rating',
  'notes',
  'sort_order',
  'poster_url',
  'episode_count',
  'season_count',
  'release_year',
  'external_source',
  'external_id',
  'external_url',
  'created_at',
  'updated_at',
].join(', ');

const CACHE_TTL_MS = 30 * 1000;

// Module-level so every hook instance (desktop/mobile tracker, admin list)
// shares one cache and one in-flight request instead of each issuing its
// own Supabase query on mount.
let cache = { data: null, timestamp: 0 };
let inFlightPromise = null;

async function fetchMediaItems() {
  return supabase
    .from('media_items')
    .select(SELECT_COLUMNS)
    .order('sort_order', { ascending: false })
    .order('updated_at', { ascending: false });
}

export function useMediaItems() {
  const [items, setItems] = useState(cache.data || []);
  const [loading, setLoading] = useState(isSupabaseConfigured && !cache.data);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const load = useCallback(async ({ force = false } = {}) => {
    if (!isSupabaseConfigured || !supabase) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    const isFresh = cache.data && Date.now() - cache.timestamp < CACHE_TTL_MS;
    if (!force && isFresh) {
      setItems(cache.data);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    if (!inFlightPromise) {
      inFlightPromise = fetchMediaItems();
    }

    const { data, error: queryError } = await inFlightPromise;
    inFlightPromise = null;

    if (!mountedRef.current) return;

    if (queryError) {
      setError(queryError.message);
      setItems([]);
    } else {
      cache = { data: data || [], timestamp: Date.now() };
      setItems(cache.data);
    }

    setLoading(false);
  }, []);

  const refresh = useCallback(() => load({ force: true }), [load]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  return { items, loading, error, refresh, configured: isSupabaseConfigured };
}
