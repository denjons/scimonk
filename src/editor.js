

sciMonk.clientX = 0;
sciMonk.clientY = 0;
sciMonk.clientZ = sciMonk.zMove;

sciMonk.can;
sciMonk.browser = "undefined";
sciMonk.lastX = 0;
sciMonk.lastY = 0;
sciMonk.currentX = 0;
sciMonk.currentY = 0;
sciMonk.xMargin = 0;
sciMonk.yMargin = 0;
sciMonk.mouseIsOver = false;
sciMonk.mouseIsDown = false;
sciMonk.keyIsDown = false;
sciMonk.ctrl = false;
sciMonk.shift = false; 
sciMonk.currentKeyCode = 0;

sciMonk.currentCords = new Array();
sciMonk.currentNr = 0;

sciMonk.currentStruct = new Array();
sciMonk.currentStructNr = 0;

sciMonk.currentModel = new Object();
sciMonk.currentModel.shapes = new Array();
sciMonk.currentModel.name="no title";
sciMonk.currentModel.user="Anonymous";
sciMonk.currentModel.modelId = 0;
sciMonk.currentModel.nr = 0;

sciMonk.currentModelList = new Array();
sciMonk.currentItemList = new Array();

sciMonk.currentColour = [1,1,1,250];
sciMonk.fillModel = true;
sciMonk.lineModel = false;
sciMonk.nodeModel = true;
sciMonk.drawGraph = false;
sciMonk.crossHair = true;

sciMonk.shapeSelecter = new Object();
sciMonk.shapeSelecter.shapes = new Array();
sciMonk.shapeSelecter.colour = [200,50,50,250];
sciMonk.shapeSelecter.id = -1;

sciMonk.marker = new Object();
sciMonk.marker.colour = [1,1,1,250];
sciMonk.marker.show=false;
sciMonk.marker.shape = new Array();

sciMonk.vectorType = "line";
sciMonk.placementType = "node";

sciMonk.initialRes = 35;
sciMonk.maxRes = 80;
sciMonk.minRes = 2;
sciMonk.initialSize = 50;

sciMonk.currentShape = new Object();
sciMonk.currentShape.originalShape = new Array();
sciMonk.currentShape.scaledShape = new Array();

// All shape objects needs to have the properties shape and colour.
sciMonk.currentShape.shape = new Array();  
sciMonk.currentShape.colour = [1,1,1,250];
   
sciMonk.currentShape.type = "node";                    
sciMonk.currentShape.size = [sciMonk.initialSize,sciMonk.initialSize,sciMonk.initialSize];
sciMonk.currentShape.rot = [0,0,0];
sciMonk.currentShape.pos = [0,0,0];
sciMonk.currentShape.scale = [1,1,1];

sciMonk.currentShape.res = [sciMonk.initialRes,sciMonk.initialRes];

sciMonk.selectAndEditShape = false;




function getClientBrowser(){
	var nAgt = navigator.userAgent;
	if (nAgt.indexOf("Firefox")!=-1){
		sciMonk.browser = "Firefox";
	}
	if(nAgt.toLowerCase().indexOf('chrome') > -1){
		sciMonk.browser = "Chrome";
	}
}

function iniEditor(canvas,prompt,shapeControl){
	
	getClientBrowser();
	
	sciMonk.can = canvas;
	sciMonk.shapeControl = shapeControl;
	sciMonk.can.style.cursor="none";
	if (sciMonk.browser == "Firefox"){
		sciMonk.can.onmousedown = function(evt){
			mouseDown(evt);
		}
		sciMonk.can.onmouseup = function(evt){
			mouseUp(evt);
		}
		sciMonk.can.onmousemove = function(evt){
			mouseMove(evt);
		}
		sciMonk.can.onmouseover = function(evt){
			mouseOver(evt);
		}
		sciMonk.can.onmouseout = function(evt){
			mouseOut();
		}
	}else{
		sciMonk.can.setAttribute("onMouseDown"," mouseDown()");
		sciMonk.can.setAttribute("onMouseUp"," mouseUp()");
		sciMonk.can.setAttribute("onMouseMove"," mouseMove()");
		sciMonk.can.setAttribute("onMouseOver"," mouseOver()");
		sciMonk.can.setAttribute("onMouseOut"," mouseOut()");
		
	}
	iniCoordBox();
	
	parseHexColour(sciMonk.marker.colour,"4eabff");//"bde8ff"
	
	/*	Node control
	*/
	/*var clNodesBtn = document.getElementById("clearNodes");
	clNodesBtn.setAttribute("onClick","clearNodes()");
	sciMonk.observer.add(clNodesBtn);*/
	
	/*var addNodesBtn = document.getElementById("addNodes");
	addNodesBtn.setAttribute("onClick","addNodes()");
	sciMonk.observer.add(addNodesBtn);*/
	
	
	/*var undoBtn = document.getElementById("undo");
	undoBtn.setAttribute("onClick","undo()");
	sciMonk.observer.add(undoBtn);*/
	
	
	var fillBtn = document.getElementById("fill");
	fillBtn.setAttribute("onChange","controlChange(this)");
	fillBtn.checked = sciMonk.fillModel;
	sciMonk.observer.add(fillBtn);
	
	var linesBtn = document.getElementById("lines");
	linesBtn.setAttribute("onChange","controlChange(this)");
	linesBtn.checked = sciMonk.lineModel;
	sciMonk.observer.add(linesBtn);
	
	/*var nodesBtn = document.getElementById("nodes");
	nodesBtn.setAttribute("onChange","controlChange(this)");
	nodesBtn.checked = sciMonk.nodeModel;
	sciMonk.observer.add(nodesBtn);*/
	
	var graphBtn = document.getElementById("drawGraph");
	graphBtn.setAttribute("onChange","controlChange(this)");
	graphBtn.checked = sciMonk.drawGraph;
	sciMonk.observer.add(graphBtn);
	
	var crossHairBtn = document.getElementById("crossHair");
	crossHairBtn.setAttribute("onChange","controlChange(this)");
	 crossHairBtn.checked = sciMonk.crossHair;
	 sciMonk.observer.add(crossHairBtn);
	
	
	var snapShotBtn = document.getElementById("snapShot");
	snapShotBtn.setAttribute("onClick","takeSnapShot()");
	sciMonk.observer.add(snapShotBtn);
	
	var snapShotBtn = document.getElementById("snapShot");
	snapShotBtn.setAttribute("onClick","takeSnapShot()");
	sciMonk.observer.add(snapShotBtn);
	
	var saveBtn = document.getElementById("save");
	saveBtn.setAttribute("onClick","saveModelCheck()");
	sciMonk.observer.add(saveBtn);
	
	/*var loadListBtn = document.getElementById("loadList"); // remove ---------------------
	loadListBtn.setAttribute("onClick","loadItemList()");
	sciMonk.observer.add(loadListBtn);*/
		
	
	/* 	Colour control
	*/
	
	
	// Change input to text if the browser is other than chrome
	var colourPicker = document.getElementById("colourPicker");
	
	if(sciMonk.browser != "Chrome"){
		colourPicker.type="text";
		colourPicker.value = "#000000";
	}
	// event handlers
	if(sciMonk.browser == "Firefox"){
		colourPicker.onpropertychange = function(evt){
			setColour(evt);
		}
		colourPicker.oninput = function(evt){
			setColour(evt);
		}
		colourPicker.onChange = function(evt){
			setColour(evt);
		}
	}
	colourPicker.setAttribute("onPropertyChange","setColour(this)");
	colourPicker.setAttribute("onChange","setColour(this)");
	colourPicker.setAttribute("onInput","setColour(this)");
	
	sciMonk.observer.add(colourPicker);
	

	sciMonk.isEditable = true;
	
	/*
		shape btns
	*/
	var boxBtn = document.getElementById("box");
	boxBtn.setAttribute("onClick","pickShape(this)");
	sciMonk.observer.add(boxBtn);
	
	var sphereBtn = document.getElementById("sphere");
	sphereBtn.setAttribute("onClick","pickShape(this)");
	sciMonk.observer.add(sphereBtn);
	
	var cylinderBtn = document.getElementById("cylinder");
	cylinderBtn.setAttribute("onClick","pickShape(this)");
	sciMonk.observer.add(cylinderBtn);
	
	var nodeBtn = document.getElementById("node");
	nodeBtn.setAttribute("onClick","pickShape(this)");
	sciMonk.observer.add(nodeBtn);
	
	/*var pipeBtn = document.getElementById("pipe");
	pipeBtn.setAttribute("onClick","pickShape(this)");*/
	
	var coneBtn = document.getElementById("cone");
	coneBtn.setAttribute("onClick","pickShape(this)");
	sciMonk.observer.add(coneBtn);
	
}

