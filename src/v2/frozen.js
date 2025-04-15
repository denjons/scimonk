import {
  planeNormalFromPoint
} from '../graph.js';

export class Light {
  lightSource;
  depth;
  halfDepth;
  constructor(lightSource, depth) {
    this.lightSource = lightSource;
    this.depth = depth;
    this.halfDepth = depth / 2;
  }

  lightVector = new Float32Array(3);
  _d = new Float32Array(3);
  _edge1 = new Float32Array(3);
  _edge2 = new Float32Array(3);
  _normal = new Float32Array(3);
  _n = new Float32Array(3);

  /**
   * 
   * 
export function planeNormalFromPoint(plane, point){
	return lineNormal(uToV(point,plane[0]),uToV(point,plane[1]));
}
export function lineNormal(u,v){
	var uv = uToV(u,v);
	var n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
	var b = vLen(uv);
	return Vx(n,1/b);
}
   */

  setLight(tringle, colour) { 
    const origin = tringle.origin();

    /*
    this._normal[0] = (origin[0] - tringle.points[1][0]) -  (origin[0] - tringle.points[0][0]);
    this._normal[1] = (origin[1] - tringle.points[1][1]) -  (origin[1] - tringle.points[0][1]);
    this._normal[2] = (origin[2] - tringle.points[1][2]) -  (origin[2] - tringle.points[0][2]);
    this._n[0] = this._normal[1]*origin[2]-this._normal[2]*origin[1];
    this._n[1] = this._normal[2]*origin[0]-this._normal[0]*origin[2];
    this._n[2] = this._normal[0]*origin[1]-this._normal[1]*origin[0];
    const b = Math.sqrt(this._normal[0]*this._normal[0] + this._normal[1]*this._normal[1] + this._normal[2]*this._normal[2]);
    this._normal[0] = this._n[0] / b;
    this._normal[1] = this._n[1] / b;
    this._normal[2] = this._n[2] / b;
    */

    // Calulate plane normal
    
    const normal = planeNormalFromPoint(tringle.points, origin);
    this._normal[0] = normal[0];
    this._normal[1] = normal[1];
    this._normal[2] = normal[2];
  

    
    // Calculate vectors directly without uToV
    this.lightVector[0] = this.lightSource[0] - origin[0];
    this.lightVector[1] = this.lightSource[1] - origin[1];
    this.lightVector[2] = this.lightSource[2] - origin[2];
    
    const persp = [
      origin[0],
      origin[1],
      origin[2] + this.halfDepth
    ];
    
    // Calculate angles directly without vectorAngle
    const nv1 = this.calculateAngle(this._normal, persp);
    const nv2 = this.calculateAngle([-this._normal[0], -this._normal[1], -this._normal[2]], persp);
    
    let a = 0;
    if (nv1 <= nv2) {
      a = this.calculateAngle(this._normal, this.lightVector);
    } else {
      a = this.calculateAngle([-this._normal[0], -this._normal[1], -this._normal[2]], this.lightVector);
    }
    
    const cosA = Math.cos(a);
    return [
     colour[0], //Math.max(colour[0] - colour[0] * cosA, 1),
     colour[1], // Math.max(colour[1] - colour[1] * cosA, 1),
     colour[2], // Math.max(colour[2] - colour[2] * cosA, 1),
      125 + 120 * cosA
    ];
  }

  // Inlined vector angle calculation
  calculateAngle(u, v) {
    const x1 = u[0], x2 = v[0];
    const y1 = u[1], y2 = v[1];
    const z1 = u[2], z2 = v[2];
    
    const a = x1 * x2 + y1 * y2 + z1 * z2;
    const b = Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
    const c = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    
    return (b === 0 || c === 0) ? 0 : Math.acos(a / (b * c));
  }
}

/**
 * 
export function uToV(u,v){
	var vec = new Array();
	var i =0;
	for(i=0;i<u.length;i++){
		vec[i] = v[i]-u[i];
	}
	return vec;
}

 export function planeNormal(plane){
	var origo = getOrigo(plane);
  return planeNormalFromPoint(plane, origo);
}

export function planeNormalFromPoint(plane, point){
	return lineNormal(uToV(point,plane[0]),uToV(point,plane[1]));
}

export function uToV(u,v){
	var vec = new Array();
	var i =0;
	for(i=0;i<u.length;i++){
		vec[i] = v[i]-u[i];
	}
	return vec;
}

export function vectorAngle( u, v){

	var x1 = u[0];	var x2 = v[0];
	var y1 = u[1];	var y2 = v[1];
	var z1 = u[2];	var z2 = v[2]; 
	
	var a = x1*x2+y1*y2+z1*z2;
	var b = Math.sqrt(x1*x1+y1*y1+z1*z1);
	var c = Math.sqrt(x2*x2+y2*y2+z2*z2);
	var v=0;  //                  <-------------        oojojojojjoojoj, se upp!
	if(!(b==0||c==0))
		v = Math.acos(a/(b*c));
	//v = xRzAngleCorrection( v, z2);
	return v;
}
 
 
 */

