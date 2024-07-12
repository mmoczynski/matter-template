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

            else {
                
            }

		}
	});

}

export default SelectionTool;