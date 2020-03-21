import Base from "../../engine/Base.js"
import Components from "../../engine/Components.js"
import Input from "../../engine/base/Input.js";

export default class MovementBehavior extends Base.Behavior {
    speed = 5;
    start() {

    }
    update() {
        
        if (Input.keys['ArrowUp']) {
            this.gameObject.y -= this.speed
        }
        if( Input.keys['ArrowDown']) {
            this.gameObject.y += this.speed
        }
        if (Input.keys['ArrowLeft']) {
            this.gameObject.x -= this.speed
        }
        if( Input.keys['ArrowRight']) {
            this.gameObject.x += this.speed
        }

    }
}