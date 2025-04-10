import { 
  addV, Vx, vLen, uToV,
} from './graph.js';

export class ScimonkView {
  imageData;
  width = 0;
  height = 0;
  canvas;
  ctx;
  backgroundColour = [200,150,150,255];
  it = 1;
  undefinedShapeId = -1;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.Depth = this.width;
    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.data = this.imageData.data;
    this.depthMap = new Float32Array(this.width*this.height*3);
    this.iniDepthMap();
  }

  resetFill(colur) {
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = colur[0];
      this.imageData.data[i + 1] = colur[1];
      this.imageData.data[i + 2] = colur[2];
      this.imageData.data[i + 3] = colur[3];
    }
  }

  // Resets the image to the background colour
  reset(){
    this.resetFill(this.backgroundColour);
    //this.imageData = this.ctx.createImageData(this.width, this.height); 
  }

  // updates the image with the recent changes
  update(){
    this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
    this.it++;
  }

  // clears the image
  finish(){
    // 
  }

  iniDepthMap(){
    var i=0;
    var d = -this.Depth/2;
    for(i=0;i<this.width*this.height*3;i+=3){
      this.depthMap[i] = d;
      this.depthMap[i+1] = 0;
      this.depthMap[i+2] = this.undefinedShapeId; // depth, update iteration, shape id
    }
  }

  points2D = new Float32Array(9);
  ux = new Float32Array(3);
  vx = new Float32Array(3);
  uxZ = 0;
  vxZ = 0;

  // ----

  lu = new Float32Array(2);
  lv = new Float32Array(2);
  luv = new Float32Array(2);
  lx = 0;
  ly = 0;
  lz = 0;
  lZIndex = 0;
  lIndex = 0;
  lw = 0;
  lZ = 0;
  x1 = 0;
  y1 = 0;
  z1 = 0;
  x2 = 0;
  y2 = 0;
  z2 = 0;
  co = new Float32Array(4);

  fill(triangle, colour, id) {
    // Copy the colour to the co array
    this.co[0] = colour[0];
    this.co[1] = colour[1];
    this.co[2] = colour[2];
    this.co[3] = colour[3];

    // Convert points to 2D in place
    this.points2D[0] = this.zRx(triangle.points[0][0], triangle.points[0][2])|0;
    this.points2D[1] = this.zRy(triangle.points[0][1], triangle.points[0][2])|0;
    this.points2D[2] = triangle.points[0][2];
    this.points2D[3] = this.zRx(triangle.points[1][0], triangle.points[1][2])|0;
    this.points2D[4] = this.zRy(triangle.points[1][1], triangle.points[1][2])|0;
    this.points2D[5] = triangle.points[1][2];
    this.points2D[6] = this.zRx(triangle.points[2][0], triangle.points[2][2])|0;
    this.points2D[7] = this.zRy(triangle.points[2][1], triangle.points[2][2])|0;
    this.points2D[8] = triangle.points[2][2];

    // Calculate vectors
    this.ux[0] = this.points2D[0] - this.points2D[6];
    this.ux[1] = this.points2D[1] - this.points2D[7];
    this.uxZ = triangle.points[0][2] - triangle.points[2][2];

    this.vx[0] = this.points2D[3] - this.points2D[0];
    this.vx[1] = this.points2D[4] - this.points2D[1];
    this.vxZ = triangle.points[1][2] - triangle.points[0][2];

    this.x2 = this.points2D[0] + this.vx[0];
    this.y2 = this.points2D[1] + this.vx[1];
    this.z2 = this.points2D[2] + this.vxZ;

    const uxLen = Math.sqrt(this.ux[0] * this.ux[0] + this.ux[1] * this.ux[1]);
    const lZ = this.Depth/3;

    for(let i = 0; i < uxLen; i++) {
      this.x1 = this.points2D[6] + this.ux[0]/uxLen * i;
      this.y1 = this.points2D[7] + this.ux[1]/uxLen * i;
      this.z1 = this.points2D[8] + this.uxZ/uxLen * i;
      
      this.luv[0] = this.x2 - this.x1;
      this.luv[1] = this.y2 - this.y1;
      
      const len = Math.sqrt(this.luv[0] * this.luv[0] + this.luv[1] * this.luv[1]);
      this.lw = (this.z2 - this.z1)/len;

      for(let t = 0; t < len; t++) {
        this.lx = this.x1 + this.luv[0]/len * t|0;
        this.ly = this.y1 + this.luv[1]/len * t|0;
        this.lz = this.z1 + this.lw * t;
        
        if(this.lx > 0 && this.lx < this.width && 
           this.ly > 0 && this.ly < this.height && 
           this.lz > -lZ) {
          
          this.lZIndex = this.ly * (this.width * 3) + this.lx * 3;
          if(this.it > this.depthMap[this.lZIndex + 1] || 
             this.depthMap[this.lZIndex] >= this.lz) {
            
            this.depthMap[this.lZIndex] = this.lz;
            this.depthMap[this.lZIndex + 1] = this.it;
            this.depthMap[this.lZIndex + 2] = id;

            this.lIndex = (this.lx + this.ly * this.width) * 4;
            this.data[this.lIndex] = this.co[0];
            this.data[this.lIndex + 1] = this.co[1];
            this.data[this.lIndex + 2] = this.co[2];
            this.data[this.lIndex + 3] = this.co[3];
          }
        }
      }
    }
  }

  lines=function(triangle, colour){
    this.nodeVector(triangle.points[0], triangle.points[1], colour);
    this.nodeVector(triangle.points[1], triangle.points[2], colour);
    this.nodeVector(triangle.points[2], triangle.points[0], colour);
  }

  nodeVector(node1, node2, colour){
    var as = this.to2D(node1);
    var bs = this.to2D(node2);
    this.drawLine(as[0],bs[0],as[1],bs[1],as[2],bs[2],colour);
  }

  drawLine( x1, x2, y1, y2, z1, z2, colour, id) {
    this.co[0] = colour[0];
    this.co[1] = colour[1];
    this.co[2] = colour[2];
    this.co[3] = colour[3];

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.luv[0] = this.x2 - this.x1;
    this.luv[1] = this.y2 - this.y1;

    // vector length
    var len = Math.sqrt(this.luv[0]*this.luv[0] + this.luv[1]*this.luv[1])*1;
    // depth test
    this.lw = (z2-z1)/len;
    this.lZ = this.Depth/3;

    for(let t=0;t<len;t++){
      this.lx = this.x1+this.luv[0]/len*t|0;
      this.ly = this.y1+this.luv[1]/len*t|0;
      this.lz = z1 + this.lw*t;
      if( ((this.lx > 0 && this.lx < this.width) && ( this.ly > 0 && this.ly < this.height)) && (this.lz > -this.lZ) ){
        //Depth test
        this.lZIndex = this.ly*(this.width*3) + this.lx*3;
        if(this.it > this.depthMap[ this.lZIndex + 1] || this.depthMap[this.lZIndex] >= this.lz){ 
          this.depthMap[this.lZIndex]=this.lz;
          this.depthMap[this.lZIndex + 1]=this.it;
          this.depthMap[this.lZIndex + 2]=id;

          this.lIndex = (this.lx + this.ly * this.width) * 4;
          this.data[this.lIndex+0] = this.co[0];
          this.data[this.lIndex+1] = this.co[1];
          this.data[this.lIndex+2] = this.co[2];
          this.data[this.lIndex+3] = this.co[3];
        }
      }
    }
  }

  convertTo2D(points){
    var i =0;
    var points2D = new Array();
    for(i=0;i<points.length;i++){
      points2D[i] = this.to2D(points[i]);
    }
    return points2D;
  }

  zRx(x,z){
    z = z + this.Depth/2;
    x = x + this.width/2;       
    return this.xOnCanvas(
        x + ((this.Depth-z)*(this.Depth/(z)))*Math.cos(this.xAngle(this.xGraph(x),0.5))
      );
  }

  zRy(y,z){
    z = z + this.Depth/2; 
    y = y + this.height/2;	
    return this.yOnCanvas(
        y + ((this.Depth-z)*(this.Depth/(z)))*Math.sin(this.yAngle(this.yGraph(y),0.5))
      );
  }

  /*
    X ON GRAPH

  */
  xGraph(x){
    return x - (this.width/2);
  }

  /*
    Y ON GRAPH

  */
  yGraph(y){
    return (y - (this.height/2));
  }

  /*
    X ANGLE
    Returns the angle between an x coordinate and origo.
  */
  xAngle( x, max ){
    x = x*max; // INFO: Spread a thinner angle over a larger area. When max is 0.5 and x is 10, x will be given as 10*0.5 = 5
    x = (2*x)/this.width;
    return Math.acos(x);
  }

  /*
    Y ANGLE
    Returns the angle between an y coordinate and origo.
    
  */
  yAngle (y, max){
    y = y*max; // Spread a thinner angle over a larger area.
    y = (2*y)/this.height;
    return Math.asin(y);
  }

  xOnCanvas(x){
    return (this.width/this.width)*x;
  }

  yOnCanvas(y){
    return this.height - (this.height/this.height)*y;
  }



  to2D(cords){
    return [this.zRx(cords[0],cords[2])|0, 
        this.zRy(cords[1],cords[2])|0,
        cords[2]];
  }
 

}


