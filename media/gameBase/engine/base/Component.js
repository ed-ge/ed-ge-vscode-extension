/**
 * Components are attached to game objects.
 * 
 * Examples of components are behaviors, renderers, and colliders.
 * Components cannot have children.
 * 
 * In the declarative syntax of scenes and game objects, components are defined
 * as follows:
 * ```
 * {
 *  type:"<type name of component>",
 *    values:[
 *       {
 *          key:"<name of component member variable>",
 *          value:"<the desired value>"
 *        }
 *    ]
 * }
 * ```
 */

class Component {

    /**
     * Reference to the parent game object.
     * 
     * In order to connect this game object member variable to the parent game
     * object, compoments must be added to game objects using the addComponent()
     * method. If instead you simple say gameObect.components.push(component),
     * you will invariably run into bugs.
     */
    gameObject;


}

export default Component;