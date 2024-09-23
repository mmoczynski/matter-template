export default function VertexSetsUnionTool(matterTemplateGui) {

    this.matterTemplateGui = matterTemplateGui;

    matterTemplateGui.container.querySelector(".dropdown-item.unite-selected-objects").addEventListener("click", function(){
        
        let o2 = {
            vertexSets: [],
            shape: "vertices"
        }

        // Values for averages

        let length = 0;
        let sumX = 0;
        let sumY = 0;

        matterTemplateGui.selectionTool.selectedObjects.forEach(function(o){
            
            length++;
            sumX += o.x;
            sumY += o.y;

            o2.vertexSets.push(o.vertexSets);
            matterTemplateGui.objectRemover.delete(o);

        });

        o2.x = sumX / length;
        o2.y = sumY / length;

        matterTemplateGui.shapes.push(o2);

    });

}