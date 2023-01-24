/**
 * @param {HTMLCanvasElement} canvas
 */

function Renderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.strokeStyle = "white";
}

/**
 * 
 * @param {Vector[]} renderVertices
 */

Renderer.prototype.renderVertices = function(vertices) {

    this.ctx.beginPath();

    this.ctx.moveTo(vertices[0].x,vertices[0].y);

    for(var i = 1; i < vertices.length; i++ ) {
        this.ctx.lineTo(vertices[i].x,vertices[i].y);
    }

    this.ctx.closePath();

    this.ctx.stroke();

}

Renderer.prototype.renderWorld = function(worldArray) {

    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    for(let i = 0; i < worldArray.length; i++) {
        this.renderVertices(worldArray[i]);   
    }
}

export default Renderer;