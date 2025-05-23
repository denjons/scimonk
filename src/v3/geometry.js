import { 
   Vx, vLen, unitVector, sign, middle,

} from '../graph.js';

import {
  calculateOrigin
} from './vectors.js';

import {
  rotate
} from './rotate.js';

import {
  scale
} from './scale.js';

// Helper functions
/**
 * Creates a box geometry
*/
function boxTriangles(x, y, z, w, h, d, faces = {}) {
  // Default all faces to true if not specified
  const {
    front = true,
    back = true,
    left = true,
    right = true,
    top = true,
    bottom = true
  } = faces;

  w = w/2;
  h = h/2;
  d = d/2;
  var array = new Array();

  if (front) {
    squareToTriangles([[x-w,y-h,z-d],[x-w,y+h,z-d],[x+w,y+h,z-d],[x+w,y-h,z-d]], array);
  }
  
  if (left) {
    squareToTriangles([[x-w,y+h,z+d],[x-w,y+h,z-d],[x-w,y-h,z-d],[x-w,y-h,z+d]], array);
  }
  
  if (bottom) {
    squareToTriangles([[x-w,y-h,z+d],[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y-h,z+d]], array);
  }

  if (back) {
    squareToTriangles([[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]], array);
  }
  
  if (right) {
    squareToTriangles([[x+w,y+h,z-d],[x+w,y+h,z+d],[x+w,y-h,z+d],[x+w,y-h,z-d]], array);
  }
  
  if (top) {
    squareToTriangles([[x-w,y+h,z-d],[x-w,y+h,z+d],[x+w,y+h,z+d],[x+w,y+h,z-d]], array);
  }

  return array;
}





function sphereCoordinate(pos, size, i, j, sn, sr) {
  var end = (2*Math.PI)/sr*(j-1);
  return [pos[0]+((size[0]/2)*Math.sin(Math.PI/sn*i))*Math.cos(end), 
						pos[1]+(size[1]/2)*Math.sin(Math.PI/2-Math.PI/sn*i),
						pos[2]+((size[2]/2)*Math.sin(Math.PI/sn*i))*Math.sin(end)];
}

function xRzCircle(pos, width, depth, ls){
	var i = 0;
	var lines = new Array();
	for(i=0;i<=ls;i++){
		lines[i] = [pos[0]+width*Math.cos(2*Math.PI/ls*i),
						pos[1],
						pos[2]+depth*Math.sin(2*Math.PI/ls*i)];
	}
	return [lines];
}

function squareToTriangles(square, triangles) {
  triangles.push(new Triangle([square[0], square[1], square[2]]));
  triangles.push(new Triangle([square[2], square[3], square[0]]));
}


export function gridToTriangles(grid, triangles, levels){

  if(levels <= 0){
    return;
  }
  levels--;

  const midLeft = middle(grid[0], grid[1]);
  const midTop = middle(grid[1], grid[2]);
  const midright = middle(grid[2], grid[3]);
  const midBottom = middle(grid[3], grid[0]);
  const center = middle(midLeft, midright);

  if(levels <= 0){
    squareToTriangles([grid[0], midLeft, center, midBottom], triangles);
    squareToTriangles([midLeft, grid[1], midTop, center], triangles);
    squareToTriangles([center, midTop, grid[2], midright], triangles);
    squareToTriangles([midBottom, center, midright, grid[3]], triangles);
  }else{
    gridToTriangles([grid[0], midLeft, center, midBottom], triangles, levels);
    gridToTriangles([midLeft, grid[1], midTop, center], triangles, levels);
    gridToTriangles([center, midTop, grid[2], midright], triangles, levels);
    gridToTriangles([midBottom, center, midright, grid[3]], triangles, levels);
  }


}

//TODO: improve performance by using a single Float32Array for the triangle and not a new one each time. Also, the normal vector should be stored in the triangle object. 
function calculateTriangleNormal(triangle) {
  // Extract the points from the flat Float32Array
  // Points are stored as [x1,y1,z1, x2,y2,z2, x3,y3,z3]
  const p1 = [triangle[0], triangle[1], triangle[2]];
  const p2 = [triangle[3], triangle[4], triangle[5]];
  const p3 = [triangle[6], triangle[7], triangle[8]];

  // Convert points to vectors for calculation
  const v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  const v2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

  // Calculate the cross product of v1 and v2
  const crossProduct = [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
  ];

  // Calculate the magnitude of the cross product (to normalize it)
  const magnitude = Math.sqrt(
      crossProduct[0] ** 2 + crossProduct[1] ** 2 + crossProduct[2] ** 2
  );

  // Normalize the cross product to get the normal vector
  const normal = crossProduct.map((component) => component / magnitude);

  return new Float32Array(normal);
}