/*
	LOAD SAVE DELETE
*/

function saveModelCheck(){
	if(sciMonk.currentModel.modelId > 0)
		optionPane("Do you want to change the current model?", "saveModel(this.parentNode)");
	else
		inflateSaveOptionsView();
}

function saveOptions(view){
	sciMonk.viewStack.pop();
	//deflateView(view);
}

function saveModel(view){
  console.log(view);
  modelToSTL();
  sciMonk.viewStack.pop();
}

function loadModel(id,view){
	loadModelRequest(id);
	sciMonk.viewStack.pop();
	//deflateView(view);
}

function deleteModelCheck(id,view){
	optionPane("Do you want to delete this model?", "deleteModel("+id+")");
	sciMonk.viewStack.pop();
	//deflateView(view);
}

function deleteModel(id){
	console.log("Not implemented");
}

function pickShapesFromMap(){
	sciMonk.selectAndEditShape = true;
}


/*
	VIEW LOADER
*/

function inflateLoadModelsView(){
	var div = document.createElement("div");
	div.id = "modelLoader";
	makeClosable(div);
	var i = 0;
	for(i=0;i<sciMonk.currentItemList.length;i++){
	
		var item = document.createElement("div");
		item.id = "modelItem";
		item.innerHTML="<h2>"+sciMonk.currentItemList[i].modelName+"</h2>"+
		"<p>creator: "+sciMonk.currentItemList[i].userName+"</p>";
		
		var lbtn = document.createElement("button");
		lbtn.setAttribute("class","loadBtn");
		lbtn.setAttribute("onClick","loadModel("+sciMonk.currentItemList[i].id+", this.parentNode.parentNode)");
		lbtn.value="load";
		item.appendChild(lbtn);
		
		var dbtn = document.createElement("button");
		dbtn.setAttribute("class","deleteBtn");
		dbtn.setAttribute("onClick","deleteModelCheck("+sciMonk.currentItemList[i].id+", this.parentNode.parentNode)");
		dbtn.value="delete";
		item.appendChild(dbtn);
		
		div.appendChild(item);
	}
	
	inflateView(div);
}

function inflateEditShapeView(index){
	if(!(sciMonk.viewLock)){
		var shape = sciMonk.currentModel.shapes[index];
		var div = document.createElement("div");
		div.id = "editShapeView";
		makeClosable(div);
		// shape type or tag
		var tagDiv = document.createElement("div"); 
		tagDiv.setAttribute("class","inpuContainer");
		var tagLbl = document.createElement("label"); 
		tagLbl.innerHTML = "shape tag:";
		tagDiv.appendChild(tagLbl);
		var tagInput = document.createElement("input");
		tagInput.oninput = tagInput.onchange = function(evt){
			var val = this.value;
			var valid = validateStringPositive(val," abcdefghijklmnopqrstuvwxyz1234567890");
			if(!valid){
				alert("The tag can only contain characters a-z and 0-9.");
				this.value = "";
			}
			if(valid){
				shape.shapeType = val;
				updateShapeList();
			}
		}
		tagInput.type = "text";
		tagInput.maxlength = 25;
		tagInput.value = shape.shapeType;
		tagDiv.appendChild(tagInput);
		div.appendChild(tagDiv);
		// shape colour
		var colorDiv = document.createElement("div");
		colorDiv.setAttribute("class","inpuContainer");
		var colorLbl = document.createElement("label"); 
		colorLbl.innerHTML = "shape color:";
		colorDiv.appendChild(colorLbl);
		var colourDisplay = document.createElement("div");
		colourDisplay.setAttribute("class","colourDisplay");
		var hexColor = "#"+decToHex(shape.colour[0])+decToHex(shape.colour[1])+decToHex(shape.colour[2]); 
		if(hexColor=="#111")
			hexColor="#000000";
		colourDisplay.style.background = hexColor; 
		colorDiv.appendChild(colourDisplay);
		var colorInput = document.createElement("input");
		colorInput.type = "text";
		colorInput.value = hexColor;
		colorInput.maxLength = 7;
		colorInput.oninput = colorInput.onchange = function(evt){
			var val = this.value.toLowerCase();
			var valid = validateStringPositive(val.substring(1),"0123456789abcdef");
			if(!valid){
				alert("The color is hexadecimal and can only contain the character '#', followed by 6 characters 1-9 and a-f. "+
				" For example: #e3a4ff.");
				this.value = "";
			}
			if(val.length==7 && valid){
				colourDisplay.style.background = val;
				parseHexColour(shape.colour,val.substring(1));
				updateShapeList();
				sciMonk.update=true;
			}
		}
		colorDiv.appendChild(colorInput);
		div.appendChild(colorDiv);
		// editBTn
		var editBtn = document.createElement("button");
		editBtn.innerHTML = "move shape";
		editBtn.setAttribute("class","button_type_2");
		editBtn.setAttribute("onClick","refactorShape("+index+")");
		editBtn.style.float="left";
		
		var okBtn = document.createElement("button"); 
		okBtn.innerHTML = "done";
		okBtn.setAttribute("class","button_type_2");
		okBtn.setAttribute("onClick","sciMonk.viewStack.pop()");
		div.appendChild(okBtn);
		
		div.appendChild(editBtn);
		inflateView(div);
	}
}

