export function transformObject(object, vector) {

    if(object.shape === "vertices") {
        for(var i = 0; i < object.vertexSets.length; i++) {
            object.vertexSets[i].x += vector.x
            object.vertexSets[i].y += vector.y
        }
    }

    // Transform center

    if(typeof object.x === "number" && typeof object.y === "number") {
        object.x += vector.x;
        object.y += vector.y;
    }

    //else {
        //throw "Unsupported object";
    //}


}

export function transformObjectX(object, x) {
    return transformObject(object, {x: x, y: 0});
}

export function transformObjectY(object, y) {
    return transformObject(object, {x: 0, y: y});
}

window.transformObject = transformObject;
window.transformObjectX = transformObjectX;

export function TransformTool(matterTreeGui) {

}