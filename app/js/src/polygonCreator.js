import PolygonDefiner from "./polygonDefiner.js";

/**
 * @constructor
 * @param {HTMLElement} canvas
 * @extends PolygonDefiner
 * 
 */

 function PolygonCreator(canvas) {

	PolygonDefiner.apply(this,arguments);

	// this.on("pushVector",function(event){
	// 	alert("Vector: " + JSON.stringify(event));
	// });

	this.on("definePolygon",function(event){
		
	});

}

Object.assign(PolygonCreator.prototype,PolygonDefiner.prototype);

export default PolygonCreator;