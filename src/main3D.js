/*
	SCIMONK
	BETA VERSION_1.0
	BY DENNIS JÖNSSON,
	17-03-2014

*/





class DrawModes{
  fill = true;
  lines = true;
  shadow = false;
  shadowVector = [[1,0,0],[0,0,1]]; // shadow plane
  shadowTranslate = [0,-200,0]; // plane translation
  shadowColour = [50,50,50,255];
  lineColour; 
  fillColour;
  skipBackFacingTriangles = true;

  constructor(fill, lines) {
    this.fill = fill;
    this.lines = lines;
  }

  setShadow(shadow, vector, translate, colour){
    this.shadow = shadow;
    this.shadowVector = vector;
    this.shadowTranslate = translate;
    this.shadowColour = colour;
  }

  overrideLineColour(colour){
    this.lineColour = colour;
  }

  overrideFillColour(colour){
    this.fillColour = colour;
  }

  overrideSkipBackFacingTriangles(skip){
    this.skipBackFacingTriangles = skip;
  }

}

class SciMonk {
  Depth=1;
  Width=1;
  Height=1;
  CanvasHeight = 0;
  CanvasWidth = 0;
  view;
  isEditable = false;
  dividePlane = true;
  moveMax=0;

  yMove = 0;
  xMove = 0;
  zMove = 0;
  xRzRot = 0;
  yRzRot = 0;
  xRyRot = 0;
  undefinedShapeId = -1;
  it = 1;
  update = true;
  drawModes = new DrawModes(true, true, false);

  constructor(view, drawModes) {
    this.model = new Object();
    this.model.geometries = new Array();
    this.model.name="no title";
    this.model.user="Anonymous";
    this.model.modelId = 0;
    this.model.nr = 0;
    this.view = view;

    if(drawModes){
      this.drawModes = drawModes;
    }
    
    this.maxSurfaceArea = 2500;
    this.maxLineLength = Math.sqrt(this.maxSurfaceArea);
    
    this.Depth = this.view.width;
    this.Width = this.view.width;
    this.Height = this.view.height;
    this.CanvasHeight = this.view.height;
    this.CanvasWidth = this.view.width;
    this.viewPort = this.CanvasHeight/this.CanvasWidth;
    this.lightVector = [-this.Width/2,this.Height/2,-this.Depth];
    
    this.background = "#FFFFFF";
    this.lineColour = "#111111";
    this.lineWidth = 1;
    this.shadowColour = [50,50,50,200]
    this.alpha = 255;
    
    this.depthMap = new Float32Array(this.CanvasHeight*this.CanvasWidth*3);
    this.shadowMap = new Array();
    this.iniDepthMap();
    // default draw method
  }

  addGeometry(triangles, type, colour, scale, rotation) {
    var origo = getShapeOrigo(triangles);
    const geometry = new Geometry(triangles, origo, type, colour, scale, rotation, this.model.nr);
    this.model.geometries[geometry.id] = geometry;
    this.model.nr++;
  }

  add(geometry) {
     this.model.geometries.push(geometry);
  }

  rotate(vector) {
    for(let geometry of this.model.geometries){
      geometry.rotateAround(vector, [0,0,0]);
    }
  }

  render(){
    this.view.reset();
    for(let geometry of this.model.geometries) {
      for(let triangle of geometry.triangles) {

        var point;
        if(this.drawModes.skipBackFacingTriangles){
          point = this.normalIntersectsPlane(triangle, 4000, 1000, 4000);
        }
        if(point){
           //this.fill(triangle, geometry.colour, geometry.id);
           //this.nodeVector(triangle.normalVector[0], triangle.normalVector[1],[100,50,50,250],false);
          //this.cross(point, 20, [255,1,1,255]);
        }else{
          if(this.drawModes.fill){
            this.fill(triangle, this.drawModes.fillColour ? this.drawModes.fillColour : geometry.colour, geometry.id);
          }
          if(this.drawModes.lines){
            this.lines(triangle.points, this.drawModes.lineColour ? this.drawModes.lineColour : geometry.colour, geometry.id);
          }
          if(this.drawModes.shadow){
            var shadow = triangle.project(this.drawModes.shadowVector[0],this.drawModes.shadowVector[1]);
            shadow.translate1(this.drawModes.shadowTranslate);
            this.fill(shadow,this.drawModes.shadowColour,0);
          }
        }
      }
    }
    this.it++;
    this.view.update();
  }

