

export class DrawModes{
  fill = true;
  lines = true;
  shadow = false;
  shadowVector = [[1,0,0],[0,0,1]]; // shadow plane
  shadowTranslate = [0,-200,0]; // plane translation
  shadowColour = [50,50,50,255];
  lineColour; 
  fillColour;
  skipBackFacingTriangles = true;

  constructor(fill, lines) {
    this.fill = fill;
    this.lines = lines;
  }

  setShadow(shadow, vector, translate, colour){
    this.shadow = shadow;
    this.shadowVector = vector;
    this.shadowTranslate = translate;
    this.shadowColour = colour;
  }

  overrideLineColour(colour){
    this.lineColour = colour;
  }

  overrideFillColour(colour){
    this.fillColour = colour;
  }

  overrideSkipBackFacingTriangles(skip){
    this.skipBackFacingTriangles = skip;
  }

}