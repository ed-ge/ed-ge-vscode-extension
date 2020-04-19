import * as vscode from 'vscode';
import Dependency from "./Dependency"

export class GameObjectTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  tree = new Dependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
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

  refresh(){
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!element) {
      let toReturn = [];
      for (let scene of this.info) {
        let d = new Dependency(scene.name, "scene", scene, vscode.TreeItemCollapsibleState.Collapsed);
        toReturn.push(d);
      }
      return Promise.resolve(toReturn);
    }
    else {
      let toReturn: any[] = [];
      if(element.type == "scene" || element.type == "gameObject"){
      //if (element.nameable.children) {
        for(let i = 0; i< element.nameable.children.length; i++){
          let child = element.nameable.children[i];
          let object = element.nameable.objects[i];
          child.objectComponents = object.components;
          toReturn.push(new Dependency(child.name,"gameObject", child, vscode.TreeItemCollapsibleState.Collapsed));
        }
      }
      if(element.type == "gameObject"){
      //if (element.nameable.components && element.nameable.components instanceof Array) {
        for (let i = 0; i < element.nameable.components.length; i++) {
          let component = element.nameable.components[i];
          let objectComponent = element.nameable.objectComponents[i];
          let name = objectComponent.split("|")[0];
          toReturn.push(new Dependency(name, "component", component, vscode.TreeItemCollapsibleState.Collapsed));
        }
      }
      if(element.type == "component"){
        for(let key in element.nameable){
          toReturn.push(new Dependency(key + "-" + element.nameable[key], "componentValue", element.nameable[key], vscode.TreeItemCollapsibleState.None))
        }

      }
      return Promise.resolve(toReturn);
    }
  }
}



