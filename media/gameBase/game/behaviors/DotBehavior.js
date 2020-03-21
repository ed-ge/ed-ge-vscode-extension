import Base from "../../engine/Base.js"
import SceneManager from "../SceneManager.js"
import Point from "../../engine/base/Point.js";
import CollisionCircle from "../prefabs/CollisionCircle.js"
import Rectangle from "../prefabs/Rectangle.js";

export default class DotBehavior extends Base.Behavior {

    start() {
        console.log("Dot started");

    }
    update() {

    }
    onCollisionEnter(otherGameObject) {
        //console.log("in collision");
    }

    onCollisionStay(collisionObject) {

        if (collisionObject.gameObject.name == "CollisionCircle") {

            SceneManager.destroy(collisionObject.gameObject);
            SceneManager.instantiate(CollisionCircle, new Point(Math.random() * 400, Math.random() * 400), 0);
            
        }
        else if (collisionObject.gameObject.name == "Rectangle") {

            SceneManager.destroy(collisionObject.gameObject);
            SceneManager.instantiate(Rectangle, new Point(Math.random() * 400, Math.random() * 400), 0);
            
        }
        
    }
}