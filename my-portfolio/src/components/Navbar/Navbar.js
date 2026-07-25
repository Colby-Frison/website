import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  getAdminNavPreference,
  subscribeAdminNavPreference,
} from '../../lib/adminNavPreference';
import './Navbar.css';

const baseNavItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' },
  { text: 'Projects', path: '/projects' },
  { text: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowAdminLink(getAdminNavPreference());
    return subscribeAdminNavPreference(setShowAdminLink);
  }, []);

  const navItems = showAdminLink
    ? [...baseNavItems, { text: 'Admin', path: '/admin' }]
    : baseNavItems;

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="site-nav-inner" aria-label="Primary">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`site-nav-link ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.text}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
