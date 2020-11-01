

/*
	SOURCE
*/


function getSciMonkSource(){
	return "&lt;!DOCTYPE HTML&gt;\n"+
		tag("html",0,tag("head",0,scriptImports())+"\n"+
		tag("body",0,tag("div","id='wraper'",tag("canvas","id='canvas' width='500' height='500'","")+"\n"+
		tag("script","type='text/javascript'",getScript()))))+"";
}

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

function getScript(){
		return "var model = new Object();\n"+
		"sciMonk.init(document.getElementById('canvas'));\n"+
		"sciMonk.moveMax=500;\n"+
		"sciMonk.draw=function(){\n"+
		//"&nbsp&nbsp&nbsp&nbsp sciMonk.xRzRot = ((Math.PI/100)*sciMonk.it)%(Math.PI*2);<br>"+
		"sciMonk.colourMapModel(model);\n"+
		//"&nbsp&nbsp&nbsp&nbsp sciMonk.update=true;<br>"+
		"}\n"+
		"sciMonk.yMove = "+sciMonk.yMove+";\n"+
		"sciMonk.xMove = "+sciMonk.xMove+";\n"+
		"sciMonk.zMove = "+sciMonk.zMove+";\n"+
		"sciMonk.xRzRot = "+sciMonk.xRzRot+";\n"+
		"sciMonk.yRzRot = "+sciMonk.yRzRot+";\n"+
		"sciMonk.xRyRot = "+sciMonk.xRyRot+";\n"+
		"sciMonk.REST.CorsRequest('GET',sciMonk.REST.loadURL+"+sciMonk.currentModel.modelId+",\n"+
		"function(){\n"+
		"model = eval ('(' + sciMonk.REST.responseText + ')');\n"+
		"sciMonk.update=true;\n"+
		"});\n";
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
	JSON MODEL PARSING

*/


function JSONparseModelObject(model){
	var JSONmodel = '{ '+
		'"name":"'+model.name+'",'+
		'"user":"'+model.user+'",'+
		'"modelId":'+model.modelId+','+
		'"userId":1,'+
		JSONparseShapeObject(model.shapes)+
		'}';
		return JSONmodel;
}

function JSONparseShapeObject(shapes){
	var JSONshape = '"shapes":'+
			'[';
	var i = 0;
	for(i=0;i<shapes.length;i++){
		JSONshape += '{';
		JSONshape += '"scale":'+ JSONparseVector(shapes[i].scale)+','+
					 '"pos":'+  JSONparseVector(shapes[i].pos)+','+
					 '"rot":'+ JSONparseVector(shapes[i].rot)+','+
					 '"colour":'+ JSONparseVector(shapes[i].colour)+','+
					 '"shapeType":"'+shapes[i].shapeType+'",';
		JSONshape += JSONparseShape(shapes[i].shape);
		JSONshape += '}';
		
		if(i<shapes.length-1)
			JSONshape += ',';
	}
			
	JSONshape += ']';
	return JSONshape;
}

function JSONparseShape(shape){
	var str = '"shape":[';
	var i = 0;
	for(i=0;i<shape.length;i++){
		str += '[';
		var j = 0;
		for(j=0;j<shape[i].length;j++){
			str += JSONparseVector(shape[i][j]);
			if(j<shape[i].length-1)
			str += ',';
		}
		str += ']';
		if(i<shape.length-1)
			str += ',';
	}
	str += ']';
	return str;
}

function JSONparseVector(v){
	var JSONvector = '['
	var j = 0;
	for(j=0;j<v.length;j++){
		JSONvector += v[j];
		if(j<v.length-1)
			JSONvector += ',';
	}
	JSONvector += ']';
	return JSONvector;
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

