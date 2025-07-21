import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Chip, Box, Collapse, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Projects.css';

const Projects = () => {
  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const projects = [
    {
      id: 1,
      name: 'Classroom Q&A',
      shortDescription: 'A web application enabling students to anonymously ask questions during class, enhancing classroom engagement through real-time interaction.',
      fullDescription: `Started as a side project for practicing databases and websockets, this application evolved into a practical tool used in actual classroom settings. It removes barriers to student participation by allowing anonymous questions while providing professors with an efficient way to manage classroom interactions.`,
      type: 'Personal/Academic Project',
      technologies: ['TypeScript', 'React', 'Next.js', 'Firebase', 'Firestore', 'Node.js', 'Tailwind CSS'],
      links: [
        {
          type: 'github',
          url: 'https://github.com/Colby-Frison/Question-website',
          label: 'View Code'
        }
      ],
      features: [
        'Anonymous question submission system',
        'Real-time updates using websockets',
        'Professor dashboard for managing questions',
        'Student interface for asking and viewing questions',
        'Theme toggle support (light/dark modes)',
        'Responsive design for all devices'
      ],
      impact: [
        'Successfully implemented in actual classroom environment',
        'Improved student engagement by removing barriers to asking questions',
        'Enhanced learning experience through anonymous participation',
        'Collaborated with professor to integrate into classroom workflow'
      ],
      role: 'Solo Developer',
      contributions: [
        'Implemented Firebase/Firestore for real-time data synchronization',
        'Built with TypeScript for type safety and code reliability',
        'Used Next.js and React for optimal performance',
        'Integrated Tailwind CSS for responsive design',
        'Implemented caching and debouncing for performance optimization',
        'Created comprehensive security rules for Firebase'
      ],
      architecture: [
        'Real-time data synchronization with Firebase',
        'Type-safe codebase with TypeScript',
        'Optimized caching system for active questions',
        'Robust state management for session persistence',
        'Comprehensive error handling system'
      ]
    },
    {
      id: 2,
      name: 'FreshStart',
      shortDescription: 'A comprehensive web application that helps users plan, build, and maintain home gardens or small farms, featuring AI-powered recommendations and interactive design tools.',
      fullDescription: `FreshStart is designed to make growing fresh food accessible to everyone by providing an intuitive platform for garden and farm planning. The application combines modern technology with practical farming knowledge to help users create successful growing spaces.`,
      type: 'Hackathon Project',
      technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Machine Learning', 'LLM', 'JavaScript'],
      links: [
        {
          type: 'github',
          url: 'https://github.com/PravCoder/FarmStart',
          label: 'View Code'
        },
        {
          type: 'devpost',
          url: 'https://devpost.com/software/fresh-start-q5f92s#updates',
          label: 'View on Devpost'
        }
      ],
      achievements: ['2nd place at Hacklahoma 2024'],
      features: [
        'Farm Mapping Layout Tool with drag-and-drop functionality',
        'ML-powered crop yield prediction system',
        'Personalized task scheduling using LLM technology',
        'Equipment and resource recommendation engine',
        'Interactive farm creation and management dashboard'
      ],
      impact: [
        'Helps users efficiently plan and manage gardens/farms',
        'Reduces research time through AI-powered recommendations',
        'Makes agriculture more accessible to beginners'
      ],
      role: 'Front-end Lead Developer',
      contributions: [
        'Led front-end development efforts',
        'Implemented drag-and-drop farm layout system',
        'Integrated ML models for yield prediction',
        'Created intuitive user interface for farm planning'
      ]
    },
    {
      id: 3,
      name: 'SmartWrite',
      shortDescription: 'An innovative note-taking application that combines handwriting recognition with AI-assisted writing features to transform and enhance the learning experience.',
      fullDescription: `SmartWrite is a sophisticated note-taking platform that bridges the gap between traditional handwritten notes and digital organization. The application uses advanced AI technology to help students and professionals better manage and understand their notes.`,
      type: 'Academic Project',
      technologies: ['HTML5', 'JavaScript', 'CSS3', 'PDF.js', 'AI Integration', 'GitHub', 'CI/CD'],
      links: [
        {
          type: 'github',
          url: 'https://github.com/Colby-Frison/SmartWrite',
          label: 'View Code'
        }
      ],
      features: [
        'Advanced handwriting recognition system',
        'AI-powered note enhancement and summarization',
        'PDF document processing and organization',
        'Custom UI components for seamless interaction',
        'Theme system with dynamic switching',
        'Robust error recovery and fallback mechanisms'
      ],
      architecture: [
        'Event-driven system architecture',
        'Model-agnostic AI integration',
        'Layered component organization',
        'State persistence and recovery'
      ],
      impact: [
        'Enhanced note-taking efficiency and organization',
        'Improved accessibility of handwritten content',
        'Streamlined document management workflow'
      ],
      role: 'Team Member',
      contributions: [
        'Implemented core note-taking functionality',
        'Developed handwriting recognition integration',
        'Created document management system',
        'Contributed to UI/UX design'
      ]
    }
  ];

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

  return (
    <Container component="section" className="projects-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h2" className="section-title">
          My Projects
        </Typography>
        <Typography variant="body1" className="section-description">
          Here are some of my recent projects that showcase my skills and interests in software development.
        </Typography>

        <Grid container spacing={4} className="projects-grid">
          {projects.map((project) => (
            <Grid item xs={12} key={project.id}>
              <motion.div variants={itemVariants}>
                <Card className="project-card">
                  <CardContent>
                    <Typography variant="h5" className="project-title">
                      {project.name}
                    </Typography>
                    <Typography variant="subtitle2" className="project-type">
                      {project.type}
                    </Typography>
                    <Typography variant="body1" className="project-description">
                      {project.shortDescription}
                    </Typography>

                    <Box className="tech-stack">
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          className="tech-chip"
                          size="small"
                        />
                      ))}
                    </Box>

                    {project.achievements && (
                      <Box className="achievements">
                        {project.achievements.map((achievement) => (
                          <Chip
                            key={achievement}
                            label={achievement}
                            className="achievement-chip"
                          />
                        ))}
                      </Box>
                    )}

                    <Box className="project-actions">
                      {project.links.map((link) => (
                        <Button
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={link.type === 'github' ? <GitHubIcon /> : <LaunchIcon />}
                          className="project-link"
                        >
                          {link.label}
                        </Button>
                      ))}
                      <IconButton
                        className={`expand-button ${expandedId === project.id ? 'expanded' : ''}`}
                        onClick={() => handleExpandClick(project.id)}
                        aria-expanded={expandedId === project.id}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>

                    <Collapse in={expandedId === project.id} timeout="auto" unmountOnExit>
                      <Box className="expanded-content">
                        <Typography variant="body1" className="full-description">
                          {project.fullDescription}
                        </Typography>

                        <Typography variant="h6" className="section-subtitle">
                          Key Features
                        </Typography>
                        <ul className="feature-list">
                          {project.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>

                        <Typography variant="h6" className="section-subtitle">
                          Impact & Results
                        </Typography>
                        <ul className="impact-list">
                          {project.impact.map((impact, idx) => (
                            <li key={idx}>{impact}</li>
                          ))}
                        </ul>

                        <Typography variant="h6" className="section-subtitle">
                          My Role & Contributions
                        </Typography>
                        <Typography variant="subtitle1" className="role-title">
                          {project.role}
                        </Typography>
                        <ul className="contributions-list">
                          {project.contributions.map((contribution, idx) => (
                            <li key={idx}>{contribution}</li>
                          ))}
                        </ul>

                        {project.architecture && (
                          <>
                            <Typography variant="h6" className="section-subtitle">
                              Technical Architecture
                            </Typography>
                            <ul className="architecture-list">
                              {project.architecture.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Projects; 