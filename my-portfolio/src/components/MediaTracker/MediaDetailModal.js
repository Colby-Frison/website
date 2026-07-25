import React, { useEffect, useRef, useState } from 'react';
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
  const episodeLabel = item.media_type === 'manga' ? 'Chapters' : 'Episodes';

  return (
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
          ×
        </button>

        <div className="media-modal-body">
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
              <dl className="media-modal-stats">
                {rating && (
                  <div>
                    <dt>Rating</dt>
                    <dd>{rating}/10</dd>
                  </div>
                )}
                {item.episode_count && (
                  <div>
                    <dt>{episodeLabel}</dt>
                    <dd>{item.episode_count}</dd>
                  </div>
                )}
                {item.season_count && (
                  <div>
                    <dt>Seasons</dt>
                    <dd>{item.season_count}</dd>
                  </div>
                )}
              </dl>
            )}

            {item.notes && (
              <div className="media-modal-notes">
                <h4>Notes</h4>
                <p>{item.notes}</p>
              </div>
            )}

            <p className="media-modal-timestamps">
              {addedDate && (
                <span>
                  Added {addedDate}
                  {addedRelative ? ` (${addedRelative})` : ''}
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
  );
};

export default MediaDetailModal;
