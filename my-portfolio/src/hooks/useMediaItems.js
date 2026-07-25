import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function useMediaItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from('media_items')
      .select('id, title, media_type, status, rating, notes, sort_order, updated_at')
      .order('sort_order', { ascending: false })
      .order('updated_at', { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh, configured: isSupabaseConfigured };
}
