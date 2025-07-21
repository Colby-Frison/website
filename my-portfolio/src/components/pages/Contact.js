import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Contact.css';

const Contact = () => {
  const [emailRevealed, setEmailRevealed] = useState(false);

  // Email parts encoded to prevent scraping
  const emailParts = {
    username: 'Colbyfrison100',
    domain: 'gmail.com'
  };

  const revealEmail = () => {
    setEmailRevealed(true);
  };

  const getEmailDisplay = () => {
    if (emailRevealed) {
      return `${emailParts.username}@${emailParts.domain}`;
    }
    return 'Click to reveal email';
  };

  const handleEmailClick = () => {
    if (emailRevealed) {
      window.location.href = `mailto:${emailParts.username}@${emailParts.domain}`;
    } else {
      revealEmail();
    }
  };

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

  const contactMethods = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      value: getEmailDisplay(),
      onClick: handleEmailClick,
      description: 'Feel free to reach out for opportunities or collaborations'
    },
    {
      icon: <GitHubIcon />,
      title: 'GitHub',
      value: 'github.com/Colby-Frison',
      link: 'https://github.com/Colby-Frison',
      description: 'Check out my projects and contributions'
    },
    {
      icon: <LinkedInIcon />,
      title: 'LinkedIn',
      value: 'Colby Frison',
      link: 'https://www.linkedin.com/in/colby-frison-892680327',
      description: 'Connect with me professionally'
    }
  ];

  return (
    <Container component="section" className="contact-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Typography variant="h2" className="section-title">
          Get in Touch
        </Typography>
        <Typography variant="body1" className="section-description">
          I'm always interested in hearing about new opportunities, collaborations, or just connecting with fellow developers.
        </Typography>

        <Grid container spacing={4} className="contact-grid">
          {contactMethods.map((method, index) => (
            <Grid item xs={12} md={4} key={method.title}>
              <motion.div variants={itemVariants}>
                <Paper className="contact-card">
                  <Box className="card-icon">
                    {method.icon}
                  </Box>
                  <Typography variant="h6" className="contact-title">
                    {method.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    className={`contact-value ${method.onClick ? 'clickable' : ''}`}
                    onClick={method.onClick}
                  >
                    {method.value}
                  </Typography>
                  <Typography variant="body2" className="contact-description">
                    {method.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={method.onClick}
                    href={method.link}
                    target={method.link ? "_blank" : undefined}
                    rel={method.link ? "noopener noreferrer" : undefined}
                    className={`contact-button ${method.onClick ? 'reveal-button' : ''}`}
                  >
                    {method.onClick ? (emailRevealed ? 'Send Email' : 'Reveal Email') : 'Connect'}
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div variants={itemVariants} className="contact-footer">
          <Typography variant="body1">
            Currently based in Norman, OK
          </Typography>
          <Typography variant="body2">
            Open to remote opportunities and collaborations
          </Typography>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Contact; 