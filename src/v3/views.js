import { TextUtils } from './textUtils.js';

export class ScimonkView {
  imageData;
  width = 0;
  height = 0;
  canvas;
  ctx;
  it = 1;
  undefinedShapeId = -1;
  texts = new Array();

  constructor(canvas, properties) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.Depth = this.width;
    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.data = this.imageData.data;
    this.depthMap = new Float32Array(this.width*this.height*3);
    this.iniDepthMap();
    this.backgroundColour = properties.backgroundColour || [200,150,150,255];
    this.backgroundType =  properties.backgroundType || 'fill';
    this.filters = properties.filters || new Array();
    
  }

  resetFill(colur) {
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = colur[0];
      this.imageData.data[i + 1] = colur[1];
      this.imageData.data[i + 2] = colur[2];
      this.imageData.data[i + 3] = colur[3];
    }
  }

  /**
   * Fills the image with a random colour
   * @param {Array} colour - The colour to fill the image with  
   */
  resetFillRandom(colour) { 
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = colour[0] + Math.random() * (255 - colour[0]);
      this.imageData.data[i + 1] = colour[1] + Math.random() * (255 - colour[1]);
      this.imageData.data[i + 2] = colour[2] + Math.random() * (255 - colour[2]);
      this.imageData.data[i + 3] = colour[3];
    }
  }

  resetFillPattern(colour) {
    const baseColour = [...colour];
    const minBubbleSize = 20;
    const maxBubbleSize = 200;
    const bubbleCount = 30;
    
    // First fill with base color
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = baseColour[0];
      this.imageData.data[i + 1] = baseColour[1];
      this.imageData.data[i + 2] = baseColour[2];
      this.imageData.data[i + 3] = baseColour[3];
    }
    
    // Create random bubbles
    for (let i = 0; i < bubbleCount; i++) {
      // Random bubble properties
      const size = minBubbleSize + Math.random() * (maxBubbleSize - minBubbleSize);
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const speedX = (Math.random() - 0.5) * 2;
      const speedY = (Math.random() - 0.5) * 2;
      
      // Random bubble color
      const bubbleColor = [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
        255
      ];
      
      // Calculate bubble position with animation
      const animX = (x + speedX * this.it) % this.width;
      const animY = (y + speedY * this.it) % this.height;
      
      // Draw the bubble
      for (let py = -size; py <= size; py++) {
        for (let px = -size; px <= size; px++) {
          const dist = Math.sqrt(px * px + py * py);
          if (dist <= size) {
            // Calculate position with wrapping
            const drawX = (Math.floor(animX + px) + this.width) % this.width;
            const drawY = (Math.floor(animY + py) + this.height) % this.height;
            
            // Calculate alpha based on distance from center
            const alpha = 1 - (dist / size);
            
            const index = (drawY * this.width + drawX) * 4;
            
            // Blend bubble color with background
            this.imageData.data[index] = 
              bubbleColor[0] * alpha + this.imageData.data[index] * (1 - alpha);
            this.imageData.data[index + 1] = 
              bubbleColor[1] * alpha + this.imageData.data[index + 1] * (1 - alpha);
            this.imageData.data[index + 2] = 
              bubbleColor[2] * alpha + this.imageData.data[index + 2] * (1 - alpha);
          }
        }
      }
    }
  }

  cross(node,w,colour){
    w = w/2;
    this.nodeVector([node[0]-w,node[1],node[2]],[node[0]+w,node[1],node[2]], colour);
    this.nodeVector([node[0],node[1]-w,node[2]],[node[0],node[1]+w,node[2]], colour);
    this.nodeVector([node[0],node[1],node[2]-w],[node[0],node[1],node[2]+w], colour);
  }

  addText(text, properties) {
    this.texts.push({
      text: text,
      fontFamily: properties.fontFamily || 'Arial',
      fontWeight: properties.fontWeight || 'normal',
      fontSize: properties.fontSize || 16,
      textColor: properties.textColor || [0, 0, 0, 255],
      textColourHex: TextUtils.toHexColour(properties.textColor || [0, 0, 0, 255]),
      position: properties.position || [0, 0],
    });

  }

  // Resets the image to the background colour
  reset(){  
    if(this.backgroundType === 'random'){
      this.resetFillRandom(this.backgroundColour);
    } else if(this.backgroundType === 'pattern') {
      this.resetFillPattern(this.backgroundColour);
    } else {
      this.resetFill(this.backgroundColour);
    }
    for(let filter of this.filters){
      filter.reset(this);
    }
    //this.imageData = this.ctx.createImageData(this.width, this.height); 
  }

  // updates the image with the recent changes
  update(){
    this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
    for(let text of this.texts){
      this.ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
      console.log(text.textColourHex);
      this.ctx.fillStyle = text.textColourHex
      this.ctx.fillText(text.text, text.position[0], text.position[1]);
    }
    this.it++;
    for(let filter of this.filters){
      filter.update(this);
    }
  }

  // clears the image
  finish(){
    for(let filter of this.filters){
      filter.finish(this);
    }
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
    this.points2D[0] = this.zRx(triangle.points[0], triangle.points[2])|0;
    this.points2D[1] = this.zRy(triangle.points[1], triangle.points[2])|0;
    this.points2D[2] = triangle.points[2];
    this.points2D[3] = this.zRx(triangle.points[3], triangle.points[5])|0;
    this.points2D[4] = this.zRy(triangle.points[4], triangle.points[5])|0;
    this.points2D[5] = triangle.points[5];
    this.points2D[6] = this.zRx(triangle.points[6], triangle.points[8])|0;
    this.points2D[7] = this.zRy(triangle.points[7], triangle.points[8])|0;
    this.points2D[8] = triangle.points[8];

    // Calculate vectors
    this.ux[0] = this.points2D[0] - this.points2D[6];
    this.ux[1] = this.points2D[1] - this.points2D[7];
    this.uxZ = triangle.points[2] - triangle.points[8];

    this.vx[0] = this.points2D[3] - this.points2D[0];
    this.vx[1] = this.points2D[4] - this.points2D[1];
    this.vxZ = triangle.points[5] - triangle.points[2];

    this.x2 = this.points2D[0] + this.vx[0];
    this.y2 = this.points2D[1] + this.vx[1];
    this.z2 = this.points2D[2] + this.vxZ;

    const uxLen = Math.sqrt(this.ux[0] * this.ux[0] + this.ux[1] * this.ux[1])*1.2;
    const lZ = this.Depth/3;

    for(let i = 0; i < uxLen; i++) {
      this.x1 = this.points2D[6] + this.ux[0]/uxLen * i;
      this.y1 = this.points2D[7] + this.ux[1]/uxLen * i;
      this.z1 = this.points2D[8] + this.uxZ/uxLen * i;
      
      this.luv[0] = this.x2 - this.x1;
      this.luv[1] = this.y2 - this.y1;
      
      const len = Math.sqrt(this.luv[0] * this.luv[0] + this.luv[1] * this.luv[1])*1.2;
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
    this.nodeVector([triangle.points[0],triangle.points[1],triangle.points[2]], [triangle.points[3],triangle.points[4],triangle.points[5]], colour);
    this.nodeVector([triangle.points[3],triangle.points[4],triangle.points[5]], [triangle.points[6],triangle.points[7],triangle.points[8]], colour);
    this.nodeVector([triangle.points[6],triangle.points[7],triangle.points[8]], [triangle.points[0],triangle.points[1],triangle.points[2]], colour);
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


