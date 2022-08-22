const Matter = (function() {

    if(typeof window === "object") {
        return window.Matter;
    }

    if(typeof require === "function") {
        return require("matter-js");
    }

})();


const MatterTemplate = {

    /**
     * Functions to construct a Matter body given some template
     * 
     */

	Bodies: {

        /**
         * @typedef CircleTemplate
         * @property {Number} x - x-coordinate
         * @property {Number} y - y-coordinate
         * @property {Number} radius - Radius of circle
         * @property {"circle"} shape 
         * @property {object} [options] - Matter.js Options
         */

        /**
         * 
         * @typedef RectangleTemplate
         * @property {Number} x - x-coordinate
         * @property {Number} y - y-coordinate
         * @property {"rectangle"} shape 
         */

        /**
         * @typedef PolygonTemplate
         * @property {Number} x 
         * @property {Number} y
         * @property {Number} sides
         * @property {Number} radius
         * @property {"polygon"} shape
         * @property {object} [options] - Matter.js Options
         */

        /**
         * 
         * @typedef VerticesTemplate
         * @property {Number} x
		 * @property {Number} y
		 * @property {Vector[]} vertexSets
         * @property {"vertices"} shape
		 * @property {object} [options]
		 * @property {Boolean} [flagInternal]
		 * @property {Boolean} [removeCollinear]
		 * @property {Number} [minimumArea]
		 * @property {Boolean} [removeDuplicatePoints]
         */

        /**
         * 
         * @typedef {CircleTemplate|RectangleTemplate|
         * PolygonTemplate|VerticesTemplate} BodyTemplate
         * 
         * 
         */

        /**
         * 
         * @param {BodyTemplate} bodyTemplate 
         * @returns {object} - Matter.JS Body
         */
		
		create: function(bodyTemplate) {

            // Set body template

            let options = bodyTemplate.options || { 
                plugin: {
                    matterTemplate: {}
                } 
            }

            options.plugin.matterTemplate = {
                template: bodyTemplate
            };



			if(bodyTemplate.shape === "circle") {

				return Matter.Bodies.circle(
					bodyTemplate.x,
					bodyTemplate.y,
					bodyTemplate.radius,
					options
				);

			}

			if(bodyTemplate.shape === "rectangle") {

				return Matter.Bodies.rectangle(
					bodyTemplate.x,
					bodyTemplate.y,
					bodyTemplate.width,
					bodyTemplate.height,
					options
				);

			}

			if(bodyTemplate.shape === "polygon") {
				return Matter.Bodies.polygon(
					bodyTemplate.x,
					bodyTemplate.y,
					bodyTemplate.sides,
					bodyTemplate.radius,
					options
				);
			}

			if(bodyTemplate.shape === "vertices") {

				return Matter.Bodies.fromVertices(
					bodyTemplate.x,
					bodyTemplate.y,
					bodyTemplate.vertexSets,
					options,
					bodyTemplate.flagInternal,
					bodyTemplate.removeCollinear,
					bodyTemplate.minimumArea,
					bodyTemplate.removeDuplicatePoints
				);

			}
		}

	},

    /**
     * Functions to create a Matter.js composite given some templates
     */

	Composite: {

        /**
         * 
         * @typedef CompositeTemplate
         * @property {BodyTemplate[]} bodies - Body templates for member bodies
         * @property {CompositeTemplate[]} composites - Composite templates for subcomposites
         * @property {Object} options - MatterJS options
         */

        /**
         * @function
         * @param {CompositeTemplate|BodyTemplate[]} compositeTemplate 
         * @returns {object} - Matter.JS composite
         */

		create: function(compositeTemplate) {

			if(Array.isArray(compositeTemplate)) {

				return MatterTemplate.Composite.create({
					bodies: compositeTemplate
				});

			}

			let o = Matter.Composite.create(compositeTemplate.options);

            if(Array.isArray(compositeTemplate.bodies)) {

                for(var i = 0; i < compositeTemplate.bodies.length; i++) {
                    let bodyTemplate = compositeTemplate.bodies[i];
                    let body = MatterTemplate.Bodies.create(bodyTemplate);
                    Matter.Composite.add(o,body);
                }

            }

            if(Array.isArray(compositeTemplate.composites)) {

                for(var i = 0; i < compositeTemplate.composites.length; i++) {
                    Matter.Composite.add(o,MatterTemplate.Composite.create(
                        compositeTemplate.composites[i]
                    ));
                }

            }
            
			return o;
		},

		bodyTemplateArray: function(a) {
			for(var i = 0; i < a.length; i++) {

			}
		}
	},

    /**
     * 
     */

	Engine: {

        /**
         * 
         * @typedef EngineTemplate
         * @property {CompositeTemplate} world - Template for engine world
         * @property {object} options - Matter.JS options for engines
         */

        /**
         * 
         * @param {EngineTemplate} engineTemplate 
         */

		create: function(engineTemplate) {
			let o = Matter.Engine.create(engineTemplate.options);
            o.world = MatterTemplate.Composite.create(engineTemplate.world);
            return o;
		},

        fullSimulation: function(engineTemplate) {
            MatterTemplate.createFullMatterSimulation()
        }

	},

    /**
     * 
     */

    Simulations: {

        
        /**
         * 
         * @typedef EngineRunnerPairTemplate 
         * @property {EngineTemplate} engine - Engine template for Matter.js
         * @property {Object} runner - Runner options for Matter.js
         */

        /**
         * 
         * @constructor
         * @param {EngineRunnerPairTemplate} template
         */

        EngineRunnerPair: function(template) {

            let engine = MatterTemplate.Engine.create(template.engine);
            let runner = Matter.Runner.create(template.runner);

            this.engine = engine;
            this.runner = runner;
            
            this.run = Matter.Runner.run.bind(Matter.Runner,engine);
            this.stop = Matter.Runner.stop.bind(Matter.Runner,runner);

            this.pause = function() {

            }

        },

        /**
         * @constructor
         * @extends MatterTemplate.Simulations.EngineRunnerPair
         * @param {*} template 
         */

        EngineRunnerRenderTriple: function(template) {
            MatterTemplate.Simulations.EngineRunnerPair.call(this,template.engine,template.runner);
            this.render = Matter.Render.create(template.render);
        },

        /**
         * @function
         * @param {BodyTemplate[]} a - Array of body templates
         * @return 
         */

        fromBodyTemplates: function(a) {

        }

    },


    /**
	 * 
	 * @param {SimulationTemplate} template 
	 */

	createFullMatterSimulation: function(template) {


        let render = Matter.Render.create({
            engine: engine,
            ...template.render
        })


        return {
            engine: engine,
            render: render,
            runner: runner
        };

	},

};

if(typeof module === "object") {
    module.exports = MatterTemplate;
}

if(typeof window === "object") {
    window.MatterTemplate = MatterTemplate;
}