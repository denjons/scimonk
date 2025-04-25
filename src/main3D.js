import { Geometry, Triangle } from './v3/geometry.js';
import { DrawModes } from './modes.js';
import { Plane } from './v3/plane.js';
import { Light, LightSource } from './v3/light.js';

export class SciMonk {
  view;
  drawModes = new DrawModes(true, true, false);
  plane = new Plane([-1000,-1000,1000,0,1000,1000,1000,-1000,1000], {width: 5000});

  constructor(view, drawModes, light) {
    this.model = new Object();
    this.model.geometries = new Array();
    this.view = view;
    this.light = light || new Light(
    [
      new LightSource(new Plane([1000,-1000,-500, 1000,1000,0, 1000,-1000,500], {width: 10000}), [200,200,200,255]),
    ], 
    {shadow: [0,0,0]});

    if(drawModes){
      this.drawModes = drawModes;
    }
  }

  add(geometry) {
     this.model.geometries.push(geometry);
  }

  addText(text, properties) {
    this.view.addText(text, properties);
  }


  rotate(vector) {
    for(let geometry of this.model.geometries){
      geometry.rotateAround(vector, [0,0,0]);
    }
  }

  scale(vector) {
    for(let geometry of this.model.geometries){
      geometry.scale(vector);
    }
  }

  triangles = 0;

  render(){
    this.view.reset();
    this.triangles = 0;
    for(let geometry of this.model.geometries) {
      for(let triangle of geometry.triangles) {
        //this.view.nodeVector(triangle.normalVector[0], triangle.normalVector[1],[100,50,50,250],false);
        var point;
        if(this.drawModes.skipBackFacingTriangles){
          point = this.plane.normalIntersectsPlane(triangle, 4000);
        }
        if(!point){
          if(geometry.drawModes ? geometry.drawModes.fill : this.drawModes.fill){
            this.triangles++;
            var colour = this.light.setLight(triangle, this.drawModes.fillColour ? this.drawModes.fillColour : geometry.colour);
            this.view.fill(triangle, colour, geometry.id);
          }
          if(geometry.drawModes ? geometry.drawModes.lines : this.drawModes.lines){
            this.view.lines(triangle, this.drawModes.lineColour ? this.drawModes.lineColour : geometry.colour, geometry.id);
          }
          if(this.drawModes.shadow){
            var shadow = triangle.project(this.drawModes.shadowVector[0],this.drawModes.shadowVector[1]);
            shadow.translate1(this.drawModes.shadowTranslate);
            this.view.fill(shadow,this.drawModes.shadowColour,0);
          }
        }else{
          //this.fill(triangle, geometry.colour, geometry.id);
          //this.view.nodeVector(triangle.origin(), point, [100,50,50,250]);
          //this.view.cross(point, 20, [255,1,1,255]);
        }
      }
    }
    this.view.update();
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



  parseSTL(arrayBuffer, colour){
    // Header (80 bytes) and number of triangles (4 bytes) 0 - 83
    // Each triangle is 50 bytes unit vector (12 bytes), 3 points (12 bytes), and attribute count (2 bytes)
    const result = new Array();
    for(var i = 84; i < arrayBuffer.byteLength; i += 50) {
      const points = new Float32Array(arrayBuffer.slice(i, i+48));
      const triangle = new Triangle([[points[3],points[4],points[5]], [points[6],points[7],points[8]], [points[9],points[10],points[11]]]);
      triangle.setNormal([points[0],points[1],points[2]]);
      result.push(triangle);

    }
    return new Geometry(result, "imported_stl", colour, 1);
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

}

//var sciMonk = new SciMonk();



