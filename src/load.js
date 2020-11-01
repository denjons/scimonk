
var loader = new Object();
loader.op = 1;
loader.count=1;
loader.dir = -1;
loader.view = undefined;
loader.parent = undefined;
loader.loading = false;

/*
	Initiates with at least one div element
*/
loader.init = function(view){
	this.reset();
	var div = document.createElement("div");
	div.id = "loadContainer";
	div.setAttribute("align","center");
	div.innerHTML = "<h3>loading..</h3>";
	loader.parent=view;
	this.view = div;
}

/*
	main progress.
	changes state in loader
*/
loader.progress = function(){
	this.op = this.op + 0.1*this.dir;
	this.count ++;
	if(this.count%10==0){
		this.dir = this.dir*(-1);
	}
	this.view.style.opacity = this.op;
	
	if(this.count > 600){
		// Kill the loader if too much time has passed.
		loader.loading = false;
		this.finish();
		alert("loading timed out");
	}
	else if(this.loading){
		var time = setTimeout("loader.progress()",50);
	}
}

/*
	changes state in all observers
*/
loader.start = function(){
	loader.loading = true;
	this.parent.appendChild(this.view);
	//this.view.style.marginLeft = ((this.parent.clientWidth-this.view.clientWidth)/2)+"px";
	//this.view.style.marginTop = 200+"px";
	this.progress();
}

/*
	resets state in loader and removes all observers.
*/
loader.finish = function(){
	this.reset();
	this.parent.removeChild(this.view);
}

loader.reset = function(){
	loader.loading = false;
	this.op = 1;
	this.count = 1;
	this.dir = -1;
}


