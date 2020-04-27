

class Preview {
  scene = null;
  gameObject = null;
  rows = [];
  vscode = {};
  files = [];
  scenes = [];
  drawer = true;
  on = true;
  source = "https://github.com/ed-ge";
  canv = {};
  setup = false;
  startScene = "";
  behaviors = {};
  //Base:Base,

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
    this.files = this.vscode.postMessage({
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
      //console.log(JSON.stringify(sceneDef, null, 2));
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
    // let response = prompt("What is the name of the new scene", "New Scene").trim();
    // if(!response || !(response.trim())) return;

    // let scene = new Base.Scene();
    // scene.name = response;
    // this.scenes.push(scene)
  }
  selectScene(scene) {
    console.log("Selecting scene " + name)
    //this.vscode.postMessage({ command: 'selectScene', text: name })
    this.scene = scene;
  }
  selectObject(object) {
    this.gameObject = object;
  }
  addScene(obj) {
    console.log(obj.GameObjects)
    console.log(obj.GameBehaviors)
    console.log(obj.Scenes)

  }

  created() {
    this.$vuetify.theme.dark = true
  }

};

let app = new Preview();






window.addEventListener('message', event => {

  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
    case 'selectScene':
      app.scene = app.scenes.find(i => i.uuid == message.text)
      break;
    case 'addComponent':
      let p = JSON.parse(message.text);
      let n = p.componentName;
      let c = new Base.Components[n]();
      app.gameObject.addComponent(c)
      app.save();
      break;
    case 'selectGameObject':
      app.gameObject = app.scene.findByUUID(message.text)
      break;
    case 'editComponentValue':
      app.editComponentValue(message.text);
      break;
    case 'allFiles':
      app.files = message.text;
      break;
    // case 'editComponentValue':
    //   let object = JSON.parse(message.text);
    //   let key = object.key;
    //   let value = object.value;
    //   console.log(`Got ${key} and ${value}`);
    //   break;
    case 'deleteScene':
      app.scenes = app.scenes.filter(i => i.name != message.text);
      break;
    case 'editSceneName':
      let data = JSON.parse(message.text);
      let s = app.scenes.find(i => i.uuid == data.uuid);
      if (app.startScene == s.name)
        app.startScene = data.name
      s.name = data.name;

      app.save();
      break;
    case 'newScene': //The user provided input for a new scene name
      let scene = new Base.Scene({ name: message.text }, Base.prefabs, Base.components, app.behaviors);
      scene.name = message.text;
      console.log("Created new scene" + "|" + message.text + "|")
      app.scenes.push(scene);
      break;
    case 'allScenes':
      console.log("Got scenes");

      var moduleData = message.text;
      var b64moduleData = "data:text/javascript;base64," + btoa(moduleData);
      import(b64moduleData)
        .then(module => {
          console.log("Got module")

          console.log(module.Scenes)
          app.scenes = module.Scenes.allScenes;
          Base.main(module.GameObjects, module.GameBehaviors, module.Scenes, false);
          app.scenes = Base.SceneManager.scenes;
          app.behaviors = module.GameBehaviors;
          app.startScene = module.Scenes.startScene;
          console.log(app.scenes);
          app.setup = true;
          app.deep
          app.vscode.postMessage({
            command: "object",
            text: JSON.stringify(app.scenes, (name, value) => name == "gameObject" ? undefined : value)
          });
          app.vscode.postMessage({
            command: "Components",
            text: JSON.stringify(Object.keys(Base.Components))
          });
          if (Base.GameObjects)
            app.vscode.postMessage({
              command: "GameObjects",
              text: JSON.stringify(Object.keys(Base.GameObjects))
            });

        })
        .catch(err => {
          console.log("Error " + err);
        })

      //app.scenes = message.text;
      break;
    case 'sceneContents':
      console.log("Got scene contents");
      // console.log(JSON.stringify(message.text, null, 2));
      // var moduleData = message.text;
      // var b64moduleData = "data:text/javascript;base64," + btoa(moduleData);
      // import(b64moduleData)
      //   .then(result => {
      //     console.log(JSON.stringify(result, null, 2));
      //     //app.scene = result;
      //     //app.addScene(result)


      //   })
      //   .catch(err => {
      //     console.log("Error " + err);
      //   })


      break;
  }

});

app.canv = document.getElementById("canv")





