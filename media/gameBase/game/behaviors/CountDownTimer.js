import Base from "../../engine/Base.js"
import Components from "../../engine/Components.js"
import Input from "../../engine/base/Input.js";
import SceneManager from "../SceneManager.js";

export default class CountDownTimer extends Base.Behavior {
    time = 10;
    toSceneText = "SceneTwoB";

    start() {

    }
    update() {
        this.time -= .1;

        this.gameObject.getComponent(Components.TextComponent).text = this.time;
        if(this.time <= 0){
            SceneManager.currentScene = this.toSceneText;
        }


    }
}