/**
 * OMDB lookups used only from the Admin UI (shows and movies).
 *
 * Design goal: the public About page never calls this — an admin searches
 * once, picks a result, and the chosen poster/episode/season data is saved
 * into Supabase. Every export here returns `{ data, error }` and never
 * throws, so a flaky third-party API can't break the admin form.
 */

const OMDB_BASE = 'https://www.omdbapi.com/';

const OMDB_API_KEY =
  process.env.REACT_APP_OMDB_API_KEY || process.env.OMDB_API_KEY || '';

export const isOmdbConfigured = Boolean(OMDB_API_KEY);

const CACHE_TTL_MS = 5 * 60 * 1000;
const searchCache = new Map();

function getCached(key) {
  const hit = searchCache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.timestamp > CACHE_TTL_MS) {
    searchCache.delete(key);
    return undefined;
  }
  return hit.value;
}

function setCached(key, value) {
  searchCache.set(key, { value, timestamp: Date.now() });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RETRYABLE_STATUSES = new Set([502, 503, 504]);

/**
 * OMDB is a small volunteer-run service that occasionally returns transient
 * 502/503/504s under load. One retry with a short delay clears most of
 * those without the admin needing to manually search again.
 */
async function safeFetchJson(url, attemptsLeft = 1) {
  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    return { data: null, error: 'Network error reaching the API.' };
  }

  if (!response.ok) {
    if (RETRYABLE_STATUSES.has(response.status) && attemptsLeft > 0) {
      await delay(900);
      return safeFetchJson(url, attemptsLeft - 1);
    }

    let body = null;
    try {
      body = await response.json();
    } catch (parseError) {
      body = null;
    }
    const bodyMessage = body?.Error || body?.message;

    if (response.status === 401) {
      return {
        data: null,
        error:
          bodyMessage ||
          'Invalid or unactivated API key (401). Check the key value, and make sure you clicked the activation link in the confirmation email.',
      };
    }

    if (response.status === 429) {
      return { data: null, error: 'Rate limited — wait a moment and try again.' };
    }

    if (RETRYABLE_STATUSES.has(response.status)) {
      return {
        data: null,
        error: `The service is temporarily unavailable (${response.status}). Try again in a moment.`,
      };
    }

    return { data: null, error: bodyMessage || `Request failed (${response.status}).` };
  }

  try {
    const json = await response.json();
    return { data: json, error: null };
  } catch (parseError) {
    return { data: null, error: 'Could not parse the API response.' };
  }
}

/**
 * @param {'movie' | 'series' | null} type Pass null/undefined to search
 *   both movies and series.
 */
export async function searchOmdb(query, type) {
  const trimmed = query.trim();
  if (!trimmed) return { data: [], error: null };
  if (!isOmdbConfigured) {
    return { data: [], error: 'OMDB_API_KEY is not configured.' };
  }

  const cacheKey = `omdb-search:${type || 'any'}:${trimmed.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return { data: cached, error: null };

  const typeParam = type ? `&type=${type}` : '';
  const url = `${OMDB_BASE}?apikey=${encodeURIComponent(OMDB_API_KEY)}&s=${encodeURIComponent(
    trimmed
  )}${typeParam}`;
  const { data, error } = await safeFetchJson(url);
  if (error) return { data: [], error };

  if (data?.Response === 'False') {
    const message = data.Error || '';
    // "Movie/Series not found!" just means no matches — not a real error.
    if (/not found/i.test(message)) {
      return { data: [], error: null };
    }
    return { data: [], error: message || 'OMDB request failed.' };
  }

  const results = (data?.Search || []).map((item) => ({
    externalId: item.imdbID,
    title: item.Title,
    year: item.Year ? parseInt(item.Year, 10) || null : null,
    posterUrl: item.Poster && item.Poster !== 'N/A' ? item.Poster : null,
    kind: item.Type || null,
  }));

  setCached(cacheKey, results);
  return { data: results, error: null };
}

export async function getOmdbDetails(imdbId) {
  if (!isOmdbConfigured) {
    return { data: null, error: 'OMDB_API_KEY is not configured.' };
  }

  const cacheKey = `omdb-detail:${imdbId}`;
  const cached = getCached(cacheKey);
  if (cached) return { data: cached, error: null };

  const url = `${OMDB_BASE}?apikey=${encodeURIComponent(OMDB_API_KEY)}&i=${encodeURIComponent(
    imdbId
  )}&plot=short`;
  const { data, error } = await safeFetchJson(url);
  if (error) return { data: null, error };

  if (!data || data.Response === 'False') {
    return { data: null, error: data?.Error || 'Title not found.' };
  }

  const details = {
    externalId: data.imdbID,
    title: data.Title,
    year: data.Year ? parseInt(data.Year, 10) || null : null,
    posterUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : null,
    seasonCount:
      data.Type === 'series' && data.totalSeasons && data.totalSeasons !== 'N/A'
        ? parseInt(data.totalSeasons, 10) || null
        : null,
    externalUrl: `https://www.imdb.com/title/${data.imdbID}/`,
  };

  setCached(cacheKey, details);
  return { data: details, error: null };
}

