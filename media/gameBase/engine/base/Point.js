/**
 * 2D Point class
 */

class Point {
    /**
     * 
     * @param {Number} x The x location of the point
     * @param {Number} y The y location of the point
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Calculate the Euclidian distance between this point and another point.
     * 
     * @param {Point} otherPoint The point to which we are calculating a distance
     */
    distance(otherPoint = new Point(0, 0)) {

        return Math.sqrt(this.distanceSquared(otherPoint));
    }

    /**
     * Since finding the Euclidean distance requires an expensive square root
     * calculation, we have the option of calculating the squared distance to go
     * quicker.
     * 
     * @param {Point} otherPoint The point to which we are calculating the
     * squared distance
     */
    distanceSquared(otherPoint = new Point(0, 0)) {
        let xDiff = (this.x - otherPoint.x);
        let yDiff = (this.y - otherPoint.y);
        return xDiff * xDiff + yDiff * yDiff;
    }

    /**
     * Find the pairwise difference to another point.
     * 
     * @param {Point} otherPoint The point from which we are doing a pairwise
     * difference. 
     */
    diff(otherPoint) {
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
    }
}

export default Point;