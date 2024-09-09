export function generateConvexSubPolygons(matterVertexSets) {

    decomp.removeDuplicatePoints(matterVertexSets);
    decomp.makeCCW(matterVertexSets);

    // Array for holding points and eventually decomposed convex polygons
    let polyDecompVectorArrays = [];

    for(let i = 0; i < matterVertexSets.length; i++) {

        polyDecompVectorArrays.push([
            matterVertexSets[i].x,
            matterVertexSets[i].y
        ]);

    }

    /** 
     * Decompose polygon into convex polygons
     * 
     * At this point, the array referred to with the "a" variable now holds the 
     * sub-polygons
     */ 

    decomp.removeDuplicatePoints(polyDecompVectorArrays);
    decomp.makeCCW(polyDecompVectorArrays);

    let polygons = decomp.quickDecomp(polyDecompVectorArrays);

    // Convert back to Matter vector objects from poly-decomp.js vectors.

    for(let i = 0; i < polygons.length; i++) {

        let polygon = polygons[i];

        for(let j = 0; j < polygon.length; j++) {

            let x = polygon[j][0];
            let y = polygon[j][1];

            polygon[j] = {
                x: x,
                y: y
            }

        }

    }

    return polygons;

    //return decomp.quickDecomp(matterVertexSets.map(o => [o.x, o.y])).map(function(o){
    //    return o.map(o => ({x: o[0], y: o[1]}))
    //});

}

export function breakApartPolygon(matterTemplateGui, polygon) {

    let index = matterTemplateGui.shapes.indexOf(polygon);

    // Remove original polygon

    matterTemplateGui.shapes.splice(index, 1);

    // Generate new polygons

    generateConvexSubPolygons(polygon.vertexSets).forEach(function(vertexSets){

        let c = Matter.Vertices.centre(vertexSets)
        
        matterTemplateGui.shapes.push({
            vertexSets: vertexSets,
            shape: "vertices",
            x: c.x,
            y: c.y
        })

    });

}

export function breakApartSelectedPolygons(matterTemplateGui) {

    matterTemplateGui.selectionTool.selectedObjects.forEach(function(o){
        if(o.shape === "vertices") {
            breakApartPolygon(matterTemplateGui, o);
        }
    })

}

window.breakApartPolygon = breakApartPolygon;