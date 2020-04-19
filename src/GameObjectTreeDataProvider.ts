import * as vscode from 'vscode';
import Dependency from "./Dependency"
import { ComponentTreeDataProvider } from './ComponentTreeDataProvider';
import { SceneTreeDataProvider } from './SceneTreeDataProvider';

export class GameObjectTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  
  selectScene(scene: any) {
    this.scene = scene;
    this._onDidChangeTreeData.fire();

  }
  tree = new Dependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  info: any[] = [];
  components: ComponentTreeDataProvider;
  
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
    if (!this.scene) return Promise.resolve([]);

    let toReturn: any[] = [];
    if (!element) {
      for (let i = 0; i < this.scene.nameable.children.length; i++) {
        let child = this.scene.nameable.children[i];
        let object = this.scene.nameable.objects[i];
        child.objectComponents = object.components;
        let hasChildren = child.children.length > 0;
        toReturn.push(new Dependency(child.name, "gameObject", child, hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None));
      }
    }
    else{
      for (let i = 0; i < element.nameable.children.length; i++) {
        let child = element.nameable.children[i];
        let object = element.nameable.objects[i];
        child.objectComponents = object.components;
        let hasChildren = child.children.length > 0;
        toReturn.push(new Dependency(child.name, "gameObject", child, hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None));
      }
    }

    /*if (element.type == "gameObject") {
      //if (element.nameable.components && element.nameable.components instanceof Array) {
      for (let i = 0; i < element.nameable.components.length; i++) {
        let component = element.nameable.components[i];
        let objectComponent = element.nameable.objectComponents[i];
        let name = objectComponent.split("|")[0];
        toReturn.push(new Dependency(name, "component", component, vscode.TreeItemCollapsibleState.Collapsed));
      }
    }
    if (element.type == "component") {
      for (let key in element.nameable) {
        toReturn.push(new Dependency(key + "-" + element.nameable[key], "componentValue", element.nameable[key], vscode.TreeItemCollapsibleState.None))
      }

    }*/
    return Promise.resolve(toReturn);
  }

}