  /**
   * Checks if the triangle normal intersects a square plane of at depth
   * 
   * @param {Triangle} triangle 
   * @param {number} width 
   * @param {number} depth 
   */
  normalIntersectsPlane(triangle, width, depth, normalLength){
    const w = width/2;
    const uv = triangle.unitVector();
    const point = planeIntersection(triangle.normalVector[0], addV(triangle.normalVector[0], Vx(uv,normalLength)), [[w,w,depth],[-w,w,depth],[-w,-w,depth],[w,-w,depth]]);
    if(((point[0] < w && point[0] > -w) && (point[1] < w && point[1] > -w)) && uv[2] > 0){
      return point;
    }
  }

  reset(){
    this.xMove = 0;
    this.yMove = 0;
    this.zMove = 0;
    this.yRzRot = 0;
    this.xRzRot = 0;
    this.xRyRot = 0;
  }


  iniDepthMap(){
    var i=0;
    var d = -this.Depth/2;
    for(i=0;i<this.CanvasWidth*this.CanvasHeight*3;i+=3){
      this.depthMap[i] = d;
      this.depthMap[i+1] = 0;
      this.depthMap[i+1] = this.undefinedShapeId; // depth, update iteration, shape id
    }
  } 

  fill(triangle, colour, id){
    colour = this.setAlpha(triangle, colour);
    var nodes = this.multipleNopdes(triangle.points); 
    this.fillTriangle(nodes,colour,id);
    //this.fillTriangle2(nodes,triangle.origin(),colour,id);
  }

  fillTriangle2(triangle, z, colour, id){
    const points = getPointsInTriangle(triangle);
    for(let i = 0; i < points.length; i ++){
      var x = points[i][0];
      var y = points[i][1];
      var Zindex = y*(this.CanvasWidth*3) + x*3;
      if(this.it > this.depthMap[ Zindex + 1] || this.depthMap[Zindex] >= z){
          this.depthMap[Zindex]=z;
          this.depthMap[Zindex + 1]=this.it;
          this.depthMap[Zindex + 2]=id;
          this.setPixel(
          x, 
          y, 
          colour[0],colour[1],colour[2],colour[3]);
      }
    }

  }

  fillTriangle(plane,colour,id){
    var a = [plane[1][0]-plane[0][0],plane[1][1]-plane[0][1]];
    var az = plane[1][2]-plane[0][2];

    var b = [plane[0][0]-plane[2][0],plane[0][1]-plane[2][1]];
    var bz = plane[0][2]-plane[2][2];

    this.lineFillTriangle(plane[2],b,bz,plane[0],a,az,colour,id);
  }

  lines=function(nodes, colour, alpha){
    if(nodes.length == 2){ // Line
      this.nodeVector(nodes[0], nodes[1], colour, alpha);
    }else if(nodes.length > 2){ // Triangle
      this.nodeVector(nodes[0], nodes[1], colour, alpha);
      this.nodeVector(nodes[1], nodes[2], colour, alpha);
      this.nodeVector(nodes[2], nodes[0], colour, alpha);
    }
  }

  lineFillTriangle(u,ux,uxZ,v,vx,vxZ,colour,id){
    var i = 0;
    var uxLen = vLen(ux)*1.5;
    for(i=0;i<uxLen;i++){
      this.drawLine(
      u[0] + ux[0]/uxLen*i, 
      v[0] + vx[0],
      u[1] + ux[1]/uxLen*i,
      v[1] + vx[1],
      u[2] + uxZ/uxLen*i,
      v[2] + vxZ,
      colour,id);//-
    }
  }
  
  /*
    computes the 2D position
  */
  to2D(cords){
    return [this.zRx(cords[0],cords[2])|0, 
        this.zRy(cords[1],cords[2])|0,
        cords[2]];
  }

  /*
    NODES

  */
  multipleNopdes(nodes){
    var i =0;
    var newNodes = new Array();
    for(i=0;i<nodes.length;i++){
      newNodes[i] = this.to2D(nodes[i]);
    }
    return newNodes;
  }

  nodeVector(node1, node2, colour, alpha){
    var uv = uToV(node1,node2);
    if(vLen(uv)>25){
      this.nodeVector(node1,addV(node1,Vx(uv,0.5)),colour, alpha);
      this.nodeVector(addV(node1,Vx(uv,0.5)),node2,colour, alpha);
    }else{
      if(!colour){
        colour = [10,10,10,250];
      }
      if(alpha){
        colour[3] = 250;
      }
      var as = this.to2D(node1);
      var bs = this.to2D(node2);
      this.drawLine(as[0],bs[0],as[1],bs[1],as[2],bs[2],colour);
    }
  }

