import React from 'react';
import { Link } from 'react-router-dom';
import './HomeMobile.css';

const HomeMobile = ({ deviceInfo }) => {
  const directories = [
    { name: 'about', path: '/about' },
    { name: 'projects', path: '/projects' },
    { name: 'contact', path: '/contact' },
  ];

  return (
    <div className="home-mobile-page">
      <div className="mobile-hero-content">
        <h1 className="mobile-hero-title">
          <span className="mobile-accent">Colby Frison</span>
        </h1>

        <div className="mobile-main-content">
          <div className="mobile-bonsai-container">
            <img src="/bonsai.png" alt="Bonsai" className="mobile-bonsai-image"/>
          </div>
          
          <div className="mobile-directories-section">
            <div className="mobile-directories-list">
              {directories.map((directory, index) => (
                <Link 
                  key={directory.name}
                  to={directory.path} 
                  className="mobile-directory-item"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <span className="mobile-directory-name">
                    {directory.name}
                  </span>
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
                <img 
                  src="/github.png" 
                  alt="GitHub" 
                  className="mobile-social-icon"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/colbyfrison"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-social-link"
                aria-label="LinkedIn Profile"
              >
                <img 
                  src="/linkedIn.png" 
                  alt="LinkedIn" 
                  className="mobile-social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobile;
