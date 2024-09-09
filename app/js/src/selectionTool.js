/**
 * 
 * @param {MatterTemplateGuiTab} matterTreeGuiTab 
 */

import { breakApartPolygon, generateConvexSubPolygons } from "./breakapart.js";



function SelectionTool(matterTreeGuiTab) {

    var self = this;

    this.matterTreeGuiTab = matterTreeGuiTab;
    this.selectedObjects = [];

    matterTreeGuiTab.renderer.canvas.addEventListener("click", function(event){

		if(!event.shiftKey === true) self.selectedObjects = [];

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

				let a = generateConvexSubPolygons(o.vertexSets);
				let cond = false;

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