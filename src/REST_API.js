
sciMonk.REST = new Object();
// Current sciMonk restService JSON path
// var sciMonk.REST.corsURL = "http://localhost:8080/SciMonkRestService/ModelService/";
sciMonk.REST.corsURL = "http://www.dennisjonsson.com/sciMonk/lib/model/";
sciMonk.REST.loadURL = sciMonk.REST.corsURL+"load.php?id=";
sciMonk.REST.PATH = "lib/model/";
sciMonk.REST.responseText;
sciMonk.REST.serverMessages="";
sciMonk.REST.requestError = false;
sciMonk.REST.f = undefined;

sciMonk.REST.reset = function(){
	sciMonk.REST.requestError = false;
	sciMonk.REST.responseText = undefined;
	sciMonk.REST.serverMessages="";
}

sciMonk.REST.getModel=function(id, model){
	sciMonk.REST.CorsRequest("GET",sciMonk.REST.corsURL+"load.php?id="+id,
	function(){
		model = eval ("(" + sciMonk.REST.responseText + ")");
	});
}

sciMonk.REST.setPATH = function(url){
	sciMonk.REST.PATH = url;
}

sciMonk.REST.request = function(method,url,f){
	sciMonk.REST.reset();
	sciMonk.REST.f = f;
	XmlHttpReq(method,url);
	waitForResponse(0);
}

sciMonk.REST.PostRequest = function(url,param,f){
	sciMonk.REST.reset();
	sciMonk.REST.f = f;
	XmlHttpPostReq(url,param);
	waitForResponse(0);
}

sciMonk.REST.CorsRequest = function(method,url,f){
	sciMonk.REST.reset();
	sciMonk.REST.f = f;
	CorsRequest(method,url);
	waitForResponse(0);
}

sciMonk.REST.CorsPostRequest = function(url,param,f){
	sciMonk.REST.reset();
	sciMonk.REST.f = f;
	CorsPostRequest(url,param);
	waitForResponse(0);
}

function waitForResponse(n){
	if(sciMonk.REST.responseText){
		sciMonk.REST.f();
	}
	else if(n>100 ){
		alert("could not finish request");
	}
	else
		var timeout = setTimeout("waitForResponse("+(n+1)+")",100);
}

function serverMessage(msg){
	sciMonk.REST.serverMessages += "<br>: "+msg;
}

/*
	XML HTTP EQUEST
*/

function XmlHttpPostReq(url,param){
	if (window.XMLHttpRequest){
		xhttp=new XMLHttpRequest();
	}
	else // code for IE5 and IE6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("POST",url,true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.onreadystatechange = function() {//Call a function when the state changes.
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			sciMonk.REST.responseText = xhttp.responseText;
		}else{
			sciMonk.REST.requestError = true;
			serverMessage("error with status: "+xhttp.status);
			serverMessage(sciMonk.REST.responseText);
		}
	}
	xhttp.send(param);
	
}

function XmlHttpReq(method, url){
	if (window.XMLHttpRequest){
		xhttp=new XMLHttpRequest();
	}
	else // code for IE5 and IE6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open(method,url,true);
	xhttp.onreadystatechange = function() {//Call a function when the state changes.
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			sciMonk.REST.responseText = xhttp.responseText;
		}else{
			sciMonk.REST.requestError = true;
			serverMessage("status: "+xhttp.status);
			serverMessage(sciMonk.REST.responseText);
		}
	}
	xhttp.send();
}

/*
	CREATE CORS REQUEST
*/
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
	xhr.setRequestHeader("Content-type", "application/json");
  } else {
    xhr = null;
  }
  return xhr;
}

/*
	CORS POST / UPDATE
*/
function CorsPostRequest(url,param){

	var xhr = createCORSRequest('POST', url);
    if (!xhr) {
		sciMonk.REST.requestError = true;
		serverMessage('Cannot connect to server: CORS not supported');
		return;
    }

    // Response handlers.
    xhr.onload = function() {
		sciMonk.REST.responseText = xhr.responseText;
		serverMessage(sciMonk.REST.responseText);
    };
    xhr.onerror = function() {
		sciMonk.REST.requestError = true;
		serverMessage('There was an error making the POST request. Status '+xhr.status);
    };
	
    xhr.send(param);
}

/*
	CORS REQUEST
*/

function CorsRequest(method,url){

	var xhr = createCORSRequest(method, url);
    if (!xhr) {
		sciMonk.REST.requestError = true;
		serverMessage('Cannot connect to server: CORS not supported');
		return;
    }

    // Response handlers.
    xhr.onload = function() {
		sciMonk.REST.responseText = xhr.responseText;
		serverMessage(sciMonk.REST.responseText);
    };
    xhr.onerror = function() {
		sciMonk.REST.requestError = true;
		serverMessage('There was an error making the '+method+' request. Status '+xhr.status);
    };
	
    xhr.send();
}