/*
	GET ORIGIN
	returns the center of a given group of nodes

*/
export function calculateOrigin(nodes, origin){
	// Initialize origin to zeros
	origin[0] = 0;
	origin[1] = 0;
	origin[2] = 0;
	
	const len = nodes.length/3; // line 2 or triangle 3
	for(let i=0;i<len;i++){
		origin[0]+=nodes[i*3+0];
		origin[1]+=nodes[i*3+1];
		origin[2]+=nodes[i*3+2];
	}
	origin[0]/=len;
	origin[1]/=len;
	origin[2]/=len;

  return origin.slice();
}



const _unitvector = new Float32Array(3);
/**
 * Unit vector (direction) of distance between point v1 and v2
 * 
 * @param {*} p1 point 1
 * @param {*} p2 point 2
 */
export function unitVector(points) {
  _unitvector[0] = points[3] - points[0];
  _unitvector[1] = points[4] - points[1];
  _unitvector[2] = points[5] - points[2];
  var length =  Math.sqrt(_unitvector[0]**2 + _unitvector[1]**2 + _unitvector[2]**2);
  _unitvector[0] = _unitvector[0]/length;
  _unitvector[1] = _unitvector[1]/length;
  _unitvector[2] = _unitvector[2]/length;
  return _unitvector.slice();
}