function makeClosable(view){
	var div = document.createElement("div");
	div.id = "viewHeader";
	var cross = document.createElement("img");
	cross.setAttribute("onClick","sciMonk.viewStack.pop()");
	cross.src = "css/imgs/cross3.png";
	div.appendChild(cross);
	view.appendChild(div);
}

function closeImage(){
	sciMonk.viewStack.pop();
	//deflateView(document.getElementById("imageDisplay"));
}

function inflateView(view){
	sciMonk.viewLock = true;
	document.getElementById("wraper").style.opacity = 0.4;
	sciMonk.observer.disable(true);
	sciMonk.viewStack.add(view);
	document.getElementById("body").appendChild(view);
}

function deflateView(view){
	sciMonk.viewLock = false;
	document.getElementById("wraper").style.opacity = 1;
	sciMonk.observer.disable(false);
	document.getElementById("body").removeChild(view);
}

function optionPane(message,func){
	var div = document.createElement("div");
	div.id="optionPane";
	div.innerHTML+="<p>"+message+"<p>";
	var noBtn = document.createElement("button");
	noBtn.setAttribute("class","noBtn");
	noBtn.name = "No";
	noBtn.setAttribute("onClick","sciMonk.viewStack.pop()");
	var yesBtn = document.createElement("button");
	yesBtn.setAttribute("class","yesBtn");
	yesBtn.name = "Yes";
	yesBtn.setAttribute("onClick",func);
	div.appendChild(yesBtn);
	div.appendChild(noBtn);
	//
	inflateView(div);
}

function inflateSaveOptionsView(id){

	var div = document.createElement("div");
	div.id = "saveOptionsView";
	makeClosable(div);
	
	var modelInput = document.createElement("input");
	modelInput.type = "text";
	modelInput.setAttribute("onChange","setModelName(this.value)");
	modelInput.maxlength = 25;
	modelInput.value="Model Name";
	
	var nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.setAttribute("onChange","setModelCreator(this.value)");
	nameInput.maxlength = 25;
	nameInput.value="Creator";

	var saveBtn = document.createElement("button");
	saveBtn.setAttribute("class","saveBtn");
	saveBtn.name = "Save";
	saveBtn.setAttribute("onClick","saveModel(this.parentNode)");
	
	var cancelBtn = document.createElement("button");
	cancelBtn.setAttribute("class","cancelBtn");
	cancelBtn.name = "Save";
	cancelBtn.setAttribute("onClick","sciMonk.viewStack.pop()");
	
	div.appendChild(modelInput);
	div.appendChild(nameInput);
	div.appendChild(saveBtn);
	div.appendChild(cancelBtn);
	
	inflateView(div);

}

function setModelName(val){
	if(!val)
		sciMonk.currentModel.name = "no title";
	else
		sciMonk.currentModel.name = val;
}

function setModelCreator(val){
	if(!val)
		sciMonk.currentModel.user = "Anonymous";
	else
		sciMonk.currentModel.user = val;
}



/*
	IMAGE
	
*/


function takeSnapShot(){
	var img = document.createElement("img");
	img.id = "innerImage";
	img.src = Canvas.toDataURL("image/png");
	displayImage(img);
	
}

function displayImage(img){
	var div = document.createElement("div");
	makeClosable(div);
	div.id = "imageDisplay";
	div.style.width = img.style.width+"px";
	div.style.height = img.style.height+"px";
	div.appendChild(img);
	inflateView(div);
}


/*
	SHAPE CONTROL

*/

/*
	Updates the GUI list, displaying shapes in model
*/
function updateShapeList(){
	var list = document.getElementById("shapeList");
	list.innerHTML = "";
	var i =0;
	for(i=0;i<sciMonk.currentModel.shapes.length;i++){                                     /* <--- construction*/
		var item = document.createElement("div");
		item.setAttribute("onClick","inflateEditShapeView("+i+")");
		item.setAttribute("onMouseOver","showMarker("+i+")");
		item.setAttribute("onMouseOut","hideMarker("+i+")");
		var c = sciMonk.currentModel.shapes[i].colour;
		item.style.background = rgbToHex(c[0],c[1],c[2]);
		item.id = "shapeItem";
		item.innerHTML = "<p>&lt;"+sciMonk.currentModel.shapes[i].shapeType+"&gt;</p>";
		list.appendChild(item);
	}
}

/*
	Moves one shape from the models shape-list to current shape
*/
function refactorShape(id){
	sciMonk.viewStack.pop();
	sciMonk.placementType = "shape";
	sciMonk.currentShape.shape = sciMonk.currentModel.shapes[id].shape;
	sciMonk.currentShape.scaledShape = sciMonk.currentModel.shapes[id].shape;
	sciMonk.currentShape.originalShape = sciMonk.currentModel.shapes[id].shape;
	sciMonk.currentShape.type = sciMonk.currentModel.shapes[id].shapeType;
	sciMonk.currentShape.pos = sciMonk.currentModel.shapes[id].pos;
	sciMonk.clientZ = sciMonk.currentModel.shapes[id].pos[2]; 
	sciMonk.currentShape.scale = sciMonk.currentModel.shapes[id].scale;
	sciMonk.currentShape.rot = sciMonk.currentModel.shapes[id].rot;
	var color = sciMonk.currentModel.shapes[id].colour;
	sciMonk.currentShape.colour = color;
	document.getElementById('colourPicker').value = "#"+decToHex(color[0])+decToHex(color[1])+decToHex(color[2]);
	sciMonk.currentModel.shapes = removeElement(sciMonk.currentModel.shapes,id);
		
	updateShapeList();
	sciMonk.update=true;
	sciMonk.currentModel.nr--;
	
	var i =0;
	for(i=0;i<sciMonk.currentModel.shapes.length;i++){
		sciMonk.currentModel.shapes.shapeId = i;
	}
}

function showMarker(id){
	//parseHexColour(sciMonk.currentModel.shapes[id].colour,"bde8ff");
	sciMonk.marker.show = true;
	sciMonk.marker.shape = scaleShape(sciMonk.currentModel.shapes[id].shape,[1.01,1.01,1.01]);
	sciMonk.update=true;
}

function hideMarker(){
	sciMonk.marker.show = false;
	sciMonk.update=true;
}

function refactorColor(id){
	
}

function updateShapePos(){
	var origo = getShapeOrigo(sciMonk.currentShape.shape);
	var path = uToV(origo,[sciMonk.currentShape.pos[0],sciMonk.currentShape.pos[1],sciMonk.currentShape.pos[2]]);
	sciMonk.currentShape.shape = translateShape(sciMonk.currentShape.shape,path);
}

