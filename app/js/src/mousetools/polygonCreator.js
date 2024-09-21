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

		matterTemplateGui.shapes.push({
			vertexSets: JSON.parse(JSON.stringify(polygonDefiner.vertices)),
			shape: "vertices",
			x: c.x,
			y: c.y
		});

		polygonDefiner.vertices = [];
	}

}

PolygonCreator.prototype.enable = function() {
	this.matterTemplateGui.canvas.addEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.matterTemplateGui.canvas.addEventListener(this.secondEventStr, this.definePolygonByMouseEvent);
}

PolygonCreator.prototype.disable = function() {
	this.matterTemplateGui.canvas.removeEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.matterTemplateGui.canvas.removeEventListener(this.secondEventStr, this.definePolygonByMouseEvent);
}

export default PolygonCreator;