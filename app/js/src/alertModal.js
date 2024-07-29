import bootstrapModal from "./bsModal.js";

export function alertModal(message,onok) {

    let messageElement = document.createElement("div");
    let dismiss = document.createElement("button");

    dismiss.addEventListener("click",onok);
    dismiss.innerText = "OK";
    dismiss.className = "btn btn-primary";

    messageElement.innerText = message;

    let m = bootstrapModal();
    m.querySelector(".modal-title").innerText = "Message from Editor"
    m.querySelector(".modal-body").appendChild(messageElement);
    m.querySelector(".modal-footer").appendChild(dismiss);
    m.style.display = "block";

    dismiss.addEventListener("click",function(){
       m.parentElement.removeChild(m); 
    });

    document.body.appendChild(m);

    return m;
    
}

export function confirmModal(message,onok,oncancel) {
    let m = alertModal(message,onok);
    
    let cancel = document.createElement("button");
    cancel.innerText = "Cancel";
    cancel.className = "btn btn-primary modal-cancel-button";

    m.querySelector(".modal-footer").appendChild(cancel);

    cancel.addEventListener("click",oncancel);

    cancel.addEventListener("click",function(){
        m.parentElement.removeChild(m); 
    });

    return m;

}

export function promptModal(message,onok,oncancel) {
    
    let m = confirmModal(message,onok,oncancel); 

    let input = document.createElement("input");
    input.type = "text";

    m.querySelector(".modal-body").appendChild(input);

    return m;

}