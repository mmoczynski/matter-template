import PolygonCreator from "./src/polygonCreator.js";
import Renderer from "./src/render.js";
import bootstrapModal from "./src/bsModal.js";
import {alertModal,confirmModal,promptModal} from "./src/alertModal.js";

function MatterTreeGuiTab() {

	let matterTreeGuiTab = this;

	this.history = [];

	this.shapes = new Proxy([],{

		set: function(target,string,value) {

			matterTreeGuiTab.newChanges = true;
			
			matterTreeGuiTab.history.push({
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

MatterTreeGuiTab.bootstrapModal = bootstrapModal;
MatterTreeGuiTab.alert = alertModal
MatterTreeGuiTab.confirm = confirmModal;
MatterTreeGuiTab.prompt = promptModal;

window.MatterTreeGuiTab = MatterTreeGuiTab;

MatterTreeGuiTab.prototype.new = function() {

	let self = this;

	new Promise(function(resolve){
		
		if(self.newChanges) {
			MatterTreeGuiTab.confirm("Are you sure you want to create a new project?", function(){
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
 
		renderer.renderWorld(MatterTreeGuiTab.currentInstance.shapes);

	}).catch()


}

MatterTreeGuiTab.prototype.open = function() {

	let self = this;

	return new Promise(function(resolve,reject){
		MatterTreeGuiTab.confirm("Are you sure you want to open a file?", resolve, reject);
	}).then(function(){
	
		let m = document.createElement("input");
		m.type = "file";
		m.click();

		m.addEventListener("input",function(){

			if(this.files.length) {

				let fileReader = new FileReader();

				fileReader.addEventListener("load",function(){
					self.shapes = JSON.parse(fileReader.result);
					renderer.renderWorld(MatterTreeGuiTab.currentInstance.shapes);
				});

				fileReader.readAsText(m.files[0])
			}

			else {
				m.querySelector(".modal-cancel-button").click();
			}

		});

	});

}

MatterTreeGuiTab.prototype.save = function() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.json";

    a.href = URL.createObjectURL(new Blob([JSON.stringify(self.shapes)],{
        type: "application/json"
    }));

    a.click();

}

MatterTreeGuiTab.currentInstance = new MatterTreeGuiTab();

function MatterTreeGuiEditor(container) {

}

// Toolbar

document.querySelector(".action-save-file").addEventListener("click",function(){
	MatterTreeGuiTab.currentInstance.save();
});

document.querySelector(".action-open-file").addEventListener("click",function(){
	MatterTreeGuiTab.currentInstance.open()
});

document.querySelector(".action-new-file").addEventListener("click",function(){
	MatterTreeGuiTab.currentInstance.new()
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
	MatterTreeGuiTab.currentInstance.shapes.push(JSON.parse(JSON.stringify(event.vertices)));
	renderer.renderWorld(MatterTreeGuiTab.currentInstance.shapes);
});

polygonCreator.on("pushVector",function(){
	renderer.ctx.clearRect(0,0,canvas.width,canvas.height);
	renderer.renderWorld(MatterTreeGuiTab.currentInstance.shapes);
	renderer.renderVertices(polygonCreator.vertices);
});

// Renderer

let renderer = new Renderer(canvas);

window.polygonCreator = polygonCreator;