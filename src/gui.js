

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


