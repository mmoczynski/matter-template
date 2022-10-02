import PolygonCreator from "./src/polygonCreator.js";
import Renderer from "./src/render.js";
import bootstrapModal from "./src/bsModal.js";
import {alertModal,confirmModal,promptModal} from "./src/alertModal.js";

function MatterTreeGui() {

	let matterTreeGui = this;

	this.history = [];

	this.shapes = new Proxy([],{

		set: function(target,string,value) {

			matterTreeGui.newChanges = true;
			
			matterTreeGui.history.push({
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

MatterTreeGui.bootstrapModal = bootstrapModal;
MatterTreeGui.alert = alertModal
MatterTreeGui.confirm = confirmModal;
MatterTreeGui.prompt = promptModal;

window.MatterTreeGui = MatterTreeGui;

MatterTreeGui.prototype.new = function() {

	let self = this;

	new Promise(function(resolve,reject){
		
		if(self.newChanges) {
			MatterTreeGui.confirm( "Are you sure you want to create a new project?",resolve,function(){
				reject(1);
			})
		
		}

		else {
			resolve()
		}

	}).then(function(){

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

		renderer.renderWorld(MatterTreeGui.currentInstance.shapes);

	}).catch(function(v){
		console.log(v);
	})


}

MatterTreeGui.prototype.open = function() {

	let self = this;

	return new Promise(function(resolve,reject){
		MatterTreeGui.confirm("Are you sure you want to open a file?", resolve, reject);
	}).then(function(){
	
		let m = document.createElement("input");
		m.type = "file";
		m.click();

		m.addEventListener("input",function(){

			if(this.files.length) {

				let fileReader = new FileReader();

				fileReader.addEventListener("load",function(){
					self.shapes = JSON.parse(fileReader.result);
					renderer.renderWorld(MatterTreeGui.currentInstance.shapes);
				});

				fileReader.readAsText(m.files[0])
			}

			else {
				m.querySelector(".modal-cancel-button").click();
			}

		});

	});

}

MatterTreeGui.prototype.save = function() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.json";

    a.href = URL.createObjectURL(new Blob([JSON.stringify(self.shapes)],{
        type: "application/json"
    }));

    a.click();

}

MatterTreeGui.currentInstance = new MatterTreeGui();

// Toolbar

document.querySelector(".action-save-file").addEventListener("click",function(){
	MatterTreeGui.currentInstance.save();
});

document.querySelector(".action-open-file").addEventListener("click",function(){
	MatterTreeGui.currentInstance.open()
});

let canvas = document.createElement("canvas");
window.canvas = canvas;

canvas.id = "mattertree-gui-canvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Polygon Creator

let polygonCreator = new PolygonCreator(canvas);
polygonCreator.enable();

polygonCreator.on("definePolygon",function(event){
	MatterTreeGui.currentInstance.shapes.push(JSON.parse(JSON.stringify(event.vertices)));
	renderer.renderWorld(MatterTreeGui.currentInstance.shapes);
});

polygonCreator.on("pushVector",function(){
	renderer.ctx.clearRect(0,0,canvas.width,canvas.height);
	renderer.renderWorld(MatterTreeGui.currentInstance.shapes);
	renderer.renderVertices(polygonCreator.vertices);
});

// Renderer

let renderer = new Renderer(canvas);

window.polygonCreator = polygonCreator;