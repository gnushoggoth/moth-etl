/**
 * Duality.js
 * Core algorithm for generating the dual-natured forms
 */

class DualityGenerator {
    constructor() {
        this.complexity = 5;
        this.organicRatio = 50;  // 0-100, higher means more organic elements
        this.colors = {
            background: '#f5ecd5',
            mechanical: '#000000',
            organic: '#907e5a',
            accent: '#d3b88c',
            highlight: '#e8d7b0'
        };
        this.symmetryTypes = ['radial', 'bilateral', 'rotational'];
        this.currentSymmetry = 'radial';
        this.segments = 7;
    }

    /**
     * Generate the base mechanical structure
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Array} - Collection of mechanical elements to render
     */
    generateMechanicalBase(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const elements = [];
        const radius = Math.min(width, height) * 0.4;
        
        // Generate core structure based on symmetry type
        switch (this.currentSymmetry) {
            case 'radial':
                // Create circles representing mechanical nodes
                for (let i = 0; i < this.segments; i++) {
                    const angle = (i / this.segments) * Math.PI * 2;
                    const distance = radius * (0.3 + (this.complexity / 20));
                    
                    elements.push({
                        type: 'circle',
                        x: centerX + Math.cos(angle) * distance,
                        y: centerY + Math.sin(angle) * distance,
                        radius: 5 + (this.complexity * 0.8),
                        color: this.colors.mechanical
                    });
                    
                    // Add connecting lines
                    elements.push({
                        type: 'line',
                        x1: centerX,
                        y1: centerY,
                        x2: centerX + Math.cos(angle) * distance,
                        y2: centerY + Math.sin(angle) * distance,
                        width: 1 + (this.complexity * 0.1),
                        color: this.colors.mechanical
                    });
                    
                    // Add secondary nodes on higher complexity
                    if (this.complexity > 5) {
                        const secondaryDistance = distance * 1.5;
                        elements.push({
                            type: 'circle',
                            x: centerX + Math.cos(angle) * secondaryDistance,
                            y: centerY + Math.sin(angle) * secondaryDistance,
                            radius: 3 + (this.complexity * 0.4),
                            color: this.colors.mechanical
                        });
                        
                        elements.push({
                            type: 'line',
                            x1: centerX + Math.cos(angle) * distance,
                            y1: centerY + Math.sin(angle) * distance,
                            x2: centerX + Math.cos(angle) * secondaryDistance,
                            y2: centerY + Math.sin(angle) * secondaryDistance,
                            width: 0.5 + (this.complexity * 0.1),
                            color: this.colors.mechanical
                        });
                    }
                }
                
                // Central node
                elements.push({
                    type: 'circle',
                    x: centerX,
                    y: centerY,
                    radius: 15 + (this.complexity * 1.5),
                    color: this.colors.mechanical
                });
                
                // Secondary ring at higher complexity
                if (this.complexity >= 7) {
                    const innerRadius = radius * 0.5;
                    for (let i = 0; i < this.segments * 2; i++) {
                        const angle = (i / (this.segments * 2)) * Math.PI * 2;
                        elements.push({
                            type: 'circle',
                            x: centerX + Math.cos(angle) * innerRadius,
                            y: centerY + Math.sin(angle) * innerRadius,
                            radius: 2 + (this.complexity * 0.3),
                            color: this.colors.accent
                        });
                    }
                }
                break;
                
            case 'bilateral':
                // Create a vertical structure with bilateral symmetry
                const stemHeight = height * 0.7;
                const stemWidth = 2 + (this.complexity * 0.5);
                
                // Main stem
                elements.push({
                    type: 'line',
                    x1: centerX,
                    y1: centerY - stemHeight/2,
                    x2: centerX,
                    y2: centerY + stemHeight/2,
                    width: stemWidth,
                    color: this.colors.mechanical
                });
                
                // Branches
                const branchCount = 3 + Math.floor(this.complexity / 2);
                for (let i = 0; i < branchCount; i++) {
                    const yPos = centerY - stemHeight/2 + (stemHeight / branchCount) * i;
                    const branchLength = (radius / 2) * (1 - (i / branchCount) * 0.5);
                    
                    // Right branch
                    elements.push({
                        type: 'line',
                        x1: centerX,
                        y1: yPos,
                        x2: centerX + branchLength,
                        y2: yPos - branchLength * 0.3,
                        width: stemWidth * 0.7,
                        color: this.colors.mechanical
                    });
                    
                    // Left branch (symmetrical)
                    elements.push({
                        type: 'line',
                        x1: centerX,
                        y1: yPos,
                        x2: centerX - branchLength,
                        y2: yPos - branchLength * 0.3,
                        width: stemWidth * 0.7,
                        color: this.colors.mechanical
                    });
                    
                    // Nodes at branch ends
                    elements.push({
                        type: 'circle',
                        x: centerX + branchLength,
                        y: yPos - branchLength * 0.3,
                        radius: 3 + (this.complexity * 0.4),
                        color: this.colors.mechanical
                    });
                    
                    elements.push({
                        type: 'circle',
                        x: centerX - branchLength,
                        y: yPos - branchLength * 0.3,
                        radius: 3 + (this.complexity * 0.4),
                        color: this.colors.mechanical
                    });
                }
                break;
                
            case 'rotational':
                // Spiral pattern with rotational symmetry
                const turns = 2 + (this.complexity * 0.2);
                const points = 50 + (this.complexity * 10);
                
                for (let i = 0; i < points; i++) {
                    const angle = (i / points) * Math.PI * 2 * turns;
                    const distance = (i / points) * radius;
                    
                    if (i > 0) {
                        const prevAngle = ((i-1) / points) * Math.PI * 2 * turns;
                        const prevDistance = ((i-1) / points) * radius;
                        
                        elements.push({
                            type: 'line',
                            x1: centerX + Math.cos(prevAngle) * prevDistance,
                            y1: centerY + Math.sin(prevAngle) * prevDistance,
                            x2: centerX + Math.cos(angle) * distance,
                            y2: centerY + Math.sin(angle) * distance,
                            width: 1 + (this.complexity * 0.1),
                            color: this.colors.mechanical
                        });
                    }
                    
                    // Add nodes at regular intervals
                    if (i % Math.floor(points / (5 + this.complexity)) === 0) {
                        elements.push({
                            type: 'circle',
                            x: centerX + Math.cos(angle) * distance,
                            y: centerY + Math.sin(angle) * distance,
                            radius: 2 + (this.complexity * 0.3),
                            color: this.colors.mechanical
                        });
                    }
                }
                break;
        }
        
        return elements;
    }

