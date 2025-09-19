import React, { useState, useEffect } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './ContactMobile.css';

const ContactMobile = ({ deviceInfo }) => {
  const [emailRevealed, setEmailRevealed] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px 50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || '0';
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseFloat(delay) * 1000);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.mobile-contact-animate');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Email parts encoded to prevent scraping
  const emailParts = {
    username: 'Colbyfrison100',
    domain: 'gmail.com'
  };

  const revealEmail = () => {
    setEmailRevealed(true);
  };

  const getEmailDisplay = () => {
    if (emailRevealed) {
      return `${emailParts.username}@${emailParts.domain}`;
    }
    return 'Click to reveal email';
  };

  const handleEmailClick = () => {
    if (emailRevealed) {
      window.location.href = `mailto:${emailParts.username}@${emailParts.domain}`;
    } else {
      revealEmail();
    }
  };

  const contactMethods = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      value: getEmailDisplay(),
      onClick: handleEmailClick,
      description: 'Feel free to reach out for opportunities or collaborations',
      buttonText: emailRevealed ? 'Send Email' : 'Reveal Email'
    },
    {
      icon: <GitHubIcon />,
      title: 'GitHub',
      value: 'github.com/Colby-Frison',
      link: 'https://github.com/Colby-Frison',
      description: 'Check out my projects and contributions',
      buttonText: 'Visit GitHub'
    },
    {
      icon: <LinkedInIcon />,
      title: 'LinkedIn',
      value: 'Colby Frison',
      link: 'https://www.linkedin.com/in/colby-frison-892680327',
      description: 'Connect with me professionally',
      buttonText: 'Connect'
    }
  ];

  return (
    <div className="contact-mobile-page">
      <div className="contact-mobile-container">
        <h1 className="mobile-contact-title">Get in Touch</h1>
        <p className="mobile-contact-description">
          I'm always interested in hearing about new opportunities, collaborations, or just connecting with fellow developers.
        </p>

        <div className="mobile-contact-methods">
          {contactMethods.map((method, index) => (
            <div 
              key={method.title} 
              className="mobile-contact-card mobile-contact-animate"
              data-delay={0.2 + index * 0.1}
            >
              <div className="mobile-contact-icon">
                {method.icon}
              </div>
              <h3 className="mobile-contact-method-title">{method.title}</h3>
              <p 
                className={`mobile-contact-value ${method.onClick ? 'clickable' : ''}`}
                onClick={method.onClick}
              >
                {method.value}
              </p>
              <p className="mobile-contact-method-description">
                {method.description}
              </p>
              <button
                className="mobile-contact-button"
                onClick={method.onClick || (() => window.open(method.link, '_blank'))}
              >
                {method.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mobile-contact-footer mobile-contact-animate" data-delay="0.6">
          <p className="mobile-contact-location">
            Currently based in Norman, OK
          </p>
          <p className="mobile-contact-availability">
            Open to remote opportunities and collaborations
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactMobile;