export class ScimonkGifView {
  imageData;
  width = 0;
  height = 0;
  canvas;
  ctx;
  backgroundColour = [200, 150, 150, 255];
  frames = [];
  gif = null;

  constructor(canvas, delay = 100) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.delay = delay;
  }

  fill(colour) {
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = colour[0];
      this.imageData.data[i + 1] = colour[1];
      this.imageData.data[i + 2] = colour[2];
      this.imageData.data[i + 3] = colour[3];
    }
  }

  // Resets the view to the background colour
  reset() {
    this.fill(this.backgroundColour);
  }

  setPixel(x, y, r, g, b, a) {
    const index = (x + y * this.imageData.width) * 4;
    this.imageData.data[index + 0] = r;
    this.imageData.data[index + 1] = g;
    this.imageData.data[index + 2] = b;
    this.imageData.data[index + 3] = a;
  }

  // updates the view with the recent changes
  update() {
    this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
    // Store the current frame
    this.frames.push(this.ctx.getImageData(0, 0, this.width, this.height));
  }

  // Creates the gif when all images have been added
  finish(filename = "output.gif") {
    if (this.frames.length === 0) {
      console.warn("No frames to create GIF from");
      return;
    }

    // Create a new GIF encoder
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      width: this.width,
      height: this.height,
      workerScript: 'gif.worker.js'
    });

    // Add each frame to the GIF
    this.frames.forEach(frame => {
      this.gif.addFrame(frame, { delay: this.delay }); // 50ms delay between frames
    });

    // When the GIF is finished, download it
    this.gif.on('finished', (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Render the GIF
    this.gif.render();
  }
}

export class ScimonkTextView {
  imageData;
  width = 0;
  height = 0;

  constructor(textarea, width, height) {
    this.textarea = textarea;
    this.width = width;
    this.height = height;
    console.log(this.width + ", "+  this.height)
    this.decoder = new TextDecoder("utf-8");
    this.buffer = new Uint8Array(width*height);
  }

  start() {
    this.buffer.fill(9); // Reset the buffer to only 0 values
  }

  setPixel(x, y, r, g, b, a) {
    const index = y * this.width + x;
    this.buffer[index] = 63; // Set the alpha value at the correct position
  }

  end(){
    var val = this.decoder.decode(this.buffer);
   // console.log(val)
    this.textarea.value = val;
  }

}

