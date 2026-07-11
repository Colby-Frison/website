import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FallingLeaves from '../../motif/FallingLeaves';
import {
  ENABLE_AMBIENT_PETALS,
  ENABLE_PETAL_TRANSITIONS,
} from '../../motif/petalFeatures';
import './HomeMobile.css';

const HomeMobile = () => {
  const navigate = useNavigate();
  const [contentReady, setContentReady] = useState(!ENABLE_PETAL_TRANSITIONS);
  const [gustActive, setGustActive] = useState(ENABLE_PETAL_TRANSITIONS);
  const [phase, setPhase] = useState(ENABLE_PETAL_TRANSITIONS ? 'intro' : 'ready');
  const [exitPath, setExitPath] = useState(null);

  const directories = [
    { name: 'about', path: '/about' },
    { name: 'projects', path: '/projects' },
    { name: 'contact', path: '/contact' },
  ];

  useEffect(() => {
    if (!ENABLE_PETAL_TRANSITIONS) {
      setContentReady(true);
      setGustActive(false);
      setPhase('ready');
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setContentReady(true);
      setGustActive(false);
      setPhase('ready');
      return undefined;
    }

    const contentTimer = window.setTimeout(() => setContentReady(true), 360);
    const gustTimer = window.setTimeout(() => {
      setGustActive(false);
      setPhase('ready');
    }, 1650);

    return () => {
      window.clearTimeout(contentTimer);
      window.clearTimeout(gustTimer);
    };
  }, []);

  useEffect(() => {
    if (!ENABLE_PETAL_TRANSITIONS) return undefined;
    if (phase !== 'exit' || !exitPath) return undefined;
    const navTimer = window.setTimeout(() => navigate(exitPath), 850);
    return () => window.clearTimeout(navTimer);
  }, [phase, exitPath, navigate]);

  const handleNavigate = useCallback(
    (path) => (event) => {
      if (!ENABLE_PETAL_TRANSITIONS) {
        // Full-speed navigation — no exit delay
        return;
      }

      event.preventDefault();
      if (phase === 'exit') return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        navigate(path);
        return;
      }

      setExitPath(path);
      setGustActive(false);
      setPhase('exit');
    },
    [navigate, phase]
  );

  const showAmbient = ENABLE_AMBIENT_PETALS && contentReady && phase !== 'exit';

  return (
    <div
      className={`home-mobile-page home-mobile-page--${phase} ${
        contentReady ? 'home-mobile-page--content-ready' : ''
      }`}
    >
      {/* Petal intro/exit transition — gated by ENABLE_PETAL_TRANSITIONS (see petalFeatures.js / DEV_LOG.md) */}
      {ENABLE_PETAL_TRANSITIONS && gustActive && (
        <>
          <FallingLeaves count={120} mode="intro" layer="behind" />
          <FallingLeaves count={105} mode="intro" layer="front" />
        </>
      )}

      {showAmbient && <FallingLeaves count={72} mode="ambient" layer="behind" />}

      {ENABLE_PETAL_TRANSITIONS && phase === 'exit' && (
        <>
          <FallingLeaves count={130} mode="exit" layer="behind" />
          <FallingLeaves count={110} mode="exit" layer="front" />
        </>
      )}

      <div className="mobile-hero-content">
        <h1 className="mobile-hero-title home-ui-layer">
          <span className="mobile-accent">Colby Frison</span>
        </h1>

        <div className="mobile-main-content">
          <div className="mobile-bonsai-container">
            <img src="/bonsai.png" alt="Bonsai" className="mobile-bonsai-image" />
          </div>

          <div className="mobile-directories-section home-ui-layer">
            <div className="mobile-directories-list">
              {directories.map((directory, index) => (
                <Link
                  key={directory.name}
                  to={directory.path}
                  className="mobile-directory-item"
                  style={{ animationDelay: `${0.15 + index * 0.08}s` }}
                  onClick={handleNavigate(directory.path)}
                >
                  <span className="mobile-directory-name">{directory.name}</span>
                </Link>
              ))}
            </div>

            <div className="mobile-social-links">
              <a
                href="https://github.com/colby-frison"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="GitHub Profile"
              >
                <img src="/github.png" alt="GitHub" className="mobile-social-icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/colby-frison-892680327"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="LinkedIn Profile"
              >
                <img src="/linkedIn.png" alt="LinkedIn" className="mobile-social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobile;
