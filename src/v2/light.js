export class Light {
  plane;
  constructor(plane) {
    this.plane = plane;
  }

  distance = new Float32Array(3);

  setLight(triangle, colour) { 
    const point = this.plane.normalIntersectsPlane(triangle, 10000);
    if(point){
      this.distance[0] = point[0] - this.plane.origin[0];
      this.distance[1] = point[1] - this.plane.origin[1];
      this.distance[2] = point[2] - this.plane.origin[2];
      const distance = Math.sqrt(this.distance[0]*this.distance[0] + this.distance[1]*this.distance[1] + this.distance[2]*this.distance[2]);  
      
      // Calculate brightness factor (1.0 when distance is 0, decreasing as distance increases)
      const brightness = Math.max(0, 1 - (distance / this.plane.width));
      
      return [
        colour[0] * brightness,
        colour[1] * brightness,
        colour[2] * brightness,
        255
      ];
      
     /*
      return [
        colour[0],
        colour[1],
        colour[2],
        255
      ];
      */
      
    }
    return [0,0,0,255];
  }
}