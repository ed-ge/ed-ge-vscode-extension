import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as ncp from 'ncp';


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('ed-ge.start', () => {
      CatCodingPanel.createOrShow(context.extensionPath);
    })
  );



  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        console.log(`Got state: ${state}`);
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

  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
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
          case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
          case 'getFiles':
            console.log("Getting files");
            files = fs.readdirSync(path.join(this._extensionPath, 'media', 'gameBase', 'game'));

            this._panel.webview.postMessage(
              {
                command: 'allFiles',
                text: files,
              }
            );
            return;
          case 'selectScene':
            console.log("Getting a scene " + message.text)
            if (vscode.workspace.workspaceFolders) {
              console.log(vscode.workspace.workspaceFolders[0].uri.fsPath)

              let temp = fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'game', 'scenes', message.text), "ascii");

              this._panel.webview.postMessage(
                {
                  command: 'sceneContents',
                  text: temp,
                }
              );
            }
            return;
          case 'getScenes':
            console.log("Getting scenes");
            if (vscode.workspace.workspaceFolders) {
              console.log(vscode.workspace.workspaceFolders[0].uri.fsPath)
              files = fs.readdirSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'game', 'scenes'));

              this._panel.webview.postMessage(
                {
                  command: 'allScenes',
                  text: files,
                }
              );
            }
            return;
          case 'createFile':
            if (vscode.workspace.workspaceFolders) {
              let basePath = vscode.workspace.workspaceFolders[0].uri.fsPath

              let extensionDir = path.join(this._extensionPath, 'media', 'gameBase');

              ncp(extensionDir, basePath, (err: any) => {
                if (err) console.error(err);
                console.log("Done with copy)")
              })
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

    const scriptPathOnDiskHTML = vscode.Uri.file(
      path.join(this._extensionPath, 'media', 'index.html')
    );

    // And the uri we use to load this script in the webview
    let content = fs.readFileSync(path.join(this._extensionPath, 'media', 'index.html'), 'utf-8');
    content = content.replace("${webview.cspSource}", `${this._extensionPath}`);
    return content;
  }
}