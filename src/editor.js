import { SciMonk } from './main3D.js';
import { ScimonkGifView, ScimonkView} from './views.js';
import { DrawModes } from './modes.js';
import { BroccoliFactory } from './things/broccoli.js';
import { createBag } from './things/bag.js';
import { Geometry } from './geometry.js';
import { TextUtils } from './textUtils.js';

let sciMonk;
let drawModes;
let view;
let running = true;
let bag;
let box;
let sphere;

// Function to update the triangle count display
function updateTriangleCount() {
  let totalTriangles = 0;
  for (let geometry of sciMonk.model.geometries) {
    totalTriangles += geometry.triangles.length;
  }
  document.getElementById('triangles').value = totalTriangles;
}

// File handling functions
function dropEventHandler(event) {
  console.log("dropped file" + event);
  event.preventDefault();
  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        readStlFile(item);
      }
    });
  }
}

function dragEnterEventHandler(event) {
  event.preventDefault();
}

function dragOverEventHandler(event) {
  event.preventDefault();
}

function readStlFile(event) {
  var reader = new FileReader();
  const file = event.getAsFile();
  reader.readAsArrayBuffer(file);
  reader.onload = function() {
    parseSTL(reader.result);
    updateTriangleCount();
  };
  reader.onerror = function() {
    console.log(reader.error);
  };
}

function parseSTL(arrayBuffer) {
  const geometry = sciMonk.parseSTL(arrayBuffer, [200,200,200,255]);
  geometry.center([0,0,0]);
  geometry.scale([6,6,6]);
  geometry.rotate([0,Math.PI/2,0]);
  geometry.rotate([Math.PI/2,0,0]);
  sciMonk.add(geometry);
}

function readJsonfILe(event) {
  var reader = new FileReader();
  const file = event.getAsFile();
  reader.readAsText(file);
  reader.onload = function() {
    readJson(reader.result);
  };
  reader.onerror = function() {
    console.log(reader.error);
  };
}

function readJson(text) {
  const geometry = sciMonk.parseJson(JSON.parse(text));
  geometry.computeNormals();
  console.log(geometry);
  geometry.center([0,0,0]);
  sciMonk.add(geometry);
  sciMonk.render();
}

