
/*
	SCIMONK
	BETA VERSION_1.0
	BY DENNIS JÖNSSON,
	17-03-2014

*/

var shapes = new Array()
var sciMonk = new Object();
sciMonk.version = "beta_v1_0";
sciMonk.javascriptSrc = "http://dennisjonsson.com/sciMonk/distributable/sciMonk/scimonk_"+sciMonk.version+".js";
sciMonk.Depth=1;
sciMonk.Width=1;
sciMonk.Height=1;
sciMonk.CanvasHeight = 0;
sciMonk.CanvasWidth = 0;
var imageData;
var Canvas;
var Ctx;
sciMonk.isEditable = false;
sciMonk.dividePlane = true;

sciMonk.moveMax=0;

sciMonk.yMove = 0;
sciMonk.xMove = 0;
sciMonk.zMove = 0;
sciMonk.xRzRot = 0;
sciMonk.yRzRot = 0;
sciMonk.xRyRot = 0;

sciMonk.undefinedShapeId = -1;

sciMonk.init=function(canvas){
	Canvas = canvas;
	Ctx = Canvas.getContext("2d");
	Message = document.getElementById("message");
	sciMonk.shadow = false;
	sciMonk.shadowVector = [0,0,0];
	
	sciMonk.maxSurfaceArea = 2500;
	sciMonk.maxLineLength = Math.sqrt(sciMonk.maxSurfaceArea);
	
	sciMonk.Depth = Canvas.width;
    sciMonk.Width = Canvas.width;
    sciMonk.Height = Canvas.height;
	sciMonk.CanvasHeight = Canvas.height;
	sciMonk.CanvasWidth = Canvas.width;
	sciMonk.viewPort = sciMonk.CanvasHeight/sciMonk.CanvasWidth;
	sciMonk.lightVector = [-sciMonk.Width/2,sciMonk.Height/2,-sciMonk.Depth];
	
	sciMonk.background = "#FFFFFF";
	sciMonk.lineColour = "#111111";
	sciMonk.lineWidth = 1;
	sciMonk.shadowColour = [50,50,50,200]
	sciMonk.alpha = 255;
	
	sciMonk.depthMap = new Float32Array(sciMonk.CanvasHeight*sciMonk.CanvasWidth*3);
	sciMonk.shadowMap = new Array();
	iniDepthMap();
	// default draw method
	sciMonk.draw=function draw(){
		
	};
	run();
	
}

/*
	MAIN RUNNING POINT

*/
sciMonk.drawing = false;
sciMonk.it = 1;
sciMonk.update = true;
function run(){
	if(sciMonk.update == true){
		sciMonk.update = false;
		render();
	}
	var time = setTimeout("run()", 25);
}

function render(){
	sciMonk.drawing = true;
	//drawMethod = changeDrawMethod;
	sequenceStart[1]();
	sciMonk.draw();
	if(sciMonk.isEditable){
		drawEditor();
	}
	sciMonk.it++;
	sequenceEnd[1]();
	sciMonk.drawing = false;
}

sciMonk.objectsToImages = function(objects){
	sciMonk.reset();
	var old = sciMonk.draw;
	var i = 0;
	var imgs = new Array();
	for(i = 0;i<objects.length;i++){
		sciMonk.draw = function(){
			sciMonk.batchColourMapShapes(objects[i].shapes);
		}
		sciMonk.update=true;
		render();
		imgs[i] = document.createElement("img");
		imgs[i].src = Canvas.toDataURL("image/png");
	}
	sciMonk.draw = old;
	sciMonk.update=true;
	return imgs;

}

sciMonk.objectToImage = function(object){
	sciMonk.reset();
	var old = sciMonk.draw;
	sciMonk.draw = function(){
		sciMonk.batchColourMapShapes(objects[i].shapes);
	}
	sciMonk.update=true;
	render();
	var img = document.createElement("img");
	img.src = Canvas.toDataURL("image/png");
	sciMonk.draw = old;
	sciMonk.update=true;
	return imgs;
}

/*
	DRAWING FUNCTIONS

*/
sciMonk.reset = function(){
	sciMonk.xMove = 0;
	sciMonk.yMove = 0;
	sciMonk.zMove = 0;
	sciMonk.yRzRot = 0;
	sciMonk.xRzRot = 0;
	sciMonk.xRyRot = 0;
	
}

function reset(){
	sciMonk.reset();
}


/*
	ENDS DRAWING SEQUENCE

*/
var sequenceEnd = new Array(
	function (){
		Ctx.lineWidth = sciMonk.lineWidth;
		Ctx.strokeStyle = sciMonk.lineColour;
		Ctx.closePath(); 
		Ctx.stroke();
	},
	function(){
		Ctx.putImageData(imageData, 0, 0); // at coords 0,0
	}
);

/*
	STARTS DRAWING SEQUENCE

*/
var sequenceStart = new Array(
	function (){ // Start sequence for drawing lines
		// Line
		Ctx.beginPath();
		Ctx.fillStyle = sciMonk.background;
		Ctx.fillRect( 0, 0, Canvas.width, Canvas.height );
	},
	function(){ // start sequence for putting pixels on image map
		imageData = Ctx.createImageData(sciMonk.Width, sciMonk.Height); 
	}
);

/*
	INITIATE DEPTH MAP
	
*/
function iniDepthMap(){
	var i=0;
	var d = -sciMonk.Depth/2;
	for(i=0;i<sciMonk.CanvasWidth*sciMonk.CanvasHeight*3;i+=3){
		sciMonk.depthMap[i] = d;
		sciMonk.depthMap[i+1] = 0;
		sciMonk.depthMap[i+1] = sciMonk.undefinedShapeId; // depth, update iteration, shape id
	}
}


/*
	CALLS DRAWING FUNCTIONS FOR DRAWLINE
*/

/**
 * Draw line
 * @param {*} x1 
 * @param {*} x2 
 * @param {*} y1 
 * @param {*} y2 
 * @param {*} z1 
 * @param {*} z2 
 * @param {*} co 
 * @param {*} id 
 */
function drawLine( x1, x2, y1, y2, z1, z2, co, id){
	var u =[x1,y1];
	var v =[x2,y2];
	var uv = uToV(u,v);
	var len = vLen(uv)*1.2;
	var w = (z2-z1)/len;// Depth test
	var t =0;
	var Z = sciMonk.Depth/3;
	for(t=0;t<len;t++){
		var x = u[0]+uv[0]/len*t|0;
		var y = u[1]+uv[1]/len*t|0;
		var z = z1 + w*t;
		var Zindex = y*(sciMonk.CanvasWidth*3) + x*3;
		if( ((x > 0 && x < sciMonk.CanvasWidth) && ( y > 0 && y < sciMonk.CanvasHeight)) && (z > -Z) ){
			//Depth test
			if(sciMonk.it > sciMonk.depthMap[ Zindex + 1] || sciMonk.depthMap[Zindex] >= z){ 
				sciMonk.depthMap[Zindex]=z;
				sciMonk.depthMap[Zindex + 1]=sciMonk.it;
				sciMonk.depthMap[Zindex + 2]=id;
				setPixel(
				x, 
				y, 
				co[0],co[1],co[2],co[3]);
			}
		}
	}
}

/*
	FILL

*/

function fillTriangle(plane,colour,id){
	var a = [plane[1][0]-plane[0][0],plane[1][1]-plane[0][1]];
	var az = plane[1][2]-plane[0][2];

	var b = [plane[0][0]-plane[2][0],plane[0][1]-plane[2][1]];
	var bz = plane[0][2]-plane[2][2];

	drawTriangle(plane[2],b,bz,plane[0],a,az,colour,id);
}

function drawTriangle(u,ux,uxZ,v,vx,vxZ,colour,id){
	var i = 0;
	var uxLen = vLen(ux)*1.5;
	for(i=0;i<uxLen;i++){
		drawLine(
		u[0] + ux[0]/uxLen*i, 
		v[0] + vx[0],
		u[1] + ux[1]/uxLen*i,
		v[1] + vx[1],
		u[2] + uxZ/uxLen*i,
		v[2] + vxZ,
		colour,id);//-
	}
}

/*
	APPLY TEXTURE
*/
function applyTextureFromSource(shape,source){
	var can = document.createElement("canvas");
	var img = new Image();
	img.src = source;
	img.onload = function() { 
		can.width=img.width;
		can.height=img.height;
		can.getContext('2d').drawImage(img,0,0); 
		var imgData = can.getContext('2d').getImageData(0,0,img.width,img.height);
		applyTextureFromImageData(shape,imgData.data,can.width,can.height);
	}
}

/*
	SET ALPHA CHANNEL

*/

function setAlpha(cords,colour){
	
  /*
	var origo = getOrigo(cords);
	var normal = planeNormal(cords);
	var nv = addV(origo,Vx(normal,0.5));
	nodeVector(addV(origo,Vx(normal,-0.5)),nv,[100,50,50,250],false);
*/

	var plane = uPlane(cords);
  var origo = getOrigo(plane);
	var normal = planeNormal(plane,origo);
	
	var lv = uToV(origo,Vx(sciMonk.lightVector,0.5));
	var nv = uToV(origo,addV(origo,normal));
	
	var persp = uToV([0,0,-sciMonk.Depth/2],origo)
	var nv1 = vectorAngle(nv,persp);
	var nv2 = vectorAngle(uToV(origo,addV(origo,Vx(normal,-1))),persp);
	
	var a=0;
	if(nv1 <= nv2)
	 a = vectorAngle(nv,lv);
	else
	 a = vectorAngle(Vx(nv,-1),lv);
	
	return [colour[0] , 
			colour[1] ,
			colour[2],
			200+55*Math.cos(a)];
}

/*
	CAST SHADOW

*/
function castShadow(nodes){
	return translateNodes(nodesXm(nodes,[[1,0,0],[0,0,0],[0,0,1]]),sciMonk.shadowVector);
}


function setLineAlpha(u,v){
	var uv = uToV(u,v);
	var m = [u[0]+uv[0]/2,u[1]+uv[1]/2,u[2]+uv[2]/2];
	var n = lineNormal(u,v);
	var nv = uToV(m,uNode(n));
	var lv = uToV(sciMonk.lightVector,m);// Light vector
	var a = vectorAngle( nv, lv);
	return /*170+170*Math.cos(a);*/170+170*Math.cos(a);
	
}

/*
	Z COORDINAT ON MAP

*/
function zOnMap(z){
	return (sciMonk.CanvasWidth/sciMonk.Depth)*z;
}

/*
	SET PIXEL
	For draw method 1 (0 .. n)

*/
function setPixel( x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}