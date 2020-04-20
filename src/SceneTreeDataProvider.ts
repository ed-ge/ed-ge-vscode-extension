import * as vscode from 'vscode';
import ADependency from "./ADependency"
import Dependency from "./Dependency"
import { GameObjectTreeDataProvider } from './GameObjectTreeDataProvider';

export class SceneTreeDataProvider implements vscode.TreeDataProvider<Dependency> {

  
  tree = new ADependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  info: any[] = [];
  constructor() {
  }

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



