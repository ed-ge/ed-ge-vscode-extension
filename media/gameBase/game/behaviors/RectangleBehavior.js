import Base from "../../engine/Base.js"

export default class RectangleBehavior extends Base.Behavior{
    start(){
        this.gameObject.rotation = 0;
    }
    update(){
        this.gameObject.rotation += .1;
    }
}