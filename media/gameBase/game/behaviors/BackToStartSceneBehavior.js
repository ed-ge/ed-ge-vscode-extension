import Base from "../../engine/Base.js"
import SceneManager from "../SceneManager.js"
import Input from "../../engine/base/Input.js";

export default class BackToStartSceneBehavior extends Base.Behavior {
    
    start() {
        

    }
    update() {
        if(Input.getKeyUp("Escape")){
            SceneManager.currentScene = "StartScene";
        }
        
    }
   
}