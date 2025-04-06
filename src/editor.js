import { SciMonk } from './main3D.js';
import { ScimonkGifView, ScimonkView} from './views.js';
import { DrawModes } from './modes.js';
import { BroccoliFactory } from './things/broccoli.js';
import { createBag } from './things/bag.js';
import { Geometry } from './geometry.js';

let sciMonk;
let drawModes;
let view;
let running = true;
let bag;
let box;
let sphere;
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
  };
  reader.onerror = function() {
    console.log(reader.error);
  };
}

function parseSTL(arrayBuffer) {
  const geometry = sciMonk.parseSTL(arrayBuffer);
  geometry.center([0,0,0]);
  geometry.scale([6,6,6]);
  geometry.rotate([0,Math.PI/2,Math.PI]);
  sciMonk.add(geometry);
  sciMonk.render();
  updateShapeList();
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
  sciMonk.render();


  if(running) {
    setTimeout(runBag, 25);
  } else {
    view.finish();
  }
}

function initBag(){
  view = new ScimonkView(document.getElementById("canvas"), 150);
  view.fill([200,150,150,255]);
  const drawModes = new DrawModes(true, true);
  drawModes.overrideLineColour([3,3,3,255]);
  drawModes.overrideFillColour([170,170,170,255]);
  drawModes.overrideSkipBackFacingTriangles(false);

  sciMonk = new SciMonk(view, drawModes);

  bag = createBag(0,-50,0,100,150,50, [3,3,3,255], 1);
  bag.shakeTriangles(7);
  sciMonk.add(bag);

  sciMonk.render();
  runBag();
}

/*
  BROCCOLI
*/

function initBroccoli(){
  view = new ScimonkView(document.getElementById("canvas"), 75);
  view.fill([200,150,150,255]);
  drawModes = new DrawModes(true, false);
  drawModes.overrideLineColour([3,3,3,255]);
  sciMonk = new SciMonk(view, drawModes);
  const broccoliFactory = new BroccoliFactory(50, 20, 6, [50,200,50,255], 1);
  const broccoli = broccoliFactory.createBroccoli([0,0,0], [200,200,200]);
  const broccoliCopy = broccoli.copy();
  broccoliCopy.setDrawModes(new DrawModes(false, true));
  broccoliCopy.scale([1.01,1.01,1.01]);
  sciMonk.add(broccoli);
  sciMonk.add(broccoliCopy);
  sciMonk.render();
  running = true;
  runBroccoli();
}

function runBroccoli(){
  let startTime = performance.now();
  sciMonk.render();
  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  console.log(`Render time: ${timeTaken} milliseconds`);

  let startTime2 = performance.now();
  sciMonk.rotate([-0.05,0,0]);
  let endTime2 = performance.now();
  let timeTaken2 = endTime2 - startTime2;
  console.log(`Rotate time: ${timeTaken2} milliseconds`);

  drawModes.overrideFillColour([255*Math.random(),255*Math.random(),255*Math.random(),255]);

  if(running) {
    setTimeout(runBroccoli, 25);
  } else {
    view.finish();
  }
}

/*
  MAIN
*/

function initBox(){
  view = new ScimonkView(document.getElementById("canvas"), 75);
  view.fill([200,150,150,255]);
  drawModes = new DrawModes(true, true);
  sciMonk = new SciMonk(view, drawModes);
  box = Geometry.gridBox([0,0,0], [100,100,100], 3, [200,200,200,255], 1);
  sciMonk.add(box);
  sciMonk.rotate([0.05,0.05,0.05]);
  sciMonk.render();
  running = true;
  runBox();
}

function runBox(){
  sciMonk.rotate([0.05,0,0]);
  sciMonk.render();
  if(running) {
    setTimeout(runBox, 25);
  }
}

function initBox2(){
  view = new ScimonkGifView(document.getElementById("canvas"), 75);
  view.fill([200,150,150,255]);
  drawModes = new DrawModes(true, true);
  drawModes.overrideLineColour([3,3,3,255]);
  sciMonk = new SciMonk(view, drawModes);
  const box = Geometry.box([0,0,0], [200,200,200], [200,200,200,255], 1);
  sciMonk.add(box);
  sciMonk.render();
  running = true;
  runBox2();
}

function runBox2(){
  sciMonk.render();
  sciMonk.rotate([0.05,0,0]);
  if(running) {
    setTimeout(runBox2, 25);
  } else {
    view.finish();
  }
}

function initSphere(){
  view = new ScimonkView(document.getElementById("canvas"), 75);
  view.fill([200,150,150,255]);
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
  sciMonk.rotate([0.05,0,0]);
  sciMonk.render();
  if(running) {
    setTimeout(runSphere, 25);
  }
}



export function init(){
  //initBag();
  initBroccoli();
  //initBox();
  //initBox2();
  //initSphere();
}


// Expose functions to global scope for HTML event handlers
window.dropEventHandler = dropEventHandler;
window.dragEnterEventHandler = dragEnterEventHandler;
window.dragOverEventHandler = dragOverEventHandler;
window.generateStlFile = generateStlFile;
window.stopAnimation = stopAnimation;