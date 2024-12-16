
/*
	SCIMONK
	BETA VERSION_1.0
	BY DENNIS JÖNSSON,
	17-03-2014

*/


/*
	X COORDINATE ON CANVAS

*/
function xOnCanvas(x){
	return (sciMonk.CanvasWidth/sciMonk.Width)*x;
}

/*
	Y COORDINATE ON CANVAS

*/
function yOnCanvas(y){
	return sciMonk.CanvasHeight - (sciMonk.CanvasHeight/sciMonk.Height)*y;
}


/*
	X ON GRAPH

*/
function xGraph(x){
	return x - (sciMonk.Width/2);
}

/*
	Y ON GRAPH

*/
function yGraph(y){
	return (y - (sciMonk.Height/2));
}

/*
	X TO GRAPH
	From canvas to graph coordinate

*/
function xToGraph(x){
	return (sciMonk.Width/sciMonk.CanvasWidth*(x - (sciMonk.CanvasWidth/2)))*0.5;
}

/*
	Y TO GRAPH
	From canvas to graph coordinate

*/
function yToGraph(y){
	return (sciMonk.Height/sciMonk.CanvasHeight*(y - (sciMonk.CanvasHeight/2))*-1)*0.5;
}

// ----------------------------- Z Metrics -------------------------------
/*
	X ANGLE
	Returns the angle between an x coordinate and origo.
	
*/
function xAngle( x, max ){
	x = x*max; // INFO: Spread a thinner angle over a larger area. When max is 0.5 and x is 10, x will be given as 10*0.7 = 0.7
	x = (2*x)/sciMonk.Width;
	return Math.acos(x);
}

/*
	Y ANGLE
	Returns the angle between an y coordinate and origo.
	
*/
function yAngle (y, max){
	y = y*max; // Spread a thinner angle over a larger area.
	y = (2*y)/sciMonk.Height;
	return Math.asin(y);
}

/*
	X PERSPECTIVE
	Gives a point on the x axis relative to the depth in z  
	
*/
function zRx(x,z){
	
	z = z + sciMonk.Depth/2;  	
	x = x + sciMonk.Width/2;       
	return xOnCanvas(
			x + ((sciMonk.Depth-z)*(sciMonk.Depth/(z)))*Math.cos(xAngle(xGraph(x),0.5))
		);
}

/*
	Y PERSPECTIVE
	Gives a point on the y axis relative to the depth in z  

*/
function zRy(y,z){
	
	z = z + sciMonk.Depth/2; 	
	y = y + sciMonk.Height/2;	
	return yOnCanvas(
			y + ((sciMonk.Depth-z)*(sciMonk.Depth/(z)))*Math.sin(yAngle(yGraph(y),0.5))
		);
} 

// ---------------------------- Angle metrics -----------------------------------

/*
	VECTOR ANGLE
	Only for 3x3 matrices
	Gives the angle between the u and v vectors. The rotation is counter clockwise.
	
*/
function vectorAngle( u, v){

	var x1 = u[0];	var x2 = v[0];
	var y1 = u[1];	var y2 = v[1];
	var z1 = u[2];	var z2 = v[2]; 
	
	var a = x1*x2+y1*y2+z1*z2;
	var b = Math.sqrt(x1*x1+y1*y1+z1*z1);
	var c = Math.sqrt(x2*x2+y2*y2+z2*z2);
	var v=0;  //                  <-------------        oojojojojjoojoj, se upp!
	if(!(b==0||c==0))
		v = Math.acos(a/(b*c));
	//v = xRzAngleCorrection( v, z2);
	return v;
}

// ------------------------------ Vectors ------------------------------

