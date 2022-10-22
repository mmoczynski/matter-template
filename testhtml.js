if(typeof require === "string") {
    const MatterTemplate = require(".");
}

window.f = new MatterTemplate.Simulations.EngineRunnerRenderTriple({
    engine: {
        world: {

            bodies: [

                {
                    shape: "circle",
                    x: 300,
                    y: 300,
                    radius: 100
                }

            ]
        }
    }
});

window.f2 = MatterTemplate.Bodies.create("56,57, 100,200 343,120 423,401");

// creates a composite with irregular polygons defined by svg paths

window.f3 = MatterTemplate.Composite.create([
    "34,53 12,34 20,12 32,12",
    "23,34 45,34 34,20 34,23 120,123",
    "13,12 12,24, 43,12",
]);