  /*
    UNTRANSFORMED NODE
    Returns a rotated and translated node 
    without transforming it

  */
  uNode(cord){
    return addV(this.rotateNode(cord,[this.xRzRot,this.yRzRot,this.xRyRot],[0,0,0]),
          [this.xMove,this.yMove,this.zMove]);
  }

  uPlane(plane){
    var i = 0;
    var uPlane = new Array();
    for(i=0;i<plane.length;i++){
      uPlane[i] = this.uNode(plane[i]);
    }
    return uPlane;
  }

  /*
    ROTATION
  */
  rotateNode(node,rad,origo){
    return this.rotateNodeT(
          this.rotateNodeT(
            this.rotateNodeT(node,origo,this.XZrot(rad[0])),
              origo,this.YZrot(rad[1])),
            origo,this.XYrot(rad[2]));
  }

  rotateNodeT(node,origo,matrix){
    return addV(origo,Ab(matrix,uToV(origo,node)));
  }

  XZrot(a){
    return [[Math.cos(a),0,-Math.sin(a)],[0,1,0],[Math.sin(a),0,Math.cos(a)]];
  }

  YZrot(a){
    return [[1,0,0],[0,Math.cos(a),Math.sin(a)],[0,-Math.sin(a),Math.cos(a)]];
  }

  XYrot(a){
    return [[Math.cos(a),Math.sin(a),0],[-Math.sin(a),Math.cos(a),0],[0,0,1]];
  }

  /*
	TRANSLATE

  */


  /**
   * PERSPECTIVE
   */
  
  /*
    X COORDINATE ON CANVAS

  */
  xOnCanvas(x){
    return (this.CanvasWidth/this.Width)*x;
  }

  /*
    Y COORDINATE ON CANVAS

  */
  yOnCanvas(y){
    return this.CanvasHeight - (this.CanvasHeight/this.Height)*y;
  }


  /*
    X ON GRAPH

  */
  xGraph(x){
    return x - (this.Width/2);
  }

  /*
    Y ON GRAPH

  */
  yGraph(y){
    return (y - (this.Height/2));
  }

  /*
    X TO GRAPH
    From view to graph coordinate

  */
  xToGraph(x){
    return (this.Width/this.CanvasWidth*(x - (this.CanvasWidth/2)))*0.5;
  }

  /*
    Y TO GRAPH
    From view to graph coordinate

  */
  yToGraph(y){
    return (this.Height/this.CanvasHeight*(y - (this.CanvasHeight/2))*-1)*0.5;
  }

  // ----------------------------- Z Metrics -------------------------------
  /*
    X ANGLE
    Returns the angle between an x coordinate and origo.
  */
  xAngle( x, max ){
    x = x*max; // INFO: Spread a thinner angle over a larger area. When max is 0.5 and x is 10, x will be given as 10*0.5 = 5
    x = (2*x)/this.Width;
    return Math.acos(x);
  }

  /*
    Y ANGLE
    Returns the angle between an y coordinate and origo.
    
  */
  yAngle (y, max){
    y = y*max; // Spread a thinner angle over a larger area.
    y = (2*y)/this.Height;
    return Math.asin(y);
  }

  /*
    X PERSPECTIVE
    Gives a point on the x axis relative to the depth in z  
    
  */
  zRx(x,z){
    z = z + this.Depth/2;
    x = x + this.Width/2;       
    return this.xOnCanvas(
        x + ((this.Depth-z)*(this.Depth/(z)))*Math.cos(this.xAngle(this.xGraph(x),0.5))
      );
  }

  /*
    Y PERSPECTIVE
    Gives a point on the y axis relative to the depth in z  

  */
  zRy(y,z){
    z = z + this.Depth/2; 
    y = y + this.Height/2;	
    return this.yOnCanvas(
        y + ((this.Depth-z)*(this.Depth/(z)))*Math.sin(this.yAngle(this.yGraph(y),0.5))
      );
  } 

  /*
	  Z COORDINAT ON MAP
  */
  zOnMap(z){
    return (this.CanvasWidth/this.Depth)*z;
  }

  /**
   * DRAWING 
   */


