import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          © {currentYear} Colby Frison. All rights reserved.
        </div>
        
        <div className="social-icons">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;