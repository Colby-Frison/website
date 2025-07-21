import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Box className="footer-content">
          <Box className="social-links">
            <a
              href="https://github.com/Colby-Frison"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/colby-frison-892680327"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <LinkedInIcon />
            </a>
          </Box>
          <Typography variant="body2" className="copyright">
            © {currentYear} Colby Frison. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer; 