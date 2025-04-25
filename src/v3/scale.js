
// Scales a point towards or away from a given origin by a given vector.
export function scale(point,origin,vector){
  for(let i=0;i<point.length/3;i++){
    point[i*3+0] = origin[0] + vector[0]*(point[i*3+0]-origin[0]);
    point[i*3+1] = origin[1] + vector[1]*(point[i*3+1]-origin[1]);
    point[i*3+2] = origin[2] + vector[2]*(point[i*3+2]-origin[2]);
  }
} 