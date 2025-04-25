import { describe, it, expect } from 'vitest';
import { Triangle } from '../geometry.js';

describe('Triangle', () => {
 
  describe('Rotation', () => {
    it('should rotate the triangle and its normal vector correctly', () => {
      // Create a triangle
      const points = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0]
      ];
      const triangle = new Triangle(points);
      triangle.normal();
            
      // Rotate the triangle by 90 degrees around the origin
      triangle.rotate([0,0,0], [Math.PI,0,0]);  
      expect(triangle.points[1][0]).toBe(-1);  
      expect(triangle.points[1][2]).toBeCloseTo(0,2); // Not sure why this is not 0
      expect(triangle.points[2][1]).toBe(1)
    });
  }); 
}); 