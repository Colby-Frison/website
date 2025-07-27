import React, { useEffect, useRef, useState } from 'react';
import './NumberGrid.css';

const generateNumbers = (width, height, cellSize, textZones) => {
  const numbers = [];
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const centerX = x * cellSize + cellSize / 2;
      const centerY = y * cellSize + cellSize / 2;
      
      const isInTextZone = textZones.some(zone => {
        if (zone.isHintBox) return false;
        return centerX >= zone.x &&
               centerX < zone.x + zone.width &&
               centerY >= zone.y &&
               centerY < zone.y + zone.height;
      });

      if (!isInTextZone) {
        numbers.push({
          value: Math.floor(Math.random() * 10),
          x: x * cellSize,
          y: y * cellSize,
          offsetX: 0,
          offsetY: 0,
          phase: Math.random() * Math.PI * 2,
          currentScale: 1,
          isClicked: false,
          colorTransition: 0,
          finalChar: null,
          isHintChar: false
        });
      }
    }
  }
  return numbers;
};

const NumberGrid = ({ content }) => {
  const canvasRef = useRef(null);
  const numbersRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const currentMousePosRef = useRef({ x: 0, y: 0 });
  const textZonesRef = useRef([]);
  const animationFrameRef = useRef();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const hintBoxRef = useRef({
    isActive: false,
    isRevealed: false,
    isHovered: false,
    isScrambling: false,
    scrambleStart: 0,
    initialScrambleDuration: 800,    // Initial scramble phase
    characterRevealDelay: 400,       // Delay between each character starting to reveal
    characterRevealDuration: 800,    // How long each character takes to reveal
    scrambleStartTime: 0,
    text: ['input', 'code'],
    numbers: [],
    revealedIndices: new Set(),
    revealStartTime: 0,
    characterStartTimes: new Map()    // Track when each character started revealing
  });

  const CELL_SIZE = 30;
  const FONT_SIZE = 17;
  const HOVER_RADIUS = 120;
  const MAX_SCALE = 2;
  const HOVER_LERP_FACTOR = 0.15;
  const MOUSE_LERP_FACTOR = 0.2;
  const CLICKED_SCALE_BOOST = 1.7;
  const SCRAMBLE_SCALE_BOOST = 1.4;
  const REVEALED_SCALE_BOOST = 1.2;
  const REVEALED_HOVER_SCALE = 1.1; // Reduced hover effect for revealed text
  const TEXT_MARGIN_LEFT = 90;
  const COLOR_TRANSITION_SPEED = 0.02;

  // Load fonts before rendering
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await document.fonts.load('48px Inter');
        await document.fonts.load('24px Inter');
        await document.fonts.load('16px Inter');
        setFontsLoaded(true);
      } catch (error) {
        console.error('Font loading error:', error);
        // Fallback to system fonts if loading fails
        setFontsLoaded(true);
      }
    };
    loadFonts();
  }, []);

  const generateHintBoxNumbers = (hintBox) => {
    if (!hintBox) {
      console.error('No hint box provided to generateHintBoxNumbers');
      return [];
    }

    const hintChars = [];
    const words = hintBoxRef.current.text;
    let currentY = hintBox.y;

    words.forEach((word, wordIndex) => {
      let currentX = hintBox.x;
      [...word].forEach((char, charIndex) => {
        const number = {
          value: Math.floor(Math.random() * 10),
          x: currentX,
          y: currentY,
          phase: Math.random() * Math.PI * 2,
          currentScale: 1,
          isHintChar: true,
          finalChar: char,
          colorTransition: 0,
          isClicked: false
        };
        hintChars.push(number);
        currentX += CELL_SIZE;
      });
      currentY += CELL_SIZE * 1.5;
    });

    return hintChars;
  };

  const calculateTextZones = () => {
    if (!canvasRef.current) return null;
    
    const zones = [];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let currentY = 120;

      // Helper function to ensure text measurements are valid
      const measureText = (text, fontSize, fontFamily = 'Inter') => {
        ctx.font = `${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText(text);
        // Ensure we have a valid width
        return metrics.width > 0 ? metrics : { width: fontSize * text.length * 0.6 };
      };

      // Title (2 rows high)
      const titleParts = content.title.split("Colby Frison");
      const beforeNameMetrics = measureText(titleParts[0], 48);
      const titleMetrics = measureText(content.title, 48);
      
      zones.push({
        text: content.title,
        x: TEXT_MARGIN_LEFT,
        y: currentY,
        width: titleMetrics.width,
        height: CELL_SIZE * 2,
        fontSize: '48px',
        font: 'Inter',
        specialRender: (ctx, x, y) => {
          ctx.font = '48px Inter';
          ctx.fillStyle = '#E8E8E8';
          ctx.fillText(titleParts[0], x, y);
          ctx.fillStyle = '#8b5cf6';
          ctx.fillText('Colby Frison', x + beforeNameMetrics.width, y);
        }
      });
      currentY += CELL_SIZE * 3;

      // Subtitle (1 row)
      const subtitleMetrics = measureText(content.subtitle, 24);
      zones.push({
        text: content.subtitle,
        x: TEXT_MARGIN_LEFT,
        y: currentY,
        width: subtitleMetrics.width,
        height: CELL_SIZE,
        fontSize: '24px',
        font: 'Inter',
        color: '#E8E8E8'
      });
      currentY += CELL_SIZE * 1.8;

      // Description with proper word wrapping
      const maxWidth = Math.min(canvas.width * 0.7, 900);
      const words = content.description.split(' ');
      let lines = [];
      let currentLine = words[0];

      // Ensure font is set correctly for word wrapping
      ctx.font = '16px Inter';

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = measureText(testLine, 16);
        
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine !== '') {
        lines.push(currentLine);
      }

      // Create zones for each line
      const lineHeight = CELL_SIZE * 1.1;
      lines.forEach((line, index) => {
        const lineMetrics = measureText(line, 16);
        zones.push({
          text: line,
          x: TEXT_MARGIN_LEFT,
          y: currentY + (index * lineHeight),
          width: lineMetrics.width,
          height: lineHeight,
          fontSize: '16px',
          font: 'Inter',
          color: '#E8E8E8'
        });
      });

      // Create hint box zone at a fixed position from the bottom
      const hintBoxWidth = CELL_SIZE * Math.max(...hintBoxRef.current.text.map(word => word.length));
      const hintBoxHeight = CELL_SIZE * (hintBoxRef.current.text.length * 1.5);
      
      const hintBox = {
        x: TEXT_MARGIN_LEFT,
        y: canvas.height - hintBoxHeight - CELL_SIZE * 2,
        width: hintBoxWidth,
        height: hintBoxHeight,
        boxWidth: hintBoxWidth,
        boxHeight: hintBoxHeight,
        isHintBox: true,
        checkHover: function(mouseX, mouseY) {
          return (
            mouseX >= this.x &&
            mouseX <= this.x + this.boxWidth &&
            mouseY >= this.y &&
            mouseY <= this.y + this.boxHeight
          );
        }
      };
      
      console.log('Created hint box zone:', hintBox);
      zones.push(hintBox);

      textZonesRef.current = zones;
      return zones;
  };

  // Initialization effect
  useEffect(() => {
    if (!canvasRef.current || !fontsLoaded) {
      console.log('Not ready for initialization', { hasCanvas: !!canvasRef.current, fontsLoaded });
      return;
    }

    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    console.log('Canvas dimensions:', { width: canvas.width, height: canvas.height });
    
    const zones = calculateTextZones();
    if (!zones) {
      console.error('Failed to calculate text zones');
      return;
    }

    const hintBox = zones.find(zone => zone.isHintBox);
    if (!hintBox) {
      console.error('Hint box zone not found in zones');
      return;
    }

    console.log('Found hint box zone:', hintBox);
    
    // Generate hint box numbers first
    const hintChars = generateHintBoxNumbers(hintBox);
    console.log(`Generated ${hintChars.length} hint characters`);
    hintBoxRef.current.numbers = hintChars;

    // Generate rest of the numbers, excluding hint box area
    const numbers = generateNumbers(canvas.width, canvas.height, CELL_SIZE, zones);
    numbersRef.current = numbers;

    console.log('Numbers generated:', { 
      total: numbers.length,
      hintChars: hintChars.length,
      zones: zones.length
    });
  }, [fontsLoaded]);

  // Start hint box animation after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      hintBoxRef.current.isActive = true;
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Global mouse position and click tracking
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX + window.scrollX - rect.left;
      const mouseY = e.clientY + window.scrollY - rect.top;
      
      mousePosRef.current = { x: mouseX, y: mouseY };

      // Check if mouse is over hint box
      const hintBox = textZonesRef.current[textZonesRef.current.length - 1];
      if (hintBox && hintBox.checkHover.call(hintBox, mouseX, mouseY)) {
        if (!hintBoxRef.current.isHovered && hintBoxRef.current.isActive && !hintBoxRef.current.isScrambling) {
          hintBoxRef.current.isHovered = true;
          hintBoxRef.current.isScrambling = true;
          hintBoxRef.current.scrambleStartTime = Date.now();
          hintBoxRef.current.revealStartTime = hintBoxRef.current.scrambleStartTime + hintBoxRef.current.initialScrambleDuration;
          hintBoxRef.current.revealedIndices.clear();
          hintBoxRef.current.characterStartTimes.clear();

          // Schedule the sequential reveal after initial scramble
          const totalChars = hintBoxRef.current.numbers.length;
          
          // Schedule each character reveal
          hintBoxRef.current.numbers.forEach((_, index) => {
            const charRevealStart = hintBoxRef.current.revealStartTime + (index * hintBoxRef.current.characterRevealDelay);
            hintBoxRef.current.characterStartTimes.set(index, charRevealStart);
            
            setTimeout(() => {
              hintBoxRef.current.revealedIndices.add(index);
            }, hintBoxRef.current.initialScrambleDuration + (index * hintBoxRef.current.characterRevealDelay) + hintBoxRef.current.characterRevealDuration);
          });

          // Set final reveal after all characters
          const totalDuration = hintBoxRef.current.initialScrambleDuration + 
                              (totalChars * hintBoxRef.current.characterRevealDelay) + 
                              hintBoxRef.current.characterRevealDuration;
          
          setTimeout(() => {
            hintBoxRef.current.isRevealed = true;
          }, totalDuration);
        }
      } else {
        hintBoxRef.current.isHovered = false;
      }
    };

    const handleGlobalClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX + window.scrollX - rect.left;
      const clickY = e.clientY + window.scrollY - rect.top;

      numbersRef.current.forEach(number => {
        const centerX = number.x + CELL_SIZE / 2;
        const centerY = number.y + CELL_SIZE / 2;
        if (
          Math.abs(clickX - centerX) < CELL_SIZE / 2 &&
          Math.abs(clickY - centerY) < CELL_SIZE / 2
        ) {
          number.isClicked = !number.isClicked;
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

  // Animation effect
  useEffect(() => {
    if (!canvasRef.current || !fontsLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentMousePosRef.current.x += (mousePosRef.current.x - currentMousePosRef.current.x) * MOUSE_LERP_FACTOR;
      currentMousePosRef.current.y += (mousePosRef.current.y - currentMousePosRef.current.y) * MOUSE_LERP_FACTOR;
      
      // Draw all numbers first
      numbersRef.current.forEach((number, globalIndex) => {
        const dx = currentMousePosRef.current.x - (number.x + CELL_SIZE / 2);
        const dy = currentMousePosRef.current.y - (number.y + CELL_SIZE / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const hoverScale = distance < HOVER_RADIUS
          ? 1 + (MAX_SCALE - 1) * Math.pow(1 - distance / HOVER_RADIUS, 1.5)
          : 1;

        // Calculate target scale considering all boost factors
        let targetScale;
        if (number.isHintChar) {
          if (hintBoxRef.current.isRevealed) {
            targetScale = Math.max(REVEALED_SCALE_BOOST, 1 + (REVEALED_HOVER_SCALE - 1) * (hoverScale - 1));
          } else if (hintBoxRef.current.isScrambling) {
            targetScale = Math.max(hoverScale, SCRAMBLE_SCALE_BOOST, number.isClicked ? CLICKED_SCALE_BOOST : 0);
          } else {
            targetScale = number.isClicked 
              ? Math.max(CLICKED_SCALE_BOOST, hoverScale)
              : hoverScale;
          }
        } else {
          targetScale = number.isClicked 
            ? Math.max(CLICKED_SCALE_BOOST, hoverScale)
            : hoverScale;
        }
        
        number.currentScale += (targetScale - number.currentScale) * HOVER_LERP_FACTOR;
        
        number.phase += 0.02;
        number.offsetX = Math.sin(number.phase) * 1.5;
        number.offsetY = Math.cos(number.phase) * 1.5;

        ctx.save();
        ctx.translate(
          number.x + CELL_SIZE / 2 + number.offsetX,
          number.y + CELL_SIZE / 2 + number.offsetY
        );
        ctx.scale(number.currentScale, number.currentScale);
        
        ctx.font = `${FONT_SIZE}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (number.isHintChar && hintBoxRef.current.isActive) {
          number.colorTransition = Math.min(1, number.colorTransition + COLOR_TRANSITION_SPEED);
          
          if (hintBoxRef.current.isRevealed) {
            ctx.fillStyle = '#8b5cf6';
            ctx.fillText(number.finalChar, 0, 0);
          } else {
            if (hintBoxRef.current.isScrambling) {
              ctx.fillStyle = '#8b5cf6';
              
              // Find this number's index in the hint characters
              const hintIndex = hintBoxRef.current.numbers.indexOf(number);
              const currentTime = Date.now();
              
              if (currentTime < hintBoxRef.current.revealStartTime) {
                // In initial scramble phase - all characters scramble
                const displayChar = Math.floor(Math.random() * 10).toString();
                ctx.fillText(displayChar, 0, 0);
              } else {
                const charStartTime = hintBoxRef.current.characterStartTimes.get(hintIndex);
                
                if (currentTime < charStartTime) {
                  // Still in scramble phase for this character
                  const displayChar = Math.floor(Math.random() * 10).toString();
                  ctx.fillText(displayChar, 0, 0);
                } else if (hintBoxRef.current.revealedIndices.has(hintIndex)) {
                  // This character is fully revealed
                  ctx.fillText(number.finalChar, 0, 0);
                } else {
                  // This character is in transition
                  const revealProgress = (currentTime - charStartTime) / hintBoxRef.current.characterRevealDuration;
                  const showLetter = Math.random() < revealProgress * 0.8;
                  const displayChar = showLetter ? number.finalChar : Math.floor(Math.random() * 10).toString();
                  ctx.fillText(displayChar, 0, 0);
                }
              }
            } else {
              const grayColor = { r: 102, g: 102, b: 102 };
              const purpleColor = { r: 139, g: 92, b: 246 };
              const r = Math.round(grayColor.r + (purpleColor.r - grayColor.r) * number.colorTransition);
              const g = Math.round(grayColor.g + (purpleColor.g - grayColor.g) * number.colorTransition);
              const b = Math.round(grayColor.b + (purpleColor.b - grayColor.b) * number.colorTransition);
              
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              ctx.fillText(number.value.toString(), 0, 0);
            }
          }
        } else {
          ctx.fillStyle = number.isClicked ? '#8b5cf6' : '#666666';
          ctx.fillText(number.value.toString(), 0, 0);
        }
        
        ctx.restore();
      });

      // Draw text zones
      textZonesRef.current.forEach(zone => {
        if (!zone.isHintBox) {
          ctx.save();
          ctx.font = `${zone.fontSize} ${zone.font}`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          
          if (zone.specialRender) {
            zone.specialRender(ctx, zone.x, zone.y + zone.height / 2);
          } else {
            ctx.fillStyle = zone.color || '#E8E8E8';
            ctx.fillText(zone.text, zone.x, zone.y + zone.height / 2);
          }
          
          ctx.restore();
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [fontsLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="number-grid interactive"
    />
  );
};

export default NumberGrid; 