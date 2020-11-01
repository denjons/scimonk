var animation = new Object();
animation.drawList = new sciMonk.List();
animation.animationList = new sciMonk.List();
animation.models = new sciMonk.List();
animation.ticker = 0;
animation.fill = true;

// iterate through list of functions
animation.iterateFunctions = function(list){
	var i =0;
	for(i=0;i<list.size();i++)
		list.list[i]();
}

/* 
	iterates through all drawing functions
	must be called from within sciMonk.draw()
*/
animation.draw = function(){
	this.iterateFunctions(this.drawList);
}

// iterates through all animation functions and updates sciMonk
animation.animate = function(){
	animation.ticker ++;
	this.iterateFunctions(this.animationList);
	
	// tell sciMonk to redraw the model
	sciMonk.update=true;
		
	// repeat animation for.. ETERNITYYYY...
	setTimeout("animation.animate()",65);
}

// walking animation
animation.iniWalk = function(model){

	var panda = new Object();
	panda.head = new Array();
	panda.body = new Array();
	panda.eyes = new Array();
	panda.legs = new Array();
	panda.arms = new Array();
	panda.legJoints = new Array();
	panda.armJoints = new Array();
	panda.legRot = 0;
	panda.ticker = 0;
	panda.jump = 0;
	panda.time;
	panda.headRot=0;
	panda.bodyRot = 0;
	panda.shutEye = 0;
	panda.armBounce = 0;
	panda.letterT = [0,0,0];
	
	panda.origin = getModelOrigo(model);
	
	panda.armIndex = new Array();
	panda.legIndex = new Array();
	panda.eyeIndex = new Array();
	
	var radDenom = 70;
	
	// find and sort out shapes in model
	var shapes = model.shapes;
	var i = 0;
	for(i=0;i<shapes.length;i++){
		
		if(shapes[i].shapeType.indexOf("body") !== -1)
			panda.body[panda.body.length] = shapes[i];
		if(shapes[i].shapeType.indexOf("head") !== -1)
			panda.head[panda.head.length] = shapes[i];
		if(shapes[i].shapeType.indexOf("eye") !== -1){
			panda.eyes[panda.eyes.length] = copyArray(shapes[i].shape);
			panda.eyeIndex[panda.eyeIndex.length] = panda.head.length - 1;
		}if(shapes[i].shapeType.indexOf("arm") !== -1){
			panda.arms[panda.arms.length] = copyArray(shapes[i].shape);
			panda.armIndex[panda.armIndex.length] = panda.body.length - 1;
		}if(shapes[i].shapeType.indexOf("leg") !== -1){
			panda.legs[panda.legs.length] = copyArray(shapes[i].shape);
			panda.legIndex[panda.legIndex.length] = panda.body.length - 1;
		}
	}
	
	// set points of rotation
	panda.legJoints = [getShapeOrigo(panda.legs[0]),getShapeOrigo(panda.legs[1])];
	panda.legJoints[0][1] += 10;
	panda.legJoints[1][1] += 10;
	panda.armJoints = [getShapeOrigo(panda.arms[0]),getShapeOrigo(panda.arms[1])];
	panda.armJoints[0][0] += 10;
	panda.armJoints[1][0] -= 10;
	panda.armJoints[0][1] += 5;
	panda.armJoints[1][1] += 5;
	
	// index of current model in modelList
	var index = animation.models.size();
	animation.models.add(panda);
	
	// set up animation
	this.animationList.add( function(){
	
		// get model from model-list
		var aniModel = animation.models.list[index];
		
		// increment rotation angles
		if(animation.ticker%50<25)
			aniModel.headRot += (Math.PI/radDenom*Math.sin((180/Math.PI)*animation.ticker/(radDenom*10)))*0.7;
		
		aniModel.bodyRot += (Math.PI/(radDenom/2)*Math.sin((180/Math.PI)*animation.ticker/(radDenom*5)))*0.2;
		aniModel.legRot += Math.PI/(radDenom/2)*Math.sin((180/Math.PI)*animation.ticker/(radDenom*5));
		
		// open and close eyes
		if(((animation.ticker)%360)<180){
			aniModel.shutEye++;
			aniModel.head[panda.eyeIndex[0]].shape = scaleShape(aniModel.eyes[0],[1,Math.abs(Math.sin(Math.PI/180*aniModel.shutEye)),1]);
			aniModel.head[panda.eyeIndex[1]].shape = scaleShape(aniModel.eyes[1],[1,Math.abs(Math.sin(Math.PI/180*aniModel.shutEye)),1]);
		}

		// leg movement
		aniModel.body[panda.legIndex[0]].shape = rotate(aniModel.legJoints[0],aniModel.legs[0],[0,Math.PI/6-aniModel.legRot,0]);
		aniModel.body[panda.legIndex[1]].shape = rotate(aniModel.legJoints[1],aniModel.legs[1],[0,aniModel.legRot-Math.PI/6,0]);
		
		// arm bounce
		aniModel.armBounce += Math.PI/(radDenom/4)*Math.sin((180/Math.PI)*animation.ticker/(radDenom*2.5))*0.2;
		aniModel.body[panda.armIndex[0]].shape = rotate(aniModel.armJoints[0],aniModel.arms[0],[0,0,aniModel.armBounce]);
		aniModel.body[panda.armIndex[1]].shape = rotate(aniModel.armJoints[1],aniModel.arms[1],[0,0,-aniModel.armBounce]);
	});
	
	// set sciMonk draw function
	this.drawList.add(function(){
		// rotate shapes and draw
		var head = batchRotateShapes(animation.models.list[index].origin,animation.models.list[index].head,
		[animation.models.list[index].headRot-(Math.PI/10),0,/*animation.models.list[index].bodyRot-(Math.PI/25)*/0]);
		
		var body = batchRotateShapes(animation.models.list[index].origin,animation.models.list[index].body,
		[animation.models.list[index].bodyRot-(Math.PI/15),0,/*animation.models.list[index].bodyRot-(Math.PI/25)*/0]);
		
		if(animation.fill){
			sciMonk.batchColourMapShapes(head);
			sciMonk.batchColourMapShapes(body);
		}else{
			sciMonk.batchLineMapObjects(head,false);
			sciMonk.batchLineMapObjects(body,false);
		}
	});

}