/*
	NODE VECTOR
	
*/
function nodeVector(node1, node2, colour, alpha){
	
	var uv = uToV(node1,node2);
	if(vLen(uv)>25){
		nodeVector(node1,addV(node1,Vx(uv,0.5)),colour, alpha);
		nodeVector(addV(node1,Vx(uv,0.5)),node2,colour, alpha);
	}else{
		//colour[3] = 250;
		if(!colour){
			colour = [10,10,10,250];
		}
		if(alpha){
			//colour[3]=setLineAlpha(node1, node2);
			colour[3] = 250;
		}
		var as = node(node1,sciMonk.xRzRot,sciMonk.yRzRot,sciMonk.xRyRot);
		var bs = node(node2,sciMonk.xRzRot,sciMonk.yRzRot,sciMonk.xRyRot);
		drawLine(as[0],bs[0],as[1],bs[1],as[2],bs[2],colour);
	}
}

/*
	NODE
	computes the position of a node

*/
function node(cords,xRzR,yRzR,xRyR){
	var xyz=addV(rotateNode(cords,[xRzR,yRzR,xRyR],[0,0,0]),
				[sciMonk.xMove,sciMonk.yMove,sciMonk.zMove]);
	return [zRx(xyz[0],xyz[2])|0, 
			zRy(xyz[1],xyz[2])|0,
			xyz[2]];
}

/*
	NODES

*/
function multipleNopdes(nodes){
	var i =0;
	var newNodes = new Array();
	for(i=0;i<Math.max(3, nodes.length);i++){
		newNodes[i] = node(nodes[i], sciMonk.xRzRot,sciMonk.yRzRot,sciMonk.xRyRot);
	}
	return newNodes;
}

/*
	UNTRANSFORMED NODE
	Returns a rotated and translated node 
	without transforming it

*/
function uNode(cord){
	return addV(rotateNode(cord,[sciMonk.xRzRot,sciMonk.yRzRot,sciMonk.xRyRot],[0,0,0]),
				[sciMonk.xMove,sciMonk.yMove,sciMonk.zMove]);
}

function uPlane(plane){
	var i = 0;
	var uPlane = new Array();
	for(i=0;i<Math.max(3, plane.length);i++){
		uPlane[i] = uNode(plane[i]);
	}
	return uPlane;
}

/*
	C NODE
	Returns a regular node.

*/
function cNode(cords){
	return node(cords[0],cords[1],cords[2],
	sciMonk.xRzRot,sciMonk.yRzRot,sciMonk.xRyRot)
}


/*
	ROTATION
*/
function rotateNodeT(node,origo,matrix){
	return addV(origo,Ab(matrix,uToV(origo,node)));
}

function XZrot(a){
	return [[Math.cos(a),0,-Math.sin(a)],[0,1,0],[Math.sin(a),0,Math.cos(a)]];
}

function YZrot(a){
	return [[1,0,0],[0,Math.cos(a),Math.sin(a)],[0,-Math.sin(a),Math.cos(a)]];
}

function XYrot(a){
	return [[Math.cos(a),Math.sin(a),0],[-Math.sin(a),Math.cos(a),0],[0,0,1]];
}


/*
	-------------------- MATH UTILITIES ------------------------

*/



/*
	SCALAR PRODUCT

*/
	function scalar(u,v){
		var i =0;
		var res =0;
		for(i=0;i<u.length;i++)
			res += u[i]*v[i];
		return res;
	}

/*
	
	u -> v

*/
function uToV(u,v){
	var vec = new Array();
	var i =0;
	for(i=0;i<u.length;i++){
		vec[i] = v[i]-u[i];
	}
	return vec;
}

/*
	TRANSLATE
	u + v
	for vectors [X1, .. ,Xn]^t

*/
function addV(u,v){
	var w = new Array();
	var i=0;
	for(i=0;i<u.length;i++){
		w[i] = u[i]+v[i];
	}
	return w;
}

/*
	VECTOR + NUMBER
*/
function Vt(v,t){
	var i = 0;
	var nv = new Array();
	for(i=0;i<v.length;i++)
		nv[i] = v[i] + t;
		
	return nv;
}

