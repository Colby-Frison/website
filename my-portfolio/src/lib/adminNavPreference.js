/**
 * Lets a signed-in admin opt into showing an "Admin" link in the main
 * navbar on a given device, so they don't have to remember/retype the
 * /admin URL. Combined with Supabase's default persisted session, this
 * means no repeated logins on that device.
 *
 * Purely a UI convenience — the link itself is harmless to show, since
 * /admin still requires a valid Supabase session to read or write data.
 */
const STORAGE_KEY = 'portfolio_admin_nav_visible';
const CHANGE_EVENT = 'portfolio-admin-nav-changed';

export function getAdminNavPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch (storageError) {
    return false;
  }
}

export function setAdminNavPreference(visible) {
  try {
    window.localStorage.setItem(STORAGE_KEY, visible ? '1' : '0');
  } catch (storageError) {
    // Storage disabled (e.g. private browsing) — preference just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeAdminNavPreference(callback) {
  const handler = () => callback(getAdminNavPreference());
  window.addEventListener('storage', handler);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(CHANGE_EVENT, handler);
  };
}
