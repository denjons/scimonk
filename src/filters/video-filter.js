//import { VideoConverter } from './video-converter.js';

export class VideoFilter {
  videoChunks = [];
  //videoConverter = new VideoConverter();
  isRecording = false;
  frames = [];
  frameRate = 60;

  constructor(canvas, properties) {
    this.canvas = canvas;
    this.fps = properties.fps || 60;
    this.fileName = properties.fileName || "video.webm";
    this.frameRate = this.fps;
    this.mimeType = properties.mimeType || 'video/webm; codecs=vp9';
    this.videoBitsPerSecond = properties.videoBitsPerSecond || 8000000;
    this.imageType = properties.imageType || 'image/webp';
  }

  start() {
    this.isRecording = true;
    this.frames = [];
  }

  reset() {
    // Do nothing
  }

  // updates the view with the recent changes
  update(view) {
    if (this.isRecording) {
      // Capture the current frame
      const frame = this.canvas.toDataURL(this.imageType, 1.0);
      this.frames.push(frame);
    }
  }

  // Creates and downloads a video file
  async finish(view) {
    this.isRecording = false;
    
    // Create a temporary canvas for frame processing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Preload all images
    const preloadedImages = await Promise.all(
      this.frames.map(frame => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = frame;
        });
      })
    );

    // Create a MediaRecorder for the final video
    const stream = tempCanvas.captureStream(this.frameRate);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: this.mimeType,
      videoBitsPerSecond: 8000000 // Higher bitrate for smoother playback
    });

    const videoChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        videoChunks.push(e.data);
      }
    };

    mediaRecorder.start(1000 / this.frameRate); // Timeslice based on frame rate

    // Process all frames with a small delay between each
    for (const img of preloadedImages) {
      tempCtx.drawImage(img, 0, 0);
      // Wait for the frame to be captured
      await new Promise(resolve => setTimeout(resolve, 1000 / this.frameRate));
    }

    // Wait a bit longer before stopping to ensure all frames are captured
    await new Promise(resolve => setTimeout(resolve, 1000 / this.frameRate));
    mediaRecorder.stop();

    // Wait for the final data
    await new Promise(resolve => {
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: this.mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = this.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(videoUrl);
        resolve();
      };
    });
  }
}