    /**
     * Generate organic elements that overlay the mechanical structure
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Array} - Collection of organic elements to render
     */
    generateOrganicElements(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const elements = [];
        const radius = Math.min(width, height) * 0.4;
        
        // Adjust count based on organic ratio
        const curveCount = Math.floor(5 + (this.organicRatio / 10));
        
        // Create flowing curves emanating from the center
        for (let i = 0; i < curveCount; i++) {
            const startAngle = (i / curveCount) * Math.PI * 2;
            const endAngle = startAngle + (Math.random() * 0.5 + 0.5);
            
            const points = [];
            const pointCount = 20 + Math.floor(this.complexity * 2);
            
            for (let j = 0; j < pointCount; j++) {
                const t = j / (pointCount - 1);
                const angle = startAngle + (endAngle - startAngle) * t;
                const distance = radius * t * (0.8 + Math.sin(t * Math.PI) * 0.3);
                
                // Add some organic variation
                const variation = (Math.sin(t * 10) * 10) * (this.organicRatio / 100);
                
                points.push({
                    x: centerX + Math.cos(angle) * distance + variation,
                    y: centerY + Math.sin(angle) * distance + variation
                });
            }
            
            elements.push({
                type: 'curve',
                points: points,
                width: 1 + (this.organicRatio / 25),
                color: this.colors.organic
            });
            
            // Add organic nodes/flowers at the end of curves
            if (this.organicRatio > 30) {
                const lastPoint = points[points.length - 1];
                elements.push({
                    type: 'organicNode',
                    x: lastPoint.x,
                    y: lastPoint.y,
                    size: 5 + (this.organicRatio / 10),
                    color: this.colors.accent
                });
            }
        }
        
        // Add veined structures for higher organic ratio
        if (this.organicRatio > 60) {
            const veinsCount = Math.floor(this.organicRatio / 10);
            
            for (let i = 0; i < veinsCount; i++) {
                const angle = (i / veinsCount) * Math.PI * 2;
                const mainVein = [];
                const veinLength = radius * (0.5 + Math.random() * 0.5);
                
                // Create main vein
                for (let j = 0; j < 20; j++) {
                    const t = j / 19;
                    mainVein.push({
                        x: centerX + Math.cos(angle) * veinLength * t,
                        y: centerY + Math.sin(angle) * veinLength * t
                    });
                }
                
                elements.push({
                    type: 'curve',
                    points: mainVein,
                    width: 0.5 + (this.organicRatio / 40),
                    color: this.colors.organic
                });
                
                // Add branching veins
                const branchCount = 2 + Math.floor(Math.random() * 3);
                for (let b = 0; b < branchCount; b++) {
                    const branchStart = Math.floor(Math.random() * 10) + 5;
                    const branchAngle = angle + (Math.random() * 0.8 - 0.4);
                    const branchVein = [];
                    const branchLength = veinLength * 0.3;
                    
                    const startPoint = mainVein[branchStart];
                    branchVein.push(startPoint);
                    
                    for (let j = 1; j < 10; j++) {
                        const t = j / 9;
                        branchVein.push({
                            x: startPoint.x + Math.cos(branchAngle) * branchLength * t,
                            y: startPoint.y + Math.sin(branchAngle) * branchLength * t
                        });
                    }
                    
                    elements.push({
                        type: 'curve',
                        points: branchVein,
                        width: 0.3 + (this.organicRatio / 60),
                        color: this.colors.organic
                    });
                }
            }
        }
        
        return elements;
    }

    /**
     * Generate a central aureole/halo effect behind the figure
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Object} - Aureole element to render
     */
    generateAureole(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.25;
        
        return {
            type: 'aureole',
            x: centerX,
            y: centerY,
            radius: radius,
            color: this.colors.accent
        };
    }

    /**
     * Create a complete composition
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {Object} - Complete composition data
     */
    createComposition(width, height) {
        // Randomly select symmetry type based on complexity
        const symmetryIndex = Math.floor(Math.random() * this.symmetryTypes.length);
        this.currentSymmetry = this.symmetryTypes[symmetryIndex];
        
        // Adjust segments based on complexity
        this.segments = 5 + Math.floor(this.complexity / 2);
        
        return {
            aureole: this.generateAureole(width, height),
            mechanical: this.generateMechanicalBase(width, height),
            organic: this.generateOrganicElements(width, height),
            aspectRatio: width / height
        };
    }

    /**
     * Update generator parameters
     * @param {Object} params - Parameter updates
     */
    updateParameters(params) {
        if (params.complexity !== undefined) {
            this.complexity = params.complexity;
        }
        
        if (params.organicRatio !== undefined) {
            this.organicRatio = params.organicRatio;
        }
    }
}