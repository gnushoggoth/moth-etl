/**
 * CCRU Data Visualization Module
 * A specialized extension for the Bluesky CCRU Data Scraper that implements
 * visualization approaches informed by Superflat aesthetics and viral research methodologies.
 */

class CCRUVisualizationModule {
  constructor(scraperInstance) {
    this.scraper = scraperInstance;
    this.visualModes = {
      SUPERFLAT: 'superflat',     // Flattened hierarchical visualization 
      VIRAL: 'viral',             // Epidemic-inspired network visualization
      HYBRID: 'hybrid'            // Combined approach
    };
    this.currentMode = this.visualModes.HYBRID;
    
    // Color schemes inspired by both superflat aesthetics and medical imaging
    this.colorSchemes = {
      superflat: {
        background: '#FFF0F5',    // Light pink background (Murakami-inspired)
        nodes: ['#FF99CC', '#6699FF', '#FFCC33', '#66CCCC', '#FF6666'],
        edges: '#333333',
        text: '#000000',
        highlight: '#FF0066'      // Bright pink highlight (Superflat signature)
      },
      viral: {
        background: '#000000',    // Dark background (like medical imaging)
        nodes: ['#FF3333', '#33FF33', '#3333FF', '#FFFF33', '#FF33FF'],
        edges: '#AAAAAA',
        text: '#FFFFFF',
        highlight: '#FF0000'      // Red highlight (medical emergency)
      },
      hybrid: {
        background: '#111122',    // Dark blue-black (digital space)
        nodes: ['#FF3366', '#33CCFF', '#FFCC00', '#66FF99', '#CC33FF'],
        edges: '#CCCCCC',
        text: '#FFFFFF',
        highlight: '#00FFFF'      // Cyan highlight (digital/biological fusion)
      }
    };
    
    // Initialize canvas and context references
    this.canvas = null;
    this.ctx = null;
    
    // Animation parameters
    this.animationActive = false;
    this.animationFrame = null;
    this.viralPulseRate = 0.5;    // Pulse rate for viral mode (Hz)
    this.flatteningRate = 0.2;    // Rate of "flattening" effect in superflat mode
  }
  
  /**
   * Initialize the visualization with a canvas element
   * @param {HTMLCanvasElement} canvasElement - The canvas to render to
   */
  initialize(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    // Set up event listeners for interaction
    this.setupInteraction();
    
    // Initial render
    this.render();
  }
  
