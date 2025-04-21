export class GifFilter {
  frames = [];
  gif = null;

  constructor(properties) {
    this.delay = 100 || properties.delay;
    this.fileName = properties.fileName || "output.gif";
  }

  // updates the view with the recent changes
  update(view) {
    this.frames.push(view.ctx.getImageData(0, 0, view.width, view.height));
  }

  // Creates the gif when all images have been added
  finish(view) {
    if (this.frames.length === 0) {
      console.warn("No frames to create GIF from");
      return;
    }

    // Create a new GIF encoder
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      width: view.width,
      height: view.height,
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
      a.download = this.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Render the GIF
    this.gif.render();
  }
}