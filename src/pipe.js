
/*
	PIPE
	
*/
function pipe(beg, end, w, r, s){

	var xL = end[0]-beg[0];
	var yL = end[1]-beg[1];
	var zL = end[2]-beg[2];
	var len = Math.sqrt(xL*xL+yL*yL+zL*zL);
	
	var origo = [beg[0]+xL/2,beg[1]+yL/2,beg[2]+zL/2];
	
	if(w<=1){
		//s=1
		return [[beg],[end]];//cylinder(beg[0]+xL/2,beg[1]+yL/2,beg[2]+zL/2,w,len,w,r,s);
	//	return [[beg],[end]];
	}else{
		var shape = cylinder(beg[0]+xL/2,beg[1]+yL/2,beg[2]+zL/2,w,len,w,r,s);
		//return directShape(cylinder(beg[0]+xL/2,beg[1]+yL/2,beg[2]+zL/2,w,len,w,r,s),beg,end);
	}
		
	//var shape = cylinder(beg[0]+xL/2,beg[1]+yL/2,beg[2]+zL/2,w,len,w,r,s);
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
		return rotate(
				origo,
				batchShuffle(shape,s/2),
				[Math.PI/4,0,0]);
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
		
		angs = [xRzA,yRzA,yRzA];//angs = [0,0,xRyA];
	
		if(zL==0){
			if((xL)>0){
				xRyA += Math.PI;
			}
			angs = [0,0,xRyA];
		}else{
			var xr = 0;
			if((xL)>0){
				xr = Math.PI ;
			}
			angs = [xr,yRzA,0];
		}
		if(xL==0){
			angs[1]+=Math.PI;
		}
		if(xL<0){
			angs[0]+=-Math.PI;
		}
		
		return rotate(
					origo,
					rotate(
							origo,
							rotate(
								origo,
								shape,
								[0,0,Math.PI/2]
							),
						[Math.PI-xRzA,0,0]
					),
					angs
				);
	}
}


/*
	PIPE 3
	pipe using line normal

*/
function pipe3(u,v,w,r,s){

	if(w<=1){
		return [[u],[v]];
	}
	
	var ln = uToV(u,v);
	var len = vDist(u,v);
	
	var origo = [u[0]+ln[0]/2,u[1]+ln[1]/2,u[2]+ln[2]/2];
	if(len == Math.abs(ln[0])){
		return rotate(
		origo,
			rotate(
					origo,
					cylinder(u[0]+ln[0]/2,u[1]+ln[1]/2,u[2]+ln[2]/2,w,len,w,r,s),
					[Math.PI/4,0,Math.PI/2]),
				[0,-2*Math.PI/3,0]
			);	
	}else if(len == Math.abs(ln[1])){
		return rotate(
				origo,
				batchShuffle(cylinder(u[0]+ln[0]/2,u[1]+ln[1]/2,u[2]+ln[2]/2,w,len,w,r,s),s/2),
				[Math.PI/4,0,0]);
	}else if(len == Math.abs(ln[2])){
		return rotate(
				origo,
				cylinder(u[0]+ln[0]/2,u[1]+ln[1]/2,u[2]+ln[2]/2,w,len,w,r,s),
				[Math.PI/4,Math.PI/2,0]);
	}
	
	var n1 = uToV(u,v);
	n1 = Vx(n1,1/vLen(n1));
	var n2 = lineNormal(u,v);
	n2 = Vx(n2,1/vLen(n2));
	var n3 = lineNormal(n2,ln);
	n3 = Vx(n3,1/vLen(n3));
	
	/*var x=1;
	if(ln[0]<=0)
		x = -1;
	var y = 1;
	if(ln[1]<=0)
		y = -1;*/
		
	var N = [n2,n1,n3];
	
	// VISUAL COMMENT
	//nodeVector(u,addV(u,Vx(n1,w)));
	//nodeVector(u,addV(u,Vx(n2,w)));
	//nodeVector(u,addV(u,Vx(n3,w)));
	// VISUAL COMMENT
	
	
	var Ninv = inverseMatrix(N);
	var lines = new Array();
	var i = 0;
	
	for(i=0;i<=r;i++){
		var nodes = new Array();
		var j =0;
		for(j=0;j<=s;j++){
			var a = 2*Math.PI/s*j;
			var A = Ab([[Math.cos(a),Math.sin(a),0],[-Math.sin(a),Math.cos(a),0],[0,0,1]],[w/2,w/2,0]);
			//alert(A);
			//alert(multMatrix(N,Ninv));
			nodes[j] = 
				addV(addV(u,Vx(ln,1/r*i)),Ab(N,Ab(Ninv,A)));
		
		}
		lines[i] = nodes;
	}
	
	return lines;
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
	/*	if(zL==0){
			if((xL)>0){
				xRyA += Math.PI;
			}
			angs = [0,0,xRyA];
		}else{
			var xr = 0;
			if((xL)>0){
				xr = Math.PI ;
			}
			angs = [xr,yRzA,0];
		}
		if(xL==0){
			angs[1]+=Math.PI;
		}*/
		
		return 	rotate(
					origo,
					shape,
					angs
				);
	}
}

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
	/*
		Connect first coordinate and point of the beginning radius
	*/
	var j=0;
	var dd = d/(2*inter);
	var ww = w/(2*inter);
	for(j=0;j<2*inter;j++){
		a1 = 2*Math.PI/(2*inter)*j;
		a2 = 2*Math.PI/(2*inter)*(j+1);
		lines = connectShapes(
					lines,
					pipe3([beg[0]+(ww*j)*Math.cos(a1),beg[1]+incr*(j),beg[2]+(dd*j)*Math.sin(a1)],
					[beg[0]+(ww*(j+1))*Math.cos(a2),beg[1]+incr*(j+1),beg[2]+dd*(j+1)*Math.sin(a2)],
					width,r,l)
				);
	}
	/*
		Spiral
	*/
	if(curves>1){
		var i=0;
		for(i=0;i<total;i++){
				a1 = 2*Math.PI+(curves-2)*Math.PI/total*i;
				a2 = 2*Math.PI+(curves-2)*Math.PI/total*(i+1);
				lines = connectShapes(
							lines,
							pipe3([beg[0]+(w+wDif*i)*Math.cos(a1),beg[1]+incr*(j+i),beg[2]+(d+dDif*i)*Math.sin(a1)],
								[beg[0]+(w+wDif*(i+1))*Math.cos(a2),beg[1]+incr*(j+i+1),beg[2]+(d+dDif*(i+1))*Math.sin(a2)],
								width+widthDif*i,r,l)
						);
		}
	}
	return directShape(lines,beg,end);
}

