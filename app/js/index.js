import PolygonCreator from "./src/polygonCreator.js";
import Renderer from "./src/render.js";
import bootstrapModal from "./src/bsModal.js";
import {alertModal,confirmModal,promptModal} from "./src/alertModal.js";
import MatterTemplateGuiTool from "./src/matterTemplateGuiTool.js";

let canvas = document.createElement("canvas");
window.canvas = canvas;

canvas.id = "mattertree-gui-canvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

function MatterTemplateGuiTab() {

	/**
	 * @type {MatterTemplateGui}
	 */

	this.parent = null;

	let matterTemplateGuiTab = this;

	this.history = [];

	// Renderer

	this.renderer = new Renderer(canvas);

	this.shapes = new Proxy([],{

		set: function(target,string,value) {

			matterTemplateGuiTab.newChanges = true;
			
			matterTemplateGuiTab.history.push({
				target: target,
				property: string,
				newValue: value,
				oldValue: target[string]
			});
	
			return target[string] = value;
		}
	
	});
	
	this.newChanges = false;

	let polygonCreator = new PolygonCreator(canvas);

	this.polygonCreator = polygonCreator;

	polygonCreator.on("definePolygon",function(event){
		matterTemplateGuiTab.shapes.push(JSON.parse(JSON.stringify(event.vertices)));
		matterTemplateGuiTab.renderer.renderWorld(matterTemplateGuiTab.shapes);

		if(matterTemplateGuiTab.playing) {
			matterTemplateGuiTab.render_matter_simulation();
		}

	});

	polygonCreator.on("pushVector",function(){

		matterTemplateGuiTab.renderer.ctx.clearRect(0,0,canvas.width,canvas.height);
		matterTemplateGuiTab.renderer.renderWorld(matterTemplateGuiTab.shapes);
		matterTemplateGuiTab.renderer.renderVertices(polygonCreator.vertices);

		if(matterTemplateGuiTab.playing) {
			matterTemplateGuiTab.render_matter_simulation();
		}

	});

}

MatterTemplateGuiTab.bootstrapModal = bootstrapModal;
MatterTemplateGuiTab.alert = alertModal
MatterTemplateGuiTab.confirm = confirmModal;
MatterTemplateGuiTab.prompt = promptModal;

window.MatterTemplateGuiTab = MatterTemplateGuiTab;

MatterTemplateGuiTab.prototype.new = function() {

	let self = this;

	new Promise(function(resolve){
		
		if(self.newChanges) {
			MatterTemplateGuiTab.confirm("Are you sure you want to create a new project?", function(){
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
 
		self.renderer.renderWorld(MatterTemplateGuiTab.currentInstance.shapes);

	}).catch()


}

MatterTemplateGuiTab.prototype.open = function() {

	let self = this;

	return new Promise(function(resolve,reject){
		MatterTemplateGuiTab.confirm("Are you sure you want to open a file?", resolve, reject);
	}).then(function(){
	
		let m = document.createElement("input");
		m.type = "file";
		m.click();

		m.addEventListener("input",function(){

			if(this.files.length) {

				let fileReader = new FileReader();

				fileReader.addEventListener("load",function(){
					self.shapes = JSON.parse(fileReader.result);
					self.renderer.renderWorld(MatterTemplateGuiTab.currentInstance.shapes);
				});

				fileReader.readAsText(m.files[0])
			}

			else {
				m.querySelector(".modal-cancel-button").click();
			}

		});

	});

}

MatterTemplateGuiTab.prototype.save = function() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.json";

    a.href = URL.createObjectURL(new Blob([JSON.stringify(self.shapes)],{
        type: "application/json"
    }));

    a.click();

}

MatterTemplateGuiTab.prototype.export = function() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.js";

    a.href = URL.createObjectURL(new Blob([self.generateVertexCode()],{
        type: "application/js"
    }));

    a.click();
}

MatterTemplateGuiTab.prototype.generateVertexCode = function() {

	let txt = "let composite = Matter.composite.create();\n\n";
	
	txt = txt + "let shapes = [];\n\n";

	for(var i = 0; i < this.shapes.length; i++) {
		let c = Matter.Vertices.centre(this.shapes[i]);
		txt = txt + `shapes[${i}] = Matter.Bodies.fromVertices(${c.x},${c.y},${JSON.stringify(this.shapes[i])});` + "\n\n";
		txt = txt + `Matter.composite.add(composite,shapes[${i}]);\n\n`;
	}
	

	return txt;
}

MatterTemplateGuiTab.prototype.render_matter_simulation = function() {

	window.s.world.bodies.forEach(function(o){
	
		o.parts.forEach(function(p){
			matterTemplateGui.currentTab.renderer.renderVertices(p.vertices)
		});

	});

}

MatterTemplateGuiTab.prototype.wireframeRun = function() {

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
	this.parent.container.appendChild(tools);

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

		self.render_matter_simulation();

	});


	reset.addEventListener("click",function(){
		Matter.Composite.clear(window.s.world,true,true);
		window.s = MatterTemplate.Engine.create(self.shapes);
	});

	exit.addEventListener("click",function(){
		self.playing = false;
		Matter.Composite.clear(window.s.world,true,true);
		clearInterval(interval_id);
		window.s = null;
		self.renderer.renderWorld(self.shapes);
		self.parent.container.removeChild(tools);
	});

	interval_id = setInterval(function(){

		self.renderer.ctx.clearRect(0,0,canvas.width,canvas.height);

		self.renderer.ctx.strokeStyle = "#555";

		self.renderer.renderWorld(self.shapes);

		self.renderer.ctx.strokeStyle = "white";

		if(self.playing) {
			Matter.Engine.update(window.s);
		}

		if(self.polygonCreator.vertices.length) {
			self.renderer.renderVertices(self.polygonCreator.vertices);
		}

		self.render_matter_simulation();

	},16.666);

}

MatterTemplateGuiTab.prototype.createPolygonRidgidMethod = function() {

	let self = this;

	this.polygonCreator.enable();

	let reset = document.createElement("span");
	let exit = document.createElement("span");

	exit.addEventListener("click",function(){
		self.polygonCreator.disable();
		self.parent.container.removeChild(tools);
	});

	reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
	exit.className = "bi bi-x exit-button ctrl-button";

	let tools = document.createElement("span");
	tools.className = "ctrl-tools";
	tools.append(reset,exit);
	self.parent.container.appendChild(tools);


}

function MatterTemplateGui(container) {

	this.container = container;

	let matterTemplateGui = this;

	this.currentTab = new MatterTemplateGuiTab();
	this.currentTab.parent = this;
	this.tabs = [this.currentTab];

	// Toolbar

	container.querySelector(".action-save-file").addEventListener("click",function(){
		matterTemplateGui.currentTab.save();
	});

	container.querySelector(".action-open-file").addEventListener("click",function(){
		matterTemplateGui.currentTab.open()
	});

	container.querySelector(".action-new-file").addEventListener("click",function(){
		matterTemplateGui.currentTab.new()
	});

	container.querySelector(".action-export").addEventListener("click",function(){
		matterTemplateGui.currentTab.export()
	});

	container.querySelector(".wireframe-run").addEventListener("click",function(){
		matterTemplateGui.currentTab.wireframeRun();
	});

	container.querySelector(".rigid-polygon-creation").addEventListener("click",function(){
		matterTemplateGui.currentTab.createPolygonRidgidMethod();
	});

}

let matterTemplateGui = new MatterTemplateGui(document.body);
MatterTemplateGuiTab.currentInstance = matterTemplateGui.currentTab;

window.matterTemplateGui = matterTemplateGui;