// stand around animation
animation.iniStandAraound = function(model){

	var panda = new Object();
	panda.head = new Array();
	panda.body = new Array();
	panda.eyes = new Array();
	panda.arms = new Array();
	panda.armJoints = new Array();
	panda.ticker = 0;
	panda.jump = 0;
	panda.time;
	panda.headRot=0;
	panda.bodyRot = 0;
	panda.shutEye = 0;
	panda.armBounce = 0;
	panda.letterT = [0,0,0];
	
	panda.origin = getModelOrigo(model);
	
	panda.armIndex = new Array();
	panda.eyeIndex = new Array();
	
	var radDenom = 70;
	
	// find and sort out shapes in model
	var shapes = model.shapes;
	var i = 0;
	for(i=0;i<shapes.length;i++){
		
		if(shapes[i].shapeType.indexOf("body") !== -1)
			panda.body[panda.body.length] = shapes[i];
		if(shapes[i].shapeType.indexOf("head") !== -1)
			panda.head[panda.head.length] = shapes[i];
		if(shapes[i].shapeType.indexOf("eye") !== -1){
			panda.eyes[panda.eyes.length] = copyArray(shapes[i].shape);
			panda.eyeIndex[panda.eyeIndex.length] = panda.head.length - 1;
		}if(shapes[i].shapeType.indexOf("arm") !== -1){
			panda.arms[panda.arms.length] = copyArray(shapes[i].shape);
			panda.armIndex[panda.armIndex.length] = panda.body.length - 1;
		}
	}
	
	// set points of rotation
	panda.armJoints = [getShapeOrigo(panda.arms[0]),getShapeOrigo(panda.arms[1])];
	panda.armJoints[0][0] += 10;
	panda.armJoints[1][0] -= 10;
	panda.armJoints[0][1] += 5;
	panda.armJoints[1][1] += 5;
	
	// index of current model in modelList
	var index = animation.models.size();
	animation.models.add(panda);
	
	// set up animation
	this.animationList.add( function(){
	
		// get model from model-list
		var aniModel = animation.models.list[index];
		
		// increment rotation angles
		if(animation.ticker%50<25)
			aniModel.headRot += (Math.PI/radDenom*Math.sin((180/Math.PI)*animation.ticker/(radDenom*10)))*0.7;
		
		aniModel.bodyRot += (Math.PI/(radDenom/2)*Math.sin((180/Math.PI)*animation.ticker/(radDenom*5)))*0.2;
		
		// open and close eyes
		if(((animation.ticker)%360)<180){
			aniModel.shutEye++;
			aniModel.head[panda.eyeIndex[0]].shape = scaleShape(aniModel.eyes[0],[1,Math.abs(Math.sin(Math.PI/180*aniModel.shutEye)),1]);
			aniModel.head[panda.eyeIndex[1]].shape = scaleShape(aniModel.eyes[1],[1,Math.abs(Math.sin(Math.PI/180*aniModel.shutEye)),1]);
		}

		// arm bounce
		aniModel.armBounce += Math.PI/(radDenom/4)*Math.sin((180/Math.PI)*animation.ticker/(radDenom*2.5))*0.2;
		aniModel.body[panda.armIndex[0]].shape = rotate(aniModel.armJoints[0],aniModel.arms[0],[0,0,aniModel.armBounce]);
		aniModel.body[panda.armIndex[1]].shape = rotate(aniModel.armJoints[1],aniModel.arms[1],[0,0,-aniModel.armBounce]);
	});
	
	// set sciMonk draw function
	this.drawList.add(function(){
		// rotate shapes and draw
		sciMonk.batchColourMapShapes(batchRotateShapes(animation.models.list[index].origin,animation.models.list[index].head,
		[animation.models.list[index].headRot-(Math.PI/10),0,/*animation.models.list[index].bodyRot-(Math.PI/25)*/0]));
		
		sciMonk.batchColourMapShapes(batchRotateShapes(animation.models.list[index].origin,animation.models.list[index].body,
		[animation.models.list[index].bodyRot-(Math.PI/15),0,/*animation.models.list[index].bodyRot-(Math.PI/25)*/0]));
	});

}



// swirling letter animation
animation.iniSwirl = function(model){
	var obj = new Object();
	obj.letterT = [0,0,0];
	obj.ra = model.shapes;
	
	var index = animation.models.size();
	animation.models.add(obj);
	
	this.animationList.add( function(){
		var aniModel = animation.models.list[index];
		//floating letters
		aniModel.letterT[0] = 20*Math.sin(Math.PI/25*animation.ticker%100);
		aniModel.letterT[1] = animation.ticker%100-35;
	});
	
	this.drawList.add(function(){
		sciMonk.batchColourMap(batchTranslateShapes(animation.models.list[index].ra,animation.models.list[index].letterT),[1,1,1,250]);
	});
}

// rotates model
animation.iniRotate = function(model,rad){
	
	model.origin = getModelOrigo(model);
	model.rad = rad;
	var index = animation.models.size();
	animation.models.add(model);

	this.animationList.add( function(){
		var aniModel = animation.models.list[index];
		//floating letters
		rotateModel(aniModel.origin,aniModel,aniModel.rad);
	});
	
	this.drawList.add(function(){
		if(animation.fill){
			sciMonk.colourMapModel(animation.models.list[index]);
		}else{
			sciMonk.lineMapModel(animation.models.list[index],false);
		}
	});
}

