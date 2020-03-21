import Engine from "../../engine/Engine.js"
import Base from "../../engine/Base.js"
import RectangleBehavior from "./RectangleBehavior.js";


export default class TileBehavior extends Base.Behavior{
    selected = false;
    isWater = false;
    hasCharacter = false;
    start(){
        
    }
    update(){
        let component = this.gameObject.getComponent(Engine.Components.RectangleComponent);
        if(this.isWater){
            component.fill = "blue";
        }
        else if(this.hasCharacter){
            component.fill = "green";
        }
        else{
            component.fill = "gray";
        }
        
    }
}