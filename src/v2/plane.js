import { addV, Vx, getOrigo} from '../graph.js';

export class Plane {
  points;
  properties;
  constructor(points, properties) {
   
    this.width = 5000 || properties.width/2,
    this.origin = getOrigo([[points[0],points[1],points[2]],[points[3],points[4],points[5]],[points[6],points[7],points[8]]]);
    this.points = new Float32Array(points);
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
    const uv = triangle.unitVector();
    const point = this.planeIntersection(triangle.normalVector[0], addV(triangle.normalVector[0], Vx(uv,normalLength)), this.points);
    
    // Calculate vector from triangle origin to plane origin
    const toPlane = [
      this.origin[0] - triangle.normalVector[0][0],
      this.origin[1] - triangle.normalVector[0][1],
      this.origin[2] - triangle.normalVector[0][2]
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

  planeIntersection(p1, p2, plane) {
    // Calculate direction vector and normalize
    this.d[0] = p2[0] - p1[0];
    this.d[1] = p2[1] - p1[1];
    this.d[2] = p2[2] - p1[2];
    const length = Math.sqrt(this.d[0]*this.d[0] + this.d[1]*this.d[1] + this.d[2]*this.d[2]);
    this.d[0] /= length;
    this.d[1] /= length;
    this.d[2] /= length;

    // Calculate intersection parameter t
    const d1 = (this.normal[0]*plane[0] + this.normal[1]*plane[1] + this.normal[2]*plane[2]) - 
              (this.normal[0]*p1[0] + this.normal[1]*p1[1] + this.normal[2]*p1[2]);
    const d2 = this.normal[0]*this.d[0] + this.normal[1]*this.d[1] + this.normal[2]*this.d[2];
    const t = d1/d2;

    // Return intersection point
    return [
      p1[0] + t*this.d[0],
      p1[1] + t*this.d[1],
      p1[2] + t*this.d[2]
    ];
  }

}





