import React, { useEffect, useState } from 'react';
import PageAtmosphere from '../../motif/PageAtmosphere';
import LeafAccent from '../../motif/LeafAccent';
import './ContactMobile.css';

const ContactMobile = () => {
  const [emailRevealed, setEmailRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || '0';
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, parseFloat(delay) * 1000);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px 50px 0px' }
    );

    const sections = document.querySelectorAll('.contact-mobile-page .section-animate');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const emailParts = {
    username: 'Colbyfrison100',
    domain: 'gmail.com',
  };

  const revealEmail = () => {
    setEmailRevealed(true);
  };

  const getEmailDisplay = () => {
    if (emailRevealed) {
      return `${emailParts.username}@${emailParts.domain}`;
    }
    return 'Tap to reveal email';
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
      title: 'Email',
      value: getEmailDisplay(),
      description: 'Reach out for opportunities or collaborations',
      onClick: handleEmailClick,
      actionLabel: emailRevealed ? 'Send Email' : 'Reveal Email',
    },
    {
      title: 'GitHub',
      value: 'github.com/Colby-Frison',
      description: 'Projects and contributions',
      link: 'https://github.com/Colby-Frison',
      actionLabel: 'Visit GitHub',
    },
    {
      title: 'LinkedIn',
      value: 'Colby Frison',
      description: 'Connect professionally',
      link: 'https://www.linkedin.com/in/colby-frison-892680327',
      actionLabel: 'Connect',
    },
  ];

  return (
    <div className="interior-page contact-mobile-page">
      <PageAtmosphere showSecondary={false} />
      <div className="interior-page-inner contact-mobile-container">
        <h1 className="interior-title">Get in Touch</h1>
        <div className="interior-title-rule">
          <LeafAccent size="sm" settle />
        </div>
        <p className="interior-lede contact-mobile-lede">
          I&apos;m always interested in hearing about new opportunities, collaborations, or just
          connecting with fellow developers.
        </p>

        <ul className="contact-mobile-list">
          {contactMethods.map((method, index) => (
            <li
              key={method.title}
              className="contact-mobile-row section-animate"
              data-delay={0.1 + index * 0.08}
            >
              <div className="contact-mobile-row-top">
                <LeafAccent size="sm" settle />
                <h2>{method.title}</h2>
              </div>
              <p className="contact-mobile-value">{method.value}</p>
              <p className="contact-mobile-desc">{method.description}</p>
              {method.onClick ? (
                <button type="button" className="contact-mobile-action" onClick={method.onClick}>
                  {method.actionLabel}
                </button>
              ) : (
                <a
                  className="contact-mobile-action"
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {method.actionLabel}
                </a>
              )}
            </li>
          ))}
        </ul>

        <footer className="contact-mobile-note section-animate" data-delay="0.4">
          <p>Currently based in Norman, OK</p>
          <p>Open to remote opportunities and collaborations</p>
        </footer>
      </div>
    </div>
  );
};

export default ContactMobile;
