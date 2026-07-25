import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import { useAuth } from '../../hooks/useAuth';
import { useMediaItems } from '../../hooks/useMediaItems';
import { supabase } from '../../lib/supabase';
import {
  getAdminNavPreference,
  setAdminNavPreference,
} from '../../lib/adminNavPreference';
import {
  EMPTY_MEDIA_FORM,
  JIKAN_MEDIA_TYPES,
  MEDIA_STATUSES,
  MEDIA_STATUS_LABELS,
  MEDIA_TYPES,
  MEDIA_TYPE_LABELS,
  OMDB_MEDIA_TYPES,
  formatRating,
  formatRelativeTime,
  normalizeMediaPayload,
} from '../../lib/media';
import {
  fetchOmdbEpisodeTotal,
  getOmdbDetails,
  isOmdbConfigured,
  searchJikanAnime,
  searchJikanManga,
  searchOmdb,
} from '../../lib/externalMedia';
import './Admin.css';

const FILTER_ALL = 'all';

const Admin = () => {
  const { user, loading: authLoading, error: authError, configured, signIn, signOut } = useAuth();
  const { items, loading: itemsLoading, error: itemsError, refresh } = useMediaItems();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);

  const [navShortcut, setNavShortcut] = useState(false);

  const [form, setForm] = useState(EMPTY_MEDIA_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formBusy, setFormBusy] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const [externalQuery, setExternalQuery] = useState('');
  const [externalResults, setExternalResults] = useState([]);
  const [externalBusy, setExternalBusy] = useState(false);
  const [externalMessage, setExternalMessage] = useState(null);
  const [episodeFetchBusy, setEpisodeFetchBusy] = useState(false);
  const [episodeFetchMessage, setEpisodeFetchMessage] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState(FILTER_ALL);
  const [filterStatus, setFilterStatus] = useState(FILTER_ALL);

  useEffect(() => {
    document.title = 'Admin · Media Tracker';
    return () => {
      document.title = 'Colby Frison | Portfolio';
    };
  }, []);

  useEffect(() => {
    setNavShortcut(getAdminNavPreference());
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const isJikanType = JIKAN_MEDIA_TYPES.has(form.media_type);
  const isOmdbType = OMDB_MEDIA_TYPES.has(form.media_type);
  const canFetchEpisodeTotal =
    form.media_type === 'show' &&
    form.external_source === 'omdb' &&
    form.external_id &&
    Number(form.season_count) > 0;

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

  const handleToggleNavShortcut = (event) => {
    const checked = event.target.checked;
    setNavShortcut(checked);
    setAdminNavPreference(checked);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginBusy(true);
    setLoginMessage(null);
    const result = await signIn(email.trim(), password);
    if (result.error) {
      setLoginMessage(result.error);
    }
    setLoginBusy(false);
  };

  const resetForm = () => {
    setForm(EMPTY_MEDIA_FORM);
    setEditingId(null);
    setFormMessage(null);
    setExternalQuery('');
    setExternalResults([]);
    setExternalMessage(null);
    setEpisodeFetchMessage(null);
  };

  const startEdit = (item) => {
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
    setExternalQuery(item.title || '');
    setExternalResults([]);
    setExternalMessage(null);
    setEpisodeFetchMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === 'media_type') {
      setExternalResults([]);
      setExternalMessage(null);
      setEpisodeFetchMessage(null);
    }
  };

  const handleExternalSearch = async (event) => {
    event.preventDefault();
    const query = externalQuery.trim() || form.title.trim();
    if (!query) {
      setExternalMessage('Enter a title to search.');
      return;
    }

    setExternalBusy(true);
    setExternalMessage(null);
    setExternalResults([]);

    let result;
    if (isJikanType) {
      result =
        form.media_type === 'anime'
          ? await searchJikanAnime(query)
          : await searchJikanManga(query);
    } else if (isOmdbType) {
      result = await searchOmdb(query, form.media_type === 'show' ? 'series' : 'movie');
    } else {
      setExternalBusy(false);
      setExternalMessage('No external lookup available for this type.');
      return;
    }

    setExternalBusy(false);

    if (result.error) {
      setExternalMessage(result.error);
      return;
    }

    if (result.data.length === 0) {
      setExternalMessage('No matches found.');
      return;
    }

    setExternalResults(result.data);
  };

  const applyJikanResult = (result) => {
    setForm((prev) => ({
      ...prev,
      title: result.title || prev.title,
      poster_url: result.posterUrl || '',
      episode_count: result.episodeCount ?? '',
      season_count: '',
      release_year: result.year ?? '',
      external_source: 'jikan',
      external_id: result.externalId,
      external_url: result.externalUrl || '',
    }));
    setExternalResults([]);
    setEpisodeFetchMessage(null);
  };

  const applyOmdbResult = async (result) => {
    setExternalBusy(true);
    setExternalMessage(null);

    const { data: details, error } = await getOmdbDetails(result.externalId);

    setExternalBusy(false);

    if (error || !details) {
      setExternalMessage(error || 'Could not load details for this title.');
      return;
    }

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
    setExternalResults([]);
    setEpisodeFetchMessage(null);
  };

  const handleFetchEpisodeTotal = async () => {
    if (!canFetchEpisodeTotal) return;

    setEpisodeFetchBusy(true);
    setEpisodeFetchMessage(null);

    const { data, error, partial } = await fetchOmdbEpisodeTotal(
      form.external_id,
      Number(form.season_count)
    );

    setEpisodeFetchBusy(false);

    if (error) {
      setEpisodeFetchMessage(error);
      return;
    }

    setForm((prev) => ({ ...prev, episode_count: data }));
    setEpisodeFetchMessage(
      partial
        ? `Got ${data} episodes (some seasons could not be fetched).`
        : `Got ${data} episodes across ${form.season_count} seasons.`
    );
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

  const handleDelete = async (id) => {
    if (!supabase) return;
    const confirmed = window.confirm('Delete this entry?');
    if (!confirmed) return;

    const { error } = await supabase.from('media_items').delete().eq('id', id);
    if (error) {
      setFormMessage(error.message);
      return;
    }

    if (editingId === id) resetForm();
    await refresh();
  };

  if (!configured) {
    return (
      <div className="interior-page admin-page">
        <PageAtmosphere />
        <div className="interior-page-inner admin-container">
          <h1 className="interior-title">Admin</h1>
          <p className="admin-notice">
            Supabase is not configured. Set <code>SUPABASE_URL</code> and{' '}
            <code>SUPABASE_ANON_KEY</code> (Vercel env or <code>.env.local</code>), then
            redeploy / restart. Run <code>supabase/schema.sql</code> in the Supabase SQL
            editor and create an Auth user for login.
          </p>
          <p className="admin-back">
            <Link to="/about">Back to About</Link>
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="interior-page admin-page">
        <PageAtmosphere />
        <div className="interior-page-inner admin-container">
          <p className="admin-notice">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="interior-page admin-page">
        <PageAtmosphere />
        <div className="interior-page-inner admin-container admin-container--narrow">
          <header className="admin-hero">
            <h1 className="interior-title">Admin</h1>
            <div className="interior-title-rule">
              <LeafAccent size="sm" settle />
            </div>
            <p className="admin-subtitle">Sign in to manage the media tracker.</p>
          </header>

          <form className="admin-form" onSubmit={handleLogin}>
            <label className="admin-label">
              Email
              <input
                className="admin-input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="admin-label">
              Password
              <input
                className="admin-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {(loginMessage || authError) && (
              <p className="admin-message admin-message--error">
                {loginMessage || authError}
              </p>
            )}
            <button className="admin-button" type="submit" disabled={loginBusy}>
              {loginBusy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="admin-back">
            <Link to="/about">Back to About</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="interior-page admin-page">
      <PageAtmosphere />
      <div className="interior-page-inner admin-container">
        <header className="admin-hero">
          <div className="admin-hero-row">
            <h1 className="interior-title admin-title-inline">Media Tracker</h1>
            <button className="admin-button admin-button--ghost" type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
          <div className="interior-title-rule admin-rule-left">
            <LeafAccent size="sm" settle />
          </div>
          <p className="admin-subtitle">Signed in as {user.email}.</p>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={navShortcut}
              onChange={handleToggleNavShortcut}
            />
            Show an Admin link in the site navbar on this device
          </label>
        </header>

        <section className="admin-section">
          <div className="admin-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">
              {editingId ? 'Edit entry' : 'Add entry'}
            </h2>
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

            {(isJikanType || isOmdbType) && (
              <div className="admin-label--full admin-lookup">
                <p className="admin-lookup-label">
                  {isJikanType
                    ? 'Look up on MyAnimeList (Jikan)'
                    : isOmdbConfigured
                    ? 'Look up on OMDB'
                    : 'OMDB lookup unavailable'}
                </p>
                {isOmdbType && !isOmdbConfigured ? (
                  <p className="admin-notice">
                    Set <code>OMDB_API_KEY</code> to enable movie/show lookups. You can
                    still fill this entry in manually below.
                  </p>
                ) : (
                  <>
                    <div className="admin-lookup-row">
                      <input
                        className="admin-input"
                        type="text"
                        placeholder="Search by title…"
                        value={externalQuery}
                        onChange={(event) => setExternalQuery(event.target.value)}
                      />
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={handleExternalSearch}
                        disabled={externalBusy}
                      >
                        {externalBusy ? 'Searching…' : 'Search'}
                      </button>
                    </div>

                    {externalMessage && (
                      <p className="admin-message admin-message--muted">{externalMessage}</p>
                    )}

                    {externalResults.length > 0 && (
                      <ul className="admin-lookup-results">
                        {externalResults.map((result) => (
                          <li key={result.externalId}>
                            <button
                              type="button"
                              className="admin-lookup-result"
                              onClick={() =>
                                isJikanType ? applyJikanResult(result) : applyOmdbResult(result)
                              }
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
                                {result.year && (
                                  <span className="admin-lookup-result-year">{result.year}</span>
                                )}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}

            <label className="admin-label admin-label--full">
              Title
              <input
                className="admin-input"
                type="text"
                value={form.title}
                onChange={handleFormChange('title')}
                required
              />
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
              {form.media_type === 'manga' ? 'Chapters' : 'Episodes'}
              <input
                className="admin-input"
                type="number"
                min="0"
                value={form.episode_count}
                onChange={handleFormChange('episode_count')}
              />
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

            {canFetchEpisodeTotal && (
              <div className="admin-label--full">
                <button
                  type="button"
                  className="admin-button admin-button--ghost"
                  onClick={handleFetchEpisodeTotal}
                  disabled={episodeFetchBusy}
                >
                  {episodeFetchBusy
                    ? 'Fetching episode count…'
                    : `Fetch exact episode count (${form.season_count} seasons)`}
                </button>
                {episodeFetchMessage && (
                  <p className="admin-message admin-message--muted">{episodeFetchMessage}</p>
                )}
              </div>
            )}

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
                  formMessage === 'Added.' || formMessage === 'Updated.'
                    ? ''
                    : ' admin-message--error'
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
          {itemsError && (
            <p className="admin-message admin-message--error">{itemsError}</p>
          )}
          {!itemsLoading && !itemsError && items.length === 0 && (
            <p className="admin-notice">No entries yet.</p>
          )}
          {!itemsLoading && !itemsError && items.length > 0 && filteredItems.length === 0 && (
            <p className="admin-notice">No entries match your filters.</p>
          )}

          {filteredItems.length > 0 && (
            <ul className="admin-list">
              {filteredItems.map((item) => {
                const rating = formatRating(item.rating);
                const updated = formatRelativeTime(item.updated_at);
                const created = formatRelativeTime(item.created_at);
                return (
                  <li key={item.id} className="admin-list-item">
                    <div className="admin-list-thumb">
                      {item.poster_url ? (
                        <img src={item.poster_url} alt="" loading="lazy" />
                      ) : (
                        <span aria-hidden="true">{item.title.slice(0, 1).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="admin-list-main">
                      <p className="admin-list-title">{item.title}</p>
                      <p className="admin-list-meta">
                        {MEDIA_TYPE_LABELS[item.media_type] || item.media_type}
                        {' · '}
                        {MEDIA_STATUS_LABELS[item.status] || item.status}
                        {rating ? ` · ${rating}/10` : ''}
                        {item.episode_count
                          ? ` · ${item.episode_count} ${
                              item.media_type === 'manga' ? 'ch' : 'ep'
                            }`
                          : ''}
                        {item.season_count ? ` · ${item.season_count} season(s)` : ''}
                      </p>
                      {item.notes && <p className="admin-list-notes">{item.notes}</p>}
                      <p className="admin-list-timestamps">
                        {created && <span>Added {created}</span>}
                        {updated && updated !== created && <span>Updated {updated}</span>}
                      </p>
                    </div>
                    <div className="admin-list-actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-button admin-button--danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="admin-back">
          <Link to="/about">View About page</Link>
        </p>
      </div>
    </div>
  );
};

export default Admin;
