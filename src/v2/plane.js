import { addV, Vx} from '../graph.js';


export class Plane {
  points;
  properties;
  constructor(properties) {
    this.properties = {
      width: 100000 || properties.width,
      depth: -1000 || properties.depth,
    }
    const w = this.properties.width/2;
    const depth = this.properties.depth;
    this.points = new Float32Array([w,w,depth,-w,w,depth,-w,-w,depth,w,-w,depth]);
  }

    /**
   * Checks if the triangle normal intersects a square plane of at depth
   * 
   * @param {Triangle} triangle 
   * @param {number} width 
   * @param {number} depth 
   */
  normalIntersectsPlane(triangle, normalLength){
    const w = this.properties.width/2;
    const uv = triangle.unitVector();
    const point = planeIntersection(triangle.normalVector[0], addV(triangle.normalVector[0], Vx(uv,normalLength)), this.points);
    if(((point[0] < w && point[0] > -w) && (point[1] < w && point[1] > -w)) && uv[2] > 0){
      return point;
    }
  }

}
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

// Pre-allocate Float32Arrays for reuse
const _d = new Float32Array(3);
const _edge1 = new Float32Array(3);
const _edge2 = new Float32Array(3);
const _normal = new Float32Array(3);

function planeIntersection(p1, p2, plane) {
  // Calculate direction vector and normalize
  _d[0] = p2[0] - p1[0];
  _d[1] = p2[1] - p1[1];
  _d[2] = p2[2] - p1[2];
  const length = Math.sqrt(_d[0]*_d[0] + _d[1]*_d[1] + _d[2]*_d[2]);
  _d[0] /= length;
  _d[1] /= length;
  _d[2] /= length;

  // Calculate plane normal using cross product of two edges
  _edge1[0] = plane[3] - plane[0];
  _edge1[1] = plane[4] - plane[1];
  _edge1[2] = plane[5] - plane[2];
  
  _edge2[0] = plane[6] - plane[0];
  _edge2[1] = plane[7] - plane[1];
  _edge2[2] = plane[8] - plane[2];
  
  // Cross product
  _normal[0] = _edge1[1]*_edge2[2] - _edge1[2]*_edge2[1];
  _normal[1] = _edge1[2]*_edge2[0] - _edge1[0]*_edge2[2];
  _normal[2] = _edge1[0]*_edge2[1] - _edge1[1]*_edge2[0];
  
  // Normalize normal vector
  const normalLength = Math.sqrt(_normal[0]*_normal[0] + _normal[1]*_normal[1] + _normal[2]*_normal[2]);
  _normal[0] /= normalLength;
  _normal[1] /= normalLength;
  _normal[2] /= normalLength;

  // Calculate intersection parameter t
  const d1 = (_normal[0]*plane[0] + _normal[1]*plane[1] + _normal[2]*plane[2]) - 
             (_normal[0]*p1[0] + _normal[1]*p1[1] + _normal[2]*p1[2]);
  const d2 = _normal[0]*_d[0] + _normal[1]*_d[1] + _normal[2]*_d[2];
  const t = d1/d2;

  // Return intersection point
  return [
    p1[0] + t*_d[0],
    p1[1] + t*_d[1],
    p1[2] + t*_d[2]
  ];
}


