import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import MediaTracker from '../MediaTracker/MediaTracker';
import ResumeViewer from '../ResumeViewer/ResumeViewer';
import SectionNav from '../SectionNav/SectionNav';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import './About.css';

// Kept to at most 12 characters so they fit the vertical nav cleanly.
const BASE_ABOUT_SECTIONS = [
  { id: 'about-intro', label: 'Intro' },
  { id: 'about-education', label: 'Education' },
  { id: 'about-experience', label: 'Experience' },
  { id: 'about-skills', label: 'Skills' },
];

const TRACKER_SECTION = { id: 'about-tracker', label: 'Watching' };

const About = () => {
  const { trackerVisible } = useSiteSettings();
  const aboutSections = trackerVisible
    ? [...BASE_ABOUT_SECTIONS, TRACKER_SECTION]
    : BASE_ABOUT_SECTIONS;

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
    languages: ['C', 'C++', 'Java', 'Python', 'TypeScript', 'JavaScript', 'HTML/CSS', 'PowerShell'],
    technologies: [
      'Power Automate Desktop',
      'UiPath',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'Firebase',
      'MongoDB',
      'Tailwind CSS',
      'Git',
      'GitHub',
      'CI/CD',
    ],
    platforms: ['Windows', 'Linux'],
    focus: [
      'RPA',
      'Process Automation',
      'Full-Stack Development',
      'Machine Learning',
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
      company: 'ConocoPhillips · Automation & AI Development · Bartlesville, OK',
      period: 'May 2026 - July 2026',
      details: [
        'Enabled Power Automate adoption by evaluating platform gaps against existing RPA tools and supporting enterprise platform integration',
        'Migrated existing UiPath workflows into Power Automate Desktop pilot projects to validate feasibility and guide platform decisions',
        'Documented capability differences across RPA platforms to inform evaluation and adoption planning for the Automation & AI team',
      ],
    },
    {
      title: 'Engineering Ambassador',
      company: 'University of Oklahoma, Gallogly College of Engineering · Norman, OK',
      period: 'March 2025 - August 2025',
      details: [
        'Served as sole Computer Science ambassador, communicating complex technical concepts to prospective students and families',
        'Led campus tours of engineering facilities and provided detailed information about engineering majors and departmental opportunities',
        'Conducted research on peer institutions and high schools to inform college recruitment strategies',
        'Supported Engineering Days and high school camps through workshop guidance, event operations, and student engagement',
      ],
    },
    {
      title: "Teacher's Assistant",
      company: 'Houston Museum of Natural Science · Sugar Land, TX',
      period: 'March 2020 - May 2024',
      details: [
        "Independently led and managed summer camp classes in the instructor's absence, demonstrating leadership and adaptability",
        'Developed lesson plans and educational materials for science-focused programs',
        'Mentored students and junior staff, fostering an engaging learning environment',
      ],
    },
  ];

  return (
    <div className="interior-page about-page">
      <PageAtmosphere />
      <SectionNav sections={aboutSections} ariaLabel="About sections" />
      <div className="interior-page-inner about-container">
        <header className="about-hero" id="about-intro">
          <h1 className="interior-title about-page-title">About</h1>
          <div className="interior-title-rule">
            <LeafAccent size="sm" settle />
          </div>
          <p className="about-bio section-animate" data-delay="0.05">
            Computer Science student at the University of Oklahoma. I care about building
            software people can trust and use-from automation and compiler work to
            full-stack products and thoughtful interfaces. Recently completed an IT
            internship in Automation &amp; AI Development at ConocoPhillips.
          </p>
          <div className="section-animate" data-delay="0.08">
            <ResumeViewer />
          </div>
        </header>

        <section className="about-section section-animate" data-delay="0.12" id="about-education">
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
                Expected December 2026
              </p>
              <p>
                <span className="about-meta-label">GPA</span>
                3.76 / 4.00
              </p>
              <p className="about-honor">President&apos;s Honor Roll · Spring 2025</p>
            </div>
          </div>
        </section>

        <section className="about-section section-animate" data-delay="0.18" id="about-experience">
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

        <section className="about-section section-animate" data-delay="0.24" id="about-skills">
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
              <h4 className="about-skill-label">Technologies</h4>
              <p className="about-skill-line">{skills.technologies.join(' · ')}</p>
            </div>
            <div className="about-skill-group">
              <h4 className="about-skill-label">Platforms</h4>
              <p className="about-skill-line">{skills.platforms.join(' · ')}</p>
            </div>
            <div className="about-skill-group">
              <h4 className="about-skill-label">Concepts</h4>
              <p className="about-skill-line">{skills.focus.join(' · ')}</p>
            </div>
          </div>
        </section>

        {trackerVisible && (
          <section className="about-section section-animate" data-delay="0.3" id="about-tracker">
            <div className="about-section-head">
              <LeafAccent size="sm" />
              <h2 className="interior-section-title">Currently Watching</h2>
            </div>
            <p className="about-tracker-intro">
              A live list of shows, movies, manga, and books that I am tracking-updated
              from the site admin without redeploying.
            </p>
            <MediaTracker />
          </section>
        )}

        <p className="about-next section-animate" data-delay="0.36">
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