function pickShape(elm){
	addStruct();
	sciMonk.selectAndEditShape = false;
	sciMonk.placementType = "shape";
	resetShapeProperties();
	switch(elm.id){
		case "box":
			sciMonk.currentShape.type = "box";
			createShape(elm.id);
		break;
		case "sphere":
			sciMonk.currentShape.type = "sphere";
			createShape(elm.id);
		break;
		case "cylinder":
			sciMonk.currentShape.type = "cylinder";
			createShape(elm.id);
		break;
		case "cone":
			sciMonk.currentShape.type = "cone";
			createShape(elm.id);
		break;
		case "node":
			sciMonk.currentShape.type = "node";
			sciMonk.placementType = "node"
			sciMonk.vectorType = "line";
		break;
		default:
			sciMonk.placementType = "node"
		break;
	}
}

function resetShapeProperties(){
	sciMonk.currentShape.rot = [0,0,0];
	sciMonk.currentShape.scale= [1,1,1];
	sciMonk.currentShape.res[0] = sciMonk.initialRes;
	sciMonk.currentShape.res[1] = sciMonk.initialRes;
}

function controlChange(elm){
	switch(elm.id){
		case "fill":
			sciMonk.fillModel = elm.checked;
		break;
		case "lines":
			sciMonk.lineModel = elm.checked;
		break;
		case "nodes":
			sciMonk.nodeModel = elm.checked;
		break;
		case "drawGraph":
			sciMonk.drawGraph = elm.checked;
			sciMonk.shadow = elm.checked;
		break;
		case "crossHair":
			sciMonk.crossHair = elm.checked;
		break;
		default:
			alert("iúnknown control change: "+elm.id);
		break;
	}
	sciMonk.update=true;
}

/*
	COLOUR

*/
function setColour(elm){
	if(elm.value.length >= 7){
		document.getElementById('colourPicker').blur();
		var rgb = elm.value.substring(1);
		parseHexColour(sciMonk.currentShape.colour,rgb);
	}
}

/*
	NODES, STRUCTURES AND MODELS

*/

function createShape(type){
	//resetShapeProperties();
	sciMonk.currentShape.originalShape = getShape(type,sciMonk.currentShape.pos,
		sciMonk.currentShape.size,sciMonk.currentShape.res[0],sciMonk.currentShape.res[1]);
	sciMonk.currentShape.scaledShape = copyArray(sciMonk.currentShape.originalShape);
	sciMonk.currentShape.shape = copyArray(sciMonk.currentShape.originalShape);
	rotateShape();
}

function getShape(type,pos,size,rings,lines){
	switch(type){
		case "box" :
			return box(pos,size);
		break;
		case "sphere" :
			return sphere(pos,size,rings,lines);
		break;
		case "cylinder" :
			return  cylinder(pos,size,lines);
		break;
		case "cone" :
			return cone([pos[0],pos[1],pos[2]],[size[0],size[1],size[2]],rings,lines);
		break;
		default:
			alert("no shape selected in createShape().");
		break;
	}
}

function addObject(){
	if(sciMonk.placementType == "node"){
		if(sciMonk.vectorType == "line" || sciMonk.currentCords.length == 0 ){
			sciMonk.currentCords[sciMonk.currentNr]=[sciMonk.currentShape.pos[0],sciMonk.currentShape.pos[1],sciMonk.currentShape.pos[2]];
			sciMonk.currentNr++;
		}
		
	}else if(sciMonk.placementType == "shape"){
		addStruct();
		sciMonk.currentStruct=copyArray(sciMonk.currentShape.shape);
		sciMonk.currentStructNr = sciMonk.currentStruct.length;
		addStruct();
	}
}


function removeNode(){
	if(sciMonk.currentNr>0){
		sciMonk.currentNr--;
		sciMonk.currentCords= removeElement(sciMonk.currentCords,sciMonk.currentNr);
	}
}

function removeStruct(){
	if(sciMonk.currentStructNr>0){
		sciMonk.currentStruct = removeElement(sciMonk.currentStruct,sciMonk.currentStructNr-1);
		sciMonk.currentStructNr--;
	}
}

function removeModel(){
	if(sciMonk.currentModel.nr>0){
		sciMonk.currentModel.shapes = removeElement(sciMonk.currentModel.shapes,sciMonk.currentModel.nr-1);;
		sciMonk.currentModel.nr--;
	}
	updateShapeList();
}


function undo(){
	if(sciMonk.currentNr>0){
		if(sciMonk.lineType == "pipe")
			removeStruct();
		removeNode();
	}else if(sciMonk.currentStructNr>0){
		removeStruct();
	}
	else if(sciMonk.currentModel.nr>0){
		removeModel()
	}
	sciMonk.update = true;
}

function clearNodes(){
	sciMonk.currentCords = new Array();
	sciMonk.currentNr = 0;
}

function clearStruct(){
	sciMonk.currentStruct = new Array();
	sciMonk.currentStructNr=0;
}

function addNodes(){
	if(sciMonk.lineType == "pipe"){
		clearNodes();
	}else if(sciMonk.currentCords.length >= 1){
		sciMonk.currentStruct[sciMonk.currentStructNr] = copyArray(sciMonk.currentCords);
		sciMonk.currentStructNr ++;
		clearNodes();
		sciMonk.update = true;
	}
}

function addStruct(){										        /* WHERE SHEOAS ARE ADDED UNDER CONSTRUCTION */
	
	if(sciMonk.currentCords.length >= 1)
		addNodes();
	if(sciMonk.currentStruct.length >= 1){
    addShapeToModel(sciMonk.currentStruct, 
      sciMonk.currentShape.type, 
      sciMonk.currentShape.colour, 
      sciMonk.currentShape.scale, 
      sciMonk.currentShape.rot);
      
		clearStruct();
		sciMonk.update = true;
	}
	updateShapeList();
}
 
function addShapeToModel(shape, type, colour, scale, rotation) {
    var origo = getShapeOrigo(shape);
		sciMonk.currentModel.shapes[sciMonk.currentModel.nr] = {
			"scale" : scale,
			"pos" : origo,
			"rot" : rotation,
			"colour" : copyArray(colour),
			"shapeId" : sciMonk.currentModel.nr,
			"shapeType" : type, 
			"shape" : copyArray(shape)
		}
		sciMonk.currentModel.nr++;
}

/*
	PIPE

*/

function switchBetweenPipeAndLine(lineType){
	sciMonk.lineType = lineType;
	if(sciMonk.lineType == "pipe"){
		convertVectorsToPipe();
	}
	else if(sciMonk.lineType == "line"){
		convertPipeToVectors();
	}
}


/*
	EVENTS
	
*/

function iniCoordBox(){
	sciMonk.coordBox = document.createElement("div");
	sciMonk.coordBox.id = "coordBox";
	sciMonk.coordBox.style.opacity = 0;
	sciMonk.coordBox.style.height = "25px";
	sciMonk.coordBox.style.background="#abe2a3";
	sciMonk.coordBox.style.position = "absolute";
	sciMonk.coordBox.style.zIndex = "1";
	document.getElementById("canvasDiv").appendChild(sciMonk.coordBox);
}