/**
 * OMDB's Season endpoint truncates the Episodes array at 100 items
 * (https://github.com/omdbapi/OMDb-API/issues/106). Long single-season
 * shows (Naruto, One Piece, etc.) therefore need per-episode probes
 * (`Season=N&Episode=M`) to discover the real end of the season.
 */
const OMDB_SEASON_EPISODE_CAP = 100;
const OMDB_EPISODE_PROBE_CEILING = 5000;

async function omdbEpisodeExists(imdbId, season, episode) {
  const url = `${OMDB_BASE}?apikey=${encodeURIComponent(
    OMDB_API_KEY
  )}&i=${encodeURIComponent(imdbId)}&Season=${season}&Episode=${episode}`;
  const { data, error } = await safeFetchJson(url);
  if (error || !data || data.Response === 'False') return false;
  return true;
}

/**
 * Count episodes for one season. When OMDB returns a full 100-item page,
 * exponentially then binary-search Episode=N until the first missing
 * episode to recover the true total.
 */
async function countEpisodesForSeason(imdbId, season, episodes) {
  const listed = episodes.length;
  if (listed === 0) return 0;
  if (listed < OMDB_SEASON_EPISODE_CAP) return listed;

  let maxListed = 0;
  for (const ep of episodes) {
    const n = parseInt(ep.Episode, 10);
    if (!Number.isNaN(n) && n > maxListed) maxListed = n;
  }

  let lastKnown = Math.max(maxListed, listed);

  // Exponential search for the first missing episode number.
  let gap = 32;
  let upper = lastKnown + gap;
  while (lastKnown < OMDB_EPISODE_PROBE_CEILING) {
    // eslint-disable-next-line no-await-in-loop
    await delay(350);
    // eslint-disable-next-line no-await-in-loop
    const exists = await omdbEpisodeExists(imdbId, season, upper);
    if (!exists) break;
    lastKnown = upper;
    gap = Math.min(gap * 2, 256);
    upper = Math.min(lastKnown + gap, OMDB_EPISODE_PROBE_CEILING + 1);
  }

  if (lastKnown >= OMDB_EPISODE_PROBE_CEILING) {
    return lastKnown;
  }

  // Binary search (lastKnown, upper) for the first missing episode.
  let lo = lastKnown + 1;
  let hi = upper;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    // eslint-disable-next-line no-await-in-loop
    await delay(350);
    // eslint-disable-next-line no-await-in-loop
    if (await omdbEpisodeExists(imdbId, season, mid)) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo - 1;
}

/**
 * Sums episode counts across every season of an OMDB series. Bounded to
 * `totalSeasons`, so at most N season requests (plus a few probes when a
 * season hits OMDB's 100-episode list cap). Only ever triggered by an
 * explicit admin action, never by a public page visit. Tolerant of
 * individual season failures: skips that season and reports a partial
 * result instead of aborting the whole lookup.
 */
export async function fetchOmdbEpisodeTotal(imdbId, totalSeasons) {
  if (!isOmdbConfigured) {
    return { data: null, error: 'OMDB_API_KEY is not configured.', partial: false };
  }
  if (!totalSeasons || totalSeasons < 1) {
    return { data: null, error: 'No season count available.', partial: false };
  }

  let episodeTotal = 0;
  let failedSeasons = 0;
  let probedPastCap = false;

  for (let season = 1; season <= totalSeasons; season += 1) {
    const url = `${OMDB_BASE}?apikey=${encodeURIComponent(
      OMDB_API_KEY
    )}&i=${encodeURIComponent(imdbId)}&Season=${season}`;
    // eslint-disable-next-line no-await-in-loop
    const { data, error } = await safeFetchJson(url);

    if (error || !data || data.Response === 'False' || !Array.isArray(data.Episodes)) {
      failedSeasons += 1;
    } else {
      if (data.Episodes.length >= OMDB_SEASON_EPISODE_CAP) {
        probedPastCap = true;
      }
      // eslint-disable-next-line no-await-in-loop
      episodeTotal += await countEpisodesForSeason(imdbId, season, data.Episodes);
    }

    if (season < totalSeasons) {
      // eslint-disable-next-line no-await-in-loop
      await delay(350);
    }
  }

  if (failedSeasons === totalSeasons) {
    return { data: null, error: 'Could not fetch episode counts for any season.', partial: false };
  }

  return {
    data: episodeTotal,
    error: null,
    partial: failedSeasons > 0,
    probedPastCap,
  };
}
