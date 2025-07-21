import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import './About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const skills = {
    languages: ['C++', 'Java', 'Python', 'HTML/CSS', 'JavaScript', 'TypeScript', 'Matlab'],
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
      period: 'March 2024 - Present',
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
    <Container component="section" className="about-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h2" className="section-title">
          About Me
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Paper className="about-card">
                <SchoolIcon className="section-icon" />
                <Typography variant="h5" className="card-title">
                  Education
                </Typography>
                <Box className="education-details">
                  <Typography variant="h6">
                    Bachelor of Science in Computer Science
                  </Typography>
                  <Typography variant="subtitle1">
                    University of Oklahoma, Gallogly College of Engineering
                  </Typography>
                  <Typography variant="subtitle2">
                    Expected Graduation: May 2027
                  </Typography>
                  <Typography variant="body2">
                    GPA: 3.60/4.00
                  </Typography>
                  <Typography variant="body2" className="achievement">
                    President's Honor Roll (Spring 2025)
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Paper className="about-card">
                <CodeIcon className="section-icon" />
                <Typography variant="h5" className="card-title">
                  Technical Skills
                </Typography>
                <Box className="skills-section">
                  <Typography variant="subtitle2">Programming Languages</Typography>
                  <Box className="skills-chips">
                    {skills.languages.map((skill) => (
                      <span key={skill} className="skill-chip">{skill}</span>
                    ))}
                  </Box>

                  <Typography variant="subtitle2">Development Tools</Typography>
                  <Box className="skills-chips">
                    {skills.devTools.map((tool) => (
                      <span key={tool} className="skill-chip">{tool}</span>
                    ))}
                  </Box>

                  <Typography variant="subtitle2">Focus Areas</Typography>
                  <Box className="skills-chips">
                    {skills.focusAreas.map((area) => (
                      <span key={area} className="skill-chip">{area}</span>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Paper className="about-card">
                <WorkIcon className="section-icon" />
                <Typography variant="h5" className="card-title">
                  Work Experience
                </Typography>
                <Box className="experience-section">
                  {workExperience.map((job, index) => (
                    <Box key={index} className="job-item">
                      <Typography variant="h6" className="job-title">
                        {job.title}
                      </Typography>
                      <Typography variant="subtitle1" className="company-name">
                        {job.company}
                      </Typography>
                      <Typography variant="subtitle2" className="job-period">
                        {job.period}
                      </Typography>
                      <ul className="job-details">
                        {job.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default About; 