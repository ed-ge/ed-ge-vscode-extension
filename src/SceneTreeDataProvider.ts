import * as vscode from 'vscode';
import ADependency from "./ADependency"
import Dependency from "./Dependency"
import EdGePanel from './EdGePanel';


export class SceneTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  
  async deleteScene(scene: any) {
    const result = await vscode.window.showQuickPick(['OK', 'Cancel'], {
      placeHolder: 'Do you want to delete the scene' + scene.name,
    });
    if (result === "OK") {
      EdGePanel.getPanel().webview.postMessage(
        {
          command: 'deleteScene',
          text: JSON.stringify(scene.nameable.uuid),
        }
      );
    }
  }
  async addScene() {
    const result = await vscode.window.showInputBox({
      value: "",
      placeHolder: 'What is the name of the new scene?',

    });
    if (result) {
      EdGePanel.getPanel().webview.postMessage(
        {
          command: 'addScene',
          text: JSON.stringify({ name: result }),
        }
      );
      this.refresh();
    }
  }
  async editScene(scene: any) {
    const result = await vscode.window.showInputBox({
      value: scene.name,
      placeHolder: 'Edit the name of  scene ' + scene.nameable.name,

    });
    if (result) {
      scene.nameable.name = result;
      EdGePanel.getPanel().webview.postMessage(
        {
          command: 'editScene',
          text: JSON.stringify({ name: result, uuid: scene.nameable.uuid }),
        }
      );
      this.refresh();
    }
  }

  tree = new ADependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  info: any[] = [];


  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  setInfo(info: any[]) {
    this.info = info;
    console.log(this.info);
    this._onDidChangeTreeData.fire();

  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    let toReturn = [];
    for (let scene of this.info) {
      let d = new ADependency(scene.name, "scene", scene, vscode.TreeItemCollapsibleState.None);
      toReturn.push(d);
    }
    return Promise.resolve(toReturn);
  }
}



