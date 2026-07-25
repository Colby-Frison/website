import React, { useMemo, useState } from 'react';
import { useMediaItems } from '../../hooks/useMediaItems';
import LeafAccent from '../motif/LeafAccent';
import {
  MEDIA_STATUS_LABELS,
  MEDIA_TYPE_LABELS,
  MEDIA_TYPES,
  formatRating,
  formatRelativeTime,
} from '../../lib/media';
import './MediaTracker.css';

const SKELETON_COUNT = 6;

const MediaPoster = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const showImage = item.poster_url && !failed;

  return (
    <div className="media-card-poster">
      {showImage ? (
        <img
          src={item.poster_url}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="media-card-poster-fallback" aria-hidden="true">
          <LeafAccent size="md" settle />
          <span>{item.title.slice(0, 1).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

const MediaCardSkeleton = () => (
  <div className="media-card media-card--skeleton" aria-hidden="true">
    <div className="media-card-poster media-skeleton-block" />
    <div className="media-card-body">
      <div className="media-skeleton-line media-skeleton-line--title" />
      <div className="media-skeleton-line media-skeleton-line--meta" />
      <div className="media-skeleton-line media-skeleton-line--notes" />
    </div>
  </div>
);

const MediaCard = ({ item }) => {
  const rating = formatRating(item.rating);
  const updated = formatRelativeTime(item.updated_at);
  const episodeLabel = (() => {
    if (item.media_type === 'manga' && item.episode_count) {
      return `${item.episode_count} ch`;
    }
    if (item.episode_count) {
      return `${item.episode_count} ep`;
    }
    if (item.season_count) {
      return `${item.season_count} season${item.season_count === 1 ? '' : 's'}`;
    }
    return null;
  })();

  return (
    <article className="media-card">
      <MediaPoster item={item} />
      <div className="media-card-body">
        <div className="media-card-top">
          <h4 className="media-card-title">{item.title}</h4>
          {rating && <span className="media-card-rating">{rating}/10</span>}
        </div>
        <div className="media-card-badges">
          <span className="media-card-badge media-card-badge--type">
            {MEDIA_TYPE_LABELS[item.media_type] || item.media_type}
          </span>
          {episodeLabel && <span className="media-card-badge">{episodeLabel}</span>}
          {item.release_year && (
            <span className="media-card-badge">{item.release_year}</span>
          )}
        </div>
        {item.notes && <p className="media-card-notes">{item.notes}</p>}
        {updated && <p className="media-card-updated">Updated {updated}</p>}
      </div>
    </article>
  );
};

const MediaTracker = ({ compact = false }) => {
  const { items, loading, error, configured } = useMediaItems();
  const [activeType, setActiveType] = useState('all');

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
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default MediaTracker;
