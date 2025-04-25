import { Geometry } from '../v3/geometry.js';
import { Vx } from '../graph.js';

export class BroccoliFactory {

  clusterSize;
  branchClusterSize;
  stemClusterSize;
  colour;
  id;

  constructor(clusterSize = 10, branchClusterSize = 10, stemClusterSize = 10, colour = [1,1,1, 255], id = 0){
    this.clusterSize = clusterSize;
    this.colour = colour;
    this.id = id;
    this.branchClusterSize = branchClusterSize;
    this.stemClusterSize = stemClusterSize;
  }

  createBroccoli(pos, size){
    const stemSize = ((size[0]+size[1]+ size[2])/3)/10;
    const cylinder = Geometry.cylinder(pos, [size[0]/3, size[1], size[2]/3], 10, this.colour, this.id);
    cylinder.crushTriangles(1);
    cylinder.shakeTriangles(5);
    const cluster = this.createBroccoliStemCluster([pos[0], pos[1]+size[1]/2-stemSize/3, pos[2]], stemSize);
    cluster.triangles.push(...cylinder.triangles);
    return cluster;
  }

  createBroccoliSprout(pos, size, tilt){
    var cylinderSize = [size/3,size*3,size/3];
    var sphereSize = Vx([size,size,size], 1.5);
    var cylinder = Geometry.cylinder(pos, cylinderSize, 5, this.colour, this.id);
    var sphere = Geometry.sphere([pos[0], pos[1]+cylinderSize[1]/2, pos[2]], sphereSize, 3, 3);
    const sprout = Geometry.merge([cylinder, sphere], this.colour, this.id);
    sprout.rotateAround(tilt, [pos[0], pos[1]-cylinderSize[1]/2, pos[2]]);
    return sprout;
  }

  createBroccoliSproutCluster(pos, size){
    const sprouts = new Array();
    for(let i = 0; i < this.clusterSize; i++){
      sprouts.push(this.createBroccoliSprout(pos, size, createTilt()));
    }

    return Geometry.merge(sprouts, this.colour, this.id);
  }

  createBroccoliBranch(pos, size, tilt){
    const sproutSize = size/2;
    var cylinderSize = [size/3,size*3,size/3];
    const sproutCluster = this.createBroccoliSproutCluster([pos[0], pos[1]+cylinderSize[1]/2+sproutSize/2, pos[2]], sproutSize, this.clusterSize);
    var cylinder = Geometry.cylinder(pos, cylinderSize, 5, this.colour, this.id);
    const result =  Geometry.merge([cylinder, sproutCluster], this.colour, this.id);
    result.rotateAround(tilt, [pos[0], pos[1]-cylinderSize[1]/2, pos[2]]);
    return result;
  }

  createBroccoliBranchCluster(pos, size){
    const branches = new Array();
    for(let i = 0; i < this.branchClusterSize; i++){  
      branches.push(this.createBroccoliBranch(pos, size, createTilt()));
    }
    return Geometry.merge(branches, this.colour, this.id);
  }

  createBroccoliStem(pos, size, tilt){
    const clusterSize = size;
    const stemSize = [size,size*5,size];
    const stem = Geometry.cylinder(pos, stemSize, 10, this.colour, this.id);
    const sproutCluster = this.createBroccoliBranchCluster([pos[0], pos[1]+stemSize[1]/2+clusterSize/2, pos[2]], clusterSize, this.clusterSize);
    const result =  Geometry.merge([stem, sproutCluster], this.colour, this.id);
    result.rotateAround(tilt, [pos[0], pos[1]-stemSize[1]/2, pos[2]]);
    return result;
  }


  createBroccoliStemCluster(pos, size){
    const stems = new Array();
    for(let i = 0; i < this.stemClusterSize; i++){
      stems.push(this.createBroccoliStem(pos, size, createTilt()));
    }
    return Geometry.merge(stems, this.colour, this.id);
  }

  

}

function createTilt(){
  const p = Math.PI/2;
  return [randomSign(p)*Math.random(),randomSign(p)*Math.random(),randomSign(p)*Math.random()];
}

function randomSign(x){
  return Math.random() < 0.5 ? x : -x;
}