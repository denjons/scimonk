  /*
    ROTATION
  */

const XZ = [0,1,0];
const YZ = [1,0,0];
const XY = [0,0,1];

export function rotateNode(node,rad,origo){
  let rotatedNode = [...node];
  
  // XZ rotation
  if(rad[0] !== 0){
    var xzRot = Ab([[Math.cos(rad[0]),0,-Math.sin(rad[0])],XZ,[Math.sin(rad[0]),0,Math.cos(rad[0])]],uToV(origo,rotatedNode)); 
    rotatedNode[0] = origo[0] + xzRot[0];
    rotatedNode[1] = origo[1] + xzRot[1];
    rotatedNode[2] = origo[2] + xzRot[2];
  }

  // YZ rotation
  if(rad[1] !== 0){
    var yzRot = Ab([YZ,[0,Math.cos(rad[1]),Math.sin(rad[1])],[0,-Math.sin(rad[1]),Math.cos(rad[1])]],uToV(origo,rotatedNode));
    rotatedNode[0] = origo[0] + yzRot[0];
    rotatedNode[1] = origo[1] + yzRot[1];
    rotatedNode[2] = origo[2] + yzRot[2];
  }

  // XY rotation
  if(rad[2] !== 0){
    var xyRot = Ab([[Math.cos(rad[2]),Math.sin(rad[2]),0],[-Math.sin(rad[2]),Math.cos(rad[2]),0],XY],uToV(origo,rotatedNode));
    rotatedNode[0] = origo[0] + xyRot[0];
    rotatedNode[1] = origo[1] + xyRot[1];
    rotatedNode[2] = origo[2] + xyRot[2];
  }
  
  return rotatedNode;
}

function uToV(u,v){
	var vec = new Array();
	var i =0;
	for(i=0;i<u.length;i++){
		vec[i] = v[i]-u[i];
	}
	return vec;
}

export function Ab(A,v){
	var ve = [0,0,0];
	for(let i=0; i<3; i++){
		for(let j=0; j<3; j++){
			ve[i] = ve[i] + A[i][j]*v[j];
		}
	}
	return ve;
}


