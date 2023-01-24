import EventStacks from "./eventHandler.js";

/**
 * Used to define rectangles on HTML elements based off HTML elements
 * @param {HTMLElement} element - Element to define rectangles on
 */

 function RectangleDefiner(element) {
	this.element = element;

	let rectangleDefiner = this;

	function step1(event1) {
		rectangleDefiner.callEvent("step1", {
			x: event1.offsetX,
			y: event1.offsetY,
		});

		rectangleDefiner.x = event1.offsetX;
		rectangleDefiner.y = event1.offsetY;

		element.removeEventListener("click", step1);
		element.addEventListener("click", step2);
	}

	function step2(event2) {
		rectangleDefiner.callEvent("step2", {
			x: rectangleDefiner.x,
			y: rectangleDefiner.y,
			w: event2.offsetX - rectangleDefiner.x,
			h: event2.offsetY - rectangleDefiner.y,
		});

		element.removeEventListener("click", step2);
		element.addEventListener("click", step1);
	}

	element.addEventListener("click", step1);

	this.eventArrays = {
		step1: [],
		step2: [],
	};

    Object.assign(this,EventStacks);
}