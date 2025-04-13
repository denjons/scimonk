import { Geometry } from './geometry.js';

export class TextUtils {
  constructor(options = {}) {
    // Default options
    this.options = {
      fontSize: options.fontSize || 16,
      fontFamily: options.fontFamily || 'Arial',
      fontWeight: options.fontWeight || 'normal',
      canvasWidth: options.canvasWidth || 800,
      canvasHeight: options.canvasHeight || 600,
      textColor: options.textColor || [0, 0, 0], // RGB array instead of hex
      backgroundColor: options.backgroundColor || [255, 255, 255] // RGB array instead of hex
    };

    // Create a temporary canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.canvasWidth;
    this.canvas.height = this.options.canvasHeight;
    this.ctx = this.canvas.getContext('2d');
  }

  toPixels(text) {
    // Clear the canvas
    this.ctx.fillStyle = TextUtils.toHexColour(this.options.backgroundColor);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set text properties
    this.ctx.font = `${this.options.fontWeight} ${this.options.fontSize}px ${this.options.fontFamily}`;
    this.ctx.fillStyle = TextUtils.toHexColour(this.options.textColor);
    this.ctx.textBaseline = 'top';

    // Calculate text position to center it
    const textMetrics = this.ctx.measureText(text);
    const x = (this.canvas.width - textMetrics.width) / 2;
    const y = (this.canvas.height - this.options.fontSize) / 2;

    // Draw the text
    this.ctx.fillText(text, x, y);

    // Get the image data
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  // Helper method to get the canvas element (useful for debugging)
  getCanvas() {
    return this.canvas;
  }

  textTo3D(text, boxSize = [1, 1, 1], boxColor = [0, 0, 0, 255], id = 0) {
    // Get the pixel data for the text
    const imageData = this.toPixels(text);
    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Create an array to store all the boxes
    const boxes = [];
    let pixelCount = 0;

    // Get the text color we're looking for
    const textColor = this.options.textColor;

    // Calculate scaling factors based on box size
    const scaleX = boxSize[0];
    const scaleY = boxSize[1];

    // Create a 2D array to store which pixels are part of the text
    const textPixels = new Array(height);
    for (let y = 0; y < height; y++) {
      textPixels[y] = new Array(width).fill(false);
    }

    // First pass: mark which pixels are part of the text
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        if (r === textColor[0] && g === textColor[1] && b === textColor[2]) {
          textPixels[y][x] = true;
        }
      }
    }

    // Second pass: create boxes with face culling
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (textPixels[y][x]) {
          pixelCount++;
          
          // Calculate the position of the box with proper scaling
          const posX = (x - width / 2) * scaleX;
          const posY = (height / 2 - y) * scaleY; // Flip Y axis to match canvas coordinates
          const posZ = 0;

          // Check neighboring pixels to determine which faces to include
          const faces = {
            front: true,  // Always include front face
            back: true,   // Always include back face
            left: !(x > 0 && textPixels[y][x - 1]),  // No left face if there's a pixel to the left
            right: !(x < width - 1 && textPixels[y][x + 1]),  // No right face if there's a pixel to the right
            top: !(y > 0 && textPixels[y - 1][x]),  // No top face if there's a pixel above
            bottom: !(y < height - 1 && textPixels[y + 1][x])  // No bottom face if there's a pixel below
          };

          // Create a box for this pixel with face culling
          const box = Geometry.boxFaces(
            [posX, posY, posZ],
            boxSize,
            boxColor,
            id,
            faces
          );

          boxes.push(box);
        }
      }
    }

    console.log(`Created ${pixelCount} boxes for text "${text}"`);

    // Merge all boxes into a single geometry
    return Geometry.merge(boxes, boxColor, id);
  }

    /**
   * Converts an RGB colour array to a hex colour string
   * @param {Array} colour r,g,b
   * @returns {string} hex colour
   */
  static toHexColour(colour){
    return "#"+TextUtils.decToHex(colour[0])+TextUtils.decToHex(colour[1])+TextUtils.decToHex(colour[2]); 
  }

  static decToHex(input){
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
      output = TextUtils.hexParse(remainder) + output;
    }
    return output;
  }

  static hexParse(dec){
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