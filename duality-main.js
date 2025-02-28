/**
 * Main.js
 * Application entry point and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the renderer
    const renderer = new DualityRenderer('dualityCanvas');
    
    // Initialize the generator
    const generator = new DualityGenerator();
    
    // UI Elements
    const complexitySlider = document.getElementById('complexity');
    const organicRatioSlider = document.getElementById('organicRatio');
    const animationSlider = document.getElementById('animation');
    const generateButton = document.getElementById('generate');
    const saveButton = document.getElementById('save');
    
    // Generate initial composition
    generateComposition();
    
    // Event Listeners
    complexitySlider.addEventListener('input', updateParameters);
    organicRatioSlider.addEventListener('input', updateParameters);
    animationSlider.addEventListener('input', updateAnimationSpeed);
    generateButton.addEventListener('click', generateComposition);
    saveButton.addEventListener('click', saveImage);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Canvas interaction
    renderer.canvas.addEventListener('mousedown', handleMouseDown);
    renderer.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    /**
     * Generate a new composition
     */
    function generateComposition() {
        // Update generator parameters
        updateGeneratorParameters();
        
        // Create new composition
        const composition = generator.createComposition(
            renderer.width,
            renderer.height
        );
        
        // Set composition to render
        renderer.setComposition(composition);
        
        // Reset particle system
        renderer.particleSystem.clear();
        
        // Add initial organic particles
        addInitialParticles(composition);
    }
    
    /**
     * Add initial particles based on the composition
     */
    function addInitialParticles(composition) {
        const particleSystem = renderer.particleSystem;
        const centerX = renderer.width / 2;
        const centerY = renderer.height / 2;
        
        // Add particles based on organic elements
        for (const element of composition.organic) {
            if (element.type === 'curve' && element.points && element.points.length > 0) {
                // Add particles along curves
                const endPoint = element.points[element.points.length - 1];
                particleSystem.createEmitter(endPoint.x, endPoint.y, {
                    count: 5 + Math.floor(Math.random() * 5),
                    speedMin: 0.05,
                    speedMax: 0.2,
                    color: element.color
                });
            }
            
            if (element.type === 'organicNode') {
                // Add flower effect
                particleSystem.createFlower(element.x, element.y, {
                    petalCount: 4 + Math.floor(Math.random() * 3),
                    petalLength: element.size * 2,
                    color: element.color
                });
            }
        }
        
        // Add some random spirals
        const organicRatio = parseInt(organicRatioSlider.value);
        if (organicRatio > 40) {
            const spiralCount = Math.floor(organicRatio / 20);
            for (let i = 0; i < spiralCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * Math.min(renderer.width, renderer.height) * 0.3;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                particleSystem.createSpiral(x, y, {
                    turns: 1 + Math.random(),
                    radius: 20 + Math.random() * 30,
                    pointCount: 20 + Math.floor(Math.random() * 20),
                    color: Math.random() < 0.7 ? '#907e5a' : '#d3b88c'
                });
            }
        }
    }
    
    /**
     * Update generator parameters from UI
     */
    function updateGeneratorParameters() {
        generator.updateParameters({
            complexity: parseInt(complexitySlider.value),
            organicRatio: parseInt(organicRatioSlider.value)
        });
    }
    
    /**
     * Update parameters and regenerate
     */
    function updateParameters() {
        updateGeneratorParameters();
        
        // Only regenerate after a small delay to avoid too many updates
        debounce(generateComposition, 300);
    }
    
    /**
     * Update animation speed
     */
    function updateAnimationSpeed() {
        renderer.updateAnimationSettings({
            speed: parseInt(animationSlider.value)
        });
    }
    
    /**
     * Handle keyboard controls
     */
    function handleKeyPress(event) {
        switch (event.key) {
            case ' ': // Spacebar
                generateComposition();
                break;
                
            case 'ArrowUp':
                complexitySlider.value = Math.min(10, parseInt(complexitySlider.value) + 1);
                updateParameters();
                break;
                
            case 'ArrowDown':
                complexitySlider.value = Math.max(1, parseInt(complexitySlider.value) - 1);
                updateParameters();
                break;
                
            case 'ArrowRight':
                organicRatioSlider.value = Math.min(100, parseInt(organicRatioSlider.value) + 10);
                updateParameters();
                break;
                
            case 'ArrowLeft':
                organicRatioSlider.value = Math.max(0, parseInt(organicRatioSlider.value) - 10);
                updateParameters();
                break;
                
            case 's':
            case 'S':
                saveImage();
                break;
        }
    }
    
    /**
     * Handle mouse interaction
     */
    function handleMouseDown(event) {
        const rect = renderer.canvas.getBoundingClientRect();
        const scaleX = renderer.width / rect.width;
        const scaleY = renderer.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Add flower or particle effect at click location
        if (Math.random() < 0.3) {
            renderer.particleSystem.createFlower(x, y, {
                petalCount: 5 + Math.floor(Math.random() * 3),
                petalLength: 20 + Math.random() * 10
            });
        } else {
            renderer.particleSystem.createEmitter(x, y, {
                count: 10 + Math.floor(Math.random() * 10),
                speedMin: 0.2,
                speedMax: 1.0,
                colorVariation: true
            });
        }
        
        // Add event listeners for drag
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleMouseMove);
        });
    }
    
    /**
     * Handle mouse movement for drag effect
     */
    function handleMouseMove(event) {
        const rect = renderer.canvas.getBoundingClientRect();
        const scaleX = renderer.width / rect.width;
        const scaleY = renderer.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Add trail effect
        renderer.particleSystem.createEmitter(x, y, {
            count: 2 + Math.floor(Math.random() * 3),
            speedMin: 0.1,
            speedMax: 0.3,
            colorVariation: true
        });
    }
    
    /**
     * Handle touch events for mobile
     */
    function handleTouchStart(event) {
        event.preventDefault();
        
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        handleMouseDown(mouseEvent);
        
        // Add touch move listener
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', () => {
            document.removeEventListener('touchmove', handleTouchMove);
        });
    }
    
    /**
     * Handle touch movement
     */
    function handleTouchMove(event) {
        event.preventDefault();
        
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        handleMouseMove(mouseEvent);
    }
    
    /**
     * Save canvas as image
     */
    function saveImage() {
        const dataURL = renderer.saveAsImage();
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'duality-composition.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Debounce helper function
    let debounceTimer;
    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }
});