/*
	|v|
	VECTOR LENGTH
  Pythagorean theorem
*/
function vLen(v){
	var i =0;
	var len =0;
	for(i=0;i<v.length;i++){
		len	+= v[i]*v[i];
	}
	return Math.sqrt(len);
}

/*
	|UV|
	distance between two nodes

*/
function vDist(u,v){
	return vLen(uToV(u,v));
}

/*
	VECTOR * VECTOR
*/
function uXv(u,v){
	var i = 0; 
	var nv = new Array();
	for(i=0;i<u.length;i++){
		nv[i] = u[i]*v[i];
	}
	return nv;
}

/*
	SCALE NODE
*/
function scale(v,origo,vn){
	return addV(origo,uXv(uToV(origo,v),vn));  
}

/*
	SCALE NODES
*/
function batchScale(vs,origo,vn){
	var i = 0; 
	var nv = new Array();
	for(i=0;i<Math.max(3, vs.length);i++){
		nv[i] = scale(vs[i],origo,vn);
	}
	return nv;
}

/*
	u x v
	Only for vectors in R^3
	* Rounds to 6 decimals

*/

function lineNormal(u,v){
	var uv = uToV(u,v);
	var n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
	var b = vLen(uv);
	return Vx(n,1/b);
}

/*
	u x v
	plane normal

*/
function planeNormal(plane){
	var origo = getOrigo(plane);
  return planeNormalFromPoint(plane, origo);
}

function planeNormalFromPoint(plane, point){
	return lineNormal(uToV(point,plane[0]),uToV(point,plane[1]));
}


/*
	Det(A)
	Only for 3x3-matrices
	
*/
function det(A){
	var D = A;
	D[3]=A[0];
	D[4]=A[1];
	return (D[0][0]*D[1][1]*D[2][2]+D[1][0]*D[2][1]*D[3][2]
	+A[2][0]*A[3][1]*A[4][2])
	-(D[0][2]*D[1][1]*D[2][0]+D[1][2]*D[2][1]*D[3][0]
	+D[2][2]*D[3][1]*D[4][0]);
}

/*
	A^(-1)
	INVERSE MATRIX
	only for 3x3 matrices without 0
	*Rounds to 6 decimals
	
*/
function inverseMatrix(Am){
	var B = copyArray(Am);
	B[3]=[1,0,0];
	B[4]=[0,1,0];
	B[5]=[0,0,1];
	var m = [[1,2],[0,1],[1,2],[1,0],[2,1],[1,0]];
	var r = [0,0,1,2,2,1];
	var it = 0;
	for(it=0;it<m.length;it++){
		var val = -B[r[it]][m[it][1]] / B[r[it]][m[it][0]];
		var jt = 0;
		for(jt=0;jt<B.length;jt++){
			B[jt][m[it][1]] = B[jt][m[it][1]] + val * B[jt][m[it][0]];
			//alert(B[jt][m[it][1]]);
		}
	}
	var i = 0;
	var div = new Array();
	for(i=0;i<3;i++){
		div[i] = B[i][i]; 
	}
	i=0;
	for(i=0;i<B.length;i++){
		var j=0;
		for(j=0;j<3;j++){
			B[i][j] = roundTo(B[i][j]/div[j],6);
		}
	}
	return new Array(B[3],B[4],B[5]);
}

/*
	MULTIPLY TWO MATRIXES
	only for 3x3 matrices
	* Rounds to 6 decimals
	
*/
function multMatrix(A,H){
	var M = [[0,0,0],[0,0,0],[0,0,0]];
	var ic = 0;
	var mc = 0;
	for(mc=0;mc<3;mc++){
		for(ic=0;ic<3;ic++){
			var cell = 0;
			for(cell=0;cell<3;cell++){
				M[mc][ic] = M[mc][ic] + A[cell][ic]*H[mc][cell];
			}
		}
	}
	return M;
}

/*
	A*x : x c Q
	SHAPE * NUMBER
*/

