import PolygonCreator from "./mousetools/polygonCreator.js";
import Renderer from "./render.js";
import MatterTemplateGuiTool from "./matterTemplateGuiTool.js";
import CircleCreator from "./mousetools/circleCreator.js";
import SelectionTool from "./selectionTool.js";
import { breakApartPolygon, breakApartSelectedPolygons } from "./breakapart.js";
import ContextMenu from "./gui/contextMenu.js";
import ObjectRemover from "./deleteObject.js";
import WireframeRun from "./wireframeRun.js";

import save from "./file/save.js";
import open from "./file/open.js";
import newFile from "./file/new.js";
import exportFile from "./file/export.js";
import ObjectEditorHandler from "./gui/objectEditor.js";
import VertexSetsUnionTool from "./vertexSetsUnion.js";
import StaticObjectSetter from "./gui/staticObjectSetter.js";


export default function MatterTemplateGui(container) {

	this.container = container;
	let matterTemplateGui = this;
	this.objectRemover = new ObjectRemover(this);
	this.contextMenu = new ContextMenu(this);
	this.wireframeRun = new WireframeRun(this);
	this.objectEditorHandler = new ObjectEditorHandler(this);
	this.vertexSetsUnion = new VertexSetsUnionTool(this);
	this.staticObjectSetter = new StaticObjectSetter(this);

	// Toolbar

	container.querySelector(".action-save-file").addEventListener("click",function(){
		matterTemplateGui.save();
	});

	container.querySelector(".action-open-file").addEventListener("click",function(){
		matterTemplateGui.open()
	});

	container.querySelector(".action-new-file").addEventListener("click",function(){
		matterTemplateGui.newFile()
	});

	container.querySelector(".action-export").addEventListener("click",function(){
		matterTemplateGui.exportFile()
	});

	container.querySelector(".rigid-polygon-creation").addEventListener("click",function(){
		matterTemplateGui.polygonCreator.enable();
	});

	container.querySelector(".break-apart-poly").addEventListener("click", function() {
		breakApartSelectedPolygons(matterTemplateGui);
	})

	// Alternative variable name for this keyword
	var self = this;

	this.history = [];
	this.canvas = container.querySelector("#mattertree-gui-canvas");

	// Renderer
	this.renderer = new Renderer(this.canvas);

	// Selection Tool
	this.selectionTool = new SelectionTool(this);

	this.shapes = [];
	
	this.newChanges = false;

	// Polygon Creator
	this.polygonCreator = new PolygonCreator(this);

	// Circle Creator
	this.circleCreator = new CircleCreator(this);

	// Application loop
	setInterval(function(){

		// Objects loop

		matterTemplateGui.renderer.renderWorld(matterTemplateGui.shapes);

		// Render vertices of polygon creator if active

		if(self.polygonCreator.vertices.length) {
			self.renderer.renderVertices(self.polygonCreator.vertices);
		}

		// Render circle of circle creator if active

		if(self.circleCreator.center) {
			
			self.renderer.ctx.beginPath();

			/**
			 * Render circle arc
			 * See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
			 */

    		self.renderer.ctx.arc(
				self.circleCreator.center.x, 
				self.circleCreator.center.y, 
				self.circleCreator.getRadius(),
				0,
				Math.PI *2
			);
        	
			self.renderer.ctx.stroke();
		}

		// Render selection

		if(self.selectionTool.selectedObjects.length) {

			for(var i = 0; i < self.selectionTool.selectedObjects.length; i++) {

				if(self.selectionTool.selectedObjects[i].shape === "circle") {

					self.renderer.ctx.beginPath();

					self.renderer.ctx.arc(
						self.selectionTool.selectedObjects[i].x, 
						self.selectionTool.selectedObjects[i].y, 
						3,
						0,
						Math.PI *2
					);
		
					
					self.renderer.ctx.fillStyle = "white";
					self.renderer.ctx.fill();
					
					self.renderer.ctx.stroke();

				}

				if(self.selectionTool.selectedObjects[i].shape === "vertices") {

					for(let j = 0; j < self.selectionTool.selectedObjects[i].vertexSets.length; j++) {

						self.renderer.ctx.beginPath();

						self.renderer.ctx.arc(
							self.selectionTool.selectedObjects[i].vertexSets[j].x, 
							self.selectionTool.selectedObjects[i].vertexSets[j].y, 
							3,
							0,
							Math.PI *2
						);
			
						
						self.renderer.ctx.fillStyle = "white";
						self.renderer.ctx.fill();
						
						self.renderer.ctx.stroke();

					}

				}

			}

		}

		// If playing

		if(self.playing) {

			Matter.Engine.update(self.simulation);

			self.simulation.world.bodies.forEach(function(o){
	
				o.parts.forEach(function(p){
					self.renderer.renderVertices(p.vertices)
				});
		
			});

		}

	},16.666);

}

MatterTemplateGui.prototype.save = save;
MatterTemplateGui.prototype.open = open;
MatterTemplateGui.prototype.newFile = newFile;
MatterTemplateGui.prototype.exportFile = exportFile;