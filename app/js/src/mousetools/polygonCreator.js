/**
 * @constructor
 * @param {MatterTemplateGui} matterTemplateGui
 * 
 */

 function PolygonCreator(matterTemplateGui) {

	let self = this;

	this.delta = {
		x: 0,
		y: 0
	}

	let polygonDefiner = this;

	/**
	 * Vertices 
	 * @type {Vector[]}
	 */

	this.vertices = [];

	/**
	 * Target element
	 * @type {HTMLElement}
	 */

	this.matterTemplateGui = matterTemplateGui;

	/**
	 * String defining trigger for HTML Event
	 * @type {String}
	 */

	this.firstEventStr = "click";
	this.secondEventStr = "dblclick";

	this.addVectorByMouseEvent = function(event) {
		let v = {
			x: event.offsetX - self.delta.x,
			y: event.offsetY - self.delta.y,
		};

		polygonDefiner.vertices.push(v);

	}

	this.definePolygonByMouseEvent = function() {

		let c = Matter.Vertices.centre(polygonDefiner.vertices);

		// Used to remove duplicate points

		for(let i = 0; i < polygonDefiner.vertices.length; i++) {
			for(let j = 0; j < polygonDefiner.vertices.length; j++) {

				let sameX = (polygonDefiner.vertices[i].x === polygonDefiner.vertices[j].x) 
				let sameY = (polygonDefiner.vertices[i].y === polygonDefiner.vertices[j].y) 

				if(i !== j && sameX && sameY) {
					polygonDefiner.vertices.splice(j, 1);
				}
			}
		}

		matterTemplateGui.shapes.push({

			vertexSets: JSON.parse(JSON.stringify(polygonDefiner.vertices)),
			shape: "vertices",
			x: c.x,
			y: c.y,

			plugin: {
				matterTemplate: {}
			}

		});

		polygonDefiner.vertices = [];
	}

}

PolygonCreator.prototype.enable = function() {

	let self = this;

	let reset = document.createElement("span");
	let exit = document.createElement("span");

	exit.addEventListener("click",function(){
		self.matterTemplateGui.polygonCreator.disable();
		self.matterTemplateGui.container.removeChild(tools);
	});

	reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
	exit.className = "bi bi-x exit-button ctrl-button";

	let tools = document.createElement("span");
	tools.className = "ctrl-tools";
	tools.append(reset,exit);
	this.matterTemplateGui.container.appendChild(tools);

	this.matterTemplateGui.canvas.addEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.matterTemplateGui.canvas.addEventListener(this.secondEventStr, this.definePolygonByMouseEvent);
}

PolygonCreator.prototype.disable = function() {
	this.matterTemplateGui.canvas.removeEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.matterTemplateGui.canvas.removeEventListener(this.secondEventStr, this.definePolygonByMouseEvent);
}

export default PolygonCreator;