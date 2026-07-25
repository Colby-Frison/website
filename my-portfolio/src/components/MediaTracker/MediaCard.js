import React, { useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LeafAccent from '../motif/LeafAccent';
import { MEDIA_TYPE_LABELS, formatRating, formatRelativeTime } from '../../lib/media';
import './MediaTracker.css';

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

export const MediaCardSkeleton = () => (
  <div className="media-card media-card--skeleton" aria-hidden="true">
    <div className="media-card-poster media-skeleton-block" />
    <div className="media-card-body">
      <div className="media-skeleton-line media-skeleton-line--title" />
      <div className="media-skeleton-line media-skeleton-line--meta" />
    </div>
  </div>
);

/**
 * Shared media card used by both the public tracker (About page) and the
 * admin dashboard, so the two look identical. `onSelect` opens the
 * read-only detail modal (public); passing `onEdit`/`onDelete` instead
 * switches the card into admin mode (click to edit, small action icons).
 */
export const MediaCard = ({ item, compact, onSelect, onEdit, onDelete }) => {
  const rating = formatRating(item.rating);
  const added = formatRelativeTime(item.created_at);
  const episodeLabel = item.episode_count
    ? `${item.episode_count}`
    : item.season_count
    ? `${item.season_count}s`
    : null;

  const isAdminCard = Boolean(onEdit || onDelete);

  // The hover-reveal overlay is a desktop-only enhancement — skip it
  // entirely on the mobile tracker rather than relying on hover CSS
  // alone (touch devices don't have a reliable hover state anyway).
  const showOverlay = !compact && (item.notes || rating || episodeLabel || added);

  const handleCardClick = () => {
    if (onEdit) onEdit(item);
    else if (onSelect) onSelect(item);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(item);
  };

  // A plain button can't contain a nested delete <button> (invalid HTML —
  // browsers will otherwise silently reparent it out). Use a div with the
  // button role/keyboard handling instead so the delete action can nest
  // safely inside.
  return (
    <div
      className="media-card"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="media-card-poster">
        <MediaPosterImage item={item} />
        {isAdminCard && (
          <div className="media-card-admin-actions">
            {onEdit && (
              <span className="media-card-admin-action" aria-hidden="true">
                <EditRoundedIcon fontSize="inherit" />
              </span>
            )}
            {onDelete && (
              <button
                type="button"
                className="media-card-admin-action media-card-admin-action--delete"
                onClick={handleDeleteClick}
                aria-label={`Delete ${item.title}`}
              >
                <DeleteRoundedIcon fontSize="inherit" />
              </button>
            )}
          </div>
        )}
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
        <span className="media-card-title">{item.title}</span>
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
    </div>
  );
};
