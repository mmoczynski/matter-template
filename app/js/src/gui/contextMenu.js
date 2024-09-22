export default function ContextMenu(matterTemplateGui) {

    /**
     * Reference to matter template gui object
     */

    this.matterTemplateGui = matterTemplateGui;
    let self = this;

    // Used to activate context menu

    matterTemplateGui.container.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        self.create(event.offsetX, event.offsetY);
    });

    // Used to close context menu
    
    matterTemplateGui.container.addEventListener("click", function(){
        document.querySelectorAll(".context-menu").forEach(e => self.matterTemplateGui.container.removeChild(e));
    });
}

ContextMenu.prototype.create = function(x, y) {

    let self = this;

    // See if there is a previous instantation of context menu and get rid of it
    document.querySelectorAll(".context-menu").forEach(e =>  self.matterTemplateGui.container.removeChild(e));

    let contextMenu  = document.createElement("ul");
    this.contextMenu = contextMenu;

    contextMenu.classList.add("context-menu");
    contextMenu.classList.add("list-group");

    self.matterTemplateGui.container.appendChild(contextMenu);

    // Selected objects length

    //let selectedObjectsLength = this.matterTemplateGui.

    // Context menu position

    contextMenu.style.left = x + "px";
    contextMenu.style.top = y + "px";

    // Delete

    let deleteOption = document.createElement("li");
    deleteOption.innerText = "Delete";
    deleteOption.classList.add("list-group-item");
    contextMenu.appendChild(deleteOption);

    // Open object editor

    // Copy

    // Paste

    let paste = document.createElement("li");
    paste.innerText = "Paste";
    paste.classList.add("list-group-item");
    contextMenu.appendChild(paste);

    // Lock/Unlock object

    let lock = document.createElement("li");
    lock.innerText = "Lock item";
    lock.classList.add("list-group-item");
    contextMenu.appendChild(lock);

}