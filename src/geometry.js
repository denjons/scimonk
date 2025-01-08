
class Triangle {
  constructor(points) {
    this.points = points;
    this.normalVector = [];
  }

  normal(){
    return calculateTriangleNormal(this.points);
  }

  unitVector(){
    return unitVector(this.normalVector[0], this.normalVector[1]);
  }

  origin() {
    return getOrigo(this.points);
  }

  scale(origin, vector) {
    for(let i=0;i<this.points.length;i++){
      this.points[i] = scale(this.points[i], origin, vector);
    }
  }

  setNormal(vector){
    const origin = this.origin();
    this.normalVector[0] = origin;
    this.normalVector[1] = addV(origin, Vx(vector, 10));
  }

}


class Geometry {

  constructor(triangles, type, colour, id) {
    this.triangles = triangles;
    this.type = type;
    this.colour = colour;
    this.id = id;
  }

  origin(){
    var res = new Array();
    for(let triangle of this.triangles){
      res.push(triangle.origin());
    }
    return getOrigo(res);	
  }

  scale(vector) {
    const origin = this.origin();
    for(let triangle of this.triangles){
      triangle.scale(origin, vector);
    }
  }

  rotate(vector){
    this.rotateAround(vector, this.origin());
  }

  rotateAround(vector, origin){
    for(let triangle of this.triangles ){
      triangle.normalVector[0] = sciMonk.rotateNode(triangle.normalVector[0], vector, origin);
      triangle.normalVector[1] = sciMonk.rotateNode(triangle.normalVector[1], vector, origin);
      for(let j=0; j<triangle.points.length; j++){
        triangle.points[j] = sciMonk.rotateNode(triangle.points[j], vector, origin);
      }
    }
  }

  translate(vector){
    for(let triangle of this.triangles){
      for(let i=0; i<triangle.points.length; i++){
        triangle.points[i] = addV(triangle.points[i], vector);
      }
    }
  }

  computeNormals(){
    const origin = this.origin();
    for(let triangle of this.triangles) {
      const tOrigin = triangle.origin();
      const oNormal = unitVector(tOrigin, origin);
      const tNormal = triangle.normal();
      /*
      tNormal[0] = tNormal[0]*(sign(oNormal[0])*-1);
      tNormal[1] = tNormal[0]*(sign(oNormal[1])*-1);
      tNormal[2] = tNormal[0]*(sign(oNormal[2])*-1);
      */
     /* 
      tNormal[0] *= sign(oNormal[0]);
      tNormal[1] *= sign(oNormal[1]);
      tNormal[2] *= sign(oNormal[2]);
      */

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
        var point = copyArray(triangle.points[i]);
        point[0] += (point[2]%scale)*sign(point[0]);
        point[1] += (point[0]%scale)*sign(point[1]);
        point[2] += (point[1]%scale)*sign(point[2]);
        triangle.points[i] = point;
      }
    }
  }

  /**
   * Factory methods
   */

  static box(pos, size, colour, id) {
    const g = new Geometry(boxTriangles(pos[0], pos[1], pos[2], size[0], size[1],size[2]), 'box' , colour, id);
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
    return new Geometry(cylinder, 'cylinder', colour, id);
    
  }

  static cone(pos, sc, s, colour, id){
    var cone = new Array();
    pos[1] = pos[1] - sc[1]/2;
    var bottom = xRzCircle(pos, sc[0]/2, sc[2]/2, s)[0];
    pos[1] = pos[1]+sc[1];
    for(var i = 0; i < bottom.length; i++) {
      cone.push(new Triangle([pos, bottom[i], bottom[(i+1)%bottom.length]]));
    }
    return new Geometry(cone, 'cone' , colour, id);
  }

}

function boxTriangles(x, y, z, w, h, d){
	w=w/2;
	h=h/2;
	d=d/2;
  var array = new Array();
  // front
  squareToTriangles([[x-w,y-h,z-d],[x-w,y+h,z-d],[x+w,y+h,z-d],[x+w,y-h,z-d]], array);
    // left
  squareToTriangles([[x-w,y+h,z+d],[x-w,y+h,z-d],[x-w,y-h,z-d],[x-w,y-h,z+d]], array);
    // bottom
  squareToTriangles([[x-w,y-h,z+d],[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y-h,z+d]], array);

   // back
   squareToTriangles([[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]], array);
    // right
   squareToTriangles([[x+w,y+h,z-d],[x+w,y+h,z+d],[x+w,y-h,z+d],[x+w,y-h,z-d]], array);
    // top
  squareToTriangles([[x-w,y+h,z-d],[x-w,y+h,z+d],[x+w,y+h,z+d],[x+w,y+h,z-d]], array);
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

  function calculateTriangleNormal(triangle) {
    // Extract the points of the triangle
    const [p1, p2, p3] = triangle;

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

function rightHandTriangle(a, b, c) {
  let x = Math.max(a[0],Math.max(b[0], c[0]));
  if(a[0] == x){
    let y = Math.max(b[1], c[1]);
    if(b[1] == y) {
      return [a, b, c];
    }else{
      return [a, c, b];
    }
  }else if(b[0] == x){
    let y = Math.max(b[1], c[1]);
    if(a[1] == y) {
      return [b, a, c];
    }else{
      return [b, c, a];
    }
  }else if(c[0] == x){
    let y = Math.max(b[1], c[1]);
    if(a[1] == y) {
      return [c, a, b];
    }else{
      return [c, b, a];
    }
  }
}