import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LeafAccent from '../../motif/LeafAccent';
import {
  getAdminNavPreference,
  setAdminNavPreference,
} from '../../../lib/adminNavPreference';
import TrackerView from './TrackerView';
import '../Admin.css';
import './AdminDashboard.css';

// One entry today, but the shell (sidebar + view switcher) is built to
// take more — add another { id, label, component } here later.
const ADMIN_VIEWS = [{ id: 'tracker', label: 'Media Tracker', component: TrackerView }];

const AdminDashboard = ({ user, onSignOut }) => {
  const [activeViewId, setActiveViewId] = useState(ADMIN_VIEWS[0].id);
  const [navShortcut, setNavShortcut] = useState(() => getAdminNavPreference());

  const handleToggleNavShortcut = (event) => {
    const checked = event.target.checked;
    setNavShortcut(checked);
    setAdminNavPreference(checked);
  };

  const activeView = ADMIN_VIEWS.find((view) => view.id === activeViewId) || ADMIN_VIEWS[0];
  const ActiveViewComponent = activeView.component;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <LeafAccent size="sm" settle />
          <span>Admin</span>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin views">
          {ADMIN_VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`admin-sidebar-link${view.id === activeViewId ? ' is-active' : ''}`}
              aria-current={view.id === activeViewId ? 'page' : undefined}
              onClick={() => setActiveViewId(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-sidebar-user">{user.email}</p>
          <label className="admin-checkbox">
            <input type="checkbox" checked={navShortcut} onChange={handleToggleNavShortcut} />
            Show Admin link in navbar
          </label>
          <button type="button" className="admin-button admin-button--ghost" onClick={onSignOut}>
            Sign out
          </button>
          <Link to="/about" className="admin-sidebar-back">
            View About page
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <ActiveViewComponent />
      </main>
    </div>
  );
};

export default AdminDashboard;
