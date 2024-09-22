export default function ObjectRemover(matterTemplateGui) {

    /**
     * @type {MatterTemplateGui}
     */

    this.matterTemplateGui = matterTemplateGui;
}

ObjectRemover.prototype.delete = function(o) {
    return this.matterTemplateGui.shapes.splice(
        this.matterTemplateGui.shapes.indexOf(o), 
    1);
}