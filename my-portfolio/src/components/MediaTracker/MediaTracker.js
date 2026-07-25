import React, { useMemo, useState } from 'react';
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
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

const STATUS_DOT_CLASS = {
  in_progress: 'media-status-dot--active',
  planning: 'media-status-dot--planning',
  completed: 'media-status-dot--completed',
  on_hold: 'media-status-dot--hold',
  dropped: 'media-status-dot--dropped',
};

const MediaPosterImage = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const showImage = item.poster_url && !failed;

  if (showImage) {
    return (
      <img
        src={item.poster_url}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="media-card-poster-fallback" aria-hidden="true">
      <LeafAccent size="md" settle />
      <span>{item.title.slice(0, 1).toUpperCase()}</span>
    </div>
  );
};

const MediaCardSkeleton = () => (
  <div className="media-card media-card--skeleton" aria-hidden="true">
    <div className="media-card-poster media-skeleton-block" />
    <div className="media-card-body">
      <div className="media-skeleton-line media-skeleton-line--title" />
      <div className="media-skeleton-line media-skeleton-line--meta" />
    </div>
  </div>
);

const MediaCard = ({ item, compact }) => {
  const rating = formatRating(item.rating);
  const added = formatRelativeTime(item.created_at);
  const episodeLabel = item.episode_count
    ? `${item.episode_count}`
    : item.season_count
    ? `${item.season_count}s`
    : null;

  // The hover-reveal overlay is a desktop-only enhancement — skip it
  // entirely on the mobile tracker rather than relying on hover CSS
  // alone (touch devices don't have a reliable hover state anyway).
  const showOverlay = !compact && (item.notes || rating || episodeLabel || added);

  return (
    <article className="media-card" tabIndex={showOverlay ? 0 : undefined}>
      <div className="media-card-poster">
        <MediaPosterImage item={item} />
        {showOverlay && (
          <div className="media-card-overlay">
            {item.notes && <p className="media-card-overlay-notes">{item.notes}</p>}
            {(rating || episodeLabel) && (
              <p className="media-card-overlay-stats">
                {rating && (
                  <span>
                    <StarRoundedIcon fontSize="inherit" /> {rating}
                  </span>
                )}
                {episodeLabel && (
                  <span>
                    <PlaylistPlayRoundedIcon fontSize="inherit" /> {episodeLabel}
                  </span>
                )}
              </p>
            )}
            {added && <p className="media-card-overlay-added">Added {added}</p>}
          </div>
        )}
      </div>
      <div className="media-card-body">
        <div className="media-card-title-row">
          <span
            className={`media-status-dot ${STATUS_DOT_CLASS[item.status] || ''}`}
            aria-hidden="true"
          />
          <span className="media-card-title">{item.title}</span>
        </div>
        <div className="media-card-badges">
          <span className="media-card-badge">
            {MEDIA_TYPE_LABELS[item.media_type] || item.media_type}
          </span>
          {item.release_year && (
            <span className="media-card-badge">{item.release_year}</span>
          )}
          {episodeLabel && (
            <span className="media-card-badge media-card-badge--icon">
              <PlaylistPlayRoundedIcon fontSize="inherit" />
              {episodeLabel}
            </span>
          )}
          {rating && (
            <span className="media-card-badge media-card-badge--icon">
              <StarRoundedIcon fontSize="inherit" />
              {rating}
            </span>
          )}
        </div>
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
                    <MediaCard key={item.id} item={item} compact={compact} />
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
