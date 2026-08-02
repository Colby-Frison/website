import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageAtmosphere from '../../motif/PageAtmosphere';
import LeafAccent from '../../motif/LeafAccent';
import MediaTracker from '../../MediaTracker/MediaTracker';
import ResumeViewer from '../../ResumeViewer/ResumeViewer';
import { useSiteSettings } from '../../../hooks/useSiteSettings';
import './AboutMobile.css';

const AboutMobile = () => {
  const { trackerVisible } = useSiteSettings();

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
            software people can trust and use-from automation and compiler work to
            full-stack products and thoughtful interfaces. Recently completed an IT
            internship in Automation &amp; AI Development at ConocoPhillips.
          </p>
          <div className="section-animate" data-delay="0.08">
            <ResumeViewer />
          </div>
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
            <span>Graduation</span> Expected December 2026
          </p>
          <p className="about-mobile-meta">
            <span>GPA</span> 3.76 / 4.00
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
            <h4>Technologies</h4>
            <p>{skills.technologies.join(' · ')}</p>
          </div>
          <div className="about-mobile-skill">
            <h4>Platforms</h4>
            <p>{skills.platforms.join(' · ')}</p>
          </div>
          <div className="about-mobile-skill">
            <h4>Concepts</h4>
            <p>{skills.focus.join(' · ')}</p>
          </div>
        </section>

        {trackerVisible && (
          <section className="about-mobile-section section-animate" data-delay="0.3">
            <div className="about-mobile-section-head">
              <LeafAccent size="sm" />
              <h2 className="interior-section-title">Currently Watching</h2>
            </div>
            <p className="about-mobile-tracker-intro">
              A live list of shows, movies, manga, and books that I am tracking—updated
              from the site admin without redeploying.
            </p>
            <MediaTracker compact />
          </section>
        )}

        <p className="about-mobile-next section-animate" data-delay="0.36">
          <Link to="/projects">View projects</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/contact">Get in touch</Link>
        </p>
      </div>
    </div>
  );
};

export default AboutMobile;
