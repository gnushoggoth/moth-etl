import React, { useRef, useEffect, useState } from 'react';

// Neural Network Visualization Component
const NeuralNetworkArt = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Generate neural network-inspired abstract patterns
  const generateNeuralNetwork = (ctx, width, height) => {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Color palette inspired by the image
    const colors = [
      'rgba(255, 255, 255, 0.1)', 
      'rgba(200, 200, 255, 0.05)', 
      'rgba(100, 100, 255, 0.02)'
    ];

    // Create layers of interconnected nodes
    const drawLayer = (centerX, centerY, radius, depth) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[depth % colors.length];
      ctx.lineWidth = 0.5 + depth * 0.2;

      // Generate node connections with varying complexity
      for (let i = 0; i < 100; i++) {
        // Random angle and distance
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        const dist1 = Math.random() * radius;
        const dist2 = Math.random() * radius;

        const x1 = centerX + Math.cos(angle1) * dist1;
        const y1 = centerY + Math.sin(angle1) * dist1;
        const x2 = centerX + Math.cos(angle2) * dist2;
        const y2 = centerY + Math.sin(angle2) * dist2;

        // Create fractured, inkblot-like connections
        ctx.moveTo(x1, y1);
        
        // Add controlled randomness to create organic shapes
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * radius * 0.5;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * radius * 0.5;
        
        ctx.quadraticCurveTo(midX, midY, x2, y2);
      }
      
      ctx.stroke();
    };

    // Multiple layers of neural network
    const layerCount = 5;
    for (let i = 0; i < layerCount; i++) {
      const scaleFactor = 1 - (i / layerCount);
      drawLayer(
        width / 2, 
        height / 2, 
        Math.min(width, height) * 0.4 * scaleFactor, 
        i
      );
    }
  };

  // Resize and redraw handler
  const handleResize = () => {
    const canvas = canvasRef.current;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    setDimensions({ width: newWidth, height: newHeight });
    
    const ctx = canvas.getContext('2d');
    generateNeuralNetwork(ctx, newWidth, newHeight);
  };

  // Initial render and resize listener
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initial dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Generate initial network
    generateNeuralNetwork(ctx, canvas.width, canvas.height);
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        backgroundColor: 'black'
      }}
    />
  );
};

export default NeuralNetworkArt;
