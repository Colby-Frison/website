import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LeafAccent from '../../motif/LeafAccent';
import './NavbarMobile.css';

const navItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' },
  { text: 'Projects', path: '/projects' },
  { text: 'Contact', path: '/contact' },
];

const NavbarMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`mobile-nav ${scrolled || menuOpen ? 'is-scrolled' : ''}`}>
        <div className="mobile-nav-bar">
          <button
            type="button"
            className={`mobile-nav-toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="mobile-nav-toggle-line" />
            <span className="mobile-nav-toggle-line" />
            <span className="mobile-nav-toggle-line" />
          </button>
        </div>
      </header>

      <div
        id="mobile-nav-panel"
        className={`mobile-nav-panel ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-nav-menu" aria-label="Primary">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={closeMenu}
                style={{ '--item-delay': `${0.06 + index * 0.05}s` }}
                aria-current={isActive ? 'page' : undefined}
              >
                <LeafAccent size="sm" className="mobile-nav-item-leaf" />
                <span>{item.text}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mobile-nav-footer">
          <a
            href="https://github.com/Colby-Frison"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-social"
            aria-label="GitHub Profile"
          >
            <img src="/github.png" alt="" className="mobile-nav-social-icon" />
            <span>GitHub</span>
            <span className="mobile-nav-social-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/colby-frison-892680327"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-social"
            aria-label="LinkedIn Profile"
          >
            <img src="/linkedIn.png" alt="" className="mobile-nav-social-icon" />
            <span>LinkedIn</span>
            <span className="mobile-nav-social-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
