import Component from "./Component.js"

/**
 * Behaviors are game-specific class that add logic to game objects
 */
class Behavior extends Component {

    /**
     * Called when the parent game object is instatiated,
     * either when the scene starts if the game object is
     * part of the scene definition or in the middle of 
     * the scene when the game object is instantiated.
     * 
     * This is a great place to setup up your scene or
     * instantiate other game objects programmatically.
     * For example, if you have a tile-based game, you 
     * could use the start() method of a controller 
     * behaviors to intantiate all the tiled with a 
     * double for loop.
     */
    start() {}

    /**
     * Called as part of the game loop.
     * Whenever the game loop fires, all game objects in
     * the scene recursively call update on all their 
     * behaviors and then on all their child game object
     * behaviors.
     */
    update() {}

}

export default Behavior;