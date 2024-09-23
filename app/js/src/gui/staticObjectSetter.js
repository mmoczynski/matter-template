export default function StaticObjectSetter(matterTemplateGui) {

    this.matterTemplateGui = matterTemplateGui;

    matterTemplateGui.container.querySelector(".make-selected-objects-static").addEventListener("click", function(){
        matterTemplateGui.selectionTool.selectedObjects.forEach(o => o.plugin.matterTemplate.static = true);
    });

    matterTemplateGui.container.querySelector(".unmake-selected-objects-static").addEventListener("click", function(){
        matterTemplateGui.selectionTool.selectedObjects.forEach(o => o.plugin.matterTemplate.static = false);
    });

    matterTemplateGui.container.querySelector(".toggle-selected-objects-static").addEventListener("click", function(){
        matterTemplateGui.selectionTool.selectedObjects.forEach(o => o.plugin.matterTemplate.static = !o.plugin.matterTemplate.static);
    });

}