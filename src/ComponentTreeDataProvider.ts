import * as vscode from 'vscode';
import Dependency from "./Dependency"

export class ComponentTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  selectGameObject(gameObject: any): any {
    this.gameObject = gameObject;
    this._onDidChangeTreeData.fire();
  }
  tree = new Dependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  info: any[] = [];
  gameObject: any;
  constructor() {
  }

  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }



  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    let toReturn = [];
    if (!element && this.gameObject) {
      for (let i = 0; i < this.gameObject.nameable.components.length; i++) {
        let component = this.gameObject.nameable.components[i];
        let objectComponent = this.gameObject.nameable.objectComponents[i];
        let name = objectComponent.split("|")[0];
        toReturn.push(new Dependency(name, "component", component, vscode.TreeItemCollapsibleState.Collapsed));
      }
      return Promise.resolve(toReturn);
    }
    else if(!element){
      return Promise.resolve([]);
    }
    else {
      for (let key in element.nameable) {
        toReturn.push(new Dependency(key + "-" + element.nameable[key], "componentValue", element.nameable[key], vscode.TreeItemCollapsibleState.None))
      }
      return Promise.resolve(toReturn);
    }

  }
}