export class Triangle {
  constructor(points) {
    this.points = new Float32Array([points[0][0], points[0][1], points[0][2], points[1][0], points[1][1], points[1][2], points[2][0], points[2][1], points[2][2]]);
    this.normalVector = new Float32Array(6);
    this.origin = new Float32Array(3);
    this.unitVector = new Float32Array(3);
  }

  getOrigin() { 
    calculateOrigin(this.points, this.origin);
    return this.origin.slice(0, 3);
  }

  normal(){
    this.unitVector = calculateTriangleNormal(this.points);
    this.setNormal(this.unitVector);
    return this.unitVector;
  }

  // Only used when the geomtry is imported from an STL file. Otherwise the normal vector is calculated from the points.
  setNormal(vector){
    this.getOrigin();
    this.unitVector = new Float32Array(vector);
    this.normalVector[0] = this.origin[0];
    this.normalVector[1] = this.origin[1];
    this.normalVector[2] = this.origin[2];
    this.normalVector[3] = this.origin[0] + this.unitVector[0]*10;
    this.normalVector[4] = this.origin[1] + this.unitVector[1]*10;
    this.normalVector[5] = this.origin[2] + this.unitVector[2]*10;
  }

  scale(origin, vector) {
    scale(this.normalVector, origin, vector);
    scale(this.points, origin, vector);
  }

  rotate(origin, vector) {
    rotate(this.normalVector, vector, origin);
    rotate(this.points, vector, origin);
  }

  translate(vector){
    for(let i=0; i<this.points.length/3; i++){
      this.points[i*3+0] += vector[0];
      this.points[i*3+1] += vector[1];
      this.points[i*3+2] += vector[2];
    }
    for(let i=0; i<this.normalVector.length/3; i++){
      this.normalVector[i*3+0] += vector[0];
      this.normalVector[i*3+1] += vector[1];
      this.normalVector[i*3+2] += vector[2];
    }
  }

  /**
   * Projects the triangle onto a plane defined by two vectors.
   * @param {Array} planeVector1 - The first vector defining the plane.
   * @param {Array} planeVector2 - The second vector defining the plane.
   * @returns {Triangle} - A new Triangle instance projected onto the plane.
   * 
   * Example usage:
   * const triangle = new Triangle([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
   * const projected = triangle.project([1, 0, 0], [0, 1, 0]);
   */
  project(planeVector1, planeVector2) {
    const planeNormal = calculateTriangleNormal([planeVector1, planeVector2, [0, 0, 0]]);
    const projectedPoints = this.points.map(point => {
      const toPoint = [point[0], point[1], point[2]];
      const dotProduct = toPoint[0] * planeNormal[0] + toPoint[1] * planeNormal[1] + toPoint[2] * planeNormal[2];
      return [
        point[0] - dotProduct * planeNormal[0],
        point[1] - dotProduct * planeNormal[1],
        point[2] - dotProduct * planeNormal[2]
      ];
    });
    return new Triangle(projectedPoints);
  }

  copy() {
    const copiedPoints = this.points.map(point => [...point]);
    const copiedNormalVector = this.normalVector.map(vector => [...vector]);
    const copiedTriangle = new Triangle(copiedPoints);
    copiedTriangle.normalVector = copiedNormalVector;
    return copiedTriangle;
  }
}


export class Geometry {
  origin = new Float32Array(3);
  constructor(triangles, type, colour, id) {
    this.triangles = triangles;
    this.type = type;
    this.colour = colour;
    this.id = id;
  }

  setDrawModes(drawModes){
    this.drawModes = drawModes;
  }

  getOrigin(){
    const res = new Float32Array(this.triangles.length*3);
    for(let i=0; i<this.triangles.length; i++){
      const origin = this.triangles[i].getOrigin();
      res[i*3+0] = origin[0];
      res[i*3+1] = origin[1];
      res[i*3+2] = origin[2];
    }
    return calculateOrigin(res, this.origin);	
  }

  scale(vector) {
    const origin = this.getOrigin();
    for(let triangle of this.triangles){
      triangle.scale(origin, vector);
    }
  }

  rotate(vector){
    this.rotateAround(vector, this.getOrigin());
  }

