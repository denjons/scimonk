
/*
	SCIMONK
	BETA VERSION_1.0
	BY DENNIS JÖNSSON,
	17-03-2014

*/

/*
	SPHERE
	
*/
function sphere(pos,size,sn,sr){
	var sphere = new Array();
	var top = [pos[0],pos[1]+size[1]/2,pos[2]];
  var bottom =  [pos[0],pos[1]-size[1]/2,pos[2]];
	for(var i=1;i<sn;i++){ // computes each line
		for(var j=0;j<sr;j++){ // computes each node on one line
			if(i==1){
        sphere.push([top, sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr)])
        squareToTriangles([sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr),
                          sphereCoordinate(pos, size, i+1, (j+1)%sr, sn, sr), sphereCoordinate(pos, size, i+1, j, sn, sr)], sphere);
      }else if(i==sn-1){
        sphere.push([bottom, sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr)])
      }else{
        squareToTriangles([sphereCoordinate(pos, size, i, j, sn, sr), sphereCoordinate(pos, size, i, (j+1)%sr, sn, sr),
                          sphereCoordinate(pos, size, i+1, (j+1)%sr, sn, sr), sphereCoordinate(pos, size, i+1, j, sn, sr)], sphere);
      }
		}
	}
	return sphere;
}

function sphereCoordinate(pos, size, i, j, sn, sr) {
  var end = (2*Math.PI)/sr*(j-1);
  return [pos[0]+((size[0]/2)*Math.sin(Math.PI/sn*i))*Math.cos(end), 
						pos[1]+(size[1]/2)*Math.sin(Math.PI/2-Math.PI/sn*i),
						pos[2]+((size[2]/2)*Math.sin(Math.PI/sn*i))*Math.sin(end)];
}

/*
	BOX
	
*/
function box(pos,size){
	return box2(pos[0], pos[1], pos[2], size[0], size[1],size[2]);
}
function box2(x, y, z, w, h, d){
	w=w/2;
	h=h/2;
	d=d/2;
  var array = new Array();
  // front
  squareToTriangles([[x-w,y-h,z+d],[x-w,y+h,z+d],[x+w,y+h,z+d],[x+w,y-h,z+d]], array);
  // back
  squareToTriangles([[x-w,y-h,z-d],[x-w,y+h,z-d],[x+w,y+h,z-d],[x+w,y-h,z-d]], array);
  // top
  squareToTriangles([[x-w,y+h,z+d],[x-w,y+h,z-d],[x+w,y+h,z-d],[x+w,y+h,z+d]], array);
  // bottom
  squareToTriangles([[x-w,y-h,z+d],[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y-h,z+d]], array);
  // left
  squareToTriangles([[x-w,y+h,z+d],[x-w,y+h,z-d],[x-w,y-h,z-d],[x-w,y-h,z+d]], array);
    // right
  squareToTriangles([[x+w,y+h,z+d],[x+w,y+h,z-d],[x+w,y-h,z-d],[x+w,y-h,z+d]], array);
  return array;
	//return [[[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y-h,z-d],[x-w,y-h,z-d]],
	//		[[x-w,y+h,z+d],[x+w,y+h,z+d],[x+w,y+h,z-d],[x-w,y+h,z-d]]];

}

function squareToTriangles(square, triangles) {
  triangles.push([square[0], square[1], square[2]]);
  triangles.push([square[2], square[3], square[0]]);
} 

/**
 * cross
 * @param {*} p 
 * @param {*} width 
 * @returns 
 */
function cross(p, width) {
  var w = width/2;
  return [[[p[0]-w, p[1], p[2]], [p[0]+w, p[1], p[2]]],
  [[p[0], p[1]-w, p[2]], [p[0], p[1]+w, p[2]]],
[[p[0], p[1], p[2]-w], [p[0], p[1], p[2]+w]]];
}

/*
	CYLINDER
	
*/
function cylinder(pos,size,lns){
	var cylinder = new Array(); 
	var top = xRzCircle([pos[0],pos[1]-size[1]/2,pos[2]],size[0]/2, size[2]/2, lns)[0];
	var bottom = xRzCircle([pos[0],pos[1]+size[1]/2,pos[2]],size[0]/2, size[2]/2, lns)[0];
  for(var i = 0; i < top.length; i++){
    squareToTriangles([top[i], top[(i+1)%top.length], bottom[(i+1)%top.length], bottom[i]],cylinder)
  }
	return cylinder;
	
}

