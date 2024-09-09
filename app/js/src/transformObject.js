export function transformObject(object, vector) {
    
    // Used for transforming vectors, circles, and any other thing that is defined with a vector

    if( Array.isArray(object.vertexSets) ) {
        transformObject(object.vertexSets, vector);
    }

    // Transform object that is defined by array by transforming elements of array

    else if(Array.isArray(object)) {
        for(var i = 0; i < object.length; i++) {
            transformObject(object[i], vector);
        }
    }

    // Transform center

    if(typeof object.x === "number" && typeof object.y === "number") {
        object.x += vector.x;
        object.y += vector.y;
    }

    // Throw error for unsupported object

    else {
        throw "Unsupported object";
    }


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