import * as vscode from 'vscode';
import Dependency from "./Dependency"
import ADependency from "./ADependency"
import EdGePanel from './EdGePanel';

export class GameObjectTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  async deleteGameObject(gameObject: any) {
    const result = await vscode.window.showQuickPick(['OK', 'Cancel'], {
      placeHolder: 'Do you want to delete the game object' + gameObject.nameable.name,
    });
    if (result === "OK") {
      EdGePanel.getPanel().webview.postMessage(
        {
          command: 'deleteGameObject',
          text: JSON.stringify(gameObject.nameable.uuid),
        }
      );
    }
  }

  async addGameObject() {
    const result = await vscode.window.showInputBox({
      value: "",
      placeHolder: 'What is the name of the new game object?',

    });
    if (result) {
      EdGePanel.getPanel().webview.postMessage(
        {
          command: 'addGameObject',
          text: JSON.stringify({ name: result }),
        }
      );
      this.refresh();
    }
  }


  async editGameObject(gameObject: any) {

    const result = await vscode.window.showInputBox({
      value: gameObject.name,
      placeHolder: 'Edit the name of  gameObject ' + gameObject.nameable.name,

    });
    gameObject.nameable.name = result;
    EdGePanel.getPanel().webview.postMessage(
      {
        command: 'editComponentValue',
        text: JSON.stringify({ key: 'name', value: result, uuid: gameObject.nameable.uuid }),
      }
    );
    this.refresh();


  }

  selectScene(scene: any) {
    if(this.scene == scene) return;
    this.scene = scene;
    EdGePanel.getPanel().webview.postMessage({ command: 'selectScene', text: scene.nameable.uuid });
    this._onDidChangeTreeData.fire();

  }
  tree = new ADependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  info: any[] = [];
  components: any;
  scene: any;


  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.scene) return Promise.resolve([]);

    let toReturn: any[] = [];
    if (!element) {
      for (let i = 0; i < this.scene.nameable.children.length; i++) {
        let child = this.scene.nameable.children[i];
        let object = this.scene.nameable.objects[i];
        child.objectComponents = object.components;
        let hasChildren = child.children.length > 0;
        toReturn.push(new ADependency(child.name, "gameObject", child, hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None));
      }
    }
    else {
      for (let i = 0; i < element.nameable.children.length; i++) {
        let child = element.nameable.children[i];
        let object = element.nameable.objects[i];
        child.objectComponents = object.components;
        let hasChildren = child.children.length > 0;
        toReturn.push(new ADependency(child.name, "gameObject", child, hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None));
      }
    }
    return Promise.resolve(toReturn);
  }

}



