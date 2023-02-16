import PolygonCreator from "./src/polygonCreator.js";
import Renderer from "./src/render.js";
import bootstrapModal from "./src/bsModal.js";
import {alertModal,confirmModal,promptModal} from "./src/alertModal.js";

let canvas = document.createElement("canvas");
window.canvas = canvas;

canvas.id = "mattertree-gui-canvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

function MatterTemplateGuiTab() {

	/**
	 * @type {MatterTemplateGuiTab}
	 */

	this.parent = null;

	let matterTemplateGuiTab = this;

	this.history = [];

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
 
		self.parent.renderer.renderWorld(MatterTemplateGuiTab.currentInstance.shapes);

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
					self.parent.renderer.renderWorld(MatterTemplateGuiTab.currentInstance.shapes);
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

function MatterTemplateGui(container) {

	let matterTemplateGui = this;

	this.currentTab = new MatterTemplateGuiTab();
	this.currentTab.parent = this;
	this.tabs = [this.currentTab];

	let interval_id;

	// Renderer

	matterTemplateGui.renderer = new Renderer(canvas);

	let sim_playing = false;

	function render_matter_simulation() {

		window.s.world.bodies.forEach(function(o){
		
			o.parts.forEach(function(p){
				matterTemplateGui.renderer.renderVertices(p.vertices)
			});

		});

	}

	let polygonCreator = new PolygonCreator(canvas);

	polygonCreator.enable();

	polygonCreator.on("definePolygon",function(event){
		matterTemplateGui.currentTab.shapes.push(JSON.parse(JSON.stringify(event.vertices)));
		matterTemplateGui.renderer.renderWorld(matterTemplateGui.currentTab.shapes);

		if(sim_playing) {
			render_matter_simulation();
		}

	});

	polygonCreator.on("pushVector",function(){

		matterTemplateGui.renderer.ctx.clearRect(0,0,canvas.width,canvas.height);
		matterTemplateGui.renderer.renderWorld(matterTemplateGui.currentTab.shapes);
		matterTemplateGui.renderer.renderVertices(polygonCreator.vertices);

		if(sim_playing) {
			render_matter_simulation();
		}

	});

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

	container.querySelector(".wireframe-run").addEventListener("click",function() {

		sim_playing = true;
	
		let toggle = document.createElement("span");
		let reset = document.createElement("span");
		let exit = document.createElement("span");
	
		toggle.className = "bi bi-pause-fill toggle-button ctrl-button";
		reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
		exit.className = "bi bi-x exit-button ctrl-button";
	
		let tools = document.createElement("span");
		tools.className = "ctrl-tools";
		tools.append(toggle,reset,exit);
		container.appendChild(tools);
	
		window.s = MatterTemplate.Engine.create(matterTemplateGui.currentTab.shapes);
	
	
		toggle.addEventListener("click",function(){
	
			if(sim_playing) {
				toggle.classList.remove("bi-pause-fill");
				toggle.classList.add("bi-play-fill");
			}
	
			else {
				toggle.classList.remove("bi-play-fill");
				toggle.classList.add("bi-pause-fill");
			}
	
			sim_playing = !sim_playing;
	
			render_matter_simulation();
	
		});
	
	
		reset.addEventListener("click",function(){
			Matter.Composite.clear(window.s.world,true,true);
			window.s = MatterTemplate.Engine.create(matterTemplateGui.currentTab.shapes);
		});
	
		exit.addEventListener("click",function(){
			Matter.Composite.clear(window.s.world,true,true);
			clearInterval(interval_id);
			window.s = null;
			matterTemplateGui.renderer.renderWorld(matterTemplateGui.currentTab.shapes);
			container.removeChild(tools);
		});
	
		interval_id = setInterval(function(){
	
			matterTemplateGui.renderer.ctx.clearRect(0,0,canvas.width,canvas.height);
	
			matterTemplateGui.renderer.ctx.strokeStyle = "#555";
	
			matterTemplateGui.renderer.renderWorld(matterTemplateGui.currentTab.shapes);
	
			matterTemplateGui.renderer.ctx.strokeStyle = "white";
	
			if(sim_playing) {
				Matter.Engine.update(window.s);
			}
	
			if(polygonCreator.vertices.length) {
				matterTemplateGui.renderer.renderVertices(polygonCreator.vertices);
			}
	
			render_matter_simulation();
	
		},16.666);
	
	});

}

let matterTemplateGui = new MatterTemplateGui(document.body);
MatterTemplateGuiTab.currentInstance = matterTemplateGui.currentTab;

window.matterTemplateGui = matterTemplateGui;