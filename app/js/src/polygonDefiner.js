import EventHandler from "./eventHandler.js";

/**
 * Polygon definer
 * @constructor
 * @param {HTMLElement} canvas
 * @mixes EventHandler
 */

 function PolygonDefiner(canvas) {

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

	this.canvas = canvas;

	/**
	 * String defining trigger for HTML Event
	 * @type {String}
	 */

	this.firstEventStr = "click";
	this.secondEventStr = "dblclick";

	this.eventArrays = {
		definePolygon: [],
		pushVector: [],
		disable: [],
		enable: []
	};

	this.addVectorByMouseEvent = function(event) {
		let v = {
			x: event.offsetX,
			y: event.offsetY,
		};

		polygonDefiner.vertices.push(v);

		polygonDefiner.callEvent("pushVector", {
			vector: v,
		});
	}

	this.definePolygonByMouseEvent = function () {
		polygonDefiner.callEvent("definePolygon", {
			vertices: polygonDefiner.vertices,
		});

		polygonDefiner.vertices = [];
	}

    Object.assign(this,EventHandler);
}

PolygonDefiner.prototype.enable = function() {

	this.canvas.addEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.canvas.addEventListener(this.secondEventStr, this.definePolygonByMouseEvent);
	
	this.callEvent("enable", {
		targetElement: this.canvas,
		firstEventStr: this.firstEventStr,
		secondEventStr: this.secondEventStr
	});
}

PolygonDefiner.prototype.disable = function() {
	
	this.canvas.removeEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.canvas.removeEventListener(this.secondEventStr, this.definePolygonByMouseEvent);

	this.callEvent("disable", {
		targetElement: this.canvas,
		firstEventStr: this.firstEventStr,
		secondEventStr: this.secondEventStr
	});

}

export default PolygonDefiner;