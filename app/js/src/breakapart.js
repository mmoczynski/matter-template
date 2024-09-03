export function generateConvexSubPolygons(matterVertexSets) {

    decomp.removeDuplicatePoints(matterVertexSets);
    decomp.makeCCW(matterVertexSets);

    return decomp.decomp(matterVertexSets.map(o => [o.x, o.y])).map(function(o){
        return o.map(o => ({x: o[0], y: o[1]}))
    });

}

export function breakApart(o, ) {
    return generateConvexSubPolygons(o.vertexSets);
}