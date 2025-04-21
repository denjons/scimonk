export class Light {
  lightSources;
  colour;
  constructor(lightSources, properties) {
    this.lightSources = lightSources;
    this.shadow = new Float32Array(properties.shadow || [0,0,0]);
  }


  distance = new Float32Array(3);
  resultColour = new Float32Array([0,0,0,255]);

  setLight(triangle, colour) { 
    this.resultColour[0] = this.shadow[0];
    this.resultColour[1] = this.shadow[1];
    this.resultColour[2] = this.shadow[2];
    this.resultColour[3] = this.shadow[3];

    for(let lightSource of this.lightSources){
      const point = lightSource.plane.normalIntersectsPlane(triangle, 10000);
      if(point){
        this.distance[0] = point[0] - lightSource.plane.origin[0];
        this.distance[1] = point[1] - lightSource.plane.origin[1];
        this.distance[2] = point[2] - lightSource.plane.origin[2];
        const distance = Math.sqrt(this.distance[0]*this.distance[0] + this.distance[1]*this.distance[1] + this.distance[2]*this.distance[2]);  
        
        // Calculate brightness factor (1.0 when distance is 0, decreasing as distance increases)
        const brightness = Math.max(0, 1 - (distance / lightSource.plane.width));
        
        this.resultColour[0] = Math.max(Math.min(this.resultColour[0] + (colour[0] * brightness) + (lightSource.colour[0]*brightness), 255), 0);
        this.resultColour[1] = Math.max(Math.min(this.resultColour[1] + (colour[1] * brightness) + (lightSource.colour[1]*brightness), 255), 0);
        this.resultColour[2] = Math.max(Math.min(this.resultColour[1] + (colour[2] * brightness) + (lightSource.colour[2]*brightness), 255), 0);
        this.resultColour[3] = 255 - (lightSource.colour[3]*brightness)
    
      }
    }

    return this.resultColour.slice();
  }
}

export class LightSource {
  constructor(plane, colour){
    this.plane = plane;
    this.colour = colour;
  }
}