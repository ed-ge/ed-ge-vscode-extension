import Collider from "./Collider.js"

/**
Axis - Aligned Bounding Box 
*/

class TriangleCollider extends Collider {
    
    points = [];
    pointAX;
    pointAY;
    pointBX;
    pointBY;
    pointCX;
    pointCY;
    
    constructor() {
        super();
    }
    update() {
        if(this.points.length == 0){
            this.points = [new Base.Point(this.pointAX, this.pointAY), new Base.Point(this.pointBX, this.pointBY), new Base.Point(this.pointCX, this.pointCY)];
        }

    }

}

export default TriangleCollider;