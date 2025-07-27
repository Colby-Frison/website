import React from 'react';
import { Container } from '@mui/material';
import NumberGrid from '../NumberGrid/NumberGrid';
import './Home.css';

const Home = () => {
  const content = {
    title: "Hi, I'm Colby Frison",
    subtitle: "Computer Science Student & Software Developer",
    description: "I'm a Computer Science student at the University of Oklahoma, passionate about software development, AI, and creating impactful solutions. Currently serving as an Engineering Ambassador and exploring various aspects of technology."
  };

  return (
    <div className="home-page">
      <NumberGrid content={content} />
    </div>
  );
};

export default Home; 