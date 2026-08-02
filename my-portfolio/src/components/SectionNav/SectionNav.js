import React, { useEffect, useState } from 'react';
import './SectionNav.css';

/**
 * Fixed vertical table-of-contents for long interior pages (About, Projects).
 * Desktop-only - mobile pages already use a compact layout and hamburger nav.
 */
const SectionNav = ({ sections, ariaLabel = 'Section navigation' }) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  const handleClick = (id) => (event) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    // The site navbar is fixed to the top of the viewport, so a plain
    // scrollIntoView would land the section heading right underneath it.
    // Offset by the navbar's actual rendered height (plus a little
    // breathing room) instead of a hardcoded guess.
    const navbar = document.querySelector('.site-nav');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
    const gap = 16;
    const targetTop =
      element.getBoundingClientRect().top + window.scrollY - navbarHeight - gap;

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    setActiveId(id);
  };

  return (
    <nav className="section-nav" aria-label={ariaLabel}>
      <ul className="section-nav-list">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`section-nav-link${activeId === section.id ? ' is-active' : ''}`}
              onClick={handleClick(section.id)}
              aria-current={activeId === section.id ? 'true' : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SectionNav;