  rotateAround(vector, origin){
    for(let triangle of this.triangles ){
      triangle.rotate(origin, vector);
    }
  }

  translate(vector){
    for(let triangle of this.triangles){
      triangle.translate(vector);
    }
  }

  center(vector){
    const origin = this.getOrigin();
    const uv = unitVector(origin, vector);
    const len = vLen(origin, vector);
    const delta = Vx(uv, len);
    this.translate(delta);
  }

  computeNormals(){
    const origin = this.getOrigin();
    for(let triangle of this.triangles) {
      const tOrigin = triangle.getOrigin();
      const oNormal = unitVector(tOrigin, origin);
      const tNormal = triangle.normal();

      tNormal[0] *= tNormal[0] == 0 ? 0 : sign(tNormal[0])==sign(oNormal[0]) ? -1:1;
      tNormal[1] *= tNormal[1] == 0 ? 0 : sign(tNormal[1])==sign(oNormal[1]) ? -1:1;
      tNormal[2] *= tNormal[2] == 0 ? 0 : sign(tNormal[2])==sign(oNormal[2]) ? -1:1;
      triangle.setNormal(tNormal);
    }
  }

  crushTriangles(times){
    for(var i = 0; i < times; i++){
      const array = new Array();
      for(let triangle of this.triangles){
        this.crushTriangle(triangle, array);
      }
      this.triangles = array;
    }
    this.computeNormals();
  }

  crushTriangle(triangle, dest){
      const p1 = triangle.points[0];
      const p2 = triangle.points[1];
      const p3 = triangle.points[2];
      const origo = triangle.origin();
      const np1 = middle(p1, p2);
      dest.push(new Triangle([p1, np1, origo]));
      dest.push(new Triangle([np1, p2, origo]));
      const np2 = middle(p2, p3);
      dest.push(new Triangle([p2, np2, origo]));
      dest.push(new Triangle([np2, p3, origo]));
      const np3 = middle(p3, p1);
      dest.push(new Triangle([p3, np3, origo]));
      dest.push(new Triangle([np3, p1, origo]));
  }

  shakeTriangles = function(scale){
    scale = Math.ceil(scale*Math.random());
    for(let triangle of this.triangles){
      for(var i = 0 ; i < triangle.points.length; i++) {
        triangle.points[i] += (triangle.points[i]%scale)*sign(triangle.points[i]);
      }
    }
  }

  copy(){
    const copiedTriangles = this.triangles.map(triangle => triangle.copy());
    return new Geometry(copiedTriangles, this.type, this.colour, this.id);
  }

  /**
   * Factory methods
   */

  static merge(geometries, colour, id){
    const triangles = new Array();
    for(let geometry of geometries){
      triangles.push(...geometry.triangles);
    }
    return new Geometry(triangles, 'custom', colour, id);
  }

  /**
   * Creates a box geometry
   * @param {Array} position - The position of the box [x,y,z]
   * @param {Array} size - The size of the box [width, height, depth]
   * @param {Array} colour - The colour of the box [r,g,b,a]
   * @param {Number} id - The id of the box
   * @returns {Geometry}
   */
  static box(position, size, colour, id) {
    const g = new Geometry(boxTriangles(position[0], position[1], position[2], size[0], size[1],size[2]), 'box' , colour, id);
    g.computeNormals();
    return g;
  }

    /**
   * Creates a box geometry
   * @param {Array} position - The position of the box [x,y,z]
   * @param {Array} size - The size of the box [width, height, depth]
   * @param {Array} colour - The colour of the box [r,g,b,a]
   * @param {Number} id - The id of the box
   * @param {Object} faces - The faces of the box
   * @returns {Geometry}
   */
  static boxFaces(position, size, colour, id, faces) {
    const g = new Geometry(boxTriangles(position[0], position[1], position[2], size[0], size[1],size[2], faces), 'box' , colour, id);
    g.computeNormals();
    return g;
  }
  
