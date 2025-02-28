import React, { useRef, useEffect } from 'react';

const PsychedelicOctopus = ({ 
  width = 800, 
  height = 800 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Color palette inspired by the image
    const colors = {
      background: ['#000000', '#1A1A1A'],
      octopus: ['#F0F0F0', '#E0E0E0', '#D0D0D0'],
      tentacles: ['#FF4D4D', '#FF6B6B', '#FF8787'],
      flowers: ['#FF4D4D', '#FF6B6B', '#FFA0A0'],
      leaves: ['#2C5F2D', '#3D8B37', '#4CAF50']
    };

    // Draw radial rays with gradient
    const drawRadialRays = () => {
      ctx.save();
      // Number of rays
      const rayCount = 16;

      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2;
        
        // Start from center
        const startX = width / 2;
        const startY = height / 2;
        
        // Calculate end point
        const endX = startX + Math.cos(angle) * Math.max(width, height);
        const endY = startY + Math.sin(angle) * Math.max(width, height);
        
        // Create gradient for each ray
        const rayGradient = ctx.createLinearGradient(startX, startY, endX, endY);
        
        // Gradient stops with warm, translucent colors
        rayGradient.addColorStop(0, 'rgba(255, 77, 77, 0.1)');     // Soft red
        rayGradient.addColorStop(0.5, 'rgba(255, 107, 107, 0.05)'); // Lighter red
        rayGradient.addColorStop(1, 'rgba(255, 135, 135, 0)');     // Fading red
        
        // Apply gradient and draw ray
        ctx.strokeStyle = rayGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    // Create background gradient
    const createBackground = () => {
      const backgroundGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height)
      );
      backgroundGradient.addColorStop(0, colors.background[0]);
      backgroundGradient.addColorStop(1, colors.background[1]);
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, width, height);
    };

    // Draw full scene
    const drawScene = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create dark background
      createBackground();
      
      // Draw radial rays
      drawRadialRays();
    };

    // Initial draw
    drawScene();
  }, [width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      style={{
        border: '1px solid #333',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default PsychedelicOctopus;
