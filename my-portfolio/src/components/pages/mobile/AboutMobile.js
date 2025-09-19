import React, { useEffect } from 'react';
import './AboutMobile.css';

const AboutMobile = ({ deviceInfo }) => {
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

    const sections = document.querySelectorAll('.mobile-section-animate');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const skills = {
    languages: ['C/C++', 'Java', 'Python', 'HTML/CSS', 'JavaScript', 'TypeScript', 'Matlab'],
    devTools: ['Git', 'GitHub', 'VSCode', 'IntelliJ', 'Eclipse'],
    focusAreas: [
      'Software Development',
      'User Interface (UI)',
      'Full-Stack Development',
      'Game Development',
      'AI',
      'Machine Learning',
      'Graphic Design',
      'UI/UX',
      'Data Science',
      'Quality Assurance',
      'Project Management'
    ]
  };

  const workExperience = [
    {
      title: 'Engineering Ambassador',
      company: 'University of Oklahoma, Gallogly College of Engineering',
      period: 'March 2025 - August 2025',
      details: [
        'Recruit prospective students for the College of Engineering',
        'Lead campus tours of engineering facilities',
        'Sole Computer Science ambassador',
        'Research and analyze recruitment strategies'
      ]
    },
    {
      title: "Teacher's Assistant",
      company: 'Houston Museum of Natural Science',
      period: 'March 2020 - May 2024',
      details: [
        'Led summer camp classes independently',
        'Developed educational materials',
        'Fostered engaging learning environment',
        'Mentored junior staff and students'
      ]
    }
  ];

  return (
    <div className="about-mobile-page">
      <div className="about-mobile-container">
        <h1 className="mobile-page-title">About Me</h1>
        
        {/* Bio Section - Always first on mobile */}
        <section className="mobile-bio-section">
          <p className="mobile-bio-text">
            I'm a Computer Science student at the University of Oklahoma, passionate about 
            software development, AI, and creating impactful solutions. Currently serving as 
            an Engineering Ambassador and exploring various aspects of technology.
          </p>
        </section>

        {/* Education Section */}
        <section className="mobile-education-section mobile-section-animate" data-delay="0.2">
          <h2 className="mobile-section-title">Education</h2>
          <div className="mobile-education-card mobile-content-card">
            <h3 className="mobile-degree">Bachelor of Science in Computer Science</h3>
            <p className="mobile-university">University of Oklahoma, Gallogly College of Engineering</p>
            <div className="mobile-education-details">
              <p className="mobile-graduation">Expected Graduation: May 2027</p>
              <p className="mobile-gpa">GPA: 3.70/4.00</p>
            </div>
            <p className="mobile-achievement">President's Honor Roll (Spring 2025)</p>
          </div>
        </section>

        {/* Skills Section - Optimized for mobile scrolling */}
        <section className="mobile-skills-section mobile-section-animate" data-delay="0.3">
          <h2 className="mobile-section-title">Technical Skills</h2>
          
          <div className="mobile-skill-category">
            <h4 className="mobile-category-title">Programming Languages</h4>
            <div className="mobile-skills-list">
              {skills.languages.map((skill) => (
                <span key={skill} className="mobile-skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="mobile-skill-category">
            <h4 className="mobile-category-title">Development Tools</h4>
            <div className="mobile-skills-list">
              {skills.devTools.map((tool) => (
                <span key={tool} className="mobile-skill-tag">{tool}</span>
              ))}
            </div>
          </div>

          <div className="mobile-skill-category">
            <h4 className="mobile-category-title">Focus Areas</h4>
            <div className="mobile-skills-list">
              {skills.focusAreas.map((area) => (
                <span key={area} className="mobile-skill-tag">{area}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section - Mobile optimized timeline */}
        <section className="mobile-experience-section mobile-section-animate" data-delay="0.4">
          <h2 className="mobile-section-title">Work Experience</h2>
          <div className="mobile-experience-list">
            {workExperience.map((job, index) => (
              <div key={index} className="mobile-job-card mobile-content-card">
                <h3 className="mobile-job-title">{job.title}</h3>
                <p className="mobile-company">{job.company}</p>
                <p className="mobile-period">{job.period}</p>
                <ul className="mobile-job-responsibilities">
                  {job.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutMobile;
