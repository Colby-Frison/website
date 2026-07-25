import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import { useAuth } from '../../hooks/useAuth';
import { setAdminNavPreference } from '../../lib/adminNavPreference';
import AdminDashboard from './admin/AdminDashboard';
import './Admin.css';

const Admin = () => {
  const { user, loading: authLoading, error: authError, configured, signIn, signOut } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginMessage, setLoginMessage] = useState(null);

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
    } else {
      // First successful login on this device: surface the Admin shortcut
      // in the navbar automatically so there's no need to remember the URL.
      setAdminNavPreference(true);
    }
    setLoginBusy(false);
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
    <div className="interior-page admin-page admin-page--dashboard">
      <PageAtmosphere />
      <AdminDashboard user={user} onSignOut={signOut} />
    </div>
  );
};

export default Admin;
