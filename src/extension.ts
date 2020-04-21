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


  CatCodingPanel.treeView = sceneTreeDataProvider;
  vscode.window.createTreeView('sceneTreeDataProvider', {
    treeDataProvider: sceneTreeDataProvider
  });

  vscode.window.createTreeView('gameObjectTreeDataProvider', {
    treeDataProvider: gameObjectTreeDataProvider
  });

  vscode.window.createTreeView('componentTreeDataProvider', {
    treeDataProvider: componentTreeDataProvider
  });

  vscode.commands.registerCommand('sceneTreeDataProvider.refreshEntry', () =>
    sceneTreeDataProvider.refresh()
  );

  vscode.commands.registerCommand("sceneTreeDataProvider.selectScene", (scene) =>
    gameObjectTreeDataProvider.selectScene(scene)
  );

  vscode.commands.registerCommand("gameObjectTreeDataProvider.selectGameObject", (gameObject) =>
    componentTreeDataProvider.selectGameObject(gameObject)
  );

  vscode.commands.registerCommand("componentTreeDataProvider.editComponentValue", (componentValue) => {
    console.log(componentValue);
    componentTreeDataProvider.editComponentValue(componentValue);
  }
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ed-ge.start', () => {
      CatCodingPanel.createOrShow(context.extensionPath);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        //console.log(`Got state: ${state}`);
        CatCodingPanel.revive(webviewPanel, context.extensionPath);
      }
    });
  }
}

/**
 * Manages cat coding webview panels
 */
class CatCodingPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
  public static currentPanel: CatCodingPanel | undefined;

  public static treeView: SceneTreeDataProvider;

  public static readonly viewType = 'ed-ge';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (CatCodingPanel.currentPanel) {
      CatCodingPanel.currentPanel._panel.reveal(column);
      return;
    }
    console.log(path.join(extensionPath, 'media'))
    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      CatCodingPanel.viewType,
      'ed-ge',
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,
        retainContextWhenHidden: true,

      }
    );

    CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
  }

  public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
    CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
  }

  public static getPanel() { return CatCodingPanel.staticPanel };
  static staticPanel: vscode.WebviewPanel;
  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    CatCodingPanel.staticPanel = panel;
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
          case 'newScene':
            this.inputBoxSceneName();
            break;
          case 'deleteScene':
            this.confirmDeleteScene(message.text)
            break;
          case 'getScenes':
            //console.log("Getting scenes");
            if (vscode.workspace.workspaceFolders) {
              //console.log(vscode.workspace.workspaceFolders[0].uri.fsPath)
              //let GameBehaviorFileContents = fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'GameBehaviors.js'), 'ascii');

              //console.log(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'save.js'))

              //Do some conversion to deal with the external behavior files

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

                //console.log(bundle.watchFiles); // an array of file names this bundle depends on

                // generate output specific code in-memory
                // you can call this function multiple times on the same bundle object
                const { output } = await bundle.generate(outputOptions);

                for (const chunkOrAsset of output) {
                  if (chunkOrAsset.type === 'asset') {
                    // For assets, this contains
                    // {
                    //   fileName: string,              // the asset file name
                    //   source: string | Uint8Array    // the asset source
                    //   type: 'asset'                  // signifies that this is an asset
                    // }
                    //console.log('Asset', chunkOrAsset);
                  } else {
                    // For chunks, this contains
                    // {
                    //   code: string,                  // the generated JS code
                    //   dynamicImports: string[],      // external modules imported dynamically by the chunk
                    //   exports: string[],             // exported variable names
                    //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
                    //   fileName: string,              // the chunk file name
                    //   imports: string[],             // external modules imported statically by the chunk
                    //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
                    //   isEntry: boolean,              // is this chunk a static entry point
                    //   map: string | null,            // sourcemaps if present
                    //   modules: {                     // information about the modules in this chunk
                    //     [id: string]: {
                    //       renderedExports: string[]; // exported variable names that were included
                    //       removedExports: string[];  // exported variable names that were removed
                    //       renderedLength: number;    // the length of the remaining code in this module
                    //       originalLength: number;    // the original length of the code in this module
                    //     };
                    //   },
                    //   name: string                   // the name of this chunk as used in naming patterns
                    //   type: 'chunk',                 // signifies that this is a chunk
                    // }
                    //console.log('Chunk', chunkOrAsset.modules);
                  }
                }
                await bundle.write(outputOptions);
                //console.log("Done writing file");
                if (vscode.workspace.workspaceFolders) {
                  let file = fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'rollup.js'), 'ascii');
                  //console.log(file);

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
            //console.log(message.text);
            CatCodingPanel.treeView.setInfo(o);
            return;
          case 'createFile':
            console.log("Got createFile")
            if (vscode.workspace.workspaceFolders) {
              let basePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'save.js');
              let behaviorPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'GameBehaviors.js');
              //let behaviors = import(behaviorPath);

              let info = JSON.parse(message.text);
              CatCodingPanel.treeView.setInfo(info);
              let gameObjects = info.gameObjects;
              let gameBehaviors = info.gameBehaviors;
              let scenes = info.scenes;

              let file = "";

              file += `import GameBehaviors from './GameBehaviors.js';\n`

              file += "let GameObjects = ";
              file += JSON.stringify(gameObjects, null, 2);
              file += '\n';

              // file += "let GameBehaviors = ";
              // file += JSON.stringify(gameBehaviors, null, 2);
              // file += '\n';

              file += "let Scenes = ";
              file += JSON.stringify(scenes, null, 2);
              file += '\n';

              file += '\n';
              file += `export {GameObjects, GameBehaviors, Scenes}`;

              fs.writeFileSync(basePath, file);
              fs.writeFileSync(behaviorPath, gameBehaviors);
              console.log("Wrote file");
              //console.log(file);
            }
        }
      },
      null,
      this._disposables
    );
  }

  public doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({ command: 'refactor' });
  }

  public dispose() {
    CatCodingPanel.currentPanel = undefined;

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
        vscode.window.showInformationMessage(`Validating: ${text}`);
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

export default CatCodingPanel;