import MatterTemplateGui from "./matterTemplateGui.js";

MatterTemplateGui.prototype.activateKeyTransform = function() {

	let self = this;
	let delta = 5;

	window.addEventListener("keydown",function(event){

		// Note: the direction of arrow is flipped because the cartesian plane of the computer screen is
		// flipped upside down.

		if(event.key === "ArrowDown") {
			self.incrementDelta(0,delta);
		}

		if(event.key === "ArrowUp") {
			self.incrementDelta(0,-delta);
		}

		if(event.key === "ArrowLeft") {
			self.incrementDelta(-delta,0);
		}

		if(event.key === "ArrowRight") {
			self.incrementDelta(delta,0);
		}

	});

}

MatterTemplateGui.prototype.incrementDelta = function(x,y) {
	this.renderer.delta.x += x;
	this.renderer.delta.y += y;
	this.polygonCreator.delta.x += x;
	this.polygonCreator.delta.y += y;
}
