export const MEDIA_TYPES = [
  { value: 'show', label: 'TV Show' },
  { value: 'movie', label: 'Movie' },
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'book', label: 'Book' },
  { value: 'music', label: 'Music' },
];

export const MEDIA_STATUSES = [
  { value: 'planning', label: 'Plan to watch / read' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'dropped', label: 'Dropped' },
];

export const MEDIA_TYPE_LABELS = Object.fromEntries(
  MEDIA_TYPES.map(({ value, label }) => [value, label])
);

export const MEDIA_STATUS_LABELS = Object.fromEntries(
  MEDIA_STATUSES.map(({ value, label }) => [value, label])
);

// Types the admin panel can search against OMDB. Anime is included since
// OMDB covers anime movies/series too — it's searched without a `type`
// filter (see searchOmdb) since an anime title can be either.
export const OMDB_MEDIA_TYPES = new Set(['show', 'movie', 'anime']);

export const EMPTY_MEDIA_FORM = {
  title: '',
  media_type: 'show',
  status: 'in_progress',
  rating: '',
  notes: '',
  poster_url: '',
  episode_count: '',
  season_count: '',
  release_year: '',
  external_source: '',
  external_id: '',
  external_url: '',
};

export function formatRating(rating) {
  if (rating === null || rating === undefined || rating === '') return null;
  const n = Number(rating);
  if (Number.isNaN(n)) return null;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function toNullableInt(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function normalizeMediaPayload(form) {
  const ratingRaw = form.rating === '' || form.rating === null || form.rating === undefined
    ? null
    : Number(form.rating);

  return {
    title: form.title.trim(),
    media_type: form.media_type,
    status: form.status,
    rating: ratingRaw !== null && !Number.isNaN(ratingRaw) ? ratingRaw : null,
    notes: form.notes?.trim() ? form.notes.trim() : null,
    poster_url: form.poster_url?.trim() ? form.poster_url.trim() : null,
    episode_count: toNullableInt(form.episode_count),
    season_count: toNullableInt(form.season_count),
    release_year: toNullableInt(form.release_year),
    external_source: form.external_source || null,
    external_id: form.external_id || null,
    external_url: form.external_url || null,
  };
}

/**
 * "Updated 3 days ago" style relative timestamp. Falls back to a plain
 * date once far enough in the past that a relative label stops being useful.
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 30) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  const diffWeek = Math.round(diffDay / 7);
  if (diffDay < 60) return `${diffWeek}w ago`;

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
