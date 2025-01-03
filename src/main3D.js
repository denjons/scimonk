
/*
	SCIMONK
	BETA VERSION_1.0
	BY DENNIS JÖNSSON,
	17-03-2014

*/

class SciMonk {
  Depth=1;
  Width=1;
  Height=1;
  CanvasHeight = 0;
  CanvasWidth = 0;
  imageData;
  Canvas;
  Ctx;
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

  constructor(){
    this.model = new Object();
    this.model.geometries = new Array();
    this.model.name="no title";
    this.model.user="Anonymous";
    this.model.modelId = 0;
    this.model.nr = 0;
  }

  init(canvas){
    this.Canvas = canvas;
    this.Ctx = this.Canvas.getContext("2d");
    this.shadow = false;
    this.shadowVector = [0,0,0];
    
    this.maxSurfaceArea = 2500;
    this.maxLineLength = Math.sqrt(this.maxSurfaceArea);
    
    this.Depth = this.Canvas.width;
    this.Width = this.Canvas.width;
    this.Height = this.Canvas.height;
    this.CanvasHeight = this.Canvas.height;
    this.CanvasWidth = this.Canvas.width;
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
    this.draw=function draw(){
      
    };
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
    this.sequenceStart();
    this.draw();
    for(let geometry of this.model.geometries){
      for(let triangle of geometry.triangles) {
        
        //this.lines(triangle.points, geometry.colour, geometry.id);
        // render normal vector of triangle
        //this.nodeVector(triangle.normalVector[0], triangle.normalVector[1],[100,50,50,250],false);

        const point = this.normalIntersectsPlane(triangle, 3000, 1000)
        if(point){
         // this.cross(point, 20, [255,1,1,255]);
        }else{
          this.fill(triangle, geometry.colour, geometry.id);
        }
      }
    }

    this.it++;
    this.sequenceEnd();
  }

  /**
   * Checks if the triangle normal intersects a square plane of at depth
   * 
   * @param {Triangle} triangle 
   * @param {number} width 
   * @param {number} depth 
   */
  normalIntersectsPlane(triangle, width, depth){
    const w = width/2;
    const uv = triangle.unitVector();
    const point = planeIntersection(triangle.normalVector[0], addV(triangle.normalVector[0], Vx(uv,depth*2)), [[w,w,depth],[-w,w,depth],[-w,-w,depth],[w,-w,depth]]);
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


  sequenceEnd(){
    /*
  	this.Ctx.lineWidth = sciMonk.lineWidth;
		this.Ctx.strokeStyle = sciMonk.lineColour;
		this.Ctx.closePath(); 
		this.Ctx.stroke();
    */
    this.Ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
  }

  sequenceStart(){
    /*
    this.Ctx.beginPath();
		this.Ctx.fillStyle = sciMonk.background;
		this.Ctx.fillRect( 0, 0, Canvas.width, Canvas.height );
    */
    this.imageData = this.Ctx.createImageData(this.Width, this.Height); 
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

  fillTriangle(plane,colour,id){
    var a = [plane[1][0]-plane[0][0],plane[1][1]-plane[0][1]];
    var az = plane[1][2]-plane[0][2];

    var b = [plane[0][0]-plane[2][0],plane[0][1]-plane[2][1]];
    var bz = plane[0][2]-plane[2][2];

    this.lineFillTriangle(plane[2],b,bz,plane[0],a,az,colour,id);
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
    NODE
    computes the position of a node

  */
  node(cords,xRzR,yRzR,xRyR){
    var xyz=addV(this.rotateNode(cords,[xRzR,yRzR,xRyR],[0,0,0]),
          [this.xMove,this.yMove,this.zMove]);
    return [this.zRx(xyz[0],xyz[2])|0, 
        this.zRy(xyz[1],xyz[2])|0,
        xyz[2]];
  }

  /*
    NODES

  */
  multipleNopdes(nodes){
    var i =0;
    var newNodes = new Array();
    for(i=0;i<nodes.length;i++){
      newNodes[i] = this.node(nodes[i], this.xRzRot,this.yRzRot,this.xRyRot);
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
      var as = this.node(node1,this.xRzRot,this.yRzRot,this.xRyRot);
      var bs = this.node(node2,this.xRzRot,this.yRzRot,this.xRyRot);
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
    C NODE
    Returns a regular node.

  */
  cNode(cords){
    return this.node(cords[0],cords[1],cords[2],
    this.xRzRot,this.yRzRot,this.xRyRot)
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
    From canvas to graph coordinate

  */
  xToGraph(x){
    return (this.Width/this.CanvasWidth*(x - (this.CanvasWidth/2)))*0.5;
  }

  /*
    Y TO GRAPH
    From canvas to graph coordinate

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

  setPixel( x, y, r, g, b, a) {
    const index = (x + y * this.imageData.width) * 4;
    this.imageData.data[index+0] = r;
    this.imageData.data[index+1] = g;
    this.imageData.data[index+2] = b;
    this.imageData.data[index+3] = a;
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
    
    return [colour[0] , 
        colour[1] ,
        colour[2],
        200+55*Math.cos(a)];
  }

  cross=function(node,w,colour){
    w = w/2;
    this.nodeVector([node[0]-w,node[1],node[2]],[node[0]+w,node[1],node[2]], colour, false);
    this.nodeVector([node[0],node[1]-w,node[2]],[node[0],node[1]+w,node[2]], colour, false);
    this.nodeVector([node[0],node[1],node[2]-w],[node[0],node[1],node[2]+w], colour, false);
  }

  castShadow(nodes){
    return translateNodes(nodesXm(nodes,[[1,0,0],[0,0,0],[0,0,1]]),this.shadowVector);
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

  objectToImage(object){
    this.reset();
    var old = this.draw;
    this.draw = function(){
      batchColourMapShapes(objects[i].shapes);
    }
    this.update=true;
    render();
    var img = document.createElement("img");
    img.src = Canvas.toDataURL("image/png");
    this.draw = old;
    this.update=true;
    return imgs;
  }

  parseSTL(arrayBuffer){
    // Header (80 bytes) and number of triangles (4 bytes) 0 - 83
    // Each triangle is 50 bytes unit vector (12 bytes), 3 points (12 bytes), and attribute count (2 bytes)
    const result = new Array();
    for(var i = 84; i < arrayBuffer.byteLength; i += 50) {
      var points = new Float32Array(arrayBuffer.slice(i, i+48));
      result.push(new Triangle([[points[3],points[4],points[5]], [points[6],points[7],points[8]], [points[9],points[10],points[11]]]));
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
}

var sciMonk = new SciMonk();

