import { describe, it, expect } from 'vitest';
import { Triangle } from '../geometry.js';

describe('Triangle', () => {
  describe('Origin', () => {
    it('should calculate the correct origin for a triangle', () => {
      // Create a triangle with points at (0,0,0), (1,0,0), and (0,1,0)
      const points = [[0, 0, 0],
                      [1, 0, 0],
                      [0, 1, 0]];
      
      const triangle = new Triangle(points);
      const origin = triangle.getOrigin();
      
      // The origin should be the average of all points
      expect(origin[0]).toBeCloseTo(1/3);  // (0 + 1 + 0) / 3
      expect(origin[1]).toBeCloseTo(1/3);  // (0 + 0 + 1) / 3
      expect(origin[2]).toBeCloseTo(0);    // (0 + 0 + 0) / 3
    });

    it('should handle a triangle with non-zero z-coordinates', () => {
      // Create a triangle with points at (0,0,1), (1,0,1), and (0,1,1)
      const points = [[0, 0, 1],
                      [1, 0, 1],
                      [0, 1, 1]];
      
      const triangle = new Triangle(points);
      const origin = triangle.getOrigin();
      
      // The origin should be the average of all points
      expect(origin[0]).toBeCloseTo(1/3);  // (0 + 1 + 0) / 3
      expect(origin[1]).toBeCloseTo(1/3);  // (0 + 0 + 1) / 3
      expect(origin[2]).toBeCloseTo(1);    // (1 + 1 + 1) / 3
    });
  });
  describe('Normal vector', () => {
    it('should create a triangle and calculate its normal vector', () => {
      // Create a triangle with three points
      const points = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0]
      ];
      const triangle = new Triangle(points);

      // Calculate the normal vector
      const normal = triangle.normal();

      // Verify the normal vector is a Float32Array
      expect(normal).toBeInstanceOf(Float32Array);
      expect(normal.length).toBe(3);

      // Verify the normal vector is normalized (length should be approximately 1)
      const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
      expect(length).toEqual(1);

      // For this specific triangle, the normal should point in the positive z direction
      expect(normal[0]).toEqual(0);
      expect(normal[1]).toEqual(0);
      expect(normal[2]).toEqual(1);
    });

    it('should set a custom normal vector using setNormal', () => {
      // Create a triangle
      const points = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0]
      ];
      const triangle = new Triangle(points);

      // Define a custom normal vector
      const customNormal = new Float32Array([0.5, 0.5, 0.7071]);
      
      // Set the custom normal
      triangle.setNormal(customNormal);

      // Verify the unit vector was set correctly
      expect(triangle.unitVector).toEqual(customNormal);

      // Verify the normal vector was set correctly
      const origin = triangle.origin;
      expect(triangle.normalVector[0]).toBe(origin[0]);
      expect(triangle.normalVector[1]).toBeCloseTo(origin[1]);
      expect(triangle.normalVector[2]).toBeCloseTo(origin[2]);
      expect(triangle.normalVector[3]).toBeCloseTo(origin[0] + customNormal[0] * 10);
      expect(triangle.normalVector[4]).toBeCloseTo(origin[1] + customNormal[1] * 10);
      expect(triangle.normalVector[5]).toBeCloseTo(origin[2] + customNormal[2] * 10);
    });
  }); 
  describe('Scaling', () => {
    it('should scale the triangle and its normal vector correctly', () => {
      // Create a triangle
      const points = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0]
      ];
      const triangle = new Triangle(points);
      
      // Store original values for comparison
      const originalPoints = [...triangle.points];
      const originalOrigin = triangle.getOrigin();
      const originalNormal = triangle.normal();
      
      // Scale the triangle by a factor of 2
      triangle.scale([0.5,0.5,0], [2,2,2]);
      
      expect(triangle.points).toStrictEqual(new Float32Array([-0.5, -0.5, 0, 1.5, -0.5, 0, -0.5, 1.5, 0]));
 
    });
  }); 
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
      console.log(triangle.points);
      expect(triangle.points[3]).toBeCloseTo(-1);
      expect(triangle.points[5]).toBeCloseTo(0);
      expect(triangle.points[7]).toBe(1);
    });
  }); 
  describe('Translation', () => {
    it('should translate the triangle correctly', () => {
      // Create a triangle
      const points = [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0]
      ];
      const triangle = new Triangle(points);
      
      // Translate the triangle by (2, 3, 4)
      triangle.translate([2, 3, 4]);
      
      // Verify the new positions of the points
      expect(triangle.points[0]).toBe(2);  // x of first point
      expect(triangle.points[1]).toBe(3);  // y of first point
      expect(triangle.points[2]).toBe(4);  // z of first point
      
      expect(triangle.points[3]).toBe(3);  // x of second point
      expect(triangle.points[4]).toBe(3);  // y of second point
      expect(triangle.points[5]).toBe(4);  // z of second point
      
      expect(triangle.points[6]).toBe(2);  // x of third point
      expect(triangle.points[7]).toBe(4);  // y of third point
      expect(triangle.points[8]).toBe(4);  // z of third point
    });
  }); 
}); 