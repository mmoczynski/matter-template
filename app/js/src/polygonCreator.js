import EventHandler from "./eventHandler.js";

/**
 * @constructor
 * @param {HTMLElement} canvas
 * 
 */

 function PolygonCreator(canvas) {

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
			x: event.offsetX - self.delta.x,
			y: event.offsetY - self.delta.y,
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

	// this.on("pushVector",function(event){
	// 	alert("Vector: " + JSON.stringify(event));
	// });

	this.on("definePolygon",function(event){
		
	});

}

PolygonCreator.prototype.enable = function() {

	this.canvas.addEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.canvas.addEventListener(this.secondEventStr, this.definePolygonByMouseEvent);
	
	this.callEvent("enable", {
		targetElement: this.canvas,
		firstEventStr: this.firstEventStr,
		secondEventStr: this.secondEventStr
	});
}

PolygonCreator.prototype.disable = function() {
	
	this.canvas.removeEventListener(this.firstEventStr, this.addVectorByMouseEvent);
	this.canvas.removeEventListener(this.secondEventStr, this.definePolygonByMouseEvent);

	this.callEvent("disable", {
		targetElement: this.canvas,
		firstEventStr: this.firstEventStr,
		secondEventStr: this.secondEventStr
	});

}

export default PolygonCreator;