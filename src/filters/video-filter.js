//import { VideoConverter } from './video-converter.js';

export class VideoFilter {

  videoChunks = [];
  //videoConverter = new VideoConverter();

  constructor(canvas, properties) {
    this.canvas = canvas;
    this.fps = properties.fps || 60;
    this.fileName = properties.fileName || "video.webm";
    var stream = canvas.captureStream(this.fps);

    this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: properties.mimeType || "video/webm; codecs=vp9"
    });

    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.videoChunks.push(event.data);
      }
    });

    this.mediaRecorder.addEventListener('stop', () => {
      const videoBlob = new Blob(this.videoChunks, { type: this.mediaRecorder.mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      //  const videoUrl = await this.videoConverter.convertToMP4(videoBlob);
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = this.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(videoUrl);
    });
  }

  start(){
    this.mediaRecorder.start();
  }

  reset(){
  //  this.mediaRecorder.pause();
  }

  // updates the view with the recent changes
  update(view) {
  // this.mediaRecorder.resume();
  }

  // Creates and downloads a video file
    finish(view) {
      this.mediaRecorder.stop();
  }
}