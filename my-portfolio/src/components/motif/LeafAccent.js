import React from 'react';
import './LeafAccent.css';

/**
 * Reusable leaf silhouette for interior-page accents.
 * Home falling-leaves can reuse this SVG path later.
 */
const LeafAccent = ({
  size = 'md',
  tone = 'crimson',
  settle = false,
  rotate = false,
  rotated = false,
  className = '',
  ariaHidden = true,
}) => {
  const classes = [
    'leaf-accent',
    `leaf-accent--${size}`,
    `leaf-accent--${tone}`,
    settle ? 'leaf-accent--settle' : '',
    rotate ? 'leaf-accent--rotate' : '',
    rotated ? 'leaf-accent--rotated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-hidden={ariaHidden}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C12 2 5 7.2 5 13.2C5 17.4 8.1 21 12 21C15.9 21 19 17.4 19 13.2C19 7.2 12 2 12 2Z"
          fill="currentColor"
          opacity="0.92"
        />
        <path
          d="M12 5.5V19.5"
          stroke="var(--paper, #f5f2ed)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M12 10C10.2 11.1 9 12.8 9 14.4M12 12.5C13.8 13.6 15 15 15 16.4"
          stroke="var(--paper, #f5f2ed)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </span>
  );
};

export default LeafAccent;
