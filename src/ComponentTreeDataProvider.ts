import * as vscode from 'vscode';
import Dependency from "./Dependency"
import ComponentValueDependency from './ComponentValueDependency';
import ADependency from './ADependency';

export class ComponentTreeDataProvider implements vscode.TreeDataProvider<Dependency> {

  tree = new ADependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  gameObject: any;
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  selectGameObject(gameObject: any): any {
    this.gameObject = gameObject;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    let toReturn =[];
    if (!element && this.gameObject) {
      for (let i = 0; i < this.gameObject.nameable.components.length; i++) {
        let component = this.gameObject.nameable.components[i];
        let objectComponent = this.gameObject.nameable.objectComponents[i];
        let name = objectComponent.split("|")[0];
        toReturn.push(new ADependency(name, "component", component, vscode.TreeItemCollapsibleState.Expanded));
      }
      return Promise.resolve(toReturn);
    }
    else if (!element) {
      return Promise.resolve([]);
    }
    else {
      for (let key in element.nameable) {
        toReturn.push(new ComponentValueDependency(key, element.nameable[key]))
      }
      return Promise.resolve(toReturn);
    }
  }
}