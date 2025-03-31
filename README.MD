# Scimonk

A 3D visualization library for JavaScript.

## Description

Scimonk is a JavaScript library for creating and manipulating 3D graphics. It provides functionality for:

- Creating and manipulating 3D geometries (boxes, spheres, cylinders, cones)
- Rendering 3D objects with fill and line modes
- Shadow casting
- STL file parsing and writing
- Matrix operations and vector calculations

## Installation

```bash
npm install scimonk
```

## Usage

```javascript
import { SciMonk, DrawModes } from 'scimonk';
import { ScimonkView } from 'scimonk';

// Create a canvas element
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Create a view
const view = new ScimonkView(canvas);

// Create draw modes
const drawModes = new DrawModes(true, true);

// Create the main Scimonk instance
const scimonk = new SciMonk(view, drawModes);

// Add a box geometry
scimonk.addGeometry(triangles, 'box', [255, 0, 0, 255], [1, 1, 1], [0, 0, 0]);

// Render the scene
scimonk.render();
```

## API

### Classes

#### SciMonk
The main class for 3D visualization.

#### DrawModes
Controls rendering modes like fill, lines, and shadows.

#### Geometry
Represents 3D geometries like boxes, spheres, etc.

#### Triangle
Represents a 3D triangle with normal vectors.

### Functions

Various utility functions for vector operations, matrix calculations, and geometry manipulation.

## License

ISC
