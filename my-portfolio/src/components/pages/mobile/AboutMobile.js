import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../../motif/PageAtmosphere';
import LeafAccent from '../../motif/LeafAccent';
import './AboutMobile.css';

const AboutMobile = () => {
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

    const sections = document.querySelectorAll('.about-mobile-page .section-animate');
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
    <div className="interior-page about-mobile-page">
      <PageAtmosphere showSecondary={false} />
      <div className="interior-page-inner about-mobile-container">
        <header className="about-mobile-hero">
          <h1 className="interior-title about-mobile-title">About</h1>
          <div className="interior-title-rule about-mobile-rule">
            <LeafAccent size="sm" settle />
          </div>
          <p className="about-mobile-bio section-animate" data-delay="0.05">
            Computer Science student at the University of Oklahoma. I care about building
            software people can trust and use—from secure systems and quality testing to
            full-stack products and thoughtful interfaces. Currently interning in IT at
            ConocoPhillips.
          </p>
        </header>

        <section className="about-mobile-section section-animate" data-delay="0.12">
          <div className="about-mobile-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">Education</h2>
          </div>
          <h3 className="about-mobile-degree">B.S. Computer Science</h3>
          <p className="about-mobile-university">
            University of Oklahoma · Gallogly College of Engineering · Norman, OK
          </p>
          <p className="about-mobile-meta">
            <span>Graduation</span> May 2027
          </p>
          <p className="about-mobile-meta">
            <span>GPA</span> 3.70 / 4.00
          </p>
          <p className="about-mobile-honor">President&apos;s Honor Roll · Spring 2025</p>
        </section>

        <section className="about-mobile-section section-animate" data-delay="0.18">
          <div className="about-mobile-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">Experience</h2>
          </div>
          <div className="about-mobile-timeline">
            {workExperience.map((job) => (
              <article key={job.title} className="about-mobile-job">
                <div className="about-mobile-job-marker">
                  <LeafAccent size="sm" settle />
                </div>
                <h3>{job.title}</h3>
                <p className="about-mobile-period">{job.period}</p>
                <p className="about-mobile-company">{job.company}</p>
                <ul>
                  {job.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-mobile-section section-animate" data-delay="0.24">
          <div className="about-mobile-section-head">
            <LeafAccent size="sm" />
            <h2 className="interior-section-title">Skills</h2>
          </div>
          <div className="about-mobile-skill">
            <h4>Languages</h4>
            <p>{skills.languages.join(' · ')}</p>
          </div>
          <div className="about-mobile-skill">
            <h4>Tools</h4>
            <p>{skills.tools.join(' · ')}</p>
          </div>
          <div className="about-mobile-skill">
            <h4>Platforms</h4>
            <p>{skills.platforms.join(' · ')}</p>
          </div>
          <div className="about-mobile-skill">
            <h4>Focus</h4>
            <p>{skills.focus.join(' · ')}</p>
          </div>
        </section>

        <p className="about-mobile-next section-animate" data-delay="0.3">
          <Link to="/projects">View projects</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/contact">Get in touch</Link>
        </p>
      </div>
    </div>
  );
};

export default AboutMobile;
