  /*
    ROTATION
  */

const xzRotationMatrix = new Float32Array([0,0,0,0,1,0,0,0,0]);
const yzRotationMatrix = new Float32Array([1,0,0,0,0,0,0,0,0]);
const xyRotationMatrix = new Float32Array([0,0,0,0,0,0,0,0,1]);

const uv = new Float32Array([0,0,0]);

const ve = new Float32Array([0,0,0]);

const rotatedNode = new Float32Array(3);

export function rotateNode(node,rad,origo){
  rotatedNode[0] = node[0];
  rotatedNode[1] = node[1];
  rotatedNode[2] = node[2];
  
  // XZ rotation
  if(rad[0] !== 0){
    xzRotationMatrix[0] = Math.cos(rad[0]);
    xzRotationMatrix[2] = -Math.sin(rad[0]);
    xzRotationMatrix[6] = Math.sin(rad[0]);
    xzRotationMatrix[8] = Math.cos(rad[0]);

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
    yzRotationMatrix[4] = Math.cos(rad[1]);
    yzRotationMatrix[5] = Math.sin(rad[1]);
    yzRotationMatrix[7] = -Math.sin(rad[1]);
    yzRotationMatrix[8] = Math.cos(rad[1]);

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
    xyRotationMatrix[0] = Math.cos(rad[2]);
    xyRotationMatrix[1] = Math.sin(rad[2]);
    xyRotationMatrix[3] = -Math.sin(rad[2]);
    xyRotationMatrix[4] = Math.cos(rad[2]);

    uv[0] = rotatedNode[0] - origo[0];
    uv[1] = rotatedNode[1] - origo[1];
    uv[2] = rotatedNode[2] - origo[2];

    var xyRot = Ab(xyRotationMatrix,uv);

    rotatedNode[0] = origo[0] + xyRot[0];
    rotatedNode[1] = origo[1] + xyRot[1];
    rotatedNode[2] = origo[2] + xyRot[2];
  }
  
  return rotatedNode.slice();
}

export function Ab(A,v){
	ve[0] = 0;
	ve[1] = 0;
	ve[2] = 0;
	for(let i=0; i<3; i++){
		for(let j=0; j<3; j++){
			ve[i] = ve[i] + A[i * 3 + j] * v[j];
		}
	}
	return ve;
}


