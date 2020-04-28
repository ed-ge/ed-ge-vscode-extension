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

  editComponentValue(str) {
    let delta = JSON.parse(str);
    if (this.gameObject.uuid == delta.uuid)
      this.gameObject[delta.key] = delta.value
    else {
      let component = this.gameObject.components.find(i => i.uuid == delta.uuid);
      component[delta.key] = delta.value;
    }
    this.save();
  }
  get() {
    this.vscode = acquireVsCodeApi();
    let that = this;
    window.addEventListener('message', event=>that.eventListener(event));

    this.vscode.postMessage({
      command: 'getScenes',
      text: 'getScenes'
    })
  }
  
  serializeGameObjects() {
    return {};
  }
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
  serializeScenes() {
    let toReturn = {};
    let allScenes = [];
    toReturn.allScenes = allScenes;

    console.log(JSON.stringify(this.scenes.map(i => i.name + ".")))
    toReturn.startScene = this.startScene;

    for (let scene of this.scenes) {
      console.log(scene.name)
      let sceneDef = {};
      sceneDef.name = scene.name;
      sceneDef.uuid = scene.uuid;
      sceneDef.objects = [];
      for (let object of scene.children) {
        let def = {};
        def.name = object.name;
        def.location = object.location;
        def.scale = { x: object.scaleX, y: object.scaleY };
        def.rotation = object.rotation;
        def.type = "EmptyGameObject";
        sceneDef.objects.push(def);
        def.components = [];
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
          def.components.push(cdef);
        }
      }
      toReturn.allScenes.push(sceneDef)
    }

    return toReturn;
  }
  save() {
    let gameObjects = this.serializeGameObjects();
    let gameBehaviors = this.serializeBehaviors();
    console.log(gameBehaviors);
    let scenes = this.serializeScenes();
    this.vscode.postMessage({
      command: 'createFile',
      text: JSON.stringify({ gameObjects, gameBehaviors, scenes })
    })
  }
  deleteScene(scene) {
    this.vscode.postMessage({
      command: 'deleteScene',
      text: scene.name,
    })
  }
  newScene() {
    this.vscode.postMessage({
      command: 'newScene'
    })

  }
  selectScene(scene) {
    this.scene = scene;
  }
  selectObject(object) {
    this.gameObject = object;
  }
  addScene(obj) {
    
  }

  created() {
    this.$vuetify.theme.dark = true
  }
  eventListener(event) {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
      case 'selectScene':
        this.scene = this.scenes.find(i => i.uuid == message.text)
        break;
      case 'addComponent':
        let p = JSON.parse(message.text);
        let n = p.componentName;
        let c = new Base.Components[n]();
        this.gameObject.addComponent(c)
        this.save();
        break;
      case 'selectGameObject':
        this.gameObject = this.scene.findByUUID(message.text)
        break;
      case 'editComponentValue':
        this.editComponentValue(message.text);
        break;
      
      
      case 'deleteScene':
        this.scenes = this.scenes.filter(i => i.name != message.text);
        break;
      case 'editSceneName':
        let data = JSON.parse(message.text);
        let s = this.scenes.find(i => i.uuid == data.uuid);
        if (this.startScene == s.name)
          this.startScene = data.name
        s.name = data.name;

        this.save();
        break;
      case 'newScene': //The user provided input for a new scene name
        let scene = new Base.Scene({ name: message.text }, Base.prefabs, Base.components, this.behaviors);
        scene.name = message.text;
        console.log("Created new scene" + "|" + message.text + "|")
        this.scenes.push(scene);
        break;
      case 'allScenes':
        console.log("Got scenes");

        var moduleData = message.text;
        var b64moduleData = "data:text/javascript;base64," + btoa(moduleData);
        let that = this;
        import(b64moduleData)
          .then(module => {
            console.log("Got module")

            console.log(module.Scenes)
            that.scenes = module.Scenes.allScenes;
            Base.main(module.GameObjects, module.GameBehaviors, module.Scenes, false);
            that.scenes = Base.SceneManager.scenes;
            that.behaviors = module.GameBehaviors;
            that.startScene = module.Scenes.startScene;
            console.log(that.scenes);
            
            that.vscode.postMessage({
              command: "object",
              text: JSON.stringify(that.scenes, (name, value) => name == "gameObject" ? undefined : value)
            });
            that.vscode.postMessage({
              command: "Components",
              text: JSON.stringify(Object.keys(Base.Components))
            });
            if (Base.GameObjects)
              that.vscode.postMessage({
                command: "GameObjects",
                text: JSON.stringify(Object.keys(Base.GameObjects))
              });

          })
          .catch(err => {
            console.log("Error " + err);
          })
        break;
      case 'sceneContents':
        console.log("Got scene contents");
        
        break;
    }

  }

};

let app = new Preview();