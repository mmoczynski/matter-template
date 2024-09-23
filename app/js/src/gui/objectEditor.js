export default function ObjectEditorHandler(matterTemplateGui) {

    this.matterTemplateGui = matterTemplateGui;
    this.instance = null;
    let self = this;

    matterTemplateGui.container.querySelector(".open-object-handler",).addEventListener("click", function() {
        self.createNewInstance(matterTemplateGui.selectionTool.selectedObjects[0]);
    });
}

ObjectEditorHandler.prototype.createNewInstance = function(object) {
    this.instance = new ObjectEditor(object, this);
}

function ObjectEditor(object, handler) {

    this.object = object;
    this.handler = handler;

    let w = document.createElement("div");

    w.classList.add("modal");
    w.classList.add("object-editor-modal");

    let win = document.createElement("div");
    win.classList.add("object-editor-body");
    w.appendChild(win);

    handler.matterTemplateGui.container.appendChild(w);
    
}