import React, { useEffect, useRef } from 'react';

/**
 * PsychedelicSkull - A React component that renders a vibrant, psychedelic skull visualization
 * inspired by contemporary digital art aesthetics.
 */
const PsychedelicSkull = ({ 
  width = 800, 
  height = 800,
  colorScheme = "warm", // warm, cool, custom
  animationSpeed = 0.5,
  customColors = null,
  fluidIntensity = 0.8
}) => {
  const canvasRef = useRef(null);
  
  // Color schemes
  const colorSchemes = {
    warm: {
      background: ['#FF5E5B', '#FFC145', '#FF7F50', '#FF3377'],
      rays: ['#FFDD4A', '#37B6FF', '#FF5D9E', '#FF8D41'],
      skull: '#F8E9D6',
      skullHighlights: '#FF4500',
      fluid: ['#FF3366', '#FF66B2', '#FF5E5B', '#FF8D41'],
      smoke: '#F8E9D6'
    },
    cool: {
      background: ['#6236FF', '#44A7FF', '#8A56FF', '#56CBFF'],
      rays: ['#56CBFF', '#6236FF', '#C736FF', '#44A7FF'],
      skull: '#F2F2F2',
      skullHighlights: '#6236FF',
      fluid: ['#8A56FF', '#A44AFF', '#C736FF', '#44A7FF'],
      smoke: '#E6E6FA'
    }
  };
  
  // Select colors based on props
  const colors = customColors || colorSchemes[colorScheme];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Animation properties
    let time = 0;
    
    /**
     * Draw starburst background rays
     */
    const drawStarburst = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const rayCount = 16;
      
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        const rayColor = colors.rays[i % colors.rays.length];
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-width * 0.2, -height);
        ctx.lineTo(width * 0.2, -height);
        ctx.closePath();
        
        ctx.fillStyle = rayColor;
        ctx.fill();
        ctx.restore();
      }
    };
    
    /**
     * Draw base skull shape
     */
    const drawSkull = (t) => {
      const centerX = width / 2;
      const centerY = height / 2.2;
      const skullWidth = width * 0.4;
      const skullHeight = height * 0.45;
      
      // Base skull shape
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw skull outline
      ctx.beginPath();
      ctx.ellipse(0, 0, skullWidth/1.8, skullHeight/1.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = colors.skull;
      ctx.fill();
      
      // Draw skull spots/blotches
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (skullWidth/2.5);
        const spotX = Math.cos(angle) * distance;
        const spotY = Math.sin(angle) * distance;
        const spotSize = (Math.random() * skullWidth/6) + skullWidth/12;
        
        ctx.beginPath();
        ctx.ellipse(
          spotX, 
          spotY, 
          spotSize, 
          spotSize, 
          0, 0, Math.PI * 2
        );
        ctx.fillStyle = colors.skullHighlights;
        ctx.fill();
      }
      
      // Draw eye sockets
      ctx.beginPath();
      ctx.ellipse(-skullWidth/4.5, -skullHeight/8, skullWidth/7, skullHeight/9, 0, 0, Math.PI * 2);
      ctx.ellipse(skullWidth/4.5, -skullHeight/8, skullWidth/7, skullHeight/9, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Draw nose cavity
      ctx.beginPath();
      ctx.moveTo(-skullWidth/15, skullHeight/10);
      ctx.lineTo(skullWidth/15, skullHeight/10);
      ctx.lineTo(0, skullHeight/6);
      ctx.closePath();
      ctx.fill();
      
      // Draw teeth and mouth
      ctx.beginPath();
      ctx.ellipse(0, skullHeight/3.5, skullWidth/3, skullHeight/7, 0, 0, Math.PI);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Teeth
      const teethCount = 10;
      const teethWidth = (skullWidth/3) * 1.8 / teethCount;
      const teethStartX = -skullWidth/3 + teethWidth/2;
      
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < teethCount; i++) {
        ctx.beginPath();
        ctx.moveTo(teethStartX + i * teethWidth, skullHeight/3.5);
        ctx.lineTo(teethStartX + (i+0.5) * teethWidth, skullHeight/2.2);
        ctx.lineTo(teethStartX + (i+1) * teethWidth, skullHeight/3.5);
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    /**
     * Draw fluid tendrils flowing from the skull
     */
    const drawFluidTendrils = (t) => {
      const centerX = width / 2;
      const centerY = height / 2.2;
      const tendrilCount = 12;
      
      for (let i = 0; i < tendrilCount; i++) {
        const baseAngle = (i / tendrilCount) * Math.PI * 2;
        const angle = baseAngle + Math.sin(t + i) * 0.1;
        const length = height * (0.3 + Math.sin(t * 0.5 + i) * 0.1);
        const width = 30 + Math.sin(t + i * 0.3) * 15;
        const color = colors.fluid[i % colors.fluid.length];
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        // Create gradient for tendril
        const gradient = ctx.createLinearGradient(0, 0, 0, length);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        // Draw curved tendril
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        const cp1x = Math.sin(t + i) * width * 2;
        const cp1y = length * 0.3;
        const cp2x = Math.sin(t * 1.5 + i) * width * 3;
        const cp2y = length * 0.6;
        const endX = Math.sin(t * 0.5 + i * 3) * width * 4;
        const endY = length;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.lineWidth = width * fluidIntensity;
        ctx.strokeStyle = gradient;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        ctx.restore();
      }
    };
    
    /**
     * Draw smoke/vapor effects
     */
    const drawSmoke = (t) => {
      const centerX = width / 2;
      const centerY = height / 2.2;
      const smokeCount = 8;
      
      for (let i = 0; i < smokeCount; i++) {
        const angle = (i / smokeCount) * Math.PI * 2;
        const startX = centerX + Math.cos(angle) * width * 0.25;
        const startY = centerY + Math.sin(angle) * height * 0.25;
        
        ctx.save();
        ctx.translate(startX, startY);
        
        // Create gradient for smoke
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, height * 0.4);
        gradient.addColorStop(0, colors.smoke);
        gradient.addColorStop(1, 'transparent');
        
        // Draw smoke cloud
        for (let j = 0; j < 3; j++) {
          const smokeSize = 40 + Math.sin(t + i + j) * 10;
          const offsetX = Math.sin(t * 0.7 + i + j * 2) * width * 0.05;
          const offsetY = -height * 0.1 - j * height * 0.1 + Math.cos(t + i) * height * 0.05;
          
          ctx.beginPath();
          ctx.ellipse(
            offsetX, 
            offsetY, 
            smokeSize * (1 + Math.sin(t + i + j) * 0.3), 
            smokeSize, 
            0, 0, Math.PI * 2
          );
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.5;
          ctx.fill();
        }
        
        ctx.restore();
      }
    };
    
    /**
     * Main animation loop
     */
    const animate = () => {
      time += 0.01 * animationSpeed;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      ctx.fillStyle = colors.background[0];
      ctx.fillRect(0, 0, width, height);
      
      // Draw elements
      drawStarburst();
      drawSmoke(time);
      drawSkull(time);
      drawFluidTendrils(time);
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup animation on unmount
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, animationSpeed, colorScheme, customColors, fluidIntensity]);
  
  return (
    <div className="psychedelic-skull-container">
      <canvas 
        ref={canvasRef} 
        className="psychedelic-skull-canvas"
        style={{
          maxWidth: '100%',
          display: 'block',
          margin: '0 auto',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default PsychedelicSkull;