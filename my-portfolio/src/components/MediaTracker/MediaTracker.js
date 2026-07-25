import React, { useMemo, useState } from 'react';
import { useMediaItems } from '../../hooks/useMediaItems';
import MediaDetailModal from './MediaDetailModal';
import { MediaCard, MediaCardSkeleton } from './MediaCard';
import { MEDIA_STATUS_LABELS, MEDIA_TYPES } from '../../lib/media';
import './MediaTracker.css';

const SKELETON_COUNT = 6;

const MediaTracker = ({ compact = false }) => {
  const { items, loading, error, configured } = useMediaItems();
  const [activeType, setActiveType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const availableTypes = useMemo(() => {
    const present = new Set(items.map((item) => item.media_type));
    return MEDIA_TYPES.filter((type) => present.has(type.value));
  }, [items]);

  const filtered = useMemo(() => {
    if (activeType === 'all') return items;
    return items.filter((item) => item.media_type === activeType);
  }, [items, activeType]);

  const grouped = useMemo(() => {
    const order = ['in_progress', 'planning', 'on_hold', 'completed', 'dropped'];
    const buckets = Object.fromEntries(order.map((status) => [status, []]));

    filtered.forEach((item) => {
      if (buckets[item.status]) {
        buckets[item.status].push(item);
      }
    });

    return order
      .filter((status) => buckets[status].length > 0)
      .map((status) => ({ status, items: buckets[status] }));
  }, [filtered]);

  const showSkeleton = configured && loading && items.length === 0;

  return (
    <div className={`media-tracker${compact ? ' media-tracker--compact' : ''}`}>
      {!configured && (
        <p className="media-tracker-empty">
          Media tracker is not connected yet. Add Supabase env vars to enable it.
        </p>
      )}

      {configured && !loading && error && (
        <p className="media-tracker-empty media-tracker-empty--error">
          Could not load tracker: {error}
        </p>
      )}

      {showSkeleton && (
        <div className="media-tracker-grid">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <MediaCardSkeleton key={index} />
          ))}
        </div>
      )}

      {configured && !loading && !error && items.length === 0 && (
        <p className="media-tracker-empty">
          Nothing tracked yet. Entries added in the admin panel will show up here.
        </p>
      )}

      {configured && !loading && !error && items.length > 0 && (
        <>
          {availableTypes.length > 1 && (
            <div className="media-tracker-filters" role="tablist" aria-label="Filter by media type">
              <button
                type="button"
                role="tab"
                aria-selected={activeType === 'all'}
                className={`media-tracker-filter${activeType === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveType('all')}
              >
                All
              </button>
              {availableTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  role="tab"
                  aria-selected={activeType === type.value}
                  className={`media-tracker-filter${activeType === type.value ? ' is-active' : ''}`}
                  onClick={() => setActiveType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}

          {grouped.length === 0 ? (
            <p className="media-tracker-empty">No entries in this category.</p>
          ) : (
            grouped.map((group) => (
              <div key={group.status} className="media-tracker-group">
                <h3 className="media-tracker-group-title">
                  {MEDIA_STATUS_LABELS[group.status] || group.status}
                </h3>
                <div className="media-tracker-grid">
                  {group.items.map((item) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      compact={compact}
                      onSelect={setSelectedItem}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {selectedItem && (
        <MediaDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default MediaTracker;
