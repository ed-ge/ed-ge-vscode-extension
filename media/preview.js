

var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    scene: null,
    gameObject: null,
    rows: [],
    vscode: {},
    files: [],
    scenes: [],
    drawer: true,
    on: true,
    source: "https://github.com/ed-ge",
    canv: {},
    setup: false,
    startScene: "",
    //Base:Base,
  },
  mounted() {
    this.get();

  },
  watch: {
    scene(newValue, oldValue) {
      // if (newValue != oldValue) {
      //   this.draw();
      // }
    }
  },
  methods: {
    get() {
      console.log("Getting");
      this.vscode = acquireVsCodeApi();
      this.files = this.vscode.postMessage({
        command: 'getScenes',
        text: 'getScenes'
      })
    },
    serializeGameObjects() {
      return "Game Objects";
    },
    serializeBehaviors() {
      return "Game Behaviors";
    },
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
        sceneDef.objects = [];
        for (let object of scene.children) {
          let def = {};
          def.name = object.name;
          def.location = object.location;
          def.scale = { x: object.scaleX, y: object.scaleY };
          def.rotation = object.rotation;
          def.type = object.constructor.name;
          sceneDef.objects.push(def);
        }
        console.log(JSON.stringify(sceneDef, null, 2));
        toReturn.allScenes.push(sceneDef)
      }

      return toReturn;
    },
    save() {
      let gameObjects = this.serializeGameObjects();
      let gameBehaviors = this.serializeBehaviors();
      let scenes = this.serializeScenes();
      this.vscode.postMessage({
        command: 'createFile',
        text: JSON.stringify({ gameObjects, gameBehaviors, scenes })
      })
    },
    draw() {
      // let ctx = canv.getContext('2d');

      // ctx.fillStyle = "white";
      // ctx.fillRect(0, 0, canv.width, canv.height);
      // this.scene.objects.filter(i => i.draw).forEach(i => i.draw(ctx));
    },
    doClick() {
      // this.vscode.postMessage({
      //   command: 'createFile',
      //   text: '🐛  on line '
      // })
    },
    getScenes() {
      // this.vscode.postMessage({
      //   command: 'getScenes',
      //   text: 'getScenes'
      // })
    },
    selectScene(scene) {
      console.log("Selecting scene " + name)
      //this.vscode.postMessage({ command: 'selectScene', text: name })
      this.scene = scene;
    },

    selectObject(object) {
      this.gameObject = object;
    },
    addScene(obj) {
      console.log(obj.GameObjects)
      console.log(obj.GameBehaviors)
      console.log(obj.Scenes)
      //this.scenes = obj.Scenes.allScenes;
      //Base.main(obj.GameObjects, obj.GameBehaviors, obj.Scenes, false);


    }
  },
  created() {
    this.$vuetify.theme.dark = true
  },

});





window.addEventListener('message', event => {

  const message = event.data; // The JSON data our extension sent

  switch (message.command) {
    case 'allFiles':
      app.files = message.text;
      break;
    case 'allScenes':
      console.log("Got scenes");
      console.log(message.text);
      var moduleData = message.text;
      var b64moduleData = "data:text/javascript;base64," + btoa(moduleData);
      import(b64moduleData)
        .then(module => {
          console.log("Got module")
          console.log(module.Scenes)
          app.scenes = module.Scenes.allScenes;
          Base.main(module.GameObjects, module.GameBehaviors, module.Scenes, false);
          app.scenes = Base.SceneManager.scenes;
          app.startScene = "hello";
          console.log(app.scenes);
          app.setup = true;

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





