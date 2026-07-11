import React, { useCallback, useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import FallingLeaves from '../motif/FallingLeaves';
import {
  ENABLE_AMBIENT_PETALS,
  ENABLE_PETAL_TRANSITIONS,
} from '../motif/petalFeatures';
import './Home.css';

const Home = () => {
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

    // Content comes in while the gust is still crossing
    const contentTimer = window.setTimeout(() => setContentReady(true), 380);
    const gustTimer = window.setTimeout(() => {
      setGustActive(false);
      setPhase('ready');
    }, 1750);

    return () => {
      window.clearTimeout(contentTimer);
      window.clearTimeout(gustTimer);
    };
  }, []);

  useEffect(() => {
    if (!ENABLE_PETAL_TRANSITIONS) return undefined;
    if (phase !== 'exit' || !exitPath) return undefined;
    const navTimer = window.setTimeout(() => navigate(exitPath), 900);
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
      className={`home-page home-page--${phase} ${contentReady ? 'home-page--content-ready' : ''}`}
    >
      {/* Petal intro/exit transition — gated by ENABLE_PETAL_TRANSITIONS (see petalFeatures.js / DEV_LOG.md) */}
      {ENABLE_PETAL_TRANSITIONS && gustActive && (
        <>
          <FallingLeaves count={170} mode="intro" layer="behind" />
          <FallingLeaves count={150} mode="intro" layer="front" />
        </>
      )}

      {showAmbient && <FallingLeaves count={92} mode="ambient" layer="behind" />}

      {ENABLE_PETAL_TRANSITIONS && phase === 'exit' && (
        <>
          <FallingLeaves count={180} mode="exit" layer="behind" />
          <FallingLeaves count={155} mode="exit" layer="front" />
        </>
      )}

      <Container maxWidth="lg" className="hero-content">
        <Typography variant="h1" className="hero-title home-ui-layer">
          <span className="accent">Colby Frison</span>
        </Typography>

        <div className="main-content">
          <img src="/bonsai.png" alt="Bonsai" className="bonsai-image" />

          <Box className="directories-section home-ui-layer">
            <div className="directories-list">
              {directories.map((directory) => (
                <Link
                  key={directory.name}
                  to={directory.path}
                  className="directory-item"
                  onClick={handleNavigate(directory.path)}
                >
                  <Typography variant="h5" className="directory-name">
                    {directory.name}
                  </Typography>
                </Link>
              ))}
            </div>

            <Box className="social-links">
              <a
                href="https://github.com/colby-frison"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub Profile"
              >
                <img src="/github.png" alt="GitHub" className="social-icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/colby-frison-892680327"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn Profile"
              >
                <img src="/linkedIn.png" alt="LinkedIn" className="social-icon" />
              </a>
            </Box>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default Home;
