import GameObject from "./GameObject.js"

/**
 * A virtual view of the game.
 *
 * The camera allows world space and camera space to be different. This is
 * crucial for side scrollers, etc. It also allows for defered rendering for
 * features like minimaps or split screen games.
 */
class Camera extends GameObject {

    /**
     * The background color to display with this color
     * 
     * This is the color used to clear the canvas before anything is drawn.
     */
    backgroundColor = "black";

    /**
     * Create a camera with the given name.
     * @param {string} name The name of the camera game object
     */

    constructor(name) {
        super(name);

    }
}

export default Camera;