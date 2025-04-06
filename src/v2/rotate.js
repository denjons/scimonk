  /*
    ROTATION
  */

const XZ = new Float32Array([0,1,0]);
const YZ = new Float32Array([1,0,0]);
const XY = new Float32Array([0,0,1]);

const xzRotationMatrix = [new Float32Array([0,0,0]), XZ, new Float32Array([0,0,0])];
const yzRotationMatrix = [YZ, new Float32Array([0,0,0]), new Float32Array([0,0,0])];
const xyRotationMatrix = [new Float32Array([0,0,0]), new Float32Array([0,0,0]), XY];

const uv = new Float32Array([0,0,0]);

const ve = new Float32Array([0,0,0]);

export function rotateNode(node,rad,origo){
  let rotatedNode = [...node];
  
  // XZ rotation
  if(rad[0] !== 0){
    xzRotationMatrix[0][0] = Math.cos(rad[0]);
    xzRotationMatrix[0][2] = -Math.sin(rad[0]);
    xzRotationMatrix[2][0] = Math.sin(rad[0]);
    xzRotationMatrix[2][2] = Math.cos(rad[0]);

    uv[0] = rotatedNode[0] - origo[0];
    uv[1] = rotatedNode[1] - origo[1];
    uv[2] = rotatedNode[2] - origo[2];

    var xzRot = Ab(xzRotationMatrix,uv);

    rotatedNode[0] = origo[0] + xzRot[0];
    rotatedNode[1] = origo[1] + xzRot[1];
    rotatedNode[2] = origo[2] + xzRot[2];
  }

  // YZ rotation
  if(rad[1] !== 0){
    yzRotationMatrix[1][1] = Math.cos(rad[1]);
    yzRotationMatrix[1][2] = Math.sin(rad[1]);
    yzRotationMatrix[2][1] = -Math.sin(rad[1]);
    yzRotationMatrix[2][2] = Math.cos(rad[1]);

    uv[0] = rotatedNode[0] - origo[0];
    uv[1] = rotatedNode[1] - origo[1];
    uv[2] = rotatedNode[2] - origo[2];

    var yzRot = Ab(yzRotationMatrix,uv);

    rotatedNode[0] = origo[0] + yzRot[0];
    rotatedNode[1] = origo[1] + yzRot[1];
    rotatedNode[2] = origo[2] + yzRot[2];
  }

  // XY rotation
  if(rad[2] !== 0){
    xyRotationMatrix[0][0] = Math.cos(rad[2]);
    xyRotationMatrix[0][1] = Math.sin(rad[2]);
    xyRotationMatrix[1][0] = -Math.sin(rad[2]);
    xyRotationMatrix[1][1] = Math.cos(rad[2]);

    uv[0] = rotatedNode[0] - origo[0];
    uv[1] = rotatedNode[1] - origo[1];
    uv[2] = rotatedNode[2] - origo[2];

    var xyRot = Ab(xyRotationMatrix,uv);

    rotatedNode[0] = origo[0] + xyRot[0];
    rotatedNode[1] = origo[1] + xyRot[1];
    rotatedNode[2] = origo[2] + xyRot[2];
  }
  
  return rotatedNode;
}

export function Ab(A,v){
	ve[0] = 0;
	ve[1] = 0;
	ve[2] = 0;
	for(let i=0; i<3; i++){
		for(let j=0; j<3; j++){
			ve[i] = ve[i] + A[i][j]*v[j];
		}
	}
	return ve;
}