function updateCoordbox(){
	sciMonk.coordBox.style.marginLeft = (sciMonk.clientX+sciMonk.xMargin+20)+"px";
	sciMonk.coordBox.style.marginTop = (sciMonk.clientY+sciMonk.yMargin+20)+"px";
	sciMonk.coordBox.innerHTML = 
	"("+(xToGraph(sciMonk.clientX)-sciMonk.xMove|0)+", "+
	(yToGraph(sciMonk.clientY)-sciMonk.yMove|0)+", "+
	(sciMonk.clientZ+sciMonk.zMove|0)+")";
}
function keyPressed(evt){
	alert(evt.keyCode);
}

function mouseMove(evt){
	if(!sciMonk.mouseIsDown){
		getMouseCords(evt);
		sciMonk.currentX = sciMonk.clientX;
		sciMonk.currentY = sciMonk.clientY;
		updatePos();
		sciMonk.update = true;
		updateCoordbox();
	}
}


function mouseOver(evt){
	sciMonk.can.focus();
	sciMonk.mouseIsOver = true;
	sciMonk.coordBox.style.opacity = 0.7;
	getMouseCords(evt);
	updateCoordbox();
}

function mouseOut(){
	sciMonk.mouseIsOver = false;
	sciMonk.coordBox.style.opacity = 0;
}

function mouseDown(evt){
	
	sciMonk.mouseIsDown = true;
	getMouseCords(evt);
	sciMonk.lastX = sciMonk.clientX;
	sciMonk.lastY = sciMonk.clientY;
}

function mouseUp(evt){
	sciMonk.mouseIsDown = false;
	getMouseCords(evt);
	// check if mouse position has changed
	if(sciMonk.lastX != sciMonk.clientX || sciMonk.lastY != sciMonk.clientY ){
		
	}else{
		addObject();
		updateGraph();
	}
}

function keyUp(event){
	
}

function keyDownEvt(event){
	if(sciMonk.mouseIsOver){
		sciMonk.keyIsDown = true;
		sciMonk.currentKeyCode = event.keyCode;
		keyDown();
	}
}

function keyDown(){
	keyEvent();
}

function keyUpEvt(evt){
	if(sciMonk.browser == "Firefox"){
		sciMonk.ctrl = false;
		sciMonk.shift = false;
	}
	if(event.keyCode==17)
		sciMonk.ctrl = false;
	if(event.keyCode==16)
		sciMonk.shift = false;
	sciMonk.keyIsDown = false;
	if(sciMonk.mouseIsOver){
		
	}
	
}

function keyEvent(){                                                           // KEY EVENTS
	sciMonk.update = true;
	switch(sciMonk.currentKeyCode){
		case 13:
			addNodes();
		break;
		case 16:
			sciMonk.shift = true;
		break;
		case 17:
			sciMonk.ctrl = true;
		break;
		case 65://a
			if(sciMonk.shift){
				if((sciMonk.currentShape.scale[0]-0.05)>0.01){
					sciMonk.currentShape.scale[0] -= 0.05;
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
				}
					
					//updateShape();
			}else{
				//sciMonk.currentShape.rot[0] += Math.PI/100;
				sciMonk.currentShape.rot[0] = (sciMonk.currentShape.rot[0] + Math.PI/100)%(2*Math.PI);
				rotateShape();
			}
		break;
		case 67://c
			if(sciMonk.shift){
			if(	(((sciMonk.currentShape.scale[0]*sciMonk.initialSize)<sciMonk.Width) &&
				((sciMonk.currentShape.scale[1]*sciMonk.initialSize)<sciMonk.Height)) &&
				((sciMonk.currentShape.scale[2]*sciMonk.initialSize)<sciMonk.Depth) ){
					sciMonk.currentShape.scale[0] += 0.05;
					sciMonk.currentShape.scale[1] += 0.05;
					sciMonk.currentShape.scale[2] += 0.05;
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
			}
			}else{
				if((sciMonk.clientZ + sciMonk.zMove) < sciMonk.moveMax){
					sciMonk.clientZ += 1;
					sciMonk.currentShape.pos[2] += 1;
				}
			}
			
		break;
		case 68://d
			if(sciMonk.shift){
				if((sciMonk.currentShape.scale[0]*sciMonk.initialSize)<sciMonk.Width){
					sciMonk.currentShape.scale[0] += 0.05;
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
				}
			}else{
				sciMonk.currentShape.rot[0] = (sciMonk.currentShape.rot[0] - Math.PI/100)%(2*Math.PI);
				rotateShape();
			}
		break;
		case 69://e
			if(sciMonk.shift){
				if((sciMonk.currentShape.scale[2]*sciMonk.initialSize)<sciMonk.Depth){
					sciMonk.currentShape.scale[2] += 0.05;
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
				}
			}else{
				sciMonk.currentShape.rot[2] = (sciMonk.currentShape.rot[2] - Math.PI/100)%(2*Math.PI);
				rotateShape();
			}
		break;
		case 70://f
			if(sciMonk.currentShape.type!="node"){
				if(sciMonk.currentShape.res[0] > sciMonk.minRes ){
					sciMonk.currentShape.res[0] -= 1;
					sciMonk.currentShape.res[1] -= 1;
					sciMonk.currentShape.originalShape = getShape(sciMonk.currentShape.type,sciMonk.currentShape.pos,
					sciMonk.currentShape.size,sciMonk.currentShape.res[0],sciMonk.currentShape.res[1]);
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					//sciMonk.currentShape.shape = copyArray(sciMonk.currentShape.originalShape);
					rotateShape();
				}
			}
		break;
		case 81://q
			if(sciMonk.shift){
				if((sciMonk.currentShape.scale[2]-0.05)>0.01){
					sciMonk.currentShape.scale[2] -= 0.05;
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
				}
			}else{
				sciMonk.currentShape.rot[2] = (sciMonk.currentShape.rot[2] + Math.PI/100)%(2*Math.PI);
				rotateShape();
			}
		break;
		
		case 82://r
			if(sciMonk.currentShape.type!="node"){
				if(sciMonk.currentShape.res[0] < sciMonk.maxRes ){
					sciMonk.currentShape.res[0] += 1;
					sciMonk.currentShape.res[1] += 1;
					sciMonk.currentShape.originalShape = getShape(sciMonk.currentShape.type,sciMonk.currentShape.pos,
					sciMonk.currentShape.size,sciMonk.currentShape.res[0],sciMonk.currentShape.res[1]);
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					//sciMonk.currentShape.shape = copyArray(sciMonk.currentShape.originalShape);
					rotateShape();
				}
			}	
		break;
		case 83://s
			if(sciMonk.shift){
					if((sciMonk.currentShape.scale[1]-0.05)>0.01){
						sciMonk.currentShape.scale[1] -= 0.05;
						sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
						rotateShape();
					}
			}else{
				sciMonk.currentShape.rot[1] = (sciMonk.currentShape.rot[1] + Math.PI/100)%(2*Math.PI);
				rotateShape();
			}
		break;
		case 87://w
			if(sciMonk.shift){
				if((sciMonk.currentShape.scale[1]*sciMonk.initialSize)<sciMonk.Height){
					sciMonk.currentShape.scale[1] += 0.05;
					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
				}
			}else{
				sciMonk.currentShape.rot[1] = (sciMonk.currentShape.rot[1]-Math.PI/100)%(2*Math.PI);
				rotateShape();
			}
		break;
		case 88://x
			if(sciMonk.shift){
				sciMonk.currentShape.scale = [1,1,1];
				sciMonk.currentShape.scaledShape = sciMonk.currentShape.originalShape;
				rotateShape();
			}else{
				sciMonk.currentShape.rot = [0,0,0];
				sciMonk.clientZ = 0;
				sciMonk.currentShape.pos[2] = 0;
				rotateShape();
			}
		break;
		case 90://z
			if(sciMonk.shift){
				if(	(((sciMonk.currentShape.scale[0]-0.05)>0.01) &&
					((sciMonk.currentShape.scale[1]-0.05)>0.01)) &&
					((sciMonk.currentShape.scale[2]-0.05)>0.01) ){
					sciMonk.currentShape.scale[0] -= 0.05;
					sciMonk.currentShape.scale[1] -= 0.05;
					sciMonk.currentShape.scale[2] -= 0.05;

					sciMonk.currentShape.scaledShape = scaleShape(sciMonk.currentShape.originalShape,sciMonk.currentShape.scale);
					rotateShape();
				}
			}else if(sciMonk.ctrl){
				undo();
			}else{
				if((sciMonk.clientZ + sciMonk.zMove) > (-sciMonk.moveMax)){
					sciMonk.clientZ -=1;
					sciMonk.currentShape.pos[2] -=1;
				}
			}
			
		break;
		default:
		break;
	}
	updateCoordbox();
	
}


