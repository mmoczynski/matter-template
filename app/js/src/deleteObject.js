export default function ObjectRemover(matterTemplateGui) {

    /**
     * @type {MatterTemplateGui}
     */

    this.matterTemplateGui = matterTemplateGui;

    let self = this;

    matterTemplateGui.container.querySelector(".dropdown-item.delete-selected-objects").addEventListener("click", function(){
        matterTemplateGui.selectionTool.selectedObjects.forEach(o => self.delete(o));
    });
}

ObjectRemover.prototype.delete = function(o) {
    return this.matterTemplateGui.shapes.splice(
        this.matterTemplateGui.shapes.indexOf(o), 
    1);
}