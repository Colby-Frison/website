import React from 'react';
import { Typography, Container, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NumberGrid from '../NumberGrid/NumberGrid';
import './Home.css';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <>
      <NumberGrid />
      <Container 
        component="section" 
        className="home-container"
        sx={{
          position: 'relative',
          pointerEvents: 'none'  // Make container transparent to pointer events
        }}
      >
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ pointerEvents: 'auto' }} // Re-enable pointer events for actual content
        >
          <motion.div variants={itemVariants}>
            <Typography variant="h1" className="hero-title">
              Hi, I'm <span className="accent">Colby Frison</span>
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="h2" className="hero-subtitle">
              Computer Science Student & Software Developer
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="body1" className="hero-description">
              I'm a Computer Science student at the University of Oklahoma, passionate about software development,
              AI, and creating impactful solutions. Currently serving as an Engineering Ambassador and
              exploring various aspects of technology.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-buttons">
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              color="primary"
              className="cta-button"
            >
              View My Work
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              color="primary"
              className="secondary-button"
            >
              Get in Touch
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="skills-preview">
            <Typography variant="h6" className="skills-title">
              Technical Skills
            </Typography>
            <Box className="skills-grid">
              {['C++', 'Java', 'Python', 'HTML/CSS', 'JavaScript', 'React', 'Git'].map((skill) => (
                <div key={skill} className="skill-tag">
                  {skill}
                </div>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </>
  );
};

export default Home; 