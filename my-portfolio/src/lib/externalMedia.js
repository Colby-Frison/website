/**
 * Jikan (MyAnimeList) and OMDB lookups used only from the Admin UI.
 *
 * Design goal: the public About page never calls these — an admin searches
 * once, picks a result, and the chosen poster/episode/season data is saved
 * into Supabase. Every export here returns `{ data, error }` and never
 * throws, so a flaky third-party API can't break the admin form.
 */

const JIKAN_BASE = 'https://api.jikan.moe/v4';
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

async function safeFetchJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    return { data: null, error: 'Network error reaching the API.' };
  }

  if (!response.ok) {
    if (response.status === 429) {
      return { data: null, error: 'Rate limited — wait a moment and try again.' };
    }
    return { data: null, error: `Request failed (${response.status}).` };
  }

  try {
    const json = await response.json();
    return { data: json, error: null };
  } catch (parseError) {
    return { data: null, error: 'Could not parse the API response.' };
  }
}

/**
 * @param {'anime' | 'manga'} kind
 */
export async function searchJikan(kind, query) {
  const trimmed = query.trim();
  if (!trimmed) return { data: [], error: null };

  const cacheKey = `jikan:${kind}:${trimmed.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return { data: cached, error: null };

  const url = `${JIKAN_BASE}/${kind}?q=${encodeURIComponent(trimmed)}&limit=8&sfw=true`;
  const { data, error } = await safeFetchJson(url);
  if (error) return { data: [], error };

  const results = (data?.data || []).map((item) => ({
    externalId: String(item.mal_id),
    title: item.title,
    year: item.year || item.published?.prop?.from?.year || item.aired?.prop?.from?.year || null,
    posterUrl: item.images?.jpg?.image_url || null,
    episodeCount: kind === 'anime' ? item.episodes ?? null : item.chapters ?? null,
    externalUrl: item.url || null,
  }));

  setCached(cacheKey, results);
  return { data: results, error: null };
}

export function searchJikanAnime(query) {
  return searchJikan('anime', query);
}

export function searchJikanManga(query) {
  return searchJikan('manga', query);
}

/**
 * @param {'movie' | 'series'} type
 */
export async function searchOmdb(query, type) {
  const trimmed = query.trim();
  if (!trimmed) return { data: [], error: null };
  if (!isOmdbConfigured) {
    return { data: [], error: 'OMDB_API_KEY is not configured.' };
  }

  const cacheKey = `omdb-search:${type}:${trimmed.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return { data: cached, error: null };

  const url = `${OMDB_BASE}?apikey=${encodeURIComponent(OMDB_API_KEY)}&s=${encodeURIComponent(
    trimmed
  )}&type=${type}`;
  const { data, error } = await safeFetchJson(url);
  if (error) return { data: [], error };

  if (data?.Response === 'False') {
    if (data.Error === 'Request limit reached!') {
      return { data: [], error: 'OMDB daily request limit reached.' };
    }
    return { data: [], error: null };
  }

  const results = (data?.Search || []).map((item) => ({
    externalId: item.imdbID,
    title: item.Title,
    year: item.Year ? parseInt(item.Year, 10) || null : null,
    posterUrl: item.Poster && item.Poster !== 'N/A' ? item.Poster : null,
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
 * Sums episode counts across every season of an OMDB series. Bounded to
 * `totalSeasons`, so at most N sequential requests — only ever triggered by
 * an explicit admin action, never by a public page visit. Tolerant of
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

  for (let season = 1; season <= totalSeasons; season += 1) {
    const url = `${OMDB_BASE}?apikey=${encodeURIComponent(
      OMDB_API_KEY
    )}&i=${encodeURIComponent(imdbId)}&Season=${season}`;
    // eslint-disable-next-line no-await-in-loop
    const { data, error } = await safeFetchJson(url);

    if (error || !data || data.Response === 'False' || !Array.isArray(data.Episodes)) {
      failedSeasons += 1;
    } else {
      episodeTotal += data.Episodes.length;
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
  };
}
