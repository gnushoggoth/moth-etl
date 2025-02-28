import { NarrativeProcessor } from './narrative-processor.js';

class ComplexityEngine {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.narrativeProcessor = new NarrativeProcessor();
        this.systemNodes = [];
        this.initializeCanvas();
        this.setupEventListeners();
    }

    initializeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateInitialNodes();
    }

    generateInitialNodes(count = 50) {
        for (let i = 0; i < count; i++) {
            this.systemNodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 10 + 2,
                velocity: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                }
            });
        }
    }

    updateSystemNodes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Complex interconnection rendering
        this.systemNodes.forEach((node, index) => {
            // Update node position
            node.x += node.velocity.x;
            node.y += node.velocity.y;

            // Boundary conditions
            if (node.x < 0 || node.x > this.canvas.width) node.velocity.x *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.velocity.y *= -1;

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0,255,65,0.5)';
            this.ctx.fill();

            // Create interconnection lines
            this.systemNodes.slice(index + 1).forEach(otherNode => {
                const distance = Math.hypot(
                    otherNode.x - node.x, 
                    otherNode.y - node.y
                );
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(otherNode.x, otherNode.y);
                    this.ctx.strokeStyle = 'rgba(0,255,65,0.1)';
                    this.ctx.stroke();
                }
            });
        });
    }

    triggerRecursion() {
        const systemLog = document.getElementById('system-log');
        const fragment = this.narrativeProcessor.processFragment({
            id: `complexity-vector-${Date.now()}`,
            content: 'Recursive system interaction initiated',
            metadata: {
                recursionCount: this.systemNodes.length,
                entangledReferences: this.systemNodes.map((_, i) => `node-${i}`)
            }
        });

        systemLog.textContent = JSON.stringify(fragment, null, 2);
        
        // Add more nodes on recursion
        this.generateInitialNodes(this.systemNodes.length + 10);
    }

    modulateEntropy() {
        // Modify node velocities to introduce chaos
        this.systemNodes = this.systemNodes.map(node => ({
            ...node,
            velocity: {
                x: node.velocity.x * (Math.random() * 2 - 1),
                y: node.velocity.y * (Math.random() * 2 - 1)
            }
        }));
    }

    animate() {
        this.updateSystemNodes();
        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        const recursionTrigger = document.getElementById('recursion-trigger');
        const entropyModulator = document.getElementById('entropy-modulator');

        recursionTrigger.addEventListener('click', () => this.triggerRecursion());
        entropyModulator.addEventListener('click', () => this.modulateEntropy());

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    start() {
        this.animate();
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('complexity-canvas');
    const complexityEngine = new ComplexityEngine(canvas);
    complexityEngine.start();
});