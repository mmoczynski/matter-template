function MatterTemplateGuiTool(parent) {
	this.parent = parent;
	Object.assign(this,EventHander);
}

MatterTemplateGuiTool.prototype.enable = function() {

	if(this.parent.currentTool) {
		this.parent.currentTool.disable();
	}

	this.parent.currentTool = this;

	this.callEvent("enable",this);


}

MatterTemplateGuiTool.prototype.disable = function() {
	this.parent.currentTool = undefined;
}

export default MatterTemplateGuiTool;