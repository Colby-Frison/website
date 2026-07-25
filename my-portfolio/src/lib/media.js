export const MEDIA_TYPES = [
  { value: 'show', label: 'TV Show' },
  { value: 'movie', label: 'Movie' },
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

export const EMPTY_MEDIA_FORM = {
  title: '',
  media_type: 'show',
  status: 'in_progress',
  rating: '',
  notes: '',
};

export function formatRating(rating) {
  if (rating === null || rating === undefined || rating === '') return null;
  const n = Number(rating);
  if (Number.isNaN(n)) return null;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
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
  };
}