/*
	XZ ROTATION

*/
function rotateShape(){
	sciMonk.currentShape.shape = 
		rotate(sciMonk.currentShape.pos,sciMonk.currentShape.scaledShape,sciMonk.currentShape.rot);
		//rotate(getShapeOrigo(sciMonk.currentShape.scaledShape),sciMonk.currentShape.scaledShape,sciMonk.currentShape.rot);
}


function updateZ(){
	var x = Math.abs(sciMonk.lastX - sciMonk.clientX );
	var y = sciMonk.lastY - sciMonk.clientY;
	var dir=1.5;
	if(y>=0){
		dir =-1.5;
	}
	
	// New z position
	var addOn = Math.sqrt(x*x+y*y)*dir|0;
	if(Math.abs(sciMonk.clientZ + addOn + sciMonk.zMove)<=sciMonk.Depth/2){
		sciMonk.clientZ = Math.sqrt(x*x+y*y)*dir;
		//updateGraph();
	}
}



function getMouseCords(evt){
	if(sciMonk.browser == "Firefox"){
		sciMonk.clientX=evt.clientX-sciMonk.xMargin;
		sciMonk.clientY=evt.clientY-sciMonk.xMargin;
	}else{
		sciMonk.clientX=window.event.clientX-sciMonk.xMargin;
		sciMonk.clientY=window.event.clientY-sciMonk.xMargin;
	}
	//alert(sciMonk.clientX+", "+sciMonk.clientY);
}

function updateGraph(){
	updatePos();
	sciMonk.update=true;
}

function updatePos(){
	sciMonk.currentShape.pos[0] =xToGraph(sciMonk.currentX)-sciMonk.xMove|0;
	sciMonk.currentShape.pos[1] =yToGraph(sciMonk.currentY)-sciMonk.yMove|0;
	sciMonk.currentShape.pos[2] = sciMonk.clientZ;
}

/**
 * utils
 */

/*
	SOURCE
*/

function tag(name,props,content){
	var res = "&lt;"+name;
	if(props){
		res += " "+props+" ";
	}
	res += "&gt;\n"+content+"\n&lt;/"+name+"&gt;";
	return res;
}

function scriptImports(){
	return tag("script","type='text/javascript' src='"+sciMonk.javascriptSrc+"'","");
}

/*
	STRINGS
*/

	function codeString(txt){
		txt = replaceAll(txt,"function","<a>function</a>");
		txt = replaceAll(txt,"sciMonk.","<strong>sciMonk.</strong>");
		txt = replaceAll(txt,"sciMonk.","<strong>sciMonk.</strong>");
		/*txt = replaceAll(txt,"rotateShape(","&nbsp&nbsp&nbsp&nbsprotateShape(<br>&nbsp&nbsp&nbsp&nbsp");
		txt = replaceAll(txt,"Map(","Map(<br>&nbsp&nbsp&nbsp&nbsp");
		txt = replaceAll(txt,"[","&nbsp&nbsp&nbsp&nbsp[");
		txt = replaceAll(txt,"{","{<br>&nbsp&nbsp&nbsp&nbsp");
		txt = replaceAll(txt,"}","<br>}<br>");
		txt = replaceAll(txt,";",";<br>&nbsp&nbsp&nbsp&nbsp");*/
		for(i=0;i<10;i++){
			txt = replaceAll(txt,""+i+"","<i>"+i+"</i>");
		}
		return txt;
	}
	
	function replaceAll(txt,rep,newStr){
		var len=rep.length;
		var ti=0;
		while(ti<txt.length-len){
			if(txt.substring(ti,ti+len)==rep){
				txt = txt.substring(0,ti)+newStr+txt.substring(ti+len,txt.length);
				ti = ti+newStr.length;
			}else{
				ti++;
			}

		}
		return txt;
	}

/*
	DRAW EDITOR, MODEL
*/

function drawEditor(){
	sciMonk.currentColour[3]=250;
	// Graph
		
	if(sciMonk.drawGraph)
			sciMonk.nodeCross([0,0,0],10,[1,1,1,250]);
		
	if(sciMonk.placementType == "node"){
		if(sciMonk.crossHair){
			
			sciMonk.nodeCross([sciMonk.currentShape.pos[0],sciMonk.currentShape.pos[1],0],2.5,[100,100,250,250]);
			sciMonk.nodeCross(sciMonk.currentShape.pos,2.5,[180,150,150,250]);
			nodeVector([sciMonk.currentShape.pos[0],sciMonk.currentShape.pos[1],0],
			[sciMonk.currentShape.pos[0],sciMonk.currentShape.pos[1],sciMonk.currentShape.pos[2]],[250,100,100,250],false);
		}
	}
	else{
		updateShapePos();
		if(sciMonk.lineModel){
			sciMonk.lineMapObject(sciMonk.currentShape,false);
		}else if(sciMonk.fillModel)
			sciMonk.colourMapShape(sciMonk.currentShape);
		else if(sciMonk.nodeModel)
			sciMonk.nodeMap(sciMonk.currentShape);
		else
			alert("No shape Selected.");
	}
	if(sciMonk.shapeSelecter.shapes.length>0)
		sciMonk.lineMapObject(sciMonk.shapeSelecter);
		
	drawModel();
	
	if(sciMonk.marker.show)
		sciMonk.lineMap(sciMonk.marker.shape,sciMonk.marker.colour);
}

