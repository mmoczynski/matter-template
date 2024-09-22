/**
 * @this {MatterTemplateGui}
 */

export default function save() {

	let self = this;

    let a = document.createElement("a");
    a.download = "Untitled.json";

    a.href = URL.createObjectURL(new Blob([JSON.stringify(self.shapes)],{
        type: "application/json"
    }));

    a.click();

}