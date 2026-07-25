import React, { useEffect, useMemo, useRef, useState } from 'react';
import LeafAccent from '../../motif/LeafAccent';
import { useMediaItems } from '../../../hooks/useMediaItems';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import { supabase } from '../../../lib/supabase';
import {
  EMPTY_MEDIA_FORM,
  MEDIA_STATUSES,
  MEDIA_STATUS_LABELS,
  MEDIA_TYPES,
  OMDB_MEDIA_TYPES,
  normalizeMediaPayload,
} from '../../../lib/media';
import {
  fetchOmdbEpisodeTotal,
  getOmdbDetails,
  isOmdbConfigured,
  searchOmdb,
} from '../../../lib/externalMedia';
import { MediaCard } from '../../MediaTracker/MediaCard';
import '../Admin.css';
import './TrackerView.css';

const OMDB_TYPE_BY_MEDIA_TYPE = {
  show: 'series',
  movie: 'movie',
};

const FILTER_ALL = 'all';

const TrackerView = () => {
  const { items, loading: itemsLoading, error: itemsError, refresh } = useMediaItems();
  const {
    trackerVisible,
    loading: settingsLoading,
    setTrackerVisible,
    configured: settingsConfigured,
  } = useSiteSettings();

  const [visibilityBusy, setVisibilityBusy] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState(null);

  const [form, setForm] = useState(EMPTY_MEDIA_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formBusy, setFormBusy] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const [lookupResults, setLookupResults] = useState([]);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const skipNextLookupRef = useRef(false);
  const titleFieldRef = useRef(null);
  const formTopRef = useRef(null);

  const [episodeFetchBusy, setEpisodeFetchBusy] = useState(false);
  const [episodeFetchMessage, setEpisodeFetchMessage] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterStatus, setFilterStatus] = useState(FILTER_ALL);

  const isOmdbType = OMDB_MEDIA_TYPES.has(form.media_type);
  const canFetchEpisodeTotal =
    form.media_type === 'show' &&
    form.external_source === 'omdb' &&
    form.external_id &&
    Number(form.season_count) > 0;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Live "type as you search" lookup on the Title field itself, like a
  // browser address bar or search box — debounced and cached so typing
  // doesn't hammer OMDB on every keystroke.
  useEffect(() => {
    if (skipNextLookupRef.current) {
      skipNextLookupRef.current = false;
      return undefined;
    }

    if (!isOmdbType) {
      setLookupResults([]);
      setLookupOpen(false);
      setLookupError(null);
      return undefined;
    }

    const query = form.title.trim();
    if (query.length < 2) {
      setLookupResults([]);
      setLookupOpen(false);
      setLookupError(null);
      return undefined;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLookupBusy(true);
      setLookupError(null);

      const result = await searchOmdb(query, OMDB_TYPE_BY_MEDIA_TYPE[form.media_type]);

      if (cancelled) return;

      setLookupBusy(false);
      setActiveIndex(-1);

      if (result.error) {
        setLookupError(result.error);
        setLookupResults([]);
        setLookupOpen(true);
        return;
      }

      setLookupResults(result.data);
      setLookupOpen(true);
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, form.media_type, isOmdbType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (titleFieldRef.current && !titleFieldRef.current.contains(event.target)) {
        setLookupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterType !== FILTER_ALL && item.media_type !== filterType) return false;
      if (filterStatus !== FILTER_ALL && item.status !== filterStatus) return false;
      if (debouncedSearch) {
        const haystack = `${item.title} ${item.notes || ''}`.toLowerCase();
        if (!haystack.includes(debouncedSearch)) return false;
      }
      return true;
    });
  }, [items, filterType, filterStatus, debouncedSearch]);

  const groupedItems = useMemo(() => {
    const order = ['in_progress', 'planning', 'on_hold', 'completed', 'dropped'];
    const buckets = Object.fromEntries(order.map((status) => [status, []]));

    filteredItems.forEach((item) => {
      if (buckets[item.status]) {
        buckets[item.status].push(item);
      }
    });

    return order
      .filter((status) => buckets[status].length > 0)
      .map((status) => ({ status, items: buckets[status] }));
  }, [filteredItems]);

  const handleToggleTrackerVisible = async () => {
    setVisibilityBusy(true);
    setVisibilityMessage(null);

    const { error } = await setTrackerVisible(!trackerVisible);

    setVisibilityBusy(false);
    setVisibilityMessage(error || null);
  };

  const resetForm = () => {
    skipNextLookupRef.current = true;
    setForm(EMPTY_MEDIA_FORM);
    setEditingId(null);
    setFormMessage(null);
    setLookupResults([]);
    setLookupOpen(false);
    setLookupError(null);
    setEpisodeFetchMessage(null);
  };

  const startEdit = (item) => {
    skipNextLookupRef.current = true;
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      media_type: item.media_type || 'show',
      status: item.status || 'in_progress',
      rating: item.rating === null || item.rating === undefined ? '' : String(item.rating),
      notes: item.notes || '',
      poster_url: item.poster_url || '',
      episode_count: item.episode_count ?? '',
      season_count: item.season_count ?? '',
      release_year: item.release_year ?? '',
      external_source: item.external_source || '',
      external_id: item.external_id || '',
      external_url: item.external_url || '',
    });
    setFormMessage(null);
    setLookupResults([]);
    setLookupOpen(false);
    setLookupError(null);
    setEpisodeFetchMessage(null);
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFormChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === 'media_type') {
      setEpisodeFetchMessage(null);
    }
  };

  const handleTitleChange = (event) => {
    setForm((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleTitleFocus = () => {
    if (lookupResults.length > 0 || lookupError) setLookupOpen(true);
  };

  const handleTitleKeyDown = (event) => {
    if (!lookupOpen || lookupResults.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, lookupResults.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectOmdbResult(lookupResults[activeIndex]);
    } else if (event.key === 'Escape') {
      setLookupOpen(false);
    }
  };

  const selectOmdbResult = async (result) => {
    setLookupBusy(true);
    setLookupError(null);

    const { data: details, error } = await getOmdbDetails(result.externalId);

    setLookupBusy(false);

    if (error || !details) {
      setLookupError(error || 'Could not load details for this title.');
      return;
    }

    skipNextLookupRef.current = true;
    setForm((prev) => ({
      ...prev,
      title: details.title || prev.title,
      poster_url: details.posterUrl || '',
      episode_count: '',
      season_count: details.seasonCount ?? '',
      release_year: details.year ?? '',
      external_source: 'omdb',
      external_id: details.externalId,
      external_url: details.externalUrl || '',
    }));
    setLookupResults([]);
    setLookupOpen(false);
    setEpisodeFetchMessage(null);

    // Series-like result: fetch the exact episode count automatically
    // rather than waiting for a manual click.
    if (details.seasonCount) {
      runEpisodeFetch(details.externalId, details.seasonCount);
    }
  };

  const runEpisodeFetch = async (externalId, seasonCount) => {
    if (!seasonCount || seasonCount < 1) return;

    setEpisodeFetchBusy(true);
    setEpisodeFetchMessage(null);

    const { data, error, partial, probedPastCap } = await fetchOmdbEpisodeTotal(
      externalId,
      seasonCount
    );

    setEpisodeFetchBusy(false);

    if (error) {
      setEpisodeFetchMessage(error);
      return;
    }

    setForm((prev) => ({ ...prev, episode_count: data }));
    if (partial) {
      setEpisodeFetchMessage(`Got ${data} episodes (some seasons could not be fetched).`);
    } else if (probedPastCap) {
      setEpisodeFetchMessage(
        `Got ${data} episodes across ${seasonCount} seasons (verified past OMDB's 100-episode season limit).`
      );
    } else {
      setEpisodeFetchMessage(`Got ${data} episodes across ${seasonCount} seasons.`);
    }
  };

  const handleFetchEpisodeTotal = () => {
    if (!canFetchEpisodeTotal) return;
    runEpisodeFetch(form.external_id, Number(form.season_count));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    const payload = normalizeMediaPayload(form);
    if (!payload.title) {
      setFormMessage('Title is required.');
      return;
    }

    if (payload.rating !== null && (payload.rating < 0 || payload.rating > 10)) {
      setFormMessage('Rating must be between 0 and 10.');
      return;
    }

    setFormBusy(true);
    setFormMessage(null);

    const wasEditing = Boolean(editingId);
    let result;
    if (editingId) {
      result = await supabase
        .from('media_items')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('media_items')
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) {
      setFormMessage(result.error.message);
      setFormBusy(false);
      return;
    }

    resetForm();
    setFormMessage(wasEditing ? 'Updated.' : 'Added.');
    setFormBusy(false);
    await refresh();
  };

  const handleDelete = async (item) => {
    if (!supabase) return;
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from('media_items').delete().eq('id', item.id);
    if (error) {
      setFormMessage(error.message);
      return;
    }

    if (editingId === item.id) resetForm();
    await refresh();
  };

  return (
    <div className="tracker-view">
      <header className="admin-hero" ref={formTopRef}>
        <h1 className="interior-title admin-title-inline tracker-view-title">Media Tracker</h1>
        <p className="admin-subtitle">
          Entries shown here look exactly like they do on the About page.
        </p>
        {settingsConfigured && (
          <div className="tracker-visibility-toggle">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={trackerVisible}
                disabled={visibilityBusy || settingsLoading}
                onChange={handleToggleTrackerVisible}
              />
              Show the tracker section on the About page
            </label>
            {visibilityMessage && (
              <span className="admin-message admin-message--error">{visibilityMessage}</span>
            )}
          </div>
        )}
      </header>

      <section className="admin-section">
        <div className="admin-section-head">
          <LeafAccent size="sm" />
          <h2 className="interior-section-title">{editingId ? 'Edit entry' : 'Add entry'}</h2>
        </div>

        <form className="admin-form admin-form--grid" onSubmit={handleSave}>
          <label className="admin-label">
            Type
            <select
              className="admin-input"
              value={form.media_type}
              onChange={handleFormChange('media_type')}
            >
              {MEDIA_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-label">
            Status
            <select
              className="admin-input"
              value={form.status}
              onChange={handleFormChange('status')}
            >
              {MEDIA_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-label admin-label--full admin-title-field" ref={titleFieldRef}>
            Title
            <input
              className="admin-input"
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              onFocus={handleTitleFocus}
              onKeyDown={handleTitleKeyDown}
              autoComplete="off"
              placeholder={
                isOmdbType
                  ? isOmdbConfigured
                    ? 'Start typing to search OMDB…'
                    : 'Title (set OMDB_API_KEY to enable search)'
                  : 'Title'
              }
              required
            />

            {isOmdbType && lookupOpen && (
              <div className="admin-lookup-dropdown">
                {lookupBusy && <p className="admin-lookup-status">Searching…</p>}
                {!lookupBusy && lookupError && (
                  <p className="admin-lookup-status admin-lookup-status--error">{lookupError}</p>
                )}
                {!lookupBusy && !lookupError && lookupResults.length === 0 && (
                  <p className="admin-lookup-status">No matches found.</p>
                )}
                {!lookupBusy && lookupResults.length > 0 && (
                  <ul className="admin-lookup-results admin-lookup-results--dropdown">
                    {lookupResults.map((result, index) => (
                      <li key={result.externalId}>
                        <button
                          type="button"
                          className={`admin-lookup-result${
                            index === activeIndex ? ' is-active' : ''
                          }`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => selectOmdbResult(result)}
                        >
                          {result.posterUrl ? (
                            <img src={result.posterUrl} alt="" loading="lazy" />
                          ) : (
                            <span className="admin-lookup-result-noimg" aria-hidden="true">
                              {result.title.slice(0, 1).toUpperCase()}
                            </span>
                          )}
                          <span className="admin-lookup-result-info">
                            <span className="admin-lookup-result-title">{result.title}</span>
                            <span className="admin-lookup-result-meta">
                              {result.year || ''}
                              {result.year && result.kind ? ' · ' : ''}
                              {result.kind || ''}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!isOmdbType && (
              <p className="admin-field-hint">
                No automatic lookup for this type — fill in manually below.
              </p>
            )}
          </label>

          <label className="admin-label">
            Poster URL
            <input
              className="admin-input"
              type="url"
              value={form.poster_url}
              onChange={handleFormChange('poster_url')}
              placeholder="Auto-filled by lookup, or paste one"
            />
          </label>

          <label className="admin-label">
            Rating (0–10, optional)
            <input
              className="admin-input"
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={form.rating}
              onChange={handleFormChange('rating')}
            />
          </label>

          <label className="admin-label">
            <span className="admin-label-row">
              {form.media_type === 'manga' ? 'Chapters' : 'Episodes'}
              {episodeFetchBusy && (
                <span className="admin-spinner" role="status" aria-label="Fetching episode count" />
              )}
            </span>
            <input
              className="admin-input"
              type="number"
              min="0"
              value={form.episode_count}
              onChange={handleFormChange('episode_count')}
              placeholder={episodeFetchBusy ? 'Fetching…' : undefined}
            />
            {canFetchEpisodeTotal && !episodeFetchBusy && (
              <button type="button" className="admin-inline-link" onClick={handleFetchEpisodeTotal}>
                Refresh episode count
              </button>
            )}
            {episodeFetchMessage && (
              <span className="admin-message admin-message--muted">{episodeFetchMessage}</span>
            )}
          </label>

          <label className="admin-label">
            Seasons
            <input
              className="admin-input"
              type="number"
              min="0"
              value={form.season_count}
              onChange={handleFormChange('season_count')}
            />
          </label>

          <label className="admin-label">
            Year
            <input
              className="admin-input"
              type="number"
              value={form.release_year}
              onChange={handleFormChange('release_year')}
            />
          </label>

          <label className="admin-label admin-label--full">
            Notes
            <textarea
              className="admin-input admin-textarea"
              rows="3"
              value={form.notes}
              onChange={handleFormChange('notes')}
            />
          </label>

          {formMessage && (
            <p
              className={`admin-message admin-label--full${
                formMessage === 'Added.' || formMessage === 'Updated.' ? '' : ' admin-message--error'
              }`}
            >
              {formMessage}
            </p>
          )}

          <div className="admin-actions admin-label--full">
            <button className="admin-button" type="submit" disabled={formBusy}>
              {formBusy ? 'Saving…' : editingId ? 'Save changes' : 'Add entry'}
            </button>
            {editingId && (
              <button
                className="admin-button admin-button--ghost"
                type="button"
                onClick={resetForm}
                disabled={formBusy}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <LeafAccent size="sm" />
          <h2 className="interior-section-title">Entries</h2>
        </div>

        <div className="admin-filter-bar">
          <input
            className="admin-input admin-search-input"
            type="search"
            placeholder="Search title or notes…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <select
            className="admin-input"
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
          >
            <option value={FILTER_ALL}>All types</option>
            {MEDIA_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            className="admin-input"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value={FILTER_ALL}>All statuses</option>
            {MEDIA_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {itemsLoading && items.length === 0 && <p className="admin-notice">Loading…</p>}
        {itemsError && <p className="admin-message admin-message--error">{itemsError}</p>}
        {!itemsLoading && !itemsError && items.length === 0 && (
          <p className="admin-notice">No entries yet.</p>
        )}
        {!itemsLoading && !itemsError && items.length > 0 && groupedItems.length === 0 && (
          <p className="admin-notice">No entries match your filters.</p>
        )}

        {groupedItems.map((group) => (
          <div key={group.status} className="media-tracker-group">
            <h3 className="media-tracker-group-title">
              {MEDIA_STATUS_LABELS[group.status] || group.status}
            </h3>
            <div className="media-tracker-grid">
              {group.items.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TrackerView;