  drawLine( x1, x2, y1, y2, z1, z2, co, id) {
    var u =[x1,y1];
    var v =[x2,y2];
    var uv = uToV(u,v);
    var len = vLen(uv)*1.2;
    var w = (z2-z1)/len;// Depth test
    var t =0;
    var Z = this.Depth/3;
    for(t=0;t<len;t++){
      var x = u[0]+uv[0]/len*t|0;
      var y = u[1]+uv[1]/len*t|0;
      var z = z1 + w*t;
      var Zindex = y*(this.CanvasWidth*3) + x*3;
      if( ((x > 0 && x < this.CanvasWidth) && ( y > 0 && y < this.CanvasHeight)) && (z > -Z) ){
        //Depth test
        if(this.it > this.depthMap[ Zindex + 1] || this.depthMap[Zindex] >= z){ 
          this.depthMap[Zindex]=z;
          this.depthMap[Zindex + 1]=this.it;
          this.depthMap[Zindex + 2]=id;
          this.setPixel(
          x, 
          y, 
          co[0],co[1],co[2],co[3]);
        }
      }
    }
  }

  setPixel(x, y, r, g, b, a) {
    this.view.setPixel(x, y, r, g, b, a);
  }

  setAlpha(tringle,colour){
    var origo = tringle.origin();
    var normal = planeNormal(tringle.points,origo);
    
    var lv = uToV(origo,Vx(this.lightVector,0.5));
    var nv = uToV(origo,addV(origo,normal));
    
    var persp = uToV([0,0,-this.Depth/2],origo)
    var nv1 = vectorAngle(nv,persp);
    var nv2 = vectorAngle(uToV(origo,addV(origo,Vx(normal,-1))),persp);
    
    var a=0;
    if(nv1 <= nv2)
    a = vectorAngle(nv,lv);
    else
    a = vectorAngle(Vx(nv,-1),lv);
    
    return [Math.max(colour[0]-55*Math.cos(a),1), 
            Math.max(colour[1]-55*Math.cos(a),1),
            Math.max(colour[2]-55*Math.cos(a),1),
            200+55*Math.cos(a)];
  }

  cross=function(node,w,colour){
    w = w/2;
    this.nodeVector([node[0]-w,node[1],node[2]],[node[0]+w,node[1],node[2]], colour, false);
    this.nodeVector([node[0],node[1]-w,node[2]],[node[0],node[1]+w,node[2]], colour, false);
    this.nodeVector([node[0],node[1],node[2]-w],[node[0],node[1],node[2]+w], colour, false);
  }

  castShadow(nodes){
    return translateNodes(nodesXm(nodes,[[1,0,0],[0,0,0],[0,0,1]]),this.drawModes.shadowVector);
  }

  objectsToImages(objects){
    this.reset();
    var old = this.draw;
    var i = 0;
    var imgs = new Array();
    for(i = 0;i<objects.length;i++){
      this.draw = function(){
        batchColourMapShapes(objects[i].shapes);
      }
      this.update=true;
      this.render();
      imgs[i] = document.createElement("img");
      imgs[i].src = this.Canvas.toDataURL("image/png");
    }
    this.draw = old;
    this.update=true;
    return imgs;

  }


  parseSTL(arrayBuffer){
    // Header (80 bytes) and number of triangles (4 bytes) 0 - 83
    // Each triangle is 50 bytes unit vector (12 bytes), 3 points (12 bytes), and attribute count (2 bytes)
    const result = new Array();
    for(var i = 84; i < arrayBuffer.byteLength; i += 50) {
      const points = new Float32Array(arrayBuffer.slice(i, i+48));
      const triangle = new Triangle([[points[3],points[4],points[5]], [points[6],points[7],points[8]], [points[9],points[10],points[11]]]);
      triangle.setNormal([points[0],points[1],points[2]]);
      result.push(triangle);

    }
    return new Geometry(result, "imported_stl", [1,1,1,255], 1);
  }

