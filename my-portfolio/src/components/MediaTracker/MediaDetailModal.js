import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
  MEDIA_STATUS_LABELS,
  MEDIA_TYPE_LABELS,
  formatRating,
  formatRelativeTime,
} from '../../lib/media';
import './MediaDetailModal.css';

function formatFullDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const ModalPoster = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const showImage = item.poster_url && !failed;

  return (
    <div className="media-modal-poster">
      {showImage ? (
        <img src={item.poster_url} alt="" onError={() => setFailed(true)} />
      ) : (
        <div className="media-modal-poster-fallback" aria-hidden="true">
          {item.title.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  );
};

/**
 * Rendered via a portal straight onto document.body — several ancestor
 * elements up the tree (the fade-in `.section-animate` sections) set a
 * CSS `transform`, which makes them the containing block for any
 * `position: fixed` descendant. Without the portal, the backdrop would
 * center itself against that section instead of the actual viewport.
 */
const MediaDetailModal = ({ item, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!item) return null;

  const rating = formatRating(item.rating);
  const addedDate = formatFullDate(item.created_at);
  const addedRelative = formatRelativeTime(item.created_at);
  const updatedRelative = formatRelativeTime(item.updated_at);
  const episodeLabel = item.media_type === 'manga' ? 'chapters' : 'episodes';

  const modal = (
    <div className="media-modal-backdrop" onMouseDown={onClose}>
      <div
        className="media-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="media-modal-close" onClick={onClose} aria-label="Close">
          <CloseRoundedIcon fontSize="small" />
        </button>

        <div className="media-modal-content">
          <ModalPoster item={item} />

          <div className="media-modal-info">
            <h3 id="media-modal-title" className="media-modal-title">
              {item.title}
            </h3>
            <p className="media-modal-meta">
              {MEDIA_TYPE_LABELS[item.media_type] || item.media_type}
              {' · '}
              {MEDIA_STATUS_LABELS[item.status] || item.status}
              {item.release_year ? ` · ${item.release_year}` : ''}
            </p>

            {(rating || item.episode_count || item.season_count) && (
              <div className="media-modal-stats">
                {rating && (
                  <span>
                    <StarRoundedIcon fontSize="inherit" /> {rating}/10
                  </span>
                )}
                {item.episode_count && (
                  <span>
                    <PlaylistPlayRoundedIcon fontSize="inherit" /> {item.episode_count}{' '}
                    {episodeLabel}
                  </span>
                )}
                {item.season_count && (
                  <span>
                    {item.season_count} season{item.season_count === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            )}

            {item.notes && (
              <div className="media-modal-notes">
                <p>{item.notes}</p>
              </div>
            )}

            <div className="media-modal-footer">
              <p className="media-modal-timestamps">
                {addedDate && (
                  <span>
                    Added {addedDate}
                    {addedRelative ? ` · ${addedRelative}` : ''}
                  </span>
                )}
                {updatedRelative && updatedRelative !== addedRelative && (
                  <span>Updated {updatedRelative}</span>
                )}
              </p>
              {item.external_url && (
                <a
                  href={item.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-modal-link"
                >
                  View source ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default MediaDetailModal;
