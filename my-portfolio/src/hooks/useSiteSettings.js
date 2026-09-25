import { useCallback, useEffect, useRef, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const CACHE_TTL_MS = 30 * 1000;

// HOTFIX: hide Currently Watching on public About pages while the DB is broken.
// Admin still sees the real site_settings value. Flip to false to restore.
export const FORCE_HIDE_PUBLIC_TRACKER = true;

// Same module-level cache pattern as useMediaItems - shared across the
// About page and the admin dashboard so both don't each issue their own
// query, and so toggling the setting in admin can force a fresh read.
let cache = { data: null, timestamp: 0 };
let inFlightPromise = null;

async function fetchSettings() {
  return supabase.from('site_settings').select('tracker_visible').eq('id', true).single();
}

export function useSiteSettings() {
  const [trackerVisible, setTrackerVisibleState] = useState(
    cache.data ? cache.data.tracker_visible : false
  );
  const [loading, setLoading] = useState(isSupabaseConfigured && !cache.data);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const load = useCallback(async ({ force = false } = {}) => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    const isFresh = cache.data && Date.now() - cache.timestamp < CACHE_TTL_MS;
    if (!force && isFresh) {
      setTrackerVisibleState(cache.data.tracker_visible);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    if (!inFlightPromise) {
      inFlightPromise = fetchSettings();
    }

    const { data, error: queryError } = await inFlightPromise;
    inFlightPromise = null;

    if (!mountedRef.current) return;

    if (queryError) {
      setError(queryError.message);
      setTrackerVisibleState(false);
    } else if (data) {
      cache = { data, timestamp: Date.now() };
      setTrackerVisibleState(data.tracker_visible);
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

  const setTrackerVisible = useCallback(
    async (nextVisible) => {
      if (!supabase) return { error: 'Supabase is not configured.' };

      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ tracker_visible: nextVisible })
        .eq('id', true);

      if (updateError) {
        return { error: updateError.message };
      }

      cache = { data: { tracker_visible: nextVisible }, timestamp: Date.now() };
      setTrackerVisibleState(nextVisible);
      return { error: null };
    },
    []
  );

  return {
    trackerVisible,
    loading,
    error,
    refresh,
    setTrackerVisible,
    configured: isSupabaseConfigured,
  };
}
