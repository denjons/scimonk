import { SciMonk, DrawModes } from './main3D.js';
import { ScimonkGifView } from './views.js';
import { createBag } from './items.js';

// Global variables
let sciMonk;
let bag;
let view;
let running = true;

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

function updateShapeList() {
  // Implementation needed
}



// Animation functions
function run() {
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
    setTimeout(run, 25);
  } else {
    view.finish();
  }
}


export function init(){
  // Initialize the editor
  view = new ScimonkGifView(document.getElementById("canvas"));
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
  run();

}

// Expose functions to global scope for HTML event handlers
window.dropEventHandler = dropEventHandler;
window.dragEnterEventHandler = dragEnterEventHandler;
window.dragOverEventHandler = dragOverEventHandler;
window.generateStlFile = generateStlFile;
window.stopAnimation = stopAnimation;