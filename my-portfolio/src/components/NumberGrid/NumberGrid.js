import React, { useEffect, useRef, useState } from 'react';
import './NumberGrid.css';

const generateNumbers = (width, height, cellSize) => {
  const numbers = [];
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      numbers.push({
        value: Math.floor(Math.random() * 10),
        x: x * cellSize,
        y: y * cellSize,
        offsetX: 0,
        offsetY: 0,
        phase: Math.random() * Math.PI * 2,
        currentScale: 1,
        isClicked: false
      });
    }
  }
  return numbers;
};

const NumberGrid = () => {
  const canvasRef = useRef(null);
  const numbersRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const currentMousePosRef = useRef({ x: 0, y: 0 });
  
  // Animation frame reference
  const animationFrameRef = useRef();
  
  // Grid configuration
  const CELL_SIZE = 40;
  const FONT_SIZE = 20;
  const HOVER_RADIUS = 120;
  const MAX_SCALE = 2;
  const HOVER_LERP_FACTOR = 0.15;
  const MOUSE_LERP_FACTOR = 0.2;
  const CLICKED_SCALE_BOOST = 1.2; // Additional scale for clicked numbers

  // Global mouse position and click tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX + window.scrollX - rect.left,
        y: e.clientY + window.scrollY - rect.top
      };
    };

    const handleGlobalClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX + window.scrollX - rect.left;
      const clickY = e.clientY + window.scrollY - rect.top;

      // Find and toggle clicked number
      numbersRef.current.forEach(number => {
        const centerX = number.x + CELL_SIZE / 2;
        const centerY = number.y + CELL_SIZE / 2;
        if (
          Math.abs(clickX - centerX) < CELL_SIZE / 2 &&
          Math.abs(clickY - centerY) < CELL_SIZE / 2
        ) {
          number.isClicked = !number.isClicked; // Toggle clicked state
        }
      });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('click', handleGlobalClick);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (numbersRef.current.length === 0) {
        numbersRef.current = generateNumbers(window.innerWidth, window.innerHeight, CELL_SIZE);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentMousePosRef.current.x += (mousePosRef.current.x - currentMousePosRef.current.x) * MOUSE_LERP_FACTOR;
      currentMousePosRef.current.y += (mousePosRef.current.y - currentMousePosRef.current.y) * MOUSE_LERP_FACTOR;
      
      numbersRef.current.forEach((number) => {
        const dx = currentMousePosRef.current.x - (number.x + CELL_SIZE / 2);
        const dy = currentMousePosRef.current.y - (number.y + CELL_SIZE / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate base scale from hover effect
        const hoverScale = distance < HOVER_RADIUS
          ? 1 + (MAX_SCALE - 1) * Math.pow(1 - distance / HOVER_RADIUS, 1.5)
          : 1;
        
        // Add clicked scale boost if number is clicked
        const targetScale = number.isClicked 
          ? hoverScale * CLICKED_SCALE_BOOST 
          : hoverScale;
        
        number.currentScale += (targetScale - number.currentScale) * HOVER_LERP_FACTOR;
        
        number.phase += 0.02;
        number.offsetX = Math.sin(number.phase) * 2;
        number.offsetY = Math.cos(number.phase) * 2;
        
        ctx.save();
        ctx.translate(
          number.x + CELL_SIZE / 2 + number.offsetX,
          number.y + CELL_SIZE / 2 + number.offsetY
        );
        ctx.scale(number.currentScale, number.currentScale);
        
        ctx.font = `${FONT_SIZE}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = number.isClicked ? '#ff0000' : '#666666';
        ctx.fillText(number.value.toString(), 0, 0);
        
        ctx.restore();
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="number-grid interactive"
    />
  );
};

export default NumberGrid; 