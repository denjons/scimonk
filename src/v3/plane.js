import { calculateOrigin } from './vectors.js';

export class Plane {
  points;
  origin = new Float32Array(3);
  properties;
  line = new Float32Array(6);

  constructor(points, properties) {
    this.width = 5000 || properties.width/2,
    this.points = new Float32Array(points);
    calculateOrigin(points, this.origin);
    this.calculateNormal(this.points);
  }

    /**
   * Checks if the triangle normal intersects a square plane of at depth
   * 
   * @param {Triangle} triangle 
   * @param {number} width 
   * @param {number} depth 
   */
  normalIntersectsPlane(triangle, normalLength){
    const w = this.width;
    const uv = triangle.normal();
    this.line[0] = triangle.normalVector[0];
    this.line[1] = triangle.normalVector[1];
    this.line[2] = triangle.normalVector[2];
    this.line[3] = triangle.normalVector[3] + uv[0]*normalLength;
    this.line[4] = triangle.normalVector[4] + uv[1]*normalLength;
    this.line[5] = triangle.normalVector[5] + uv[2]*normalLength;
    const point = this.planeIntersection();
    
    // Calculate vector from triangle origin to plane origin
    const toPlane = [
      this.origin[0] - triangle.normalVector[0],
      this.origin[1] - triangle.normalVector[1],
      this.origin[2] - triangle.normalVector[2]
    ];
    
    // Calculate dot product between triangle normal and vector to plane
    const toPlaneDot = uv[0] * toPlane[0] + uv[1] * toPlane[1] + uv[2] * toPlane[2];
    
    // Only return intersection point if it's within bounds AND the normal is pointing towards the plane
    if(((point[0] < w && point[0] > -w) && (point[1] < w && point[1] > -w)) && toPlaneDot > 0){
      return point;
    }
  }

  edge1 = new Float32Array(3);
  edge2 = new Float32Array(3);
  normal = new Float32Array(3);

  calculateNormal(plane){
    // Calculate plane normal using cross product of two edges
    this.edge1[0] = plane[3] - plane[0];
    this.edge1[1] = plane[4] - plane[1];
    this.edge1[2] = plane[5] - plane[2];
    
    this.edge2[0] = plane[6] - plane[0];
    this.edge2[1] = plane[7] - plane[1];
    this.edge2[2] = plane[8] - plane[2];
  
    // Cross product
    this.normal[0] = this.edge1[1]*this.edge2[2] - this.edge1[2]*this.edge2[1];
    this.normal[1] = this.edge1[2]*this.edge2[0] - this.edge1[0]*this.edge2[2];
    this.normal[2] = this.edge1[0]*this.edge2[1] - this.edge1[1]*this.edge2[0];
    
  // Normalize normal vector
    const normalLength = Math.sqrt(this.normal[0]*this.normal[0] + this.normal[1]*this.normal[1] + this.normal[2]*this.normal[2]);
    this.normal[0] /= normalLength;
    this.normal[1] /= normalLength;
    this.normal[2] /= normalLength;
  }


  d = new Float32Array(3);


    /**
 * 
 * Returns the intersection point of v1 -> v2 on plane.
 * 
 * point v1 [a1,a2,a3]
 * point v2 [b1,b2,b3]
 *
 * plane [a,b,c]
 * 
 * https://math.stackexchange.com/questions/100439/determine-where-a-vector-will-intersect-a-plane
 * 
 * (𝑥,𝑦,𝑧)=(𝑜1+𝑑1𝑡,𝑜2+𝑑2𝑡,𝑜3+𝑑3𝑡)
 * 
 * 𝑁1(𝑥−𝑎1)+𝑁2(𝑦−𝑎2)+𝑁3(𝑧−𝑎3)=0
 * 
 * 𝑥=𝑜1+𝑑1𝑡,𝑦=𝑜2+𝑑2𝑡𝑧=𝑜3+𝑑3𝑡
 */

  planeIntersection() {
    // Calculate direction vector and normalize
    this.d[0] = this.line[3] - this.line[0];
    this.d[1] = this.line[4] - this.line[1];
    this.d[2] = this.line[5] - this.line[2];
    const length = Math.sqrt(this.d[0]*this.d[0] + this.d[1]*this.d[1] + this.d[2]*this.d[2]);
    this.d[0] /= length;
    this.d[1] /= length;
    this.d[2] /= length;

    // Calculate intersection parameter t
    const d1 = (this.normal[0]*this.points[0] + this.normal[1]*this.points[1] + this.normal[2]*this.points[2]) - 
              (this.normal[0]*this.line[0] + this.normal[1]*this.line[1] + this.normal[2]*this.line[2]);
    const d2 = this.normal[0]*this.d[0] + this.normal[1]*this.d[1] + this.normal[2]*this.d[2];
    const t = d1/d2;

    // Return intersection point
    return [
      this.line[0] + t*this.d[0],
      this.line[1] + t*this.d[1],
      this.line[2] + t*this.d[2]
    ];
  }

}





