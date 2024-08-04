const MatterTemplate = require("../index");

console.dir(MatterTemplate.Bodies.create({
	shape: "circle",
	x: 100,
	y: 300,
	radius: 200
}));

console.dir(MatterTemplate.Composite.create({
	bodies: [

		{
			shape: "circle",
			x: 100,
			y: 300,
			radius: 200
		},

		{
			shape: "circle",
			x: 400,
			y: 600,
			radius: 200
		}
	]
}));

console.dir(MatterTemplate.Engine.create({

	world: {

		bodies: [
			{
				shape: "circle",
				x: 120,
				y: 203,
				radius: 180
			},

			{
				shape: "circle",
				x: 123,
				y: 120,
				radius: 190
			}
		]
	}

}));


console.dir(MatterTemplate.Engine.create({

	world: {

		bodies: [
			{
				shape: "circle",
				x: 120,
				y: 203,
				radius: 180
			},

			{
				shape: "circle",
				x: 123,
				y: 120,
				radius: 190
			}
		]
	}
	
}));