/*
	CONE

*/
function cone(pos,sc,s){
  var cone = new Array();
	pos[1] = pos[1] - sc[1]/2;
	var bottom = xRzCircle(pos, sc[0]/2, sc[2]/2, s)[0];
	pos[1] = pos[1]+sc[1];
	for(var i = 0; i < bottom.length; i++) {
    cone.push([pos, bottom[i], bottom[(i+1)%bottom.length]]);
  }
	return cone;
}


/*
	XZ CIRCLE

*/
function xRzCircle(pos, width, depth, ls){
	var i = 0;
	var lines = new Array();
	for(i=0;i<=ls;i++){
		lines[i] = [pos[0]+width*Math.cos(2*Math.PI/ls*i),
						pos[1],
						pos[2]+depth*Math.sin(2*Math.PI/ls*i)];
	}
	return [lines];
}

/*
	SCALE SHAPE
*/
function scaleShape(shape,vn,origo){
	if(!origo){
		origo = getShapeOrigo(shape);
	}
	var nv = new Array();
	var i = 0; 
	for(i=0;i<shape.length;i++){
		nv[i] = batchScale(shape[i],origo,vn);
	}
	return nv;
}

/*
	SCALE MODEL
*/
function scaleModel(model, vn){
	var origin = getModelOrigo(model);
	var i = 0;
	for(i=0;i<model.shapes.length;i++){
		model.shapes[i].shape = scaleShape(model.shapes[i].shape, vn, origin);
	}
}

/*
	GET ORIGIN
	returns the center of a given group of nodes

*/
function getOrigo(nodes){
	var x=0;
	var y=0;
	var z=0;
	var len = nodes.length;
	var i=0;
	for(i=0;i<len;i++){
		x+=nodes[i][0];
		y+=nodes[i][1];
		z+=nodes[i][2];
	}
	return [x/len,y/len,z/len];
}

/*
	GET ORIGIN OF A SHAPE
	returns the center node of a given shape
*/

function getShapeOrigo(shape){
	var res = new Array();
	var i = 0;
	for(i=0;i<shape.length;i++){
		res[i] = getOrigo(shape[i]);
	}
	return getOrigo(res);	
}

/*
	GET ORIGIN OF A MODEL
	return the center node of a given model (cluster of shapes)
*/
function getModelOrigo(model){
	var or = new Array();
	var i = 0;
	for(i=0;i<model.shapes.length;i++){
		or[i] = getShapeOrigo(model.shapes[i].shape);
	}
	return getOrigo(or);
}

/*
	MAX MODEL DISTANCE FROM POINT
	returns the maximum distance from a given point and the nodes of a model
*/
function getModelMaxDistance(model,origin){
	var i = 0;
	var distance = 0;
	for(i=0;i<model.shapes.length;i++){
		distance = Math.max(distance,getShapeMaxDistance(model.shapes[i],origin));
	}
	return distance;
}

/*
	MAX SHAPE DISTANCE FROM POINT
	returns the maximum distance from a given point and the nodes of a shape
*/
function getShapeMaxDistance(shape,origin){
	var i = 0;
	var distance = 0;
	for(i=0;i<shape.length;i++){
		var j = 0;
		for(j=0;j<shape[i].length;j++)
			distance = Math.max(distance,vDist(uToV(origin,shape[i][j])));
	}
	return distance;
}

/*
	ROTATE MODEL
*/
function rotateModel(origo,model,rot){
	model.shapes = batchRotateShapes(origo,model.shapes,rot);
}

/*
	BATCH ROTATE SHAPES

*/
// the shape object
function batchRotateShapes(origo,shapes,rot){
	var i=0;
	var nShapes = new Array();
	for(i=0;i<shapes.length;i++){
		nShapes[i] = new sciMonk.Shape(shapes[i].scale,shapes[i].pos,shapes[i].rot,
			shapes[i].colour,shapes[i].shapeType,rotate(origo,shapes[i].shape,rot));
	}
	return nShapes;
}
// shape array
function batchRotate(origo,shapes,rot){
	var i=0;
	var nShapes = new Array();
	for(i=0;i<shapes.length;i++){
		nShapes[i] = rotate(origo,shapes[i].shape,rot);
	}
	return nShapes;
}

