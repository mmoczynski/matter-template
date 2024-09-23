export default function WireframeRun(matterTemplateGui) {

    let self = this;

    this.matterTemplateGui = matterTemplateGui;

    matterTemplateGui.container.querySelector(".wireframe-run").addEventListener("click",function(){
		self.run();
	});
}

WireframeRun.prototype.run = function() {

	let interval_id;

	var matterTemplateGui = this.matterTemplateGui;

	matterTemplateGui.playing = true;

	let toggle = document.createElement("span");
	let reset = document.createElement("span");
	let exit = document.createElement("span");

	toggle.className = "bi bi-pause-fill toggle-button ctrl-button";
	reset.className = "bi bi-arrow-clockwise reset-button ctrl-button";
	exit.className = "bi bi-x exit-button ctrl-button";

	let tools = document.createElement("span");
	tools.className = "ctrl-tools";
	tools.append(toggle,reset,exit);
	matterTemplateGui.container.appendChild(tools);

    matterTemplateGui.simulation = MatterTemplate.Engine.create(matterTemplateGui.shapes)


	toggle.addEventListener("click",function(){

		if(matterTemplateGui.playing) {
			toggle.classList.remove("bi-pause-fill");
			toggle.classList.add("bi-play-fill");
		}

		else {
			toggle.classList.remove("bi-play-fill");
			toggle.classList.add("bi-pause-fill");
		}

		matterTemplateGui.playing = !matterTemplateGui.playing;

	});


	reset.addEventListener("click",function(){
		Matter.Composite.clear(matterTemplateGui.simulation.world,true,true);
		matterTemplateGui.simulation = MatterTemplate.Engine.create(matterTemplateGui.shapes);
	});

	exit.addEventListener("click",function(){
		matterTemplateGui.playing = false;
		Matter.Composite.clear(matterTemplateGui.simulation.world,true,true);
		matterTemplateGui.simulation = null;
		//self.renderer.renderWorld(self.shapes);
		matterTemplateGui.container.removeChild(tools);
	});

}