  writeSTL(){
    var triangles = new Array();
    for(let model of sciMonk.model.geometries) {
      triangles = triangles.concat(model.triangles);
    }

    const count = triangles.length;
    const bufferLength = 84 + count*50;
    const buffer = new ArrayBuffer(bufferLength);
    const dataView = new DataView(buffer);
    var j = 0;
    dataView.setUint32(80, count, true); // UINT32       – Number of triangles    -      4 bytes
    for(var i = 84; i < buffer.byteLength; i+= 50){
      var points = triangles[j].points;
      const normalUnitVector = triangles[j].unitVector();
      // REAL32[3] – Normal vector - 12 bytes

      dataView.setFloat32(i, normalUnitVector[0], true);
      dataView.setFloat32(i + 4, normalUnitVector[1], true);
      dataView.setFloat32(i + 8, normalUnitVector[2], true);
      // triangles
      dataView.setFloat32(i + 12, points[0][0], true);
      dataView.setFloat32(i + 16, points[0][1], true);
      dataView.setFloat32(i + 20, points[0][2], true);
      dataView.setFloat32(i + 24, points[1][0], true);
      dataView.setFloat32(i + 28, points[1][1], true);
      dataView.setFloat32(i + 32, points[1][2], true);
      dataView.setFloat32(i + 36, points[2][0], true);
      dataView.setFloat32(i + 40, points[2][1], true);
      dataView.setFloat32(i + 44, points[2][2], true);
      j++;
    }

    return buffer;
  }

  parseJson(json){
    const triangles = new Array();
    for(var i = 0; i < (json.vertices.length - 2); i+=3){
      triangles.push(new Triangle([json.vertices[i],json.vertices[i+1],json.vertices[i+2]]));
    }
    return new Geometry(triangles, [1,1,1,255], 1);
  }

  toHexColour(colour){
    return "#"+this.decToHex(colour[0])+this.decToHex(colour[1])+this.decToHex(colour[2]); 
  }

  decToHex(input){
    var output = "";
    var value = input;
    var quotient = 1;
    var remainder = 0;
    while (quotient != 0){
      quotient = 0;
      if (((value - 16) > 0)){
        quotient = (value - value%16) / 16;
        remainder = (value %= (quotient * 16));
        value = quotient;
      }else{
        remainder = value;
      }
      output = this.hexParse(remainder) + output;
    }
    return output;
  }

  hexParse(dec){
    if(dec >= 10 && dec <=15){
        var d = dec%10;
        return "abcdef".substring(d,d+1);
    }else if(dec == 16)
      return 10;
    else{
      return dec;
    }
  }


}

//var sciMonk = new SciMonk();

/**
 * Check if a point is inside a triangle using barycentric coordinates.
 * @param {number[]} p - The point [x, y].
 * @param {number[]} v0 - First vertex of the triangle [x, y].
 * @param {number[]} v1 - Second vertex of the triangle [x, y].
 * @param {number[]} v2 - Third vertex of the triangle [x, y].
 * @returns {boolean} - True if the point is inside the triangle, false otherwise.
 */
function isPointInTriangle(p, v0, v1, v2) {
    const [x, y] = p;
    const [x0, y0] = v0;
    const [x1, y1] = v1;
    const [x2, y2] = v2;

    // Compute vectors
    const v0v1 = [x1 - x0, y1 - y0];
    const v0v2 = [x2 - x0, y2 - y0];
    const v0p = [x - x0, y - y0];

    // Compute dot products
    const dot00 = v0v2[0] * v0v2[0] + v0v2[1] * v0v2[1];
    const dot01 = v0v2[0] * v0v1[0] + v0v2[1] * v0v1[1];
    const dot02 = v0v2[0] * v0p[0] + v0v2[1] * v0p[1];
    const dot11 = v0v1[0] * v0v1[0] + v0v1[1] * v0v1[1];
    const dot12 = v0v1[0] * v0p[0] + v0v1[1] * v0p[1];

    // Compute barycentric coordinates
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return u >= 0 && v >= 0 && u + v <= 1;
}

/**
 * Get all discrete points within a triangle.
 * @param {number[][]} triangle - An array of three vertices, each a 2D point [x, y].
 * @returns {number[][]} - A 2D array of all discrete points inside the triangle.
 */
function getPointsInTriangle(triangle) {
    const [v0, v1, v2] = triangle;

    // Determine the bounding box of the triangle
    const minX = Math.min(v0[0], v1[0], v2[0]);
    const maxX = Math.max(v0[0], v1[0], v2[0]);
    const minY = Math.min(v0[1], v1[1], v2[1]);
    const maxY = Math.max(v0[1], v1[1], v2[1]);

    const points = [];

    // Iterate through all points in the bounding box
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
        for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
            if (isPointInTriangle([x, y], v0, v1, v2)) {
                points.push([x, y]);
            }
        }
    }

    return points;
}

/**
 * Creates and returns a copy of the given array.
 * @param {Array} array - The array to copy.
 * @returns {Array} - A new array that is a copy of the input array.
 */
function copyArray(array) {
    return array.slice();
}