function Ax(A,x){
	var i = 0;
	for(i=0;i<Math.max(3, A.length);i++){
		var j=0;
		for(j=0;j<A[i].length;j++){
			A[i][j] = A[i][j]*x;
		}
	}
	return A;
}

/*
	v*x : x c Q
	VECTOR * NUMBER
	
*/
function Vx(v,x){
	var j=0;
	var w = new Array();
	for(j=0;j<v.length;j++){
		w[j] = v[j]*x;
	}
	return w;
}


/*
	A*b (Matrix * vector)
	
*/
function Ab(A,v){
	var ve = [0,0,0];
	var ic = 0;
	for(ic=0;ic<3;ic++){
		var cell = 0;
		for(cell=0;cell<3;cell++){
			ve[ic] = ve[ic] + A[cell][ic]*v[cell];
		}
	}
	return ve;
}

/*
	NODES * MATRIX

*/
function nodesXm(nodes,A){
	var i = 0;
	var newNodes = new Array(); 
	for(i=0;i<Math.max(3, nodes.length);i++){
		newNodes[i] = Ab(A,nodes[i]);
	}
	return newNodes;
}

/*
	XY ROTATION MATRIX
	Only for 3x3 matrices
	
*/
function xyRotMatrix(a){
	return [[Math.cos(a), Math.sin(a), 0],[-Math.sin(a), Math.cos(a), 0],[0,0,1]];
}

/*
	ROUND
	Rounds to a given amount of decimals

*/
function roundTo(nr, dec){
	if(Math.abs(nr) < 1/Math.pow(10,dec)){
		return 0;
	}
	else if(Math.abs(nr)-Math.abs(Math.round(nr)) < 1/Math.pow(10,dec)){
		return Math.round(nr);
	}
	else{
		return Math.floor(nr*Math.pow(10,dec))/Math.pow(10,dec);
	}
}

/*
  PLANES
*/

/**
 * 
 * Returns the intersection point of v1 -> v2 on plane.
 * 
 * point v1 [a1,a2,a3]
 * point v2 [b1,b2,b3]
 *
 * plane [a,b,c]
 * 
 * https://math.stackexchange.com/questions/100439/determine-where-a-vector-will-intersect-a-plane
 * 
 * (𝑥,𝑦,𝑧)=(𝑜1+𝑑1𝑡,𝑜2+𝑑2𝑡,𝑜3+𝑑3𝑡)
 * 
 * 𝑁1(𝑥−𝑎1)+𝑁2(𝑦−𝑎2)+𝑁3(𝑧−𝑎3)=0
 * 
 * 𝑥=𝑜1+𝑑1𝑡,𝑦=𝑜2+𝑑2𝑡𝑧=𝑜3+𝑑3𝑡
 */

function planeIntersection(v1, v2, plane) {
  var d = unitVector(v1, v2);
  var o = v1;
  var a = getOrigo(plane);
  var N = planeNormalFromPoint(plane, a);
  //0 == N[0]*((o[0]+d[0]*t)-a[0]) + N[1]*((o[1]+d[1]*t)-a[1]) + N[2]*((o[2]+d[2]*t)-a[2]);
  var d1 = (N[2]*a[2]+ N[0]*a[0] + N[1]*a[1]) - (N[0]*o[0] + N[1]*o[1] + N[2]*o[2])
  var d2 = (N[0]*d[0] + N[1]*d[1] + N[2]*d[2]);
  var t = d1/d2;

  return [o[0]+t*d[0], o[1]+t*d[1], o[2]+t*d[2]];
}

/**
 * Unit vector (direction) of distance between point v1 and v2
 * 
 * @param {*} p1 point 1
 * @param {*} p2 point 2
 */
function unitVector(p1, p2) {
  var v = uToV(p1, p2);
  var length = vDist(p1, p2);
  v[0] = v[0]/length;
  v[1] = v[1]/length;
  v[2] = v[2]/length;
  return v;
}
