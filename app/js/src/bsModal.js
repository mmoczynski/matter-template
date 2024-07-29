function bootstrapModal() {

    // HTML Elements

    let modal = document.createElement("div");
    let modalDialog = document.createElement("div");
    let modalContent = document.createElement("div");
    let modalHeader = document.createElement("div");
    let modalTitle = document.createElement("h5");
    let close = document.createElement("button");
    let closeSymbol = document.createElement("span");
    let modalBody = document.createElement("div");
    let modalFooter = document.createElement("div");

    // Assigning classes to HTML elements

    modal.className = "modal";
    modalDialog.className = "modal-dialog";
    modalContent.className = "modal-content";
    modalHeader.className = "modal-header";
    modalTitle.className = "modal-title";
    close.className = "close";
    modalBody.className = "modal-body";
    modalFooter.className = "modal-footer";

    // Close button content

    closeSymbol.innerText = "&times;";

    // HTML Structure

    modal.appendChild(modalDialog);
    modalDialog.appendChild(modalContent);

    modalContent.appendChild(modalHeader);

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(close);
    close.appendChild(closeSymbol);

    modalContent.appendChild(modalBody);
    
    modalContent.appendChild(modalFooter);

    return modal;

}

export default bootstrapModal;