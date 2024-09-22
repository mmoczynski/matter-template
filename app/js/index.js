import bootstrapModal from "./src/bsModal.js";
import {alertModal,confirmModal,promptModal} from "./src/alertModal.js";
import eventHandler from "./src/eventHandler.js";
import { transformObject } from "./src/transformObject.js";
import MatterTemplateGui from "./src/matterTemplateGui.js";

import "./src/file/open.js";
import "./src/file/new.js";
import "./src/file/export.js";
import "./src/file/save.js";

import "./src/delta.js";

let canvas = document.createElement("canvas");

canvas.id = "mattertree-gui-canvas";

// Set definitions 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

document.body.appendChild(canvas);


MatterTemplateGui.bootstrapModal = bootstrapModal;
MatterTemplateGui.alert = alertModal
MatterTemplateGui.confirm = confirmModal;
MatterTemplateGui.prompt = promptModal;

window.MatterTemplateGui = MatterTemplateGui;

MatterTemplateGui.prototype.generateVertexCode = function() {

	let txt = "let composite = Matter.composite.create();\n\n";
	
	txt = txt + "let shapes = [];\n\n";

	for(var i = 0; i < this.shapes.length; i++) {
		let c = Matter.Vertices.centre(this.shapes[i]);
		txt = txt + `shapes[${i}] = Matter.Bodies.fromVertices(${c.x},${c.y},${JSON.stringify(this.shapes[i])});` + "\n\n";
		txt = txt + `Matter.composite.add(composite,shapes[${i}]);\n\n`;
	}
	

	return txt;
}

// Attach events
Object.assign(MatterTemplateGui.prototype,eventHandler);


function transformSelectedObjectsByMouse(event) {

	matterTemplateGui.selectionTool.selectedObjects.forEach(function(o){
		transformObject(o, {
			x: event.movementX,
			y: event.movementY
		})
	});

}

canvas.addEventListener("mousedown", function(){

	if(matterTemplateGui.selectionTool.selectedObjects.length) {
		canvas.addEventListener("mousemove", transformSelectedObjectsByMouse);
	}

});

canvas.addEventListener("mouseup", function(){
	canvas.removeEventListener("mousemove", transformSelectedObjectsByMouse);
});

let matterTemplateGui = new MatterTemplateGui(document.body);

window.matterTemplateGui = matterTemplateGui;