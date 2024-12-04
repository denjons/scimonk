
var insides = new  Object();
insides.loading=true;
insides.insidesCollection = new Array(
	function(col){
		var obj = new Object();
			obj.colours = new Array();
			
			obj.paintAll = true;
			obj.shapes = new Array();
			obj.colours[0] = [228,107,111,250];
			obj.colours[1] = [1,1,1,200];
			obj.colours[2] = [89,180,206,250];
			obj.colours[3] = [228,107,111,250];
			obj.colours[4] = [126,220,164,250];
			obj.shapes[0] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[0,Math.PI/3,0]);
			obj.shapes[1] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[Math.PI/3,0,0]);
			obj.shapes[2] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[0,Math.PI/3,Math.PI/2]);
			obj.shapes[3] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[Math.PI/4,0,Math.PI/2]);
			obj.shapes[4] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[0,Math.PI/3,0]);
			obj.shapes = concatArray(obj.shapes,branchOut(obj.shapes[1],6,1, 3, 5, 10, 3, 10, 1, 5));
			obj.shapes = concatArray(obj.shapes,branchOut(obj.shapes[2],7,1, 3, 5, 10, 3, 10, 1, 5));
			obj.shapes = concatArray(obj.shapes,branchOut(obj.shapes[3],7,1, 3, 5, 10, 3, 10, 1, 5));
			obj.coloured = new Object();
			obj.coloured.shapes = new Array();
			obj.coloured.colour = new Array();
			/*var j;
			 Math.random();
			for(j=0;j<5;j++){
				var c = Math.random();
				var d = Math.random();
				obj.coloured.shapes[j] = rotate([(200*c-100),(200*d-100),0],box([(200*c-100),(200*d-100),0],[20*c,20*c,20*c]),[Math.PI*d,Math.PI*c,Math.PI*c]);
			//	obj.coloured.colour[j] = [228*c,250*c,250*d,250];
			}
			obj.coloured.shapes[0] = rotate([75,100,0],box([75,100,0],[30,30,30]),[0,Math.PI/3,0]);
			obj.coloured.colour[0] = [228,107,111,250];
			obj.coloured.colour[1] = [1,1,1,200];
			obj.coloured.colour[2] = [89,180,206,250];
			obj.coloured.colour[3] = [228,107,111,250];
			obj.coloured.colour[4] = [126,220,164,250];*/
			
			var i = 0;
			var len = obj.shapes.length;
			for(i=4;i<len;i++){
				//obj.colours[i] = [Math.random()*250,Math.random()*250,Math.random()*250,Math.random()*250];
				obj.colours[i] = [Math.random()*250,Math.random()*250,Math.random()*250,250];
			}
			
			
			return obj;
	},
function(col){
		var obj = new Object();
		obj.colours = new Array();	
		obj.paintAll = true;
		obj.shapes = new Array();
		obj.coloured = new Object();
		obj.coloured.colour = new Array();
		obj.coloured.paintAll = true;
		obj.coloured.shapes = new Array();
		var c = Math.random();
		obj.coloured.shapes[0] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[0,c*Math.PI/3,0]);
		obj.coloured.shapes[1] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[c*Math.PI/3,0,0]);
		obj.coloured.shapes[2] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[0,Math.PI/3,c*Math.PI/2]);
		obj.coloured.shapes[3] = rotate([75,-75,0],sphere([75,-75,0],[100,100,100],16,16),[c*Math.PI/4,0,Math.PI/2]);
		obj.coloured.colour[0] = [250*Math.random(),250*Math.random(),250*Math.random(),250];
		obj.coloured.colour[1] = [1,1,1,200];
		obj.coloured.colour[2] = [250*Math.random(),250*Math.random(),250*Math.random(),250];
		obj.coloured.colour[3] = [250*Math.random(),250*Math.random(),250*Math.random(),250];
		obj.coloured.colour[4] = [250*Math.random(),250*Math.random(),250*Math.random(),250];
		
		obj.shapes = concatArray(obj.shapes,branchOut(obj.coloured.shapes[0],6,1, 3, 5, 10, 3, 10, 1, 5));
		obj.shapes = concatArray(obj.shapes,branchOut(obj.coloured.shapes[0],7,1, 3, 5, 10, 3, 10, 1, 5));
	
		var i = 0;
		var len = obj.shapes.length;
		for(i=0;i<len-1;i++){
			//obj.colours[i] = [Math.random()*250,Math.random()*250,Math.random()*250,Math.random()*250];
			obj.colours[i] = [Math.random()*250,Math.random()*250,Math.random()*250,Math.random()*250];
		}
		
		
		return obj;
	}		
);

/*
	SCREW
	
*/
function screw(beg,end,width,w,d,curves,inter,r,l){
	
	return spiral(beg, end, width, 1, w, 1, d, 1, curves, inter, r, l);
		
}

