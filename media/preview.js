class Preview {
  vscode = {}; //References to the vscode "server"

  startScene = ""; //Reference to the name of the current start scene
  scene = null; //Reference to the currently selected scene
  gameObject = null; //Reference to the currently selected game object

  behaviors = {}; //List of all the behaviors in the game
  scenes = [];  //List of all scenes in the game

  constructor() {
    this.get();
  }

  /**
   * Start the interaction process by
   * 1) Getting a reference to the vscode backend
   * 2) Listening for messages
   * 3) Posting a message requesting the rollup bundle
   */
  get() {
    this.vscode = acquireVsCodeApi(); // get a reference to the vscode "server"

    //Listen for message events
    let that = this;
    window.addEventListener('message', event => that.eventListener(event));

    //Send a message asking for the rollup bundle
    this.vscode.postMessage({
      command: 'getScenes',
      text: 'getScenes'
    })
  }

  

  //Right now we don't rely on prefabs when saving changes
  serializeGameObjects() {
    return {};
  }

  /**
   * Serialize behaviors.
   * This is simply the process of generating the text for a file that 
   * imports a file for every behavior we have in the game
   * This assumes that every behavior is in its own file named
   * after the behavior's file name and in the root file directory.
   */
  serializeBehaviors() {
    let toReturn = "";
    let toImport = "";
    let toPackage = "const GameBehaviors={\n";
    for (let key of Object.keys(this.behaviors)) {
      toImport += `import ${key} from './${key}.js'\n`
      toPackage += `\t${key},\n`
    }
    toReturn = toImport + "\n" + toPackage + "\n};\nexport default GameBehaviors;\n"
    console.log(toReturn);
    return toReturn;
  }

  /**
   * Generate the text for all the scenes in our DSL
   */
  serializeScenes() {
    let toReturn = {startScene:"", allScenes:[]};
    

    toReturn.startScene = this.startScene;

    for (let scene of this.scenes) {
      let sceneDef = {};
      sceneDef.name = scene.name;
      sceneDef.uuid = scene.uuid;
      sceneDef.objects = [];
      for (let object of scene.children) {
        let child = {};
        child.def= `${object.name}, ${object.x}, ${object.y}, ${object.scaleX}, ${object.scaleY}, ${object.rotation}, ${object.prefabName}`;
        
        child.components = [];
        child.children = [];
        for (let component of object.components) {
          let cdef = ""
          cdef += component.constructor.name;
          cdef += "|";
          for (let key in component) {
            if (key == "gameObject") continue;
            cdef += key;
            cdef += "|";
            cdef += component[key];
            cdef += "|";
          }
          child.components.push(cdef);
        }
        sceneDef.objects.push(child);
      }
      toReturn.allScenes.push(sceneDef)
    }

    return toReturn;
  }

  /**
   * Generate the text for the behaviors, game objects, and scene
   * Then send that text to the vs code "server" to save to disk
   */
  save() {
    let gameObjects = this.serializeGameObjects();
    let gameBehaviors = this.serializeBehaviors();
    console.log(gameBehaviors);
    let scenes = this.serializeScenes();
    console.log(scenes);
    this.vscode.postMessage({
      command: 'createFile',
      text: JSON.stringify({ gameObjects, gameBehaviors, scenes })
    })
  }
  /**
   * Parse a game definition
   * @param {object} module A module loaded at runtime
   */
  loadModule(module) {
    //this.scenes = module.Scenes.allScenes;
    Base.main(module.GameObjects, module.GameBehaviors, module.Scenes, {runUpdate:false});

    //Etract the values we need after we load the game
    this.prefabs = Base.SceneManager.Prefabs;
    this.behaviors = module.GameBehaviors;
    this.scenes = Base.SceneManager.scenes;
    this.startScene = module.Scenes.startScene;

    //Update the server with the scenes
    this.vscode.postMessage({
      command: "object",
      text: JSON.stringify(this.scenes, (name, value) => name == "gameObject" ? undefined : value)
    });

    //Update the server with the components
    this.vscode.postMessage({
      command: "Components",
      text: JSON.stringify(Object.keys(Base.Components))
    });

    //Update the server with the game objects
    if (Base.GameObjects)
      this.vscode.postMessage({
        command: "GameObjects",
        text: JSON.stringify(Object.keys(Base.GameObjects))
      });

  }
  selectScene(str) {
    this.scene = this.scenes.find(i => i.uuid == str)
    Base.main(this.Prefabs, this.behaviors, {allScenes:this.scenes}, {runUpdate:false, startScene: this.scene.name})
    //Update the server with the scenes
    this.scenes = Base.SceneManager.scenes;
    this.vscode.postMessage({
      command: "object",
      text: JSON.stringify(this.scenes, (name, value) => name == "gameObject" ? undefined : value)
    });

  }
  addComponent(str) {
    let p = JSON.parse(str);
    let n = p.componentName;
    let c = new Base.Components[n]();
    this.gameObject.addComponent(c)
    this.save();
  }
  /**
   * Respond to a request editing a component
   * @param {String} str JSON formatted object with three values
   * 1) the uuid of the currently selected object (if editing the transform)
   * or the uuid of the component on the currently selceted object
   * 2) the key of the component being edited
   * 3) the new value to be assigned to that component's key
   */
  editComponentValue(str) {
    let delta = JSON.parse(str);

    //If the uuid matches the game object, then we are changing
    //a value on the trasnform
    if (this.gameObject.uuid == delta.uuid)
      this.gameObject[delta.key] = delta.value
    //Otherwise we are changing a value on the component
    else {
      let component = this.gameObject.components.find(i => i.uuid == delta.uuid);
      component[delta.key] = delta.value;
    }
    //Automatically save the changes to disk
    this.save();
  }
  selectGameObject(str) {
    this.gameObject = this.scene.findByUUID(str);
  }
  deleteScene(str) {
    let uuid = JSON.parse(str)
    this.scenes = this.scenes.filter(i => i.uuid != uuid);
    this.save();
  }
  editScene(str) {
    let data = JSON.parse(str);
    let s = this.scenes.find(i => i.uuid == data.uuid);
    if (this.startScene == s.name)
      this.startScene = data.name
    s.name = data.name;

    this.save();
  }
  addScene(str) {
    let data = JSON.parse(str);
    let scene = new Base.Scene({ name: data.name }, Base.prefabs, Base.components, this.behaviors);
    scene.name = data.name;
    console.log("Created new scene" + "|" + str + "|")
    this.scenes.push(scene);
    this.save();
  }
  addGameObject(str) {
    let data = JSON.parse(str);
    let gameObject = this.scene.instantiate(Base.Prefabs.EmptyGameObject, new Base.Point(0,0), new Base.Point(1,1), 0, this.scene);
    gameObject.name = data.name;
    this.save();
  }
  deleteGameObject(str) {
    let uuid = JSON.parse(str)
    this.scene.children = this.scene.children.filter(i => i.uuid != uuid);
    this.save();
  }
  allScenes(str) {
    console.log("Got scenes");

    var moduleData = str;
    var b64moduleData = "data:text/javascript;base64," + btoa(moduleData);
    let that = this;
    import(b64moduleData)
      .then(module => that.loadModule(module))
      .catch(err => {
        console.log("Error " + err);
      })
  }

  /**
   * Respond to message events
   * @param {object} event An object with a data member with a command and text string
   */
  eventListener(event) {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
      case 'allScenes': return this.allScenes(message.text);

      case 'addScene': return this.addScene(message.text)
      case 'editScene': return this.editScene(message.text)
      case 'deleteScene': return this.deleteScene(message.text);

      case 'addGameObject': return this.addGameObject(message.text);
      case 'editGameObject': return ;
      case 'deleteGameObject': return this.deleteGameObject(message.text);

      case 'addComponent': return this.addComponent(message.text)
      case 'deleteComponent': return ;
      case 'editComponentValue': return this.editComponentValue(message.text);

      case 'selectScene': return this.selectScene(message.text)
      case 'selectGameObject': return this.selectGameObject(message.text);

      default: return console.error("Unknown message " + message.command);
    }
  }
};

let app = new Preview();