  /**
   * Set up mouse/touch interaction with the visualization
   */
  setupInteraction() {
    if (!this.canvas) return;
    
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Toggle between visualization modes on click
      this.cycleVisualizationMode();
      this.render();
    });
    
    // Add mode label
    const modeLabel = document.createElement('div');
    modeLabel.id = 'mode-label';
    modeLabel.style.position = 'absolute';
    modeLabel.style.top = '10px';
    modeLabel.style.left = '10px';
    modeLabel.style.color = 'white';
    modeLabel.style.fontFamily = 'monospace';
    modeLabel.style.padding = '5px';
    modeLabel.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modeLabel.style.borderRadius = '3px';
    
    this.canvas.parentNode.appendChild(modeLabel);
    this.modeLabel = modeLabel;
    this.updateModeLabel();
  }
  
  /**
   * Update the visualization mode label
   */
  updateModeLabel() {
    if (this.modeLabel) {
      this.modeLabel.textContent = `Mode: ${this.currentMode.toUpperCase()}`;
    }
  }
  
  /**
   * Cycle through available visualization modes
   */
  cycleVisualizationMode() {
    const modes = Object.values(this.visualModes);
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.currentMode = modes[nextIndex];
    this.updateModeLabel();
  }
  
  /**
   * Start the animation loop
   */
  startAnimation() {
    if (this.animationActive) return;
    
    this.animationActive = true;
    
    const animate = () => {
      this.render();
      if (this.animationActive) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  /**
   * Stop the animation loop
   */
  stopAnimation() {
    this.animationActive = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  /**
   * Toggle animation state
   */
  toggleAnimation() {
    if (this.animationActive) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }
  
  /**
   * Main rendering function - delegates to specific mode renderers
   */
  render() {
    if (!this.canvas || !this.ctx) return;
    
    // Get current color scheme
    const colors = this.colorSchemes[this.currentMode];
    
    // Clear canvas with background color
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Prepare data for visualization
    const data = this.prepareVisualizationData();
    
    // Render based on current mode
    switch(this.currentMode) {
      case this.visualModes.SUPERFLAT:
        this.renderSuperflat(data, colors);
        break;
      case this.visualModes.VIRAL:
        this.renderViral(data, colors);
        break;
      case this.visualModes.HYBRID:
        this.renderHybrid(data, colors);
        break;
    }
    
    // Render common elements
    this.renderCommonElements(colors);
  }
  
  /**
   * Prepare data from the scraper for visualization
   * @returns {Object} Processed data ready for visualization
   */
  prepareVisualizationData() {
    // Check if we have valid data from the scraper
    if (!this.scraper || !this.scraper.collectedData) {
      return this.generatePlaceholderData();
    }
    
    // Process real data from the scraper
    const { posts, users, hashtags, mentions } = this.scraper.collectedData;
    
    // Extract top hashtags
    const topHashtags = Array.from(hashtags instanceof Map ? hashtags.entries() : Object.entries(hashtags))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    // Extract top users
    const topUsers = Array.from(users instanceof Map ? users.values() : users)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 20);
    
    // Create nodes and connections
    const nodes = [];
    const connections = [];
    
    // Add hashtag nodes
    topHashtags.forEach(([tag, count], index) => {
      nodes.push({
        id: `hashtag-${tag}`,
        type: 'hashtag',
        label: `#${tag}`,
        value: count,
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        color: index % 5  // Map to color index
      });
    });
    
    // Add user nodes
    topUsers.forEach((user, index) => {
      nodes.push({
        id: `user-${user.handle || user.did}`,
        type: 'user',
        label: user.handle || user.did,
        value: user.postCount,
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        color: index % 5  // Map to color index
      });
    });
    
    // Create connections between related entities
    // This is a simplified approach - a real implementation would analyze the data
    // to determine actual relationships
    
    // Return the prepared visualization data
    return {
      nodes,
      connections,
      hashtags: topHashtags,
      users: topUsers,
      totalPosts: posts instanceof Array ? posts.length : 0
    };
  }
  
  /**
   * Generate placeholder data when no real data is available
   * @returns {Object} Placeholder visualization data
   */
  generatePlaceholderData() {
    const nodes = [];
    const connections = [];
    
    // Create sample nodes
    const sampleHashtags = [
      ['ccru', 75], ['hyperstition', 64], ['accelerationism', 48],
      ['numogram', 42], ['cybernetics', 39], ['lemurian', 27],
      ['timewar', 25], ['philo', 22], ['k0de', 19], ['theory', 18]
    ];
    
    const sampleUsers = [
      {handle: 'hyperstitional', postCount: 42},
      {handle: 'ccru_archive', postCount: 38},
      {handle: 'accelerate', postCount: 35},
      {handle: 'k0smik', postCount: 29},
      {handle: 'num0gram', postCount: 26},
      {handle: 'lemurian', postCount: 23},
      {handle: 'cyberpositive', postCount: 21},
      {handle: 'hypercamouflage', postCount: 19}
    ];
    
    // Add hashtag nodes
    sampleHashtags.forEach(([tag, count], index) => {
      nodes.push({
        id: `hashtag-${tag}`,
        type: 'hashtag',
        label: `#${tag}`,
        value: count,
        x: Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1,
        y: Math.random() * this.canvas.height * 0.8 + this.canvas.height * 0.1,
        color: index % 5
      });
    });
    
    // Add user nodes
    sampleUsers.forEach((user, index) => {
      nodes.push({
        id: `user-${user.handle}`,
        type: 'user',
        label: user.handle,
        value: user.postCount,
        x: Math.random() * this.canvas.width * 0.8 + this.canvas.width * 0.1,
        y: Math.random() * this.canvas.height * 0.8 + this.canvas.height * 0.1,
        color: index % 5
      });
    });
    
    // Create some sample connections
    for (let i = 0; i < 15; i++) {
      const sourceIndex = Math.floor(Math.random() * nodes.length);
      let targetIndex = Math.floor(Math.random() * nodes.length);
      
      // Ensure we don't connect a node to itself
      while (targetIndex === sourceIndex) {
        targetIndex = Math.floor(Math.random() * nodes.length);
      }
      
      connections.push({
        source: nodes[sourceIndex].id,
        target: nodes[targetIndex].id,
        strength: Math.random() * 0.8 + 0.2
      });
    }
    
    return {
      nodes,
      connections,
      hashtags: sampleHashtags,
      users: sampleUsers,
      totalPosts: 215 // Placeholder post count
    };
  }
  
  /**
   * Render visualization using Superflat aesthetics
   * @param {Object} data - Prepared visualization data
   * @param {Object} colors - Color scheme to use
   */
  renderSuperflat(data, colors) {
    if (!this.canvas || !this.ctx) return;
    
    const ctx = this.ctx;
    const { nodes, connections } = data;
    const now = Date.now() / 1000; // Current time in seconds
    
    // Draw connections first (underneath nodes)
    ctx.lineWidth = 2;
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (sourceNode && targetNode) {
        // Create a connection style that has both right angles (superflat) 
        // and organic elements (viral research)
        
        // Decide connection path type based on nodes
        const isOrganicConnection = (sourceNode.type !== targetNode.type);
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        
        if (isOrganicConnection) {
          // Organic, viral-like connection for nodes of different types
          // This represents cross-domain idea transmission
          const controlPointX = (sourceNode.x + targetNode.x) / 2 + (Math.random() - 0.5) * 40;
          const controlPointY = (sourceNode.y + targetNode.y) / 2 + (Math.random() - 0.5) * 40;
          
          ctx.bezierCurveTo(
            controlPointX, sourceNode.y,
            controlPointX, targetNode.y,
            targetNode.x, targetNode.y
          );
          
          // Pulsing effect from viral visualization
          const pulsePhase = (now * this.viralPulseRate) % 1;
          const pulseOpacity = 0.4 + 0.4 * Math.sin(pulsePhase * Math.PI * 2);
          
          ctx.strokeStyle = `${colors.highlight}${Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0')}`;
        } else {
          // Angular, superflat-like connection for nodes of same type
          // This represents structured, categorical relationships
          const midX = (sourceNode.x + targetNode.x) / 2;
          
          // Add a small randomized offset to avoid perfect grid-like appearance
          const offsetY = (Math.random() - 0.5) * 20;
          
          ctx.lineTo(midX, sourceNode.y);
          ctx.lineTo(midX, targetNode.y + offsetY);
          ctx.lineTo(targetNode.x, targetNode.y);
          
          ctx.strokeStyle = `${colors.edges}AA`; // Consistent opacity for structured connections
        }
        
        ctx.stroke();
        
        // Add data transmission particles along organic connections
        if (isOrganicConnection && Math.random() > 0.5) {
          const particleCount = 1 + Math.floor(Math.random() * 3);
          
          for (let i = 0; i < particleCount; i++) {
            const particlePosition = ((now * 0.2) + (i * 0.3)) % 1;
            
            // Calculate position along the curve
            const t = particlePosition;
            const cx = (sourceNode.x + targetNode.x) / 2;
            const cy = (sourceNode.y + targetNode.y) / 2;
            
            // Simple approximation of a point on the curve
            const particleX = (1-t)*(1-t)*sourceNode.x + 2*(1-t)*t*cx + t*t*targetNode.x;
            const particleY = (1-t)*(1-t)*sourceNode.y + 2*(1-t)*t*cy + t*t*targetNode.y;
            
            // Draw the particle
            ctx.fillStyle = colors.highlight;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });
    
    // Draw nodes with hybrid aesthetics
    nodes.forEach(node => {
      const baseSize = Math.sqrt(node.value) * 2.5 + 12;
      const nodeColor = colors.nodes[node.color];
      
      // Determine if node should have viral or flat aesthetics based on type
      if (node.type === 'hashtag') {
        // Hashtags are viral-inspired but with superflat coloring
        
        // For hashtags, create a viral-like shape with geometric precision
        const pulseAmt = 1 + 0.1 * Math.sin(now * this.viralPulseRate * Math.PI * 2 + node.x * 0.01);
        const size = baseSize * pulseAmt;
        
        // Draw main viral body
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw superflat-style border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add perfectly geometrical "spike proteins" (viral + superflat hybrid)
        const spikes = 6; // Perfect hexagon arrangement for superflat precision
        const spikeLength = size * 0.25;
        
        for (let i = 0; i < spikes; i++) {
          const angle = (i / spikes) * Math.PI * 2;
          const innerRadius = size/2;
          const outerRadius = size/2 + spikeLength;
          
          ctx.beginPath();
          ctx.moveTo(
            node.x + innerRadius * Math.cos(angle),
            node.y + innerRadius * Math.sin(angle)
          );
          ctx.lineTo(
            node.x + outerRadius * Math.cos(angle),
            node.y + outerRadius * Math.sin(angle)
          );
          
          // Spike styling - bold, geometric strokes
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Add viral-inspired glow to the spikes
          ctx.shadowColor = nodeColor;
          ctx.shadowBlur = 5;
          ctx.strokeStyle = colors.highlight;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset shadow
        }
      } else {
        // Users have more superflat aesthetics but with viral internal structures
        
        // Square base with perfect geometry (superflat)
        const size = baseSize;
        
        ctx.fillStyle = nodeColor;
        ctx.fillRect(node.x - size/2, node.y - size/2, size, size);
        
        // Add superflat border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(node.x - size/2, node.y - size/2, size, size);
        
        // Add circular "cell nucleus" inside (viral influence)
        ctx.fillStyle = colors.background;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add "cellular organelles" (viral influence inside superflat container)
        const organelleCount = 3;
        ctx.fillStyle = colors.highlight;
        
        for (let i = 0; i < organelleCount; i++) {
          const angle = (i / organelleCount) * Math.PI * 2;
          const radius = size/6;
          const distance = size/3;
          
          ctx.beginPath();
          ctx.arc(
            node.x + distance * Math.cos(angle),
            node.y + distance * Math.sin(angle),
            radius, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // Add stylized label
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw text with both elements: superflat drop shadow and viral glow
      // Shadow first (superflat)
      ctx.fillStyle = '#000000';
      ctx.fillText(node.label, node.x + 2, node.y + baseSize/2 + 16);
      
      // Then glow (viral)
      ctx.shadowColor = colors.highlight;
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.label, node.x, node.y + baseSize/2 + 14);
      ctx.shadowBlur = 0; // Reset shadow
    });
    
    // Add hybrid-specific overlay elements
    this.drawHybridOverlayElements(colors);
  }
  
  /**
   * Draw special overlay elements for the hybrid visualization
   * @param {Object} colors - Color scheme to use
   */
  drawHybridOverlayElements(colors) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const now = Date.now() / 1000;
    
    // Add a subtle scanning line effect (medical imaging influence)
    const scanLinePos = (now * 0.2) % 1;
    const scanY = height * scanLinePos;
    
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = colors.highlight;
    ctx.fillRect(0, scanY - 1, width, 2);
    ctx.globalAlpha = 1.0;
    
    // Add "binary code" elements at the borders (digital representation of viral spread)
    ctx.font = '14px monospace';
    ctx.fillStyle = `${colors.edges}66`;
    
    // Vertical code strips
    const codeSymbols = "01".split("");
    
    // Left side code
    for (let y = 0; y < height; y += 20) {
      const symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
      ctx.fillText(symbol, 10, y);
    }
    
    // Right side code
    for (let y = 0; y < height; y += 20) {
      const symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
      ctx.fillText(symbol, width - 20, y);
    }
    
    // Add hybrid signature elements that combine both aesthetics
    // These are square frames (superflat) with pulsing elements (viral)
    
    // Draw corner elements
    const cornerSize = 40;
    const pulseAmt = 0.7 + 0.3 * Math.sin(now * this.viralPulseRate * Math.PI * 2);
    
    ctx.lineWidth = 2 * pulseAmt;
    ctx.strokeStyle = colors.highlight;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width - cornerSize, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, cornerSize);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(0, height - cornerSize);
    ctx.lineTo(0, height);
    ctx.lineTo(cornerSize, height);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - cornerSize, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, height - cornerSize);
    ctx.stroke();
  }
  
  /**
   * Render common elements across all visualization modes
   * @param {Object} colors - Color scheme to use
   */
  renderCommonElements(colors) {
    if (!this.canvas || !this.ctx) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Add title at the top
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = colors.text;
    ctx.fillText("CCRU DATA SCRAPER VISUALIZATION", width/2, 20);
    
    // Add subtitle explaining the visualization paradigm
    ctx.font = '14px monospace';
    
    let subtitle = "";
    switch(this.currentMode) {
      case this.visualModes.SUPERFLAT:
        subtitle = "SUPERFLAT AESTHETICS MODE";
        break;
      case this.visualModes.VIRAL:
        subtitle = "VIRAL RESEARCH VISUALIZATION MODE";
        break;
      case this.visualModes.HYBRID:
        subtitle = "HYBRID SUPERFLAT/VIRAL PARADIGM";
        break;
    }
    
    ctx.fillText(subtitle, width/2, 45);
    
    // Add interaction instructions
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText("CLICK TO CHANGE VISUALIZATION MODE", 20, height - 30);
    
    // Add a subtle border around the entire visualization
    ctx.strokeStyle = colors.edges;
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, width - 4, height - 4);
  }
  
  /**
   * Helper method to get a node at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Object|null} - Found node or null
   */
  getNodeAtPosition(x, y, data) {
    if (!data || !data.nodes) return null;
    
    // Check each node to see if position is inside it
    for (const node of data.nodes) {
      const size = Math.sqrt(node.value) * 3 + 10;
      const halfSize = size / 2;
      
      // Simple circular hit testing
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance <= halfSize) {
        return node;
      }
    }
    
    return null;
  }
  
  /**
   * Initialize a demonstration of the visualization with placeholder data
   * @param {string} containerId - ID of the container element to create the canvas in
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  static initDemo(containerId, width = 800, height = 600) {
    // Get or create container
    let container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID '${containerId}' not found.`);
      return;
    }
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '1px solid #333';
    canvas.style.borderRadius = '4px';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    container.appendChild(canvas);
    
    // Create visualization module (with null scraper - will use placeholder data)
    const visualizer = new CCRUVisualizationModule(null);
    visualizer.initialize(canvas);
    
    // Start animation
    visualizer.startAnimation();
    
    // Add mode switcher buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '10px';
    
    const modes = Object.values(visualizer.visualModes);
    modes.forEach(mode => {
      const button = document.createElement('button');
      button.textContent = mode.toUpperCase();
      button.style.margin = '0 5px';
      button.style.padding = '5px 10px';
      button.style.backgroundColor = '#333';
      button.style.color = '#fff';
      button.style.border = 'none';
      button.style.borderRadius = '3px';
      button.style.cursor = 'pointer';
      
      button.addEventListener('click', () => {
        visualizer.currentMode = mode;
        visualizer.updateModeLabel();
      });
      
      buttonContainer.appendChild(button);
    });
    
    container.appendChild(buttonContainer);
    
    return visualizer;
  }
}

// Export the class for use in browser or Node.js environments
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { CCRUVisualizationModule };
} else {
  window.CCRUVisualizationModule = CCRUVisualizationModule;
}
id === conn.target);
      
      if (sourceNode && targetNode) {
        // Apply "flattening" effect - connections are sharp-edged lines in superflat mode
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        
        // Superflat connections are never curved - they use right angles
        // This creates a distinctive "flat" circuit-like appearance
        const midX = (sourceNode.x + targetNode.x) / 2;
        ctx.lineTo(midX, sourceNode.y);
        ctx.lineTo(midX, targetNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Line color has reduced opacity to create layering effect
        ctx.strokeStyle = `${colors.edges}99`; // Hex + 99 for ~60% opacity
        ctx.stroke();
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const size = Math.sqrt(node.value) * 3 + 10;
      const nodeColor = colors.nodes[node.color];
      
      // Superflat aesthetic: perfectly flat shapes with hard edges
      // For hashtags, use rectangles
      if (node.type === 'hashtag') {
        ctx.fillStyle = nodeColor;
        ctx.fillRect(node.x - size/2, node.y - size/2, size, size);
        
        // Add a distinctive border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(node.x - size/2, node.y - size/2, size, size);
      } 
      // For users, use circles
      else {
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a distinctive border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Add label with drop shadow for pop effect (characteristic of superflat)
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw shadow
      ctx.fillStyle = '#000000';
      ctx.fillText(node.label, node.x + 2, node.y + size/2 + 12 + 2);
      
      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.label, node.x, node.y + size/2 + 12);
    });
    
    // Add superflat-specific decorative elements
    // These are characteristic of Murakami-style superflat art
    
    // Draw some "emoji-like" elements (common in superflat aesthetics)
    const emojis = ['♥', '★', '◉', '◎', '✧'];
    ctx.font = '24px sans-serif';
    ctx.fillStyle = colors.highlight;
    
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      ctx.fillText(emoji, x, y);
    }
    
    // Add a grid backdrop (common in superflat to emphasize flatness)
    ctx.strokeStyle = `${colors.edges}33`; // Very transparent
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }
  }
  
  /**
   * Render visualization using Viral/HIV research-inspired aesthetics
   * @param {Object} data - Prepared visualization data
   * @param {Object} colors - Color scheme to use
   */
  renderViral(data, colors) {
    if (!this.canvas || !this.ctx) return;
    
    const ctx = this.ctx;
    const { nodes, connections } = data;
    const now = Date.now() / 1000; // Current time in seconds
    
    // Draw "viral background" - subtle cell-like patterns
    this.drawViralBackground(colors);
    
    // Draw connections as viral transmission pathways
    ctx.lineWidth = 1;
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (sourceNode && targetNode) {
        // Create gradient for connections to simulate transmission
        const gradient = ctx.createLinearGradient(
          sourceNode.x, sourceNode.y, targetNode.x, targetNode.y
        );
        
        // Pulsing effect based on time
        const pulsePhase = (now * this.viralPulseRate) % 1;
        const pulsePosition = Math.abs((pulsePhase * 2) - 1); // Triangle wave 0->1->0
        
        gradient.addColorStop(0, colors.nodes[sourceNode.color]);
        gradient.addColorStop(pulsePosition, colors.highlight);
        gradient.addColorStop(1, colors.nodes[targetNode.color]);
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        
        // Viral connections are organic, curved lines
        const controlPointX = (sourceNode.x + targetNode.x) / 2 + (Math.random() - 0.5) * 50;
        const controlPointY = (sourceNode.y + targetNode.y) / 2 + (Math.random() - 0.5) * 50;
        
        ctx.quadraticCurveTo(controlPointX, controlPointY, targetNode.x, targetNode.y);
        
        ctx.strokeStyle = gradient;
        ctx.stroke();
        
        // Add small transmission particles along the path
        if (Math.random() > 0.7) { // Only some connections show particles
          const particlePosition = (now * 0.3) % 1; // Particle position along path
          const particleX = sourceNode.x + (targetNode.x - sourceNode.x) * particlePosition;
          const particleY = sourceNode.y + (targetNode.y - sourceNode.y) * particlePosition;
          
          ctx.fillStyle = colors.highlight;
          ctx.beginPath();
          ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    
    // Draw nodes as virus-like or cell-like structures
    nodes.forEach(node => {
      const baseSize = Math.sqrt(node.value) * 2.5 + 8;
      // Pulsing effect for size based on time
      const pulseAmt = Math.sin(now * this.viralPulseRate * Math.PI * 2) * 0.2 + 1;
      const size = baseSize * pulseAmt;
      
      const nodeColor = colors.nodes[node.color];
      
      ctx.fillStyle = nodeColor;
      
      // Different node types have different viral-inspired representations
      if (node.type === 'hashtag') {
        // Hashtags are like viral structures with "spikes"
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add "spike proteins" (like coronavirus visualization)
        const spikes = 8;
        const spikeLength = size * 0.3;
        for (let i = 0; i < spikes; i++) {
          const angle = (i / spikes) * Math.PI * 2;
          const innerRadius = size/2;
          const outerRadius = size/2 + spikeLength;
          
          ctx.beginPath();
          ctx.moveTo(
            node.x + innerRadius * Math.cos(angle),
            node.y + innerRadius * Math.sin(angle)
          );
          ctx.lineTo(
            node.x + outerRadius * Math.cos(angle),
            node.y + outerRadius * Math.sin(angle)
          );
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      } else {
        // Users are like host cells - more organic shapes
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add inner structure like a cell nucleus
        ctx.fillStyle = colors.background;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size/4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add label with glow effect (like fluorescent microscopy)
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw glow
      ctx.shadowColor = nodeColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(node.label, node.x, node.y + size/2 + 15);
      
      // Reset shadow
      ctx.shadowBlur = 0;
    });
  }
  
  /**
   * Draw viral-inspired background pattern
   * @param {Object} colors - Color scheme to use
   */
  drawViralBackground(colors) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Draw "cell-like" background structures
    const cellCount = 15;
    ctx.globalAlpha = 0.1; // Very transparent
    
    for (let i = 0; i < cellCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 30 + Math.random() * 50;
      
      // Cell membrane
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = colors.edges;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Cell nucleus
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = colors.edges;
      ctx.fill();
    }
    
    ctx.globalAlpha = 1.0; // Reset opacity
  }
  
  /**
   * Render hybrid visualization combining Superflat aesthetics with Viral research influences
   * @param {Object} data - Prepared visualization data
   * @param {Object} colors - Color scheme to use
   */
  renderHybrid(data, colors) {
    if (!this.canvas || !this.ctx) return;
    
    const ctx = this.ctx;
    const { nodes, connections } = data;
    const now = Date.now() / 1000; // Current time in seconds
    
    // First, draw a stylized grid background (superflat influence)
    ctx.strokeStyle = `${colors.edges}22`; // Very transparent
    ctx.lineWidth = 1;
    
    const gridSize = 40;
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < this.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }
    
    // Add viral-inspired cell structures in the background
    const cellCount = 10;
    ctx.globalAlpha = 0.1;
    
    for (let i = 0; i < cellCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const radius = 40 + Math.random() * 60;
      
      // Draw cell outline
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = colors.nodes[i % colors.nodes.length];
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
    
    // Draw connections with mixed aesthetics
    ctx.lineWidth = 2;
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.