function drawModel(){
	if( sciMonk.nodeModel && sciMonk.currentCords.length > 0){
		var i=0;
		for(i =0;i<sciMonk.currentCords.length;i++){
			sciMonk.nodeCross(sciMonk.currentCords[i],2.5,[1,1,1,250]);
		}
	}
	if(sciMonk.lineModel){
		if(sciMonk.currentStruct.length >= 1 && sciMonk.currentCords.length >= 1 ){
			sciMonk.lineMap(concatArray(sciMonk.currentStruct,[sciMonk.currentCords]),sciMonk.currentShape.colour);
		}
		else if(sciMonk.currentStruct.length >= 1){
			sciMonk.lineMap(sciMonk.currentStruct,sciMonk.currentShape.colour);
		}
		else if(sciMonk.currentCords.length > 1 ){
			sciMonk.lineMap([sciMonk.currentCords],sciMonk.currentShape.colour);
		}
	}
	
	if(sciMonk.fillModel && sciMonk.currentStruct.length >= 1){
		sciMonk.colourMap(sciMonk.currentStruct,sciMonk.currentShape.colour);
	}
	
	if(sciMonk.currentModel.shapes.length >= 1){
		if(sciMonk.fillModel)
			sciMonk.batchColourMapShapes(sciMonk.currentModel.shapes);//,sciMonk.ModelColours,true,true);
			//var gg = 0;
			//for(gg=0;gg<sciMonk.currentModel.length;gg++)
			//alert(sciMonk.currentModel[gg].id);
		if(sciMonk.lineModel){
			sciMonk.batchLineMapObjects(sciMonk.currentModel.shapes,false);

		}
	}
		
}

/*
	END EDITOR FUNCTIONS
*/

/*
	HEX PARSING
*/
function hexToDecParse(hex){
	var result = 0;
	switch(hex){
		case "a" :
			result = 10;
			break;
		case "b":
			result = 11;
			break;
		case "c":
			result = 12;
			break;
		case "d":
			result = 13;
			break;
		case "e":
			result = 14;
			break;
		case "f":
			result = 15;
			break;
		default :
			result = parseInt(hex);
			break;
	}

	return result;
}

function decToHex(input){
	var output = "";
	var value = input;
	var quotient = 1;
	var remainder = 0;
	while (quotient != 0){
		quotient = 0;
		if (((value - 16) > 0)){
			quotient = (value - value%16) / 16;
			remainder = (value %= (quotient * 16));
			value = quotient;
		}else{
			remainder = value;
		}
		output = hexParse(remainder) + output;
	}
	return output;
}

function hexParse(dec){
	if(dec >= 10 && dec <=15){
			var d = dec%10;
			var l = "abcdef";
			return l.substring(d,d+1);
	}else if(dec == 16)
		return 10;
	else{
		return dec;
	}
}

function hexToDec(hex){
	var i = 0;
	var res = 0;
	var len = hex.length;
	for(i=0;i<len;i++){
		res += hexToDecParse(hex.substring(i,i+1))*Math.pow(16,len-1-i);
	}
	return res;
}

function rgbToHex(r,g,b){
	return "#"+decToHex(r)+decToHex(g)+decToHex(b);
}

function parseHexColour(elms,rgb){
	elms[2] = hexToDec(rgb.substring(4))
	elms[1] = hexToDec(rgb.substring(2,4))
	elms[0] = hexToDec(rgb.substring(0,2))
}

/*
	VALIDATE
*/

// negative
function validateStringNegative(string,rejects){
	string = string.toLowerCase();
	var i = 0;
	for(i=0;i<=rejects.length-1;i++){
		if(string.indexOf(rejects.substring(i,i+1)) !== -1)
			return false;
	}
	return true;
}

