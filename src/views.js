// import GIF from 'gif.js';

export class ScimonkView {
  imageData;
  width = 0;
  height = 0;
  canvas;
  ctx;
  backgroundColour = [200,150,150,255];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.imageData = this.ctx.createImageData(this.width, this.height); 
  }

  fill(colur) {
    for (let i = 0; i < this.imageData.data.length; i += 4) {
      this.imageData.data[i] = colur[0];
      this.imageData.data[i + 1] = colur[1];
      this.imageData.data[i + 2] = colur[2];
      this.imageData.data[i + 3] = colur[3];
    }
  }

  // Resets the image to the background colour
  reset(){
    this.fill(this.backgroundColour);
    //this.imageData = this.ctx.createImageData(this.width, this.height); 
  }

  setPixel( x, y, r, g, b, a) {
    const index = (x + y * this.imageData.width) * 4;
    this.imageData.data[index+0] = r;
    this.imageData.data[index+1] = g;
    this.imageData.data[index+2] = b;
    this.imageData.data[index+3] = a;
  }

  // updates the image with the recent changes
  update(){
    this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
  }

  // clears the image
  finish(){
    // 
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

