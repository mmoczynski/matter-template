export default function exportFile() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.js";

    a.href = URL.createObjectURL(new Blob([self.generateVertexCode()],{
        type: "application/js"
    }));

    a.click();
}
