import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { SceneTreeDataProvider } from './SceneTreeDataProvider';
import { ComponentTreeDataProvider } from './ComponentTreeDataProvider';
import { GameObjectTreeDataProvider } from './GameObjectTreeDataProvider';

const rollup = require('rollup');


export function activate(context: vscode.ExtensionContext) {

  let componentTreeDataProvider = new ComponentTreeDataProvider();
  let gameObjectTreeDataProvider = new GameObjectTreeDataProvider();
  let sceneTreeDataProvider = new SceneTreeDataProvider();


  EdGePanel.treeView = sceneTreeDataProvider;

  //Create the three treeDataProviders
  vscode.window.createTreeView('sceneTreeDataProvider', {
    treeDataProvider: sceneTreeDataProvider
  });

  vscode.window.createTreeView('gameObjectTreeDataProvider', {
    treeDataProvider: gameObjectTreeDataProvider
  });

  vscode.window.createTreeView('componentTreeDataProvider', {
    treeDataProvider: componentTreeDataProvider
  });

  //Add the commands for the sceneTreeDataProvider
  vscode.commands.registerCommand('sceneTreeDataProvider.refreshEntry', () =>
    sceneTreeDataProvider.refresh()
  );

  vscode.commands.registerCommand("sceneTreeDataProvider.selectScene", (scene) =>
    gameObjectTreeDataProvider.selectScene(scene)
  );

  vscode.commands.registerCommand("sceneTreeDataProvider.editScene", (scene) =>
    sceneTreeDataProvider.editScene(scene)
  );

  //Add the commands for the gameTreeDataProvider
  vscode.commands.registerCommand("gameObjectTreeDataProvider.selectGameObject", (gameObject) =>
    componentTreeDataProvider.selectGameObject(gameObject)
  );

  vscode.commands.registerCommand("gameObjectTreeDataProvider.editGameObject", (gameObject) => {
    gameObjectTreeDataProvider.editGameObject(gameObject);
  }
  );

  //Add the commansd for the componentTreeDataProvider
  vscode.commands.registerCommand("componentTreeDataProvider.editComponentValue", (componentValue) => {
    console.log(componentValue);
    componentTreeDataProvider.editComponentValue(componentValue);
  }
  );
  vscode.commands.registerCommand("componentTreeDataProvider.addComponent", () => {
    componentTreeDataProvider.addComponent();
  }
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ed-ge.start', () => {
      EdGePanel.createOrShow(context.extensionPath);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(EdGePanel.viewType, {
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        EdGePanel.revive(webviewPanel, context.extensionPath);
      }
    });
  }
}

/**
 * Manages EdGePanel webview panels
 */
class EdGePanel {
  static gameObject: any; //Currently selected game object

  /**
   * Select a game object
   * Updates the panel and sends a message to the webview
   * @param gameObject The gameObject to select
   */
  static selectGameObject(gameObject: any) {
    EdGePanel.getPanel().webview.postMessage({ command: 'selectGameObject', text: gameObject.nameable.uuid });
    EdGePanel.gameObject = gameObject;
  }

	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
  public static currentPanel: EdGePanel | undefined;

  /** Reference to the current Scene Tree  */
  public static treeView: SceneTreeDataProvider;

  /** Reference to all possible components */
  public static Components: any[];

  /** Reference to all possible game objects */
  public static GameObjects: any[];

  /** Name of the panel */
  public static readonly viewType = 'ed-ge';

  /** Boilerplate */
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (EdGePanel.currentPanel) {
      EdGePanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      EdGePanel.viewType,
      'ed-ge',
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,
        //Don't shut down in the background
        retainContextWhenHidden: true,
      }
    );

    EdGePanel.currentPanel = new EdGePanel(panel, extensionPath);
  }

  public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
    EdGePanel.currentPanel = new EdGePanel(panel, extensionPath);
  }

  public static getPanel() { return EdGePanel.staticPanel };
  static staticPanel: vscode.WebviewPanel;
  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    EdGePanel.staticPanel = panel;
    this._extensionPath = extensionPath;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      (e: any) => {
        if (this._panel.visible) {
          this._update();
        }
      },
      null,
      this._disposables
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message: any) => {
        let files;
        switch (message.command) {
          case 'Components':
            EdGePanel.Components = JSON.parse(message.text);
            break;
          case 'GameObjets':
            EdGePanel.GameObjects = JSON.parse(message.text);
            break;
          case 'getScenes':
            if (vscode.workspace.workspaceFolders) {
              const inputOptions = {
                input: path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'save.js')
              };

              const outputOptions = {
                format: 'es',
                file: path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'rollup.js'),

              }
              let self = this;
              async function build() {
                // create a bundle
                const bundle = await rollup.rollup(inputOptions);

                const { output } = await bundle.generate(outputOptions);

                await bundle.write(outputOptions);

                if (vscode.workspace.workspaceFolders) {
                  let file = fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'rollup.js'), 'ascii');

                  self._panel.webview.postMessage(
                    {
                      command: 'allScenes',
                      text: file,
                    }
                  );
                }
              }
              build();
            }
            return;
          case 'object':
            console.log("Got Object")
            let o = JSON.parse(message.text);
            EdGePanel.treeView.setInfo(o);
            return;
          case 'createFile':
            console.log("Got createFile")
            if (vscode.workspace.workspaceFolders) {
              let basePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'save.js');
              let behaviorPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'GameBehaviors.js');
              //let behaviors = import(behaviorPath);

              let info = JSON.parse(message.text);
              EdGePanel.treeView.setInfo(info.scenes.allScenes);
              let gameObjects = info.gameObjects;
              let gameBehaviors = info.gameBehaviors;
              let scenes = info.scenes;

              let file= 
`import GameBehaviors from './GameBehaviors.js'
let GameObjects = ${JSON.stringify(gameObjects, null, 2)}
let Scenes = ${JSON.stringify(scenes, null, 2)}
 
export {GameObjects, GameBehaviors, Scenes}`;

              fs.writeFileSync(basePath, file);
              fs.writeFileSync(behaviorPath, gameBehaviors);
            }
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    EdGePanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, 'media', 'preview.js')
    );
    console.log(webview.asWebviewUri(scriptPathOnDisk));

    const scriptPathOnDiskHTML = vscode.Uri.file(
      path.join(this._extensionPath, 'media', 'index.html')
    );

    // And the uri we use to load this script in the webview
    let content = fs.readFileSync(path.join(this._extensionPath, 'media', 'index.html'), 'utf-8');
    content = content.replace("${webview.cspSource}", `${webview.asWebviewUri(scriptPathOnDisk)}`);
    return content;
  }

  private async inputBoxSceneName() {

    const result = await vscode.window.showInputBox({
      value: '',
      placeHolder: 'Name of the new scene',
      validateInput: text => {
        //vscode.window.showInformationMessage(`Validating: ${text}`);
        return text.trim() === '' ? 'The value cannot be blank!' : null;
      }
    });
    vscode.window.showInformationMessage(`Creating new scene: ${result}`);
    this._panel.webview.postMessage(
      {
        command: 'newScene',
        text: result,
      }
    );
  }
  private async confirmDeleteScene(scene: string) {
    let i = 0;
    const result = await vscode.window.showQuickPick(['OK', 'Cancel'], {
      placeHolder: 'Do you want to delete the scene' + scene,
      //onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
    });
    vscode.window.showInformationMessage(`Got: ${result}`);
    if (result === "OK") {
      this._panel.webview.postMessage(
        {
          command: 'deleteScene',
          text: scene,
        }
      );
    }
  }
}

export default EdGePanel;