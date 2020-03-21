import Base from "../../engine/Base.js"
import Components from "../../engine/Components.js"
import Input from "../../engine/base/Input.js";

export default class TextBehavior extends Base.Behavior {
    time = 10;

    start() {

    }
    update() {
        this.time -= .1;
        if (Input.keys[' ']) {
            this.gameObject.getComponent(Components.TextComponent).text = 'Down';
        }
        else {
            this.gameObject.getComponent(Components.TextComponent).text = 'Up';

        }

    }
}