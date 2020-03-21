import Engine from "../../engine/Engine.js"
import SceneManager from "../SceneManager.js"

export default class TextBehavior extends Engine.Base.Behavior {
    
    start() {

    }
    update() {
        if(Engine.Base.Input.getMouseButtonUp(0)){
            SceneManager.currentScene = "CollisionScene" ;
        }
        if(Engine.Base.Input.getKeyUp(' '))
        {
            SceneManager.currentScene = "SceneOne";
        }
        if(Engine.Base.Input.getKeyUp('a'))
        {
            SceneManager.currentScene = "SceneTwo";
        }
        if(Engine.Base.Input.getKeyUp('Enter'))
        {
            SceneManager.currentScene = "StrategyScene";
        }
        if(Engine.Base.Input.getKeyUp('r'))
        {
            SceneManager.currentScene = "RoomScene";
        }
        if(Engine.Base.Input.getKeyUp('c'))
        {
            SceneManager.currentScene = "CircleCollisionScene";
        }

    }
}