import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import './About.css';

const About = () => {
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
      { threshold: 0.12, rootMargin: '0px 0px 80px 0px' }
    );

    const sections = document.querySelectorAll('.about-page .section-animate');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const skills = {
    languages: ['C/C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Matlab'],
    tools: ['Git', 'GitHub', 'VSCode', 'IntelliJ', 'Eclipse', 'Docker'],
    platforms: ['Windows', 'Linux'],
    focus: [
      'Full-Stack Development',
      'Software Quality & Testing',
      'UI/UX',
      'AI & Machine Learning',
      'Security',
      'Project Management',
    ],
  };

  const workExperience = [
    {
      title: 'IT Intern',
      company: 'ConocoPhillips',
      period: 'May 2026 — Present',
      details: ['Further information regarding this role is to be disclosed.'],
    },
    {
      title: 'Engineering Ambassador',
      company: 'University of Oklahoma, Gallogly College of Engineering',
      period: 'March 2024 — Present',
      details: [
        'Recruit prospective students and lead engineering facility tours',
        'Sole Computer Science ambassador for CS-related outreach',
        'Research peer institutions to improve recruitment strategies',
      ],
    },
    {
      title: "Teacher's Assistant",
      company: 'Houston Museum of Natural Science',
      period: 'March 2020 — May 2024',
      details: [
        'Led summer camp classes independently and mentored junior staff',
        'Developed educational materials for science-focused programs',
      ],
    },
  ];

  return (
    <div className="interior-page about-page">
      <PageAtmosphere />
      <div className="interior-page-inner about-container">
        <header className="about-hero">
          <h1 className="interior-title about-page-title">About</h1>
          <div className="interior-title-rule">
            <LeafAccent size="sm" settle />
          </div>
          <p className="about-bio section-animate" data-delay="0.05">
            Computer Science student at the University of Oklahoma. I care about building
            software people can trust and use—from secure systems and quality testing to
            full-stack products and thoughtful interfaces. Currently interning in IT at
            ConocoPhillips.
          </p>
        </header>

        <section className="about-section section-animate" data-delay="0.12">
          <div className="about-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">Education</h2>
          </div>
          <div className="about-edu">
            <div className="about-edu-main">
              <h3 className="about-degree">B.S. Computer Science</h3>
              <p className="about-university">
                University of Oklahoma · Gallogly College of Engineering · Norman, OK
              </p>
            </div>
            <div className="about-edu-aside">
              <p>
                <span className="about-meta-label">Graduation</span>
                May 2027
              </p>
              <p>
                <span className="about-meta-label">GPA</span>
                3.70 / 4.00
              </p>
              <p className="about-honor">President&apos;s Honor Roll · Spring 2025</p>
            </div>
          </div>
        </section>

        <section className="about-section section-animate" data-delay="0.18">
          <div className="about-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">Experience</h2>
          </div>
          <div className="about-timeline">
            {workExperience.map((job) => (
              <article key={job.title} className="about-job">
                <div className="about-timeline-marker" aria-hidden="true">
                  <LeafAccent size="sm" settle />
                </div>
                <div className="about-job-body">
                  <div className="about-job-top">
                    <h3 className="about-job-title">{job.title}</h3>
                    <p className="about-job-period">{job.period}</p>
                  </div>
                  <p className="about-job-company">{job.company}</p>
                  <ul className="about-job-details">
                    {job.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section section-animate" data-delay="0.24">
          <div className="about-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">Skills</h2>
          </div>
          <div className="about-skills-grid">
            <div className="about-skill-group">
              <h4 className="about-skill-label">Languages</h4>
              <p className="about-skill-line">{skills.languages.join(' · ')}</p>
            </div>
            <div className="about-skill-group">
              <h4 className="about-skill-label">Tools</h4>
              <p className="about-skill-line">{skills.tools.join(' · ')}</p>
            </div>
            <div className="about-skill-group">
              <h4 className="about-skill-label">Platforms</h4>
              <p className="about-skill-line">{skills.platforms.join(' · ')}</p>
            </div>
            <div className="about-skill-group">
              <h4 className="about-skill-label">Focus</h4>
              <p className="about-skill-line">{skills.focus.join(' · ')}</p>
            </div>
          </div>
        </section>

        <p className="about-next section-animate" data-delay="0.3">
          <Link to="/projects" className="about-next-link">
            View projects
          </Link>
          <span className="about-next-sep" aria-hidden="true">
            ·
          </span>
          <Link to="/contact" className="about-next-link">
            Get in touch
          </Link>
        </p>
      </div>
    </div>
  );
};

export default About;