// positive 
function validateStringPositive(string,accepts){
	string = string.toLowerCase();
	var i = 0;
	for(i=0;i<=string.length-1;i++){
		if(accepts.indexOf(string.substring(i,i+1)) == -1)
			return false;
	}
	return true;
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



/**
 * GUI
 */

// observers
sciMonk.observer = new sciMonk.List();
sciMonk.observer.disable = function(value){
	var i =0;
	for(i=0;i<this.size();i++){
		this.list[i].disabled = value;
	}
}

// view stack
sciMonk.viewStack = new sciMonk.List();
sciMonk.viewStack.pop = function(){
	if(this.size()>0){
		deflateView(this.list[this.size()-1]);
		this.remove(this.list,this.size()-1);
	}
}
sciMonk.viewLock = false;

function iniGUI(){

	var movePerspUpp = document.getElementById("movePerspUp");
	movePerspUpp.setAttribute("onMouseDown","HoldKey(this.id)");
	movePerspUpp.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(movePerspUpp);
	
	var movePerspDown = document.getElementById("movePerspDown");
	movePerspDown.setAttribute("onMouseDown","HoldKey(this.id)");
	movePerspDown.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(movePerspDown);
	//
	var movePerspRight = document.getElementById("movePerspRight");
	movePerspRight.setAttribute("onMouseDown","HoldKey(this.id)");
	movePerspRight.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(movePerspRight);
	//
	var movePerspLeft = document.getElementById("movePerspLeft");
	movePerspLeft.setAttribute("onMouseDown","HoldKey(this.id)");
	movePerspLeft.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(movePerspLeft);
	//
	var movePerspForeward = document.getElementById("movePerspForeward");
	movePerspForeward.setAttribute("onMouseDown","HoldKey(this.id)");
	movePerspForeward.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(movePerspForeward);
	//
	var movePerspBack = document.getElementById("movePerspBack");
	movePerspBack.setAttribute("onMouseDown","HoldKey(this.id)");
	movePerspBack.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(movePerspBack);
	//
	var rotatePerspRight = document.getElementById("rotatePerspRight");
	rotatePerspRight.setAttribute("onMouseDown","HoldKey(this.id)");
	rotatePerspRight.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(rotatePerspRight);
	
	var rotatePerspLeft = document.getElementById("rotatePerspLeft");
	rotatePerspLeft.setAttribute("onMouseDown","HoldKey(this.id)");
	rotatePerspLeft.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(rotatePerspLeft);
	
	var rotatePerspUp = document.getElementById("rotatePerspUp");
	rotatePerspUp.setAttribute("onMouseDown","HoldKey(this.id)");
	rotatePerspUp.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(rotatePerspUp);
	
	var rotatePerspDown = document.getElementById("rotatePerspDown");
	rotatePerspDown.setAttribute("onMouseDown","HoldKey(this.id)");
	rotatePerspDown.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(rotatePerspDown);
	
	var rotatePerspAntiClockw = document.getElementById("rotatePerspAntiClockwise");
	rotatePerspAntiClockw.setAttribute("onMouseDown","HoldKey(this.id)");
	rotatePerspAntiClockw.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(rotatePerspAntiClockw);
	
	var rotatePerspClockw = document.getElementById("rotatePerspClockwise");
	rotatePerspClockw.setAttribute("onMouseDown","HoldKey(this.id)");
	rotatePerspClockw.setAttribute("onMouseUp","btnUp()");
	sciMonk.observer.add(rotatePerspClockw);
	
	var resetBtn = document.getElementById("resetView");
	resetBtn.setAttribute("onClick","resetView()");
	sciMonk.observer.add(resetBtn);
	
}




// ----------------------- Input functions -------------------------

var EventId;
var btnIsDown = false;

function HoldKey(eventId){
	EventId = eventId;
	btnIsDown = true;
	btnDown();
}

function btnDown(){
	if(btnIsDown){
		callEvent(EventId);
		var time = setTimeout("btnDown()", 20);
	}
}

function btnUp(){
	btnIsDown = false;
}

function callEvent( eventId){
	sciMonk.update = true;                     /*    <---	SETS UPDATE HERE!!		*/
	switch(eventId){
		case "movePerspUp" :
			movePerspectiveY(5);
		break;
		case "movePerspDown" :
			movePerspectiveY(-5);
		break;
		case "movePerspLeft" :
			 movePerspectiveX(-5);
		break;
		case "movePerspRight" :
			movePerspectiveX(5);
		break;
		case "movePerspForeward" :
			movePerspectiveZ(-5);
		break;
		case "movePerspBack" :
			movePerspectiveZ(5);
		break;
		case "rotatePerspRight" :
			xRzPerspectiveRotation(-Math.PI/100);
		break;
		case "rotatePerspLeft" :
			xRzPerspectiveRotation(Math.PI/100);
		break;
		case "rotatePerspUp" :
			yRzPerspectiveRotation(-Math.PI/100);
		break;
		case "rotatePerspDown" :
			yRzPerspectiveRotation(Math.PI/100);
		break;
		case "rotatePerspAntiClockwise" :
			xRyPerspectiveRotation(-Math.PI/100);
		break;
		case "rotatePerspClockwise" :
			xRyPerspectiveRotation(Math.PI/100);
		break;
		default :
		break;
	}
	
}

function resetView(){
	reset();
	sciMonk.update=true;
}

function movePerspectiveX(dir){
	if(sciMonk.moveMax!=0 && 
	!((sciMonk.xMove + dir > sciMonk.moveMax/2) || 
	((sciMonk.xMove + dir) < -sciMonk.moveMax/2))){
		sciMonk.xMove += dir;
	}
}

function movePerspectiveY(dir){
	if(sciMonk.moveMax!=0 && 
	!((sciMonk.yMove + dir > sciMonk.moveMax/2) || 
	((sciMonk.yMove + dir) < -sciMonk.moveMax/2))){
		sciMonk.yMove += dir;
	}
}

function movePerspectiveZ(dir){
	if(sciMonk.moveMax!=0 && 
	!((sciMonk.zMove + dir > sciMonk.moveMax) || 
	((sciMonk.zMove + dir) < -sciMonk.moveMax))){
		sciMonk.zMove += dir;
		//changePerspMat();
	}
}

function xRzPerspectiveRotation(deg){
	sciMonk.xRzRot += deg;
}

function yRzPerspectiveRotation(deg){
	sciMonk.yRzRot += deg;
}

function xRyPerspectiveRotation(deg){
	sciMonk.xRyRot += deg;
}

function setDrawMethod(val){
	if(val >= 0 && val <= line.length - 1 )
		changeDrawMethod = val;
}

// ------------------------------------- Console ---------------------------------------
function ClearMessages()
{
	var oldmessages = new Array();
	var mes = document.getElementById("message");
	var oldmessages = mes.childNodes;
	if(oldmessages.length > 30 ){
	var newMessages = new Array();
	var count = 0;
		for( i = oldmessages.length - 1; i > 10 ; i --){
			newMessages[count] = oldmessages[i];
			count ++;
		}
		mes.innerHTML = "";
		for( i = 0; i < newMessages.length; i ++ ){
			mes.appendChild(newMessages[i]);
		}
		
	}		
}



/**
 STL files
 * 
 */


function dropEventHandler(event){
  console.log("dropped file" + event);
  event.preventDefault();
  if (event.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...event.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        var reader = new FileReader();
        const file = item.getAsFile();
        reader.readAsArrayBuffer(file);
        reader.onload = function() {
          //console.log(reader.result);
          parseSTL(reader.result);
        };
        reader.onerror = function() {
          console.log(reader.error);
        };
      }
    });
  }
}

function dragEnterEventHandler(event){
  event.preventDefault();
}

function dragOverEventHandler(event){
  event.preventDefault();
}

function parseSTL(arrayBuffer){
  // Header (80 bytes) and number of triangles (4 bytes) 0 - 83
  // Each triangle is 50 bytes unit vector (12 bytes), 3 points (12 bytes), and attribute count (2 bytes)
  const result = new Array();
  for(var i = 84; i < arrayBuffer.byteLength; i += 50) {
    var points = new Float32Array(arrayBuffer.slice(i, i+48));
    result.push([[points[3],points[4],points[5]], [points[6],points[7],points[8]], [points[9],points[10],points[11]]]);
  }
  addShapeToModel(result, "imported_stl", [1,1,1,255], [1,1,1], [1,1,1]);
  updateShapeList();
}

function modelToSTL(){
  console.log(sciMonk.currentModel.shapes);
  var triangles = new Array();
  for(model of sciMonk.currentModel.shapes) {
    triangles = triangles.concat(model.shape);
  }

  const count = triangles.length;

  console.log(count);
  const bufferLength = 84 + count*50;
  const buffer = new ArrayBuffer(bufferLength);
  const dataView = new DataView(buffer);
  var j = 0;
  dataView.setUint32(80, count, true); // UINT32       – Number of triangles    -      4 bytes
  for(var i = 84; i < buffer.byteLength; i+= 50){
    var shape = triangles[j];
    // REAL32[3] – Normal vector - 12 bytes
    dataView.setFloat32(i, 0, true);
    dataView.setFloat32(i + 4, 0, true);
    dataView.setFloat32(i + 8, 0, true);
    // triangles
    dataView.setFloat32(i + 12, shape[0][0], true);
    dataView.setFloat32(i + 16, shape[0][1], true);
    dataView.setFloat32(i + 20, shape[0][2], true);
    dataView.setFloat32(i + 24, shape[1][0], true);
    dataView.setFloat32(i + 28, shape[1][1], true);
    dataView.setFloat32(i + 32, shape[1][2], true);
    dataView.setFloat32(i + 36, shape[2][0], true);
    dataView.setFloat32(i + 40, shape[2][1], true);
    dataView.setFloat32(i + 44, shape[2][2], true);
    j++;
  }

  var file = new Blob([buffer], {type: "application/octet-binary;charset=utf-8"});
  var a = document.createElement("a"), url = URL.createObjectURL(file);
  a.href = URL.createObjectURL( file );;
  a.download = sciMonk.currentModel.name +".stl";
  document.body.appendChild(a);
  a.click();

} 