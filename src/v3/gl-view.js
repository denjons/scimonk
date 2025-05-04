import { TextUtils } from '../textUtils.js';

export class ScimonkViewGL {
  width = 0;
  height = 0;
  canvas;
  gl;
  it = 1;
  undefinedShapeId = -1;
  texts = new Array();
  program;
  backgroundColour;
  backgroundType;
  filters;

  // Triangle batch properties
  maxTriangles = 500000;
  vertices = new Float32Array(this.maxTriangles * 3 * (2 + 4)); // 3 vertices, 2 pos + 4 color
  vertexIndex = 0;
  points2D = new Float32Array(9); // Reuse array for point conversion
  buffer;

  constructor(canvas, properties) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
    this.width = canvas.width;
    this.height = canvas.height;
    this.Depth = this.width;
    this.backgroundColour = properties.backgroundColour || [200,150,150,255];
    this.backgroundType = properties.backgroundType || 'fill';
    this.filters = properties.filters || new Array();

    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    // Initialize WebGL
    this.initWebGL();
  }

  initWebGL() {
    // Shaders
    const vsSource = `
      attribute vec2 aPosition;
      attribute vec4 aColor;
      varying vec4 vColor;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vColor = aColor;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    `;

    // Compile shaders
    const vertexShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);

    // Create program
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(this.program));
    }

    this.gl.useProgram(this.program);

    // Initialize vertex buffer
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    const positionLocation = this.gl.getAttribLocation(this.program, 'aPosition');
    const colorLocation = this.gl.getAttribLocation(this.program, 'aColor');

    const stride = (2 + 4) * Float32Array.BYTES_PER_ELEMENT;
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, stride, 0);
    this.gl.enableVertexAttribArray(colorLocation);
    this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  resetFill(colour) {
    // No-op for WebGL version
  }

  resetFillRandom(colour) {
    // No-op for WebGL version
  }

  resetFillPattern(colour) {
    // No-op for WebGL version
  }

  cross(node, w, colour) {
    w = w/2;
    this.nodeVector([node[0]-w,node[1],node[2]], [node[0]+w,node[1],node[2]], colour);
    this.nodeVector([node[0],node[1]-w,node[2]], [node[0],node[1]+w,node[2]], colour);
    this.nodeVector([node[0],node[1],node[2]-w], [node[0],node[1],node[2]+w], colour);
  }

  reset() {
    this.vertexIndex = 0;
    for(let filter of this.filters) {
      filter.reset(this);
    }
  }

  update() {
    // Clear the canvas with background color
    const bg = this.backgroundColour;
    this.gl.clearColor(bg[0]/255, bg[1]/255, bg[2]/255, bg[3]/255);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Draw triangles
    this.upload();
    this.draw();

    // Draw text (using 2D context for text)
    const ctx = this.canvas.getContext('2d');
    for(let text of this.texts) {
      ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
      ctx.fillStyle = text.textColourHex;
      ctx.fillText(text.text, text.position[0], text.position[1]);
    }

    this.it++;
    for(let filter of this.filters) {
      filter.update(this);
    }
  }

  finish() {
    for(let filter of this.filters) {
      filter.finish(this);
    }
  }

  colour = new Float32Array(4);

  fill(triangle, colour, id) {
    const v = this.vertices;
    this.colour[0] = colour[0] / 255;
    this.colour[1] = colour[1] / 255;
    this.colour[2] = colour[2] / 255;
    this.colour[3] = colour[3] / 255;

    // Vertex 1
    v[this.vertexIndex++] = this.zRx(triangle.points[0], triangle.points[2]);
    v[this.vertexIndex++] = this.zRy(triangle.points[1], triangle.points[2]);
    v[this.vertexIndex++] = this.colour[0];
    v[this.vertexIndex++] = this.colour[1];
    v[this.vertexIndex++] = this.colour[2];
    v[this.vertexIndex++] = this.colour[3];

    // Vertex 2
    v[this.vertexIndex++] = this.zRx(triangle.points[3], triangle.points[5]);
    v[this.vertexIndex++] = this.zRy(triangle.points[4], triangle.points[5]);
    v[this.vertexIndex++] = this.colour[0];
    v[this.vertexIndex++] = this.colour[1];
    v[this.vertexIndex++] = this.colour[2];
    v[this.vertexIndex++] = this.colour[3];

    // Vertex 3
    v[this.vertexIndex++] = this.zRx(triangle.points[6], triangle.points[8]);
    v[this.vertexIndex++] = this.zRy(triangle.points[7], triangle.points[8]);
    v[this.vertexIndex++] = this.colour[0];
    v[this.vertexIndex++] = this.colour[1];
    v[this.vertexIndex++] = this.colour[2];
    v[this.vertexIndex++] = this.colour[3];
  }

  upload() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices.subarray(0, this.vertexIndex), this.gl.DYNAMIC_DRAW);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexIndex / (2 + 4));
  }

  zRx(x, z) {
    z = z + this.Depth/2;
    x = x + this.width/2;
    return this.xOnCanvas(
      x + ((this.Depth-z)*(this.Depth/(z)))*Math.cos(this.xAngle(this.xGraph(x),0.5))
    );
  }

  zRy(y, z) {
    z = z + this.Depth/2;
    y = y + this.height/2;
    return this.yOnCanvas(
      y + ((this.Depth-z)*(this.Depth/(z)))*Math.sin(this.yAngle(this.yGraph(y),0.5))
    );
  }

  xGraph(x) {
    return x - (this.width/2);
  }

  yGraph(y) {
    return (y - (this.height/2));
  }

  xAngle(x, max) {
    x = x*max;
    x = (2*x)/this.width;
    return Math.acos(x);
  }

  yAngle(y, max) {
    y = y*max;
    y = (2*y)/this.height;
    return Math.asin(y);
  }

  xOnCanvas(x) {
    return (x / (this.width/2)) - 1; // Convert to WebGL coordinates (-1 to 1)
  }

  yOnCanvas(y) {
    return 1 - (y / (this.height/2)); // Convert to WebGL coordinates (-1 to 1)
  }
} 