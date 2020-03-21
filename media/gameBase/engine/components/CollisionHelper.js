import CircleCollider from "./CircleCollider.js"
import PointCollider from "./PointCollider.js"
import AABBCollider from "./AABBCollider.js";
import Point from "../base/Point.js";

class CollisionHelper {

    static inCollision(one, two) {
        if (one.collider instanceof CircleCollider && two.collider instanceof PointCollider) {
            let distance = one.gameObject.location.distance(two.gameObject.location);

            if (distance < one.collider.radius)
                return true;
            return false;
        } else if (one.collider instanceof PointCollider && two.collider instanceof CircleCollider) {
            return this.inCollision(two, one);
        } else if (one.collider instanceof AABBCollider && two.collider instanceof PointCollider) {
            console.log("Testing AABB")
            let diff = one.gameObject.location.diff(two.gameObject.location);
            return Math.abs(diff.x) < one.collider.width / 2 && Math.abs(diff.y) < one.collider.height / 2;

        } else if (one.collider instanceof PointCollider && two.collider instanceof AABBCollider) {
            return this.inCollision(two, one);
        } else if (one.collider instanceof CircleCollider && two.collider instanceof CircleCollider) {
            let distance = one.gameObject.location.distance(two.gameObject.location);

            if (distance < +one.collider.radius + +two.collider.radius)
                return true;
            return false;
        }

    }

}

export default CollisionHelper;