import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const directories = [
    { name: 'about', path: '/about' },
    { name: 'projects', path: '/projects' },
    { name: 'contact', path: '/contact' },
  ];

  return (
    <div className="home-page">
      <Container maxWidth="lg" className="hero-content">
        <Typography variant="h1" className="hero-title">
          <span className="accent">Colby Frison</span>
        </Typography>

        <div className="main-content">
          <img src="/bonsai.png" alt="Bonsai" className="bonsai-image"/>
          
          <Box className="directories-section">
            <div className="directories-list">
              {directories.map((directory) => (
                <Link 
                  key={directory.name}
                  to={directory.path} 
                  className="directory-item"
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
                <img 
                  src="/github.png" 
                  alt="GitHub" 
                  className="social-icon"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/colbyfrison"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn Profile"
              >
                <img 
                  src="/linkedIn.png" 
                  alt="LinkedIn" 
                  className="social-icon"
                />
              </a>
            </Box>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default Home; 