/*
	PIPE CIRCLE
	returns a circle of connected pipes

*/
function pipeCircle(pos, width, w, h, beg, rot, itner,r,l){
	var lines = new Array();
	for(p=0;p<=itner;p++){
			lines = connectShapes(lines,pipe(
			[pos[0]+w*Math.cos(beg+rot/itner*p),pos[1]+h*Math.sin(beg+rot/itner*p),pos[2]],
			[pos[0]+w*Math.cos(beg+rot/itner*(p+1)),pos[1]+h*Math.sin(beg+rot/itner*(p+1)),
			pos[2]],
			width,r,l));
		}
		return lines;
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
	CONNECT THICK SHAPES

*/
function connectThickShapes(second,first){
	var i = 0;
	var fLen = (first.length)/2;
	var lines = new Array();
	for(i=0;i<=fLen-1;i++){
		lines[i]= first[i];
	}
	
	var linesLen = lines.length;
	for(i=0;i<second.length;i++){
		lines[linesLen] = second[i];
		linesLen++;
	}
	for(i=(fLen);i<first.length;i++){
		lines[linesLen] = first[i];
		linesLen++;
	}
	return lines;
}

/*  ------------------------------------------------------------------------------ */

/*
	PIPE MAP
	returns a pipe list which can be batch line Mapped.

*/
sciMonk.pipeMap=function(ln,w,r,s){
	var allPipes = new Array();
	allPipes=sciMonk.ringPipe(ln,w,r,s);
	var nm=1;
	for(nm=1;nm<ln.length;nm++){
		allPipes = concatArray(allPipes,sciMonk.mapPipe(ln[nm-1],ln[nm],w,r,s));
	}
	return allPipes;
}

sciMonk.mapPipe = function(line1,line2,w,r,s){
	var a = Math.max(line1.length,line2.length);
	var b = Math.min(line1.length,line2.length);
	var c = b/a;
	var i = 0;
	var j = 0;
	var pipes = new Array();
	for(i=0;i<a;i++){
		if(line1.length == a)
			pipes[i] = pipe3(line1[i],line2[j],w,r,s);
		else
			pipes[i] = pipe3(line2[i],line1[j],w,r,s);
		
		j = Math.round(c*(i+1));
		if(j>=b)
			j=j-b;
	}
	return pipes;
}

/*
	Ring map

*/
sciMonk.ringPipe=function(ringLines,w,r,s){
	var allRingPipes = new Array();
	var rln =0;
	for(rln=0;rln<ringLines.length;rln++){
		allRingPipes = concatArray(allRingPipes,sciMonk.mapRingPipe(ringLines[rln],w,r,s));
	}
	return allRingPipes;
}

sciMonk.mapRingPipe=function(ringNodes,w,r,s){
	var ringPipes = new Array();
	var rns=0;
	for(rns=0;rns<ringNodes.length-1;rns++){
		ringPipes[rns]= pipe3(ringNodes[rns], ringNodes[rns+1],w,r,s);
	}
	if(ringNodes.length > 1)
		ringPipes[rns] = pipe3(ringNodes[0], ringNodes[ringNodes.length-1],w,r,s);
		
	return ringPipes;
}
