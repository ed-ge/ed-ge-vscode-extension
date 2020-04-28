import * as vscode from 'vscode';
import ADependency from "./ADependency"
import Dependency from "./Dependency"
import EdGePanel from './EdGePanel';


export class SceneTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  async editScene(scene: any) {
    const result = await vscode.window.showInputBox({
      value: scene.name,
      placeHolder: 'Edit the name of  scene ' + scene.nameable.name,
      
    });
    scene.nameable.name = result;
    EdGePanel.getPanel().webview.postMessage(
      {
        command: 'editSceneName',
        text: JSON.stringify({ name: result, uuid: scene.nameable.uuid }),
      }
    );
    this.refresh();
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



