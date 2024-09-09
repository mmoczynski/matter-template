import bootstrapModal from "./src/bsModal.js";
import {alertModal,confirmModal,promptModal} from "./src/alertModal.js";
import eventHandler from "./src/eventHandler.js";
import { transformObject } from "./src/transformObject.js";
import MatterTemplateGui from "./src/matterTemplateGui.js";

let canvas = document.createElement("canvas");
window.canvas = canvas;

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

MatterTemplateGui.prototype.new = function() {

	let self = this;

	new Promise(function(resolve){
		
		if(self.newChanges) {
			MatterTemplateGui.confirm("Are you sure you want to create a new project?", function(){
				resolve(1)
			},function(){
				resolve(0);
			})
		}

		else {
			resolve(0)
		}

	}).then(function(value){

		if(value === 1) {

			self.shapes = new Proxy([],{
	
				set: function(target,string,value) {
						
					self.history.push({
						target: target,
						property: string,
						newValue: value,
						oldValue: target[string]
					});
				
					return target[string] = value;
				}
				
			});

		}
 

	}).catch()


}

MatterTemplateGui.prototype.open = function() {

	let self = this;

	return new Promise(function(resolve,reject){
		MatterTemplateGui.confirm("Are you sure you want to open a file?", resolve, reject);
	}).then(function(){
	
		let m = document.createElement("input");
		m.type = "file";
		m.click();

		m.addEventListener("input",function(){

			if(this.files.length) {

				let fileReader = new FileReader();

				fileReader.addEventListener("load",function(){
					self.shapes = JSON.parse(fileReader.result);
				});

				fileReader.readAsText(m.files[0])
			}

			else {
				m.querySelector(".modal-cancel-button").click();
			}

		});

	});

}

MatterTemplateGui.prototype.save = function() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.json";

    a.href = URL.createObjectURL(new Blob([JSON.stringify(self.shapes)],{
        type: "application/json"
    }));

    a.click();

}

MatterTemplateGui.prototype.export = function() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.js";

    a.href = URL.createObjectURL(new Blob([self.generateVertexCode()],{
        type: "application/js"
    }));

    a.click();
}

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

MatterTemplateGui.prototype.render_matter_simulation = function() {



}

MatterTemplateGui.prototype.activateKeyTransform = function() {

	let self = this;
	let delta = 5;

	window.addEventListener("keydown",function(event){

		// Note: the direction of arrow is flipped because the cartesian plane of the computer screen is
		// flipped upside down.

		if(event.key === "ArrowDown") {
			self.incrementDelta(0,delta);
		}

		if(event.key === "ArrowUp") {
			self.incrementDelta(0,-delta);
		}

		if(event.key === "ArrowLeft") {
			self.incrementDelta(-delta,0);
		}

		if(event.key === "ArrowRight") {
			self.incrementDelta(delta,0);
		}

	});

}

MatterTemplateGui.prototype.wireframeRun = function() {

	let interval_id;

	let self = this;

	this.playing = true;

	let toggle = document.createElement("span");
	let reset = document.createElement("span");
	let exit = document.createElement("span");

	toggle.className = "bi bi-pause-fill toggle-button ctrl-button";
	reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
	exit.className = "bi bi-x exit-button ctrl-button";

	let tools = document.createElement("span");
	tools.className = "ctrl-tools";
	tools.append(toggle,reset,exit);
	this.container.appendChild(tools);

	window.s = MatterTemplate.Engine.create(this.shapes);


	toggle.addEventListener("click",function(){

		if(self.playing) {
			toggle.classList.remove("bi-pause-fill");
			toggle.classList.add("bi-play-fill");
		}

		else {
			toggle.classList.remove("bi-play-fill");
			toggle.classList.add("bi-pause-fill");
		}

		self.playing = !self.playing;

	});


	reset.addEventListener("click",function(){
		Matter.Composite.clear(window.s.world,true,true);
		window.s = MatterTemplate.Engine.create(self.shapes);
	});

	exit.addEventListener("click",function(){
		self.playing = false;
		Matter.Composite.clear(window.s.world,true,true);
		window.s = null;
		//self.renderer.renderWorld(self.shapes);
		self.container.removeChild(tools);
	});

}

MatterTemplateGui.prototype.createPolygonRidgidMethod = function() {

	let self = this;

	this.polygonCreator.enable();

	let reset = document.createElement("span");
	let exit = document.createElement("span");

	exit.addEventListener("click",function(){
		self.polygonCreator.disable();
		self.container.removeChild(tools);
	});

	reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
	exit.className = "bi bi-x exit-button ctrl-button";

	let tools = document.createElement("span");
	tools.className = "ctrl-tools";
	tools.append(reset,exit);
	self.container.appendChild(tools);


}

MatterTemplateGui.prototype.incrementDelta = function(x,y) {
	this.renderer.delta.x += x;
	this.renderer.delta.y += y;
	this.polygonCreator.delta.x += x;
	this.polygonCreator.delta.y += y;
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