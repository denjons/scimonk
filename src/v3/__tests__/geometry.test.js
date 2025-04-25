import { describe, it, expect } from 'vitest';
import { Geometry, Triangle } from '../geometry.js';

describe('Geometry', () => {
  it('should create a box geometry with correct properties', () => {
    const position = [0, 0, 0];
    const size = [1, 1, 1];
    const colour = [1, 0, 0, 1];
    const id = 1;

    const box = Geometry.box(position, size, colour, id);

    expect(box).toBeDefined();
    expect(box.type).toBe('box');
    expect(box.colour).toEqual(colour);
    expect(box.id).toBe(id);
    expect(box.triangles).toBeDefined();
    expect(box.triangles.length).toBeGreaterThan(0);
  });

  it('should scale a box geometry correctly', () => {
    const position = [0, 0, 0];
    const size = [1, 1, 1];
    const colour = [1, 0, 0, 1];
    const id = 1;
    const scaleFactor = [2, 2, 2]; // Scale by 2x in x, 3x in y, 4x in z

    const box = Geometry.box(position, size, colour, id);

    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i])).toBe(0.5);
      }
    });
    
    // Scale the box
    box.scale(scaleFactor);

    // Verify that each triangle's points have been scaled correctly
    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i])).toBe(1);
      }
    });
  });

  it('should translate a box geometry correctly', () => {
    const position = [0, 0, 0];
    const size = [1, 1, 1];
    const colour = [1, 0, 0, 1];
    const id = 1;
    const translation = [1, 1, 1]; // Translate by 2 in x, 3 in y, 4 in z

    const box = Geometry.box(position, size, colour, id);

    // Verify initial position
    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i])).toBe(0.5);
      }
    });

    // Translate the box
    box.translate(translation);

    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i]) == 0.5 || Math.abs(triangle.points[i]) == 1.5).toBe(true);
      }
    });
  });

  it('should center a box geometry correctly', () => {
    const position = [0, 0, 0];
    const size = [1, 1, 1];
    const colour = [1, 0, 0, 1];
    const id = 1;
    const centerPoint = [1, 1, 1];

    const box = Geometry.box(position, size, colour, id);

    // Verify initial position
    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i])).toBe(0.5);
      }
    });

    // Center the box
    box.center(centerPoint);

    // Verify that each triangle's points have been centered correctly
    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i]) == 0.5 || Math.abs(triangle.points[i]) == 1.5).toBe(true);
      }
    });
  });

  it('should rotate a box 360 degrees and return to original position', () => {
    const position = [0, 0, 0];
    const size = [1, 1, 1];
    const colour = [1, 0, 0, 1];
    const id = 1;
    const fullRotation = [2 * Math.PI, 2 * Math.PI, 2 * Math.PI]; // 360 degrees in radians for x, y, z

    const box = Geometry.box(position, size, colour, id);

    // Verify initial position
    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i])).toBe(0.5);
      }
    });

    // Rotate the box 360 degrees
    box.rotate(fullRotation);

    box.triangles.forEach(triangle => {
      for (let i = 0; i < triangle.points.length; i++) {
        expect(Math.abs(triangle.points[i])).toBe(0.5);
      }
    });
  });
  
});