/*
	SPIRAL
	
*/
function spiral(beg, end, width, endWidth, w, endW, d, endD, curves, inter, r, l){
	var total = curves * inter;
	var widthDif = (endWidth-width)/total;
	var wDif = (endW-w)/total;
	var dDif = (endD-d)/total;
	var xL = end[0]-beg[0];
	var yL = end[1]-beg[1];
	var zL = end[2]-beg[2];
	var len = Math.sqrt(xL*xL+yL*yL+zL*zL);
	var incr = len/total;
	var a1=0;
	var a2=0;
	var lines = new Array();
	var j=0;
	var dd = d/(2*inter);
	var ww = w/(2*inter);
	for(j=0;j<2*inter;j++){
		a1 = 2*Math.PI/(2*inter)*j;
		a2 = 2*Math.PI/(2*inter)*(j+1);
		lines = connectShapes(
					lines,
				    [[[beg[0]+(ww*j)*Math.cos(a1),beg[1]+incr*(j),beg[2]+(dd*j)*Math.sin(a1)],
					[beg[0]+(ww*(j+1))*Math.cos(a2),beg[1]+incr*(j+1),beg[2]+dd*(j+1)*Math.sin(a2)]]]
				);
	}
	if(curves>1){
		var i=0;
		for(i=0;i<total;i++){
				a1 = 2*Math.PI+(curves-2)*Math.PI/total*i;
				a2 = 2*Math.PI+(curves-2)*Math.PI/total*(i+1);
				lines = connectShapes(
							lines,
							[[[beg[0]+(w+wDif*i)*Math.cos(a1),beg[1]+incr*(j+i),beg[2]+(d+dDif*i)*Math.sin(a1)],
								[beg[0]+(w+wDif*(i+1))*Math.cos(a2),beg[1]+incr*(j+i+1),beg[2]+(d+dDif*(i+1))*Math.sin(a2)]]]
							
						);
		}
	}
	return directShape(lines,beg,end);
}

/*
	CONNECT SHAPES

*/
function connectShapes(first, second){
	var i = 0;
	if(!first)
		return second;
	else if(!second)
		return first;
	var len = first.length;
	for(i=0;i<second.length;i++){
		first[len+i] = second[i];
	}
	return first;
}

/*
	DIRECT SHAPE

*/

function directShape( shape, beg, end ){
	var xL = end[0]-beg[0];
	var yL = end[1]-beg[1];
	var zL = end[2]-beg[2];
	var len = Math.sqrt(xL*xL+yL*yL+zL*zL);
	
	var origo = [beg[0],beg[1],beg[2]];
	
	if(len == Math.abs(xL)){
		return rotate(
		origo,
			rotate(
					origo,
					shape,
					[Math.PI/4,0,Math.PI/2]),
				[0,-2*Math.PI/3,0]
			);	
	}else if(len == Math.abs(yL)){
		var angs = [Math.PI/4,0,0];
		if(yL>0)
			angs[2]=Math.PI;
		return rotate(
				origo,
				shape,
				angs);

	}else if(len == Math.abs(zL)){
		return rotate(
				origo,
				shape,
				[Math.PI/4,Math.PI/2,0]);
	}else{
		var xRzA = 0;
		var xRyA = 0;
		var yRzA = 0;
		
		xRzA = Math.atan(zL/xL);
		xRyA = Math.atan(yL/xL);
		yRzA = Math.atan(yL/zL);
		var angs = new Array();
		angs = [xRzA,yRzA,xRyA];
	
		return 	rotate(
					origo,
					shape,
					angs
				);
	}
}


/*
	BRANCH OUT
	returns an array of branches from a given list of coordinates
	
*/
function branchOut(branch,branches,shouldContinue,wbeg,xbeg,zbeg,curves,inter,rs,ls){
	var brns = getBranchCoords(branch,branches);
	var n = 0;
	var other = new Array();
	var vVeins = new Array();
	for(n=0;n<brns.length;n++){
		var co = brns[n];
		var end = [co[0]+co[0]*Math.random(),co[1]+co[1]*Math.random(),co[2]+20+co[2]*Math.random()];
		vVeins[n] = spiral(brns[n],end, wbeg, 1, xbeg, 1, zbeg, 1, curves,inter,rs,ls);
		if(shouldContinue>0){
			other = concatArray(other,branchOut(vVeins[n],branches,shouldContinue-1, wbeg/3,20,20,curves,inter,rs,ls));
		}
	}
	if(other.length>0){
		return concatArray(vVeins,other);
	}
	return vVeins;
}	

/*
	BRANCH CORDS
	Returns an array of randomly placed points along a given structure 

*/
function getBranchCoords(bran,brs){
	var i=0;
	var adds = Math.floor((bran.length-1)/brs); 
	var lines= new Array();
	for(i=0;i<brs-1;i++){
		var j = 0;
		var part = bran[i*adds + Math.round(adds*Math.random())];
		var x = 0;
		var y = 0;
		var z = 0;
		var len = part.length;
		for(j=0;j<part.length;j++){
			x += part[j][0];
			y += part[j][1];
			z += part[j][2];
		}
		lines[i] = [x/len,y/len,z/len];
	}
	return lines;
}
