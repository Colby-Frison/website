import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavbarMobile.css';

const NavbarMobile = ({ deviceInfo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Projects', path: '/projects' },
    { text: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`mobile-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="mobile-navbar-content">
          <Link to="/" className="mobile-nav-brand" onClick={closeMobileMenu}>
            Colby Frison
          </Link>
          
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="mobile-menu-line"></span>
            <span className="mobile-menu-line"></span>
            <span className="mobile-menu-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <nav className="mobile-menu-nav">
            {navItems.map((item, index) => (
              <Link
                key={item.text}
                to={item.path}
                className={`mobile-menu-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                {item.text}
              </Link>
            ))}
          </nav>
          
          <div className="mobile-menu-footer">
            <div className="mobile-menu-social">
              <a
                href="https://github.com/colby-frison"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-menu-social-link"
                aria-label="GitHub Profile"
              >
                <img src="/github.png" alt="GitHub" className="mobile-menu-social-icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/colbyfrison"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-menu-social-link"
                aria-label="LinkedIn Profile"
              >
                <img src="/linkedIn.png" alt="LinkedIn" className="mobile-menu-social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
