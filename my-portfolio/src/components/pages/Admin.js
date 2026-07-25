import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import { useAuth } from '../../hooks/useAuth';
import { useMediaItems } from '../../hooks/useMediaItems';
import { supabase } from '../../lib/supabase';
import {
  EMPTY_MEDIA_FORM,
  MEDIA_STATUSES,
  MEDIA_STATUS_LABELS,
  MEDIA_TYPES,
  MEDIA_TYPE_LABELS,
  formatRating,
  normalizeMediaPayload,
} from '../../lib/media';
import './Admin.css';

const Admin = () => {
  const { user, loading: authLoading, error: authError, configured, signIn, signOut } = useAuth();
  const { items, loading: itemsLoading, error: itemsError, refresh } = useMediaItems();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);

  const [form, setForm] = useState(EMPTY_MEDIA_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formBusy, setFormBusy] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    document.title = 'Admin · Media Tracker';
    return () => {
      document.title = 'Colby Frison | Portfolio';
    };
  }, []);

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
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      media_type: item.media_type || 'show',
      status: item.status || 'in_progress',
      rating: item.rating === null || item.rating === undefined ? '' : String(item.rating),
      notes: item.notes || '',
    });
    setFormMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
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

    setForm(EMPTY_MEDIA_FORM);
    setEditingId(null);
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
          <p className="admin-subtitle">
            Signed in as {user.email}. Entries appear on the About page.
          </p>
        </header>

        <section className="admin-section">
          <div className="admin-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">
              {editingId ? 'Edit entry' : 'Add entry'}
            </h2>
          </div>

          <form className="admin-form admin-form--grid" onSubmit={handleSave}>
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
            <h2 className="interior-section-title">Current entries</h2>
          </div>

          {itemsLoading && <p className="admin-notice">Loading…</p>}
          {itemsError && (
            <p className="admin-message admin-message--error">{itemsError}</p>
          )}
          {!itemsLoading && !itemsError && items.length === 0 && (
            <p className="admin-notice">No entries yet.</p>
          )}

          {!itemsLoading && items.length > 0 && (
            <ul className="admin-list">
              {items.map((item) => {
                const rating = formatRating(item.rating);
                return (
                  <li key={item.id} className="admin-list-item">
                    <div className="admin-list-main">
                      <p className="admin-list-title">{item.title}</p>
                      <p className="admin-list-meta">
                        {MEDIA_TYPE_LABELS[item.media_type] || item.media_type}
                        {' · '}
                        {MEDIA_STATUS_LABELS[item.status] || item.status}
                        {rating ? ` · ${rating}/10` : ''}
                      </p>
                      {item.notes && <p className="admin-list-notes">{item.notes}</p>}
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
