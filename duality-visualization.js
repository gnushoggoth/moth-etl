# Duality: Technology & Nature Visualization

![License](https://img.shields.io/badge/license-MIT-blue.svg)

An interactive art visualization exploring the duality between technology and organic elements. Inspired by art nouveau aesthetics and cybernetic philosophy, this project renders procedurally generated figures that blend mechanical and natural elements.

[View Demo](https://github.com/yourusername/duality)

![Preview](./preview.png)

## Features

- Interactive canvas-based visualization
- Procedural generation of cybernetic/organic forms
- Art nouveau-inspired color palette (sepia, gold, black)
- Particle system mimicking natural growth patterns
- Responsive design scaling to any viewport

## Installation

```bash
git clone https://github.com/yourusername/duality.git
cd duality
# Simple local server
python -m http.server 8000
# Or just open index.html in a browser
```

## Usage

- Click and drag to interact with the visualization
- Press spacebar to generate a new composition
- Use arrow keys to adjust complexity/detail level
- 'S' key to save the current view as PNG

## Project Structure

```
duality/
├── index.html          # Main entry point
├── css/
│   └── style.css       # Styling
├── js/
│   ├── main.js         # Application logic
│   ├── renderer.js     # Canvas rendering
│   ├── duality.js      # Core algorithm
│   └── particles.js    # Particle system
├── assets/
│   └── patterns/       # Vector patterns
└── LICENSE             # MIT License
```

## How It Works

The visualization uses HTML Canvas to create procedurally generated figures that combine mechanical precision with organic growth patterns. The algorithm:

1. Generates a symmetric core structure (mechanical)
2. Overlays organic growth patterns using particle systems
3. Applies art nouveau-inspired decorative elements
4. Renders using a limited color palette inspired by vintage illustrations

## Development

Requirements:
- Modern browser with Canvas support
- No external dependencies

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by art nouveau aesthetics
- Influenced by cybernetic philosophy
- Thanks to the creative coding community