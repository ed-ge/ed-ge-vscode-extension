import NameableParent from "./NamableParent.js"
import Point from "./Point.js";

/**
 * A game object represents a "thing" in a game.
 * a gameOject instance can be a character, part of the background
 * or an invisible container for logic
 */
class GameObject extends NameableParent {
    /**
     * The x position of the game object relative to its parent
     */
    x;

    /**
     * The y position of the game object relative to its parent
     */
    y;

    /**
     * The scale of the game object in x relative to its parent
     */
    scaleX;

    /**
     * The scale of the game object in y relative to its parent
     */
    scaleY;

    /**
     * The rotation of the game object relative to its parent
     */
    rotation;

    /**
     * Array of components this game object has. Note, components should only be
     * added to this array used GameObject.addComponent() to components.push().
     * Otherwise the components won't have their parent game object member
     * variable method populated.
     */
    components = [];

    /**
     * Returns the location of the game object as a Point object rather than two
     * variables x and y.
     */
    get location() {
        return new Point(this.x, this.y);
    }

    /**
     * 
     * @param {Number} x The x position of the game object relative to its parent. Defaults to 0
     * @param {Number} y The y positon of the game object relative to its
     * parent. Defaults to 0
     * @param {Number} scaleX The scale of the objet in x relative to its
     * parent. Defaults to 1.
     * @param {Number} scaleY The scale of the object in y relative to its
     * parent. Scales to 1.
     * @param {Number} rotation The scale of the object relative to its parent.
     */
    constructor(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0) {
            super();
            [this.x, this.y, this.scaleX, this.scaleY, this.rotation] = [x, y, scaleX, scaleY, rotation];
        }
        /**
         * 
         * @param {Component} component The component to be added to this game
         * object's list of components
         * 
         * Call this method instead of GameObject.components.push() to add
         * components so that components will have their gameObject parent member
         * variable populated.
         */
    addComponent(component) {
        this.components.push(component);
        component.gameObject = this;
    }

    /**
     * 
     * Render this game object to a canvas by calling the draw method on all its
     * components and then recursively calling draw on its child components.
     * 
     * @param {Canvas_2D_Context} ctx The canvas context  to draw to. This may a
     * literal reference to a canvas on the DOM or a background image for
     * deferred rendering.
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.rotate(this.rotation);

        this.components.filter(i => i.draw).forEach(i => i.draw(ctx));

        //Now draw all the children
        this.children.filter(i => i.draw).forEach(i => i.draw(ctx))

        ctx.restore();
    }
    update() {
        this.components.filter(i => i.update).forEach(i => i.update());

        //Now update all the children
        this.children.forEach(i => i.update());
    }
    getComponent(type) {
        if (typeof(type) === 'string' || type instanceof String) {
            //The user passed us a string, not a type
            //https://stackoverflow.com/a/7772724/10047920
            let component = this.components.find(i => i.constructor.name === type);
            if (component) return component;
            throw "Error, couldn't find type " + type;
        } else {
            let component = this.components.find(i => i instanceof type);
            if (component) return component;
            throw "Error, couldn't find type " + type;
        }
    }
    recursiveCall(functionName) {
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            if (component[functionName]) {
                component[functionName]();
            }
        }
        //Now call the function on the children
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            child.recursiveCall(functionName);
        }
    }
}

export default GameObject;