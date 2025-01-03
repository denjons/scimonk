
/*
	SCALE SHAPE
*/
function scaleShape(shape,vn,origo){
	if(!origo){
		origo = getShapeOrigo(shape);
	}
	var nv = new Array();
	var i = 0; 
  // console.log("scaleShape: "+ shape.length); all vertecies
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
	var len = nodes.length; // line 2 or triangle 3
	var i=0;
  //console.log("getOrigo: "+ len); is 4
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
			ns[i][j] = sciMonk.rotateNode(shape[i][j],rot,origo);
		}
	}
	return ns;
}



/*
	ROTATE NODE

*/



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
const lineMap=function(ln, colour, alpha){
	for(var i=0;i<ln.length;i++){
		sciMonk.lines(ln[i], colour, alpha);
	}
}

/*
	BATCH LINE MAP

*/
const batchLineMap=function(lines, colours, multiColour, alpha){
	var i = 0;
	for(i=0;i<lines.length;i++){
		if(multiColour)
			lineMap(lines[i], colours[i], alpha);
		else
			lineMap(lines[i], colours, alpha);
	}
}

/*
	COLOUR MAP

*/


//	UTILITY METHODS

/*
	BATCH COLOUR MAP
	
*/
const batchColourMap = function(shapes,colours,multiColour,id){
	var i =0;
	for(i=0;i<shapes.length;i++){
		if(multiColour)
			sciMonk.fill(shapes[i],colours[i],id);
		else
			sciMonk.fill(shapes[i],colours,id);
		
	}
}

/*
	COLOUR MAP SHAPE
*/
const colourMapShape = function(obj){
	sciMonk.fill(obj.triangles,obj.colour,obj.shapeId);
}
/*
	BATCH COLOUR MAP SHAPES
*/
const batchColourMapShapes = function(objs){
	var i = 0;
	for(i=0;i<objs.length;i++){
		colourMapShape(objs[i]);
	}
}


/*
	LINE MAP OBJECT
*/
const lineMapObject = function(obj,alpha){
	lineMap(obj.shape,obj.colour,alpha);
}
/*
	BATCH LINE MAP OBJECTS
*/
const batchLineMapObjects = function(objs,alpha){
	var i = 0;
	for(i=0;i<objs.length;i++){
		lineMapObject(objs[i],alpha);
	}
}

/*
	LINE MAP MODEL
*/
const lineMapModel = function(model, alpha){
	batchLineMapObjects(model.shapes, alpha);
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



/*
		OTHER UTLITIES
*/

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

sciMonk.crushTriangles = function(shape, times){
  for(var i = 0; i < times; i++){
    const array = new Array();
    for(triangle of shape){
      crushTriangle(triangle, array);
    }
    if(i == times - 1){
      return array;
    }
    shape = array;
  }

}

function crushTriangle(triangle, dest){
    const p1 = triangle[0];
    const p2 = triangle[1];
    const p3 = triangle[2];
    const origo = getOrigo(triangle);
    const np1 = middle(p1, p2);
    dest.push([p1, np1, origo]);
    dest.push([np1, p2, origo]);
    const np2 = middle(p2, p3);
    dest.push([p2, np2, origo]);
    dest.push([np2, p3, origo]);
    const np3 = middle(p3, p1);
    dest.push([p3, np3, origo]);
    dest.push([np3, p1, origo]);
}



sciMonk.shakeTriangles = function(shape, scale){
  scale = Math.ceil(scale*Math.random());
  for(triangle of shape){
    for(var i = 0 ; i < triangle.length; i++){
      var point = copyArray(triangle[i]);
      point[0] += (point[2]%scale)*sign(point[0]);
      point[1] += (point[0]%scale)*sign(point[1]);
      point[2] += (point[1]%scale)*sign(point[2]);
      triangle[i] = point;
    }
  }
}


*/




