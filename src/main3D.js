/*
	SCIMONK
	BETA VERSION_1.0
	BY DENNIS JÖNSSON,
	17-03-2014

*/

import { Geometry, Triangle } from './geometry.js';
import { 
  addV, Vx, planeIntersection, planeNormal, uToV,
  vectorAngle
} from './graph.js';
import { DrawModes } from './modes.js';

export class SciMonk {
  view;
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
    
    this.lightVector = [-this.view.width/2,this.view.height/2,-this.view.Depth];
    this.alpha = 255;

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
        //this.view.nodeVector(triangle.normalVector[0], triangle.normalVector[1],[100,50,50,250],false);
        var point;
        if(this.drawModes.skipBackFacingTriangles){
          point = this.normalIntersectsPlane(triangle, 4000, -1000, 100000);
        }
        if(!point){
          if(geometry.drawModes ? geometry.drawModes.fill : this.drawModes.fill){
            var colour = this.setAlpha(triangle, this.drawModes.fillColour ? this.drawModes.fillColour : geometry.colour);
            this.view.fill(triangle, colour, geometry.id);
          }
          if(geometry.drawModes ? geometry.drawModes.lines : this.drawModes.lines){
            this.view.lines(triangle.points, this.drawModes.lineColour ? this.drawModes.lineColour : geometry.colour, geometry.id);
          }
          if(this.drawModes.shadow){
            var shadow = triangle.project(this.drawModes.shadowVector[0],this.drawModes.shadowVector[1]);
            shadow.translate1(this.drawModes.shadowTranslate);
            this.view.fill(shadow,this.drawModes.shadowColour,0);
          }
        }else{
          //this.fill(triangle, geometry.colour, geometry.id);
          //this.cross(point, 20, [255,1,1,255]);
        }
      }
    }
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




  /*
    X TO GRAPH
    From view to graph coordinate

  */
  xToGraph(x){
    return (this.view.width/this.view.width*(x - (this.view.width/2)))*0.5;
  }

  /*
    Y TO GRAPH
    From view to graph coordinate

  */
  yToGraph(y){
    return (this.view.height/this.view.height*(y - (this.view.height/2))*-1)*0.5;
  }

  // ----------------------------- Z Metrics -------------------------------

  /*
	  Z COORDINAT ON MAP
  */
  zOnMap(z){
    return (this.view.width/this.Depth)*z;
  }

  setAlpha(tringle,colour){
    var origo = tringle.origin();
    var normal = planeNormal(tringle.points,origo);
    
    var lv = uToV(origo,Vx(this.lightVector,0.5));
    var nv = uToV(origo,addV(origo,normal));
    
    var persp = uToV([0,0,-this.view.Depth/2],origo)
    var nv1 = vectorAngle(nv,persp);
    var nv2 = vectorAngle(uToV(origo,addV(origo,Vx(normal,-1))),persp);
    
    var a=0;
    if(nv1 <= nv2)
    a = vectorAngle(nv,lv);
    else
    a = vectorAngle(Vx(nv,-1),lv);
    
    return [Math.max(colour[0]-100*Math.cos(a),1), 
            Math.max(colour[1]-100*Math.cos(a),1),
            Math.max(colour[2]-100*Math.cos(a),1),
            200+55*Math.cos(a)];
  }

  cross=function(node,w,colour){
    w = w/2;
    this.nodeVector([node[0]-w,node[1],node[2]],[node[0]+w,node[1],node[2]], colour, false);
    this.nodeVector([node[0],node[1]-w,node[2]],[node[0],node[1]+w,node[2]], colour, false);
    this.nodeVector([node[0],node[1],node[2]-w],[node[0],node[1],node[2]+w], colour, false);
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
    for(let model of this.model.geometries) {
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