  static sphere(pos, size, sn, sr, colour, id){
    var sphere = new Array();
    var top = [pos[0],pos[1]+size[1]/2,pos[2]];
    var bottom =  [pos[0],pos[1]-size[1]/2,pos[2]];
    for(var i=1;i<sn;i++){ // computes each line
      for(var j=0;j<sr;j++){ // computes each node on one line
        if(i==1){
          sphere.push(new Triangle([sphereCoordinate(pos, size, i, j, sn, sr), top, sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr)]))
          squareToTriangles([sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr),
                            sphereCoordinate(pos, size, i+1, (j+1)%sr, sn, sr), sphereCoordinate(pos, size, i+1, j, sn, sr)], sphere);
        }else if(i==sn-1){
          sphere.push(new Triangle([bottom, sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr)]))
        }else{
          squareToTriangles([sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr),
                            sphereCoordinate(pos, size, i+1, (j+1)%sr, sn, sr), sphereCoordinate(pos, size, i+1, j, sn, sr)], sphere);
        }
      }
    }
    const g = new Geometry(sphere,'sphere' ,colour, id);
    g.computeNormals();
    return g;
  }

  static cylinder(pos, size, lns, colour, id){
    var cylinder = new Array(); 
    var top = xRzCircle([pos[0],pos[1]-size[1]/2,pos[2]],size[0]/2, size[2]/2, lns)[0];
    var bottom = xRzCircle([pos[0],pos[1]+size[1]/2,pos[2]],size[0]/2, size[2]/2, lns)[0];
    for(var i = 0; i < top.length; i++){
      squareToTriangles([top[i], top[(i+1)%top.length], bottom[(i+1)%top.length], bottom[i]],cylinder)
    }
    const g = new Geometry(cylinder, 'cylinder', colour, id);
    g.computeNormals();
    return g;
    
  }

  static cone(pos, sc, s, colour, id){
    var cone = new Array();
    pos[1] = pos[1] - sc[1]/2;
    var bottom = xRzCircle(pos, sc[0]/2, sc[2]/2, s)[0];
    pos[1] = pos[1]+sc[1];
    for(var i = 0; i < bottom.length; i++) {
      cone.push(new Triangle([pos, bottom[i], bottom[(i+1)%bottom.length]]));
    }
    const g = new Geometry(cone, 'cone' , colour, id);
    g.computeNormals();
    return g;
  }

  static custom(triangles, colour, id){
    const g = new Geometry(triangles, 'custom', colour, id);
    g.computeNormals();
    return g;
  }

  static gridBox(pos, size, levels, colour, id) {
    const triangles = [];
    const w = size[0]/2;
    const h = size[1]/2;
    const d = size[2]/2;

    // front face
    gridToTriangles([
      [pos[0]-w, pos[1]-h, pos[2]-d],
      [pos[0]-w, pos[1]+h, pos[2]-d],
      [pos[0]+w, pos[1]+h, pos[2]-d],
      [pos[0]+w, pos[1]-h, pos[2]-d]
    ], triangles, levels);

    // back face
    gridToTriangles([
      [pos[0]-w, pos[1]-h, pos[2]+d],
      [pos[0]-w, pos[1]+h, pos[2]+d],
      [pos[0]+w, pos[1]+h, pos[2]+d],
      [pos[0]+w, pos[1]-h, pos[2]+d]
    ], triangles, levels);

    // left face
    gridToTriangles([
      [pos[0]-w, pos[1]-h, pos[2]-d],
      [pos[0]-w, pos[1]+h, pos[2]-d],
      [pos[0]-w, pos[1]+h, pos[2]+d],
      [pos[0]-w, pos[1]-h, pos[2]+d]
    ], triangles, levels);

    // right face
    gridToTriangles([
      [pos[0]+w, pos[1]-h, pos[2]-d],
      [pos[0]+w, pos[1]+h, pos[2]-d],
      [pos[0]+w, pos[1]+h, pos[2]+d],
      [pos[0]+w, pos[1]-h, pos[2]+d]
    ], triangles, levels);

    // top face
    gridToTriangles([
      [pos[0]-w, pos[1]+h, pos[2]-d],
      [pos[0]-w, pos[1]+h, pos[2]+d],
      [pos[0]+w, pos[1]+h, pos[2]+d],
      [pos[0]+w, pos[1]+h, pos[2]-d]
    ], triangles, levels);

    // bottom face
    gridToTriangles([
      [pos[0]-w, pos[1]-h, pos[2]-d],
      [pos[0]-w, pos[1]-h, pos[2]+d],
      [pos[0]+w, pos[1]-h, pos[2]+d],
      [pos[0]+w, pos[1]-h, pos[2]-d]
    ], triangles, levels);

    const g = new Geometry(triangles, 'gridBox', colour, id);
    g.computeNormals();
    return g;
  }

  copy() {
    const copiedTriangles = this.triangles.map(triangle => triangle.copy());
    return new Geometry(copiedTriangles, this.type, this.colour, this.id);
  }

}