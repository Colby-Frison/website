import React, { useEffect } from 'react';
import './About.css';

const About = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px 100px 0px'
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

    const sections = document.querySelectorAll('.section-animate');
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
    <div className="about-page">
      <div className="about-container">
        <h1 className="page-title">About Me</h1>
        
        <section className="top-section">
          <div className="left-column">
            <div className="bio-section">
              <p className="bio-text">
                I'm a Computer Science student at the University of Oklahoma, passionate about 
                software development, AI, and creating impactful solutions. Currently serving as 
                an Engineering Ambassador and exploring various aspects of technology.
              </p>
            </div>

            <div className="education-section section-animate" data-delay="0.3">
              <h2 className="section-title">Education</h2>
              <div className="education-card content-card">
                <h3 className="degree">Bachelor of Science in Computer Science</h3>
                <p className="university">University of Oklahoma, Gallogly College of Engineering</p>
                <div className="education-details">
                  <p className="graduation">Expected Graduation: May 2027</p>
                  <p className="gpa">GPA: 3.70/4.00</p>
                </div>
                <p className="achievement">President's Honor Roll (Spring 2025)</p>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="skills-section section-animate" data-delay="0.2">
              <h2 className="section-title">Technical Skills</h2>
              <div className="skills-content">
                <div className="skill-category">
                  <h4 className="category-title">Programming Languages</h4>
                  <div className="skills-list">
                    {skills.languages.map((skill) => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="skill-category">
                  <h4 className="category-title">Development Tools</h4>
                  <div className="skills-list">
                    {skills.devTools.map((tool) => (
                      <span key={tool} className="skill-tag">{tool}</span>
                    ))}
                  </div>
                </div>

                <div className="skill-category">
                  <h4 className="category-title">Focus Areas</h4>
                  <div className="skills-list">
                    {skills.focusAreas.map((area) => (
                      <span key={area} className="skill-tag">{area}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="experience-section section-animate" data-delay="0.4">
          <div className="section-header">
            <h2 className="section-title">Work Experience</h2>
            <div className="section-line"></div>
          </div>
          <div className="experience-timeline">
            {workExperience.map((job, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="job-card content-card">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <p className="period">{job.period}</p>
                  <ul className="job-responsibilities">
                    {job.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 