/*
	ROTATE SHAPE

*/
function rotate(origo,shape,rot){
	var i=0;
	var j=0;
	var ns = new Array();
	for(i=0;i<shape.length;i++){
		ns[i] = new Array();
		for(j=0;j<shape[i].length;j++){
			ns[i][j] = rotateNode(shape[i][j],rot,origo);
		}
	}
	return ns;
}



/*
	ROTATE NODE

*/
function rotateNode(node,rad,origo){
	return rotateNodeT(
				rotateNodeT(
					rotateNodeT(node,origo,XZrot(rad[0])),
						origo,YZrot(rad[1])),
					origo,XYrot(rad[2]));
}


/*
	TRANSLATE MODEL
	shape+v
	add vector to all coordinates in a shape

*/
function translateModel(model,v){
	var i = 0;
	for(i=0;i<model.shapes.length;i++){
		model.shapes[i].shape = translateShape(model.shapes[i].shape,v);
	}
}

/*
	BATCH TRANSLATE SHAPES
	shapes+v
	add vector to all coordinates in a shape
*/
function batchTranslateShapes(shapes, v){
	var nShapes = new Array();
	var i = 0;
	for(i=0;i<shapes.length;i++){
		nShapes[i] = translateShape(shapes[i].shape,v);
	}
	return nShapes;
}


/*
	TRANSLATE SHAPE
	shape+v
	add vector to all coordinates in a shape

*/
function translateShape(shape,v){
	var B = new Array();
	var i = 0;
	for(i=0;i<shape.length;i++){
		B[i] = translateNodes(shape[i],v);
	}
	return B;
}

/*
	TRANSLATE NODES

*/
function translateNodes(nodes,v){
	var i = 0;
	var newNodes = new Array();
	for(i=0;i<nodes.length;i++){
		newNodes[i] = addV(v,nodes[i]);
	}
	return newNodes;
}


/*
	LINE MAP

*/
sciMonk.lineMap=function(ln, colour, alpha){
	sciMonk.ringMap(ln, colour, alpha);
	//for(nm=1;nm<ln.length;nm++){
		//sciMonk.mapLine(ln[nm-1], ln[nm], colour, alpha);
	//}
}

 // UTILITY METHODS
sciMonk.mapLine = function(line1, line2, colour,alpha){
	var a = Math.max(line1.length,line2.length);
	var b = Math.min(line1.length,line2.length);
	var c = b/a;
	var i = 0;
	var j = 0;
	for(i=0;i<a;i++){
		if(line1.length == a)
			nodeVector(line1[i], line2[j], colour, alpha);
		else
			nodeVector(line2[i], line1[j], colour, alpha);
		
		j = Math.round(c*(i+1));
		if(j>=b)
			j=j-b;
	}
}

sciMonk.ringMap=function(ringLines, colour, alpha){
	for(rln=0;rln<ringLines.length;rln++){
		sciMonk.mapRing(ringLines[rln], colour, alpha);
	}
}

sciMonk.mapRing=function(ringNodes, colour, alpha){
	for(rns=0;rns<ringNodes.length-1;rns++){
		nodeVector(ringNodes[rns], ringNodes[rns+1], colour, alpha);
	}
	if(ringNodes.length > 1)
		nodeVector(ringNodes[0], ringNodes[ringNodes.length-1], colour, alpha);
}


/*
	BATCH LINE MAP

*/
sciMonk.batchLineMap=function(lines, colours, multiColour, alpha){
	var i = 0;
	for(i=0;i<lines.length;i++){
		if(multiColour)
			sciMonk.lineMap(lines[i], colours[i], alpha);
		else
			sciMonk.lineMap(lines[i], colours, alpha);
	}
}

/*
	COLOUR MAP

*/
sciMonk.colourMap=function(ln,colour,id){
		fillTrianglePlane(ln,colour,id);
}

//	UTILITY METHODS

/*
	BATCH COLOUR MAP
	
*/
sciMonk.batchColourMap = function(shapes,colours,multiColour,id){
	var i =0;
	for(i=0;i<shapes.length;i++){
		if(multiColour)
			sciMonk.colourMap(shapes[i],colours[i],id);
		else
			sciMonk.colourMap(shapes[i],colours,id);
		
	}
}

