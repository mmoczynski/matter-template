/**
 * @param {HTMLCanvasElement} canvas
 */

function Renderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.strokeStyle = "white";

    this.delta = {
        x: 0, 
        y:0
    };

}

/**
 * 
 * @param {Vector[]} renderVertices
 */

Renderer.prototype.renderVertices = function(vertices) {

    this.ctx.beginPath();

    this.ctx.moveTo(vertices[0].x + this.delta.x,vertices[0].y + this.delta.y);

    for(var i = 1; i < vertices.length; i++ ) {
        this.ctx.lineTo(vertices[i].x + this.delta.x ,vertices[i].y + this.delta.y);
    }

    this.ctx.closePath();

    this.ctx.stroke();

}

Renderer.prototype.renderCircle = function(circle) {
    this.ctx.beginPath();
    this.ctx.arc(circle.x,circle.y,circle.radius,0,Math.PI *2);
    this.ctx.stroke();
}

Renderer.prototype.renderWorld = function(worldArray) {

    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    for(let i = 0; i < worldArray.length; i++) {

        if(worldArray[i].shape === "circle") {
            this.renderCircle(worldArray[i]);  
        }

        if(worldArray[i].shape === "vertices") {
            this.renderVertices(worldArray[i].vertexSets);
        }
        

    }
}

export default Renderer;