function generateStlFile() {
  const stl = modelToSTL();
  const blob = new Blob([stl], { type: 'model/stl' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model.stl';
  a.click();
  URL.revokeObjectURL(url);
}

function stopAnimation() {
  running = false;
}

function modelToSTL() {
  const buffer = sciMonk.writeSTL();
  var file = new Blob([buffer], {type: "application/octet-binary;charset=utf-8"});
  var a = document.createElement("a"), url = URL.createObjectURL(file);
  a.href = URL.createObjectURL(file);
  a.download = "test.stl";
  document.body.appendChild(a);
  a.click();
}

/*
  BAG
*/

function runBag() {
  const rott = [Math.random()/10, Math.random()/10, Math.random()/10];
  bag.rotate(rott);        
  var newBag = bag.copy();  
  newBag.rotate(rott);
  newBag.shakeTriangles(2);
  sciMonk.add(newBag);
  bag = newBag;
  bag.shakeTriangles(7);
  sciMonk.rotate(rott);
  
  let startTime = performance.now();
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  
  // Update render time field
  document.getElementById('renderTime').value = `${timeTaken.toFixed(2)} ms`;

  if(running) {
    setTimeout(runBag, 25);
  } else {
    view.finish();
  }
}

function initBag(){
  view = new ScimonkView(document.getElementById("canvas"), 150);
  const drawModes = new DrawModes(true, true);
  drawModes.overrideLineColour([3,3,3,255]);
  drawModes.overrideFillColour([170,170,170,255]);
  drawModes.overrideSkipBackFacingTriangles(false);

  sciMonk = new SciMonk(view, drawModes);

  bag = createBag(0,-50,0,100,150,50, [3,3,3,255], 1);
  bag.shakeTriangles(7);
  sciMonk.add(bag);
  updateTriangleCount();
  sciMonk.render();
  runBag();
}

/*
  BROCCOLI
*/

function initBroccoli(){
  view = new ScimonkView(document.getElementById("canvas"), {backgroundColour: [200,150,150,255]});
  drawModes = new DrawModes(true, false);
  drawModes.overrideLineColour([3,3,3,255]);
  sciMonk = new SciMonk(view, drawModes);

  // broccoli
  const broccoliFactory = new BroccoliFactory(30, 15, 6, [50,200,50,255], 1);
  const broccoli = broccoliFactory.createBroccoli([0,50,0], [100,100,100]);
  sciMonk.add(broccoli);

  // line broccoli
  
  const broccoliCopy = broccoli.copy();
  broccoliCopy.setDrawModes(new DrawModes(false, true));
  broccoliCopy.scale([1.01,1.01,1.01]);
  sciMonk.add(broccoliCopy);
  

  sciMonk.addText("sciMonk", {fontFamily: 'Arial', fontSize: 256, fontWeight: 'bold', textColor: [3,3,3,255], position: [275, 950]});
  
  sciMonk.render();
  running = true;
  updateTriangleCount();
  runBroccoli();
}

function runBroccoli(){
 // drawModes.overrideLineColour([255*Math.random() ,255*Math.random(),255*Math.random(),255]);
  let startTime = performance.now();
  sciMonk.rotate([-0.05,0,0]);
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;  
  document.getElementById('renderTime').value = `${timeTaken.toFixed(2)} ms`;
  
  //drawModes.overrideFillColour([255*Math.random(),255*Math.random(),255*Math.random(),255]);

  if(running) {
    setTimeout(runBroccoli, 25);
  } else {
    view.finish();
  }
}


function initBox(){
  view = new ScimonkView(document.getElementById("canvas"), {backgroundColour: [200,150,150,255], backgroundType: 'pattern'});
  drawModes = new DrawModes(true, true);
  drawModes.overrideLineColour([3,3,3,255]);
  sciMonk = new SciMonk(view, drawModes);

 // sciMonk.addText("sciMonk", {fontFamily: 'Arial', fontSize: 256, fontWeight: 'bold', textColor: [3,3,3,255], position: [275, 950]});

  const box = Geometry.box([0,0,0], [150,150,150], [200,200,200,255], 1);
  sciMonk.add(box);
  /*
  const box2 = box.copy();
  box2.setDrawModes(new DrawModes(false, true));
  box2.scale([1.01,1.01,1.01]);
  sciMonk.add(box2);
  */
  sciMonk.render();
  running = true;
  updateTriangleCount();
  runBox();
}

function runBox(){
  let startTime = performance.now();  
  sciMonk.rotate([0.05,0.05,0.05]);
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  
  // Update render time field
  document.getElementById('renderTime').value = `${timeTaken.toFixed(2)} ms`;
  
  

  if(running) {
    setTimeout(runBox, 50);
  } else {
    view.finish();
  }
}

function initSphere(){
  view = new ScimonkView(document.getElementById("canvas"), {backgroundColour: [200,150,150,255], backgroundType: 'pattern'});
  drawModes = new DrawModes(true, false);
  drawModes.overrideLineColour([3,3,3,255]);
  drawModes.overrideFillColour([170,170,170,255]);
  sciMonk = new SciMonk(view, drawModes);
  sphere = Geometry.sphere([0,0,0], [400,400,400], 50, 50, [200,200,200,255], 1);
  sciMonk.add(sphere);
  sciMonk.render();
  running = true;
  runSphere();
}

function runSphere(){
  //box = box.copy();
  //box.rotate(rott);
 // sciMonk.add(box);
  //sphere.shakeTriangles(2);
  let startTime = performance.now();
  sciMonk.rotate([0.05,0,0]);
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  
  // Update render time field
  document.getElementById('renderTime').value = `${timeTaken.toFixed(2)} ms`;
  
  // Update triangle count
  updateTriangleCount();
  
  if(running) {
    setTimeout(runSphere, 25);
  }
}

function initEmpty(){
  view = new ScimonkView(document.getElementById("canvas"), 75);
  drawModes = new DrawModes(true, false);
  drawModes.overrideLineColour([3,3,3,255]);
  sciMonk = new SciMonk(view, drawModes);
  runEmpty();
}

function runEmpty(){
  let startTime = performance.now();
  sciMonk.rotate([0.05,0,0]);
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  document.getElementById('renderTime').value = `${timeTaken.toFixed(2)} ms`;
  if(running) {
    setTimeout(runEmpty, 25);
  }
}


function initText(){
  view = new ScimonkView(document.getElementById("canvas"), 75);
  drawModes = new DrawModes(false, true);
  sciMonk = new SciMonk(view, drawModes);
  const text = new TextUtils({fontSize: 64, fontWeight: 'bold' });
  const text2 = text.textTo3D("10杯", [10, 10, 10], [3,3,3,255], 1);
  text2.scale([0.5,0.5,0.5]);
  sciMonk.add(text2);
  sciMonk.render();
  running = true;
  updateTriangleCount();
  runText();
}

function runText(){
  let startTime = performance.now();
  sciMonk.rotate([0.05,0,0]);
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  document.getElementById('renderTime').value = `${timeTaken.toFixed(2)} ms`;
  if(running) {
    setTimeout(runText, 25);
  } else {
    view.finish();
  } 
}



export function init(){
  // Initialize text fields with default values
  document.getElementById('renderTime').value = '0.00 ms';
  document.getElementById('misc').value = '';
  document.getElementById('triangles').value = '0';
  
  //initBag();
  initBroccoli();
  //initBox();
  //initGridBox();
  //initSphere();
  //initEmpty();
  //initText();
}


// Expose functions to global scope for HTML event handlers
window.dropEventHandler = dropEventHandler;
window.dragEnterEventHandler = dragEnterEventHandler;
window.dragOverEventHandler = dragOverEventHandler;
window.generateStlFile = generateStlFile;
window.stopAnimation = stopAnimation;