export function transformObject(object, vector) {
    
    // Used for transforming vectors, circles, and any other thing that is defined with a vector

    if(typeof object.x === "number" && typeof object.y === "number") {
        object.x += vector.x;
        object.y += vector.y;
    }

    // Transform object that is defined by array by transforming elements of array

    else if(Array.isArray(object)) {
        for(var i = 0; i < object.length; i++) {
            transformObject(object, vector);
        }
    }

    else if( Array.isArray(object.vertexSets) ) {
        transformObject(object.vertexSets, vector);
    }

    // Throw error for unsupported object

    else {
        throw "Unsupported object";
    }


}