/*
	COLOUR MAP SHAPE
*/
sciMonk.colourMapShape = function(obj){
	sciMonk.colourMap(obj.shape,obj.colour,obj.shapeId);
}
/*
	BATCH COLOUR MAP SHAPES
*/
sciMonk.batchColourMapShapes = function(objs){
	var i = 0;
	for(i=0;i<objs.length;i++){
		sciMonk.colourMapShape(objs[i]);
	}
}

/*
	COLOUR MAP MODEL
*/
sciMonk.colourMapModel = function(model){
	sciMonk.batchColourMapShapes(model.shapes);
}
/*
	LINE MAP OBJECT
*/
sciMonk.lineMapObject = function(obj,alpha){
	sciMonk.lineMap(obj.shape,obj.colour,alpha);
}
/*
	BATCH LINE MAP OBJECTS
*/
sciMonk.batchLineMapObjects = function(objs,alpha){
	var i = 0;
	for(i=0;i<objs.length;i++){
		sciMonk.lineMapObject(objs[i],objs[i].colour,alpha);
	}
}

/*
	LINE MAP MODEL
*/
sciMonk.lineMapModel = function(model, alpha){
	sciMonk.batchLineMapObjects(model.shapes, alpha);
}


/*
	NODE MAP

*/
sciMonk.nodeMap=function(lines,w){
	var i = 0;
	for(i=0;i<lines.length;i++){
		sciMonk.mapNodes(lines[i],w);
	}
}
sciMonk.mapNodes=function(nodes,w){
	var i =0;
	for(i=0;i<nodes.length;i++){
		sciMonk.nodeCross(nodes[i],w,[1,1,1,1]);
	}
}

/*
	NODE CROSS
	
*/
sciMonk.nodeCross=function(node,w,colour){
	w = w/2;
	nodeVector([node[0]-w,node[1],node[2]],[node[0]+w,node[1],node[2]], colour, false);
	nodeVector([node[0],node[1]-w,node[2]],[node[0],node[1]+w,node[2]], colour, false);
	nodeVector([node[0],node[1],node[2]-w],[node[0],node[1],node[2]+w], colour, false);
}

/*
	3D GRAPH

*/
sciMonk.graph3d=function(w,colour){
		w = w/2;
		nodeVector([-w,0,0],[w,0,0], colour, false);
		nodeVector([0,-w,0],[0,w,0], colour, false);
		nodeVector([0,0,-w],[0,0,w], colour, false);

}


/*
		OTHER UTLITIES
*/

/*
	BUBBLE SORT
	Sorts an array with the smallest at the beginning

*/
function bubbleSort( array ){
	for ( w = 0; w <= array.length; w++){
		var first = array[array.Length - 1];
		for ( i = array.length - 1 ; i >= 0; i--){
			if (first < array[i]){
				array[i + 1] = array[i];
				array[i] = first;
			}else{
				first = array[i];
			}
		}
	}
	return array;
}

/*
	SHUFFLE ARRAY
	returns a shuffled copy of a given array

*/
function shuffle(array, st){
	var i =0;
	var j=0;
	var array2 = copyArray(array);
	
	for(j=0;j<array.length;j++){
		if(j+st<0)
			array[array.length+st+j] = array2[j];
		else if(j+st>(array.length-1))
			array[j+st-array.length] = array2[j]; 
		else
			array[j+st] = array2[j]; 
	}
	
	return array;
}

/*
	BATCH SHUFFLE
	returns an array of shuffled copies of given arrays
*/
function batchShuffle(batch, steps){
	var i = 0;
	for(i=0;i<batch.length;i++){
		batch[i] = shuffle(batch[i], steps);
	}
	return batch;

}

/*
	SWITCH PLACES
	return a copy of a given array with 
*/
function switchPlaces(array, i, j){
	var ar = copyArray(array);
	var c = ar[i];
	ar[i] = ar[j];
	ar[j] = c;
	return ar;
}

/*
	COPY ARRAY
	returns a copy of a given array

*/
function copyArray(a1){
	var a2 = new Array();
	var i = 0;
	for(i=0;i<a1.length;i++){
		a2[i] = a1[i];
	}
		
	return a2;
}

/*
	REVERSE ARRAY
	returns a reversed copy of a given array
*/
function reverse(array){
	var array2 = new Array();
	var i=0;
	var len = array.length;
	for(i=0;i<len;i++){
		array2[i] = array[len-1-i];
	}
	return array2;
}

/*
	BATCH REVERSE
	returns an array of revered copies of given arrays
*/
function batchReverse(batch){
	var i = 0;
	for(i=0;i<batch.length;i++){
		batch[i] = reverse(batch[i]);
	}
	return batch;
}

/*
	CONCAT ARRAY
	returns a concatenated copy of two given arrays
*/
function concatArray(a1,a2){
	if(!a2)
		return a1;
	if(!a1)
		return a2;
	if(a2.lenght<1)
		return a1;
	if(a1.length<1)
		return a2;
	var i = 0;
	var c = copyArray(a1);
	var len =  c.length;
	for(i=0;i<a2.length;i++){
		 c[len+i] = a2[i];
	}
	return  c;
}

/*
	REMOVE ELEMENT
	returns a copy of a given array without the element at a given index

*/
function removeElement(array,e){
	if(e>=0 && e < array.length){
		var copy = new Array();
		var i = 0;
		var j = 0;
		for(i=0;i<array.length;i++){
			if(i!=e){
				copy[j] = array[i];
				j++;
			}
		}
		return copy;
	}
	return array;
}

/*
	TAKE N FIRST ELEMENTS IN ARRAY
	returns an array of the first n elements
*/

function take(array,n){
	if(n < array.length){
		var newArray = new Array();
		var i =0;
		for(i=0;i<n;i++){
			newArray[i] = array[i];
		}
		return newArray;
	}else{
		return array;
	}
}

/*
	DROP N FIRST ELEMENTS IN ARRAY
	returns a copy of a given array without the n first elements
*/

function drop(array,n){
	if(n < array.length){
		var newArray = new Array();
		var i =0;
		var j=0;
		for(i=n;i<array.length;i++){
			newArray[j] = array[i];
			j++;
		}
		return newArray;
	}else{
		return array;
	}
}

/*
	LIST
*/
sciMonk.List = function(){
	this.list = new Array(),
	this.size = function (){return this.list.length},
	this.add = function (item){
		this.list[this.size()] = item;
	},
	this.remove = function(index){
		if(index > 0 && index < this.size()){
			this.list = removeElement(this.list,index);
		}
	}
}

/*
	SHAPE
*/
sciMonk.Shape = function(scale,pos,rot,colour,shapeType,shape){
	this.scale=scale;
	this.pos=pos;
	this.rot=rot;
	this.colour=colour;
	this.shapeType=shapeType;
	this.shape=shape;
}

/*
	MODEL
*/
sciMonk.Model = function(name, modelId, user, userId, shapes){
	this.name = name;
	this.modelId = modelId;
	this.user = user;
	this.userId = userId;
	this.shapes = shapes;
}

/*
	COPY SHAPE
*/
sciMonk.copyShape = function(shape){
	var ns = new sciMonk.Shape(copyArray(shape.scale),copyArray(shape.pos),copyArray(shape.rot),
			copyArray(shape.colour),shape.shapeType,copyArray(shape.shape));
	return ns;
}

/*
	COPY SHAPES
*/
sciMonk.batchCopyShapes = function(shapes){
	var i = 0;
	var ns = new Array();
	for(i=0;i<shapes.length;i++)
		ns[i] = sciMonk.copyShape(shapes[i]);
	return ns;
}

/*
	COPY MODEL
*/
sciMonk.copyModel = function(model){
	var nm = new sciMonk.Model(model.name,model.modelId,model.user,model.userId,sciMonk.batchCopyShapes(model.shapes));
	return nm;
}




/*
	REPLACE ALL
	replaces all occurences in string 
*/
function replaceAll(txt,rep,newStr){
	var len=rep.length;
	var ti=0;
	while(ti<=txt.length-len){
		if(txt.substring(ti,ti+len)==rep){
			txt = txt.substring(0,ti)+newStr+txt.substring(ti+len,txt.length);
			ti = ti+newStr.length;
		}else{
			ti++;
		}

	}
	return txt;
}