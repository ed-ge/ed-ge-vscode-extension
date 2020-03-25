/**
 * Modification of game.js as found in the game engine
 * 
 * This allows us to create scenes without calling the full game loop
 */

import Engine from "./gameBase/engine/Engine.js"
import SceneManager from "./gameBase/game/SceneManager.js"

import GameBehaviors from "./gameBase/game/GameBehaviors.js";
import GameObjects from "./gameBase/game/GameObjects.js"




Engine.Base.Scene.gameObjects = GameObjects;
Engine.Base.Scene.components = Engine.Components;
Engine.Base.Scene.gameBehaviors = GameBehaviors;


window.addScene = function (scene) {
  SceneManager.scenes = [];

  SceneManager.addScene(Engine.Base.Scene.parse(scene))
  SceneManager.currentScene = scene.name;

}


//Setup event handling
/*document.body.addEventListener('keydown', keydown);
document.body.addEventListener('keyup', keyup);
document.body.addEventListener('keypress', keypress);
document.body.addEventListener('mousedown', mousedown);
document.body.addEventListener('mouseup', mouseup);*/



//var can = document.getElementById("canv");





let canv, ctx;

function main() {
 
  setInterval(gameLoop, 1000)

}



function gameLoop() {

  draw(ctx);
}



function draw(ctx) {
  canv = document.querySelector("#canv");
  ctx = canv.getContext('2d');
  
  try {
    SceneManager.currentScene.draw(ctx, canv.width, canv.height);
  }catch(err){
    console.log("Can't draw until a scene is selected");
  }
}

main();



