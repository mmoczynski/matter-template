/**
 * 
 * @param {MatterTemplateGuiTab} matterTemplateGuiTab 
 */

function CircleCreator(matterTemplateGuiTab) {

    let self = this;

    this.matterTemplateGuiTab = matterTemplateGuiTab;
    this.shapeName = "circle";

    matterTemplateGuiTab.parent.container.querySelector(".activate-circle-creation").addEventListener("click",function(){
        self.enable();
    });

}

CircleCreator.prototype.getRadius = function() {
    return Math.sqrt(Math.pow(this.center.x - this.secondPoint.x,2) + Math.pow(this.center.y - this.secondPoint.y,2))
}

CircleCreator.prototype.enable = function() {

    let self = this;

    let reset = document.createElement("span");
	let exit = document.createElement("span");

	exit.addEventListener("click",function(){
		self.disable();
		self.matterTemplateGuiTab.parent.container.removeChild(tools);
	});

	reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
	exit.className = "bi bi-x exit-button ctrl-button";

	let tools = document.createElement("span");
	tools.className = "ctrl-tools";
	tools.append(reset,exit);
	this.matterTemplateGuiTab.parent.container.appendChild(tools);

    /**
     * 
     * @param {MouseEvent} event 
     */

    this.onclick = function(event) {

        if(!self.center && !self.secondPoint) {
            
            /**
             * Used to define the center point of the circle.
             * @type {undefined|Object}
             */
    
            self.center = {
                x: event.x,
                y: event.y
            }
    
        }
    
        else if(self.center && !self.secondPoint) {
    
            /**
             * Used to define the other end point of the radius that is used to create the circle
             * @type {undefined|Object}
             */
    
            self.secondPoint = {
                x: event.x,
                y: event.y
            }
        }
    
        else if(self.center && self.secondPoint) {
    
            self.matterTemplateGuiTab.shapes.push({
                x: self.center.x,
                y: self.center.y,
                radius: self.getRadius(),
                shape: "circle"
            })
    
            self.center = undefined;
            self.secondPoint = undefined;
        }
    
        else if(!self.center && self.secondPoint) {
            throw "The center is undefined and the second point is defined. This is not supposed to happen.";
        }
    
    }

    this.onmousemove = function(event) {

        //self.matterTemplateGuiTab.renderer.renderWorld(self.matterTemplateGuiTab.shapes);

        if(self.center) {

            self.secondPoint = {
                x: event.x,
                y: event.y
            }

            //self.matterTemplateGuiTab.renderer.ctx.beginPath();
            //self.matterTemplateGuiTab.renderer.ctx.arc(self.center.x,self.center.y,self.getRadius(),0,Math.PI *2);
            //self.matterTemplateGuiTab.renderer.ctx.stroke();
        }

    }

    this.matterTemplateGuiTab.renderer.canvas.addEventListener("click",this.onclick);
    this.matterTemplateGuiTab.renderer.canvas.addEventListener("mousemove",this.onmousemove);
}

CircleCreator.prototype.disable = function() {
    this.matterTemplateGuiTab.renderer.canvas.removeEventListener("click",this.onclick);
    this.matterTemplateGuiTab.renderer.canvas.removeEventListener("mousemove",this.onmousemove);
    self.center = undefined;
    self.secondPoint = undefined;
}

export default CircleCreator;