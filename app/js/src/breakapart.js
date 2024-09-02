export default function breakApart(o) {

    return decomp.decomp(o.vertexSets.map(o => [o.x, o.y])).map(function(o){
        
        return {
            vertexSets: o.map(o => ({x: o[0], y: o[1]}))
        }

    });

}