
var frontModel = new Array(
	function(cubes,size,distance){
		var colours = [[228,107,111,250],[1,1,1,200],[89,180,206,250],[228,107,111,250],[126,220,164,250]];
		//colours[Math.round(4*r)]
		//[250*r,250*r2,250*r3,250]
		var shapes = new Array();
		var i =0;
		for(i=0;i<cubes;i++){
			var r = Math.random();
			var r2 = Math.random();
			var r3 = Math.random();
			var c = distance*r;
			var c1 = distance*r2;
			var c2 = distance*r3;
			var s = size*r;
			var pi = 2*Math.PI*r;
			var d1 = Math.round(Math.cos(pi));
			var d2 = Math.round(Math.sin(pi));
			var d3 = Math.round(Math.sin(pi/2));
			shapes[i] = new sciMonk.Shape(1,[c*d1,c1*d2,c2*d3],[pi,pi,pi],[1,1,1,250],"box",
							rotate([c*d1,c1*d2,c2*d3],box([c*d1,c1*d2,c2*d3],[s,s,s]),[pi,pi,pi]));

		}
		var model = new Object;
		model.shapes = shapes;
		return model;
	}
	
);

//translateShape(shape,v)
//rotate(o,s,deg)

var mixer = new Object();
mixer.mix = true;
mixer.mixMmodel = function(model){
	mixer.model = model;
	mixer.mixedModel = new Object();
	mixer.mixedModel.shapes = new Array();
	mixer.lines = new Array(); // drawing lines between the cubes
	var i = 0;
	for(i=0;i<model.shapes.length;i++){
		mixer.mixedModel.shapes[i] = new sciMonk.Shape(model.shapes[i].scale,model.shapes[i].pos,model.shapes[i].rot,
		model.shapes[i].colour,model.shapes[i].shapeType, new Array());
	} 
	mixer.mixShapes();
}
mixer.do = function(){

}
mixer.rot = [0,0,0];
mixer.mixShapes = function(){
	var i = 0;
	var lines = new Array();
	for(i=0;i<mixer.model.shapes.length;i++){
		mixer.mixedModel.shapes[i].rot[0] += Math.PI/(50+50*Math.random());
		mixer.mixedModel.shapes[i].rot[1] += Math.PI/(50+50*Math.random());
		mixer.mixedModel.shapes[i].rot[2] += Math.PI/(50+50*Math.random());
		mixer.mixedModel.shapes[i].shape = rotate([0,0,0],mixer.model.shapes[i].shape,mixer.mixedModel.shapes[i].rot);
		mixer.mixedModel.shapes[i].colour = [250*Math.random(),250*Math.random(),250*Math.random(),250];
		// for drawing lines between the cubes
		mixer.lines[i] = [getShapeOrigo(mixer.mixedModel.shapes[i].shape),getShapeOrigo(mixer.mixedModel.shapes[(i+1)%25].shape)];
	}
	mixer.do();
	if(mixer.mix)
		var time = setTimeout("mixer.mixShapes()",50);
}




