/**
 * 
 * @param {MatterTemplateGuiTab} matterTreeGuiTab 
 */



function SelectionTool(matterTreeGuiTab) {

    var self = this;

    this.matterTreeGuiTab = matterTreeGuiTab;
    this.selectedObjects = [];

    matterTreeGuiTab.renderer.canvas.addEventListener("click", function(event){

		for(var i = 0; i < matterTreeGuiTab.shapes.length; i++) {

			let o = matterTreeGuiTab.shapes[i];

			if(o.shape === "circle") {

				let r = Math.sqrt(
					Math.pow((o.x - event.x), 2) + Math.pow((o.y - event.y), 2)
				)

				if (r <= o.radius) {

					alert(o);

					if(event.shiftKey === true) {
						self.selectedObjects.push(o);
					}

					else {
						self.selectedObjects = [o];
					}

				}

			}

			/**
			 * 
			 * To understand code more, look at the documentation for poly-decomp.js
			 * Documentation for poly-decomp: https://github.com/schteppe/poly-decomp.js/
			 */

            else if(o.shape === "vertices") {

				// Array for holding points and eventually decomposed convex polygons
				let a = [];

				// Conditonal to tell script if
				let cond = false;

				// Convert matter vectors to poly-decomp.js vectors

				for(let i = 0; i < o.vertexSets.length; i++) {

					a.push([
						o.vertexSets[i].x,
						o.vertexSets[i].y
					]);

				}

				/** 
				 * Decompose polygon into convex polygons
				 * 
				 * At this point, the array referred to with the "a" variable now holds the 
				 * sub-polygons
				 */ 

				decomp.removeDuplicatePoints(a);
				decomp.makeCCW(a);
				a = decomp.quickDecomp(a);

				// Convert back to Matter vector objects from poly-decomp.js vectors.

				for(let i = 0; i < a.length; i++) {

					let polygon = a[i];

					for(let j = 0; j < polygon.length; j++) {

						let x = polygon[j][0];
						let y = polygon[j][1];

						polygon[j] = {
							x: x,
							y: y
						}

					}

				}

				// See if point is inside one of the constituient convex polygons

				for(let i = 0; i < a.length; i++) {
					if(Matter.Vertices.contains(a[i], { x: event.x, y: event.y} )) {
						cond = true;
					}
				}

				if(cond) {

					alert(o);

					if(event.shiftKey === true) {
						self.selectedObjects.push(o);
					}

					else {
						self.selectedObjects = [o];
					}

				};

            }

		}
	});

}

export default SelectionTool;