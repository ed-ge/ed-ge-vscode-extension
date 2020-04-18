import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { toASCII } from 'punycode';
import * as requireFromString from 'require-from-string';
const rollup = require('rollup');





export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  tree = new Dependency("root", {}, vscode.TreeItemCollapsibleState.Collapsed);
  info:any[] = [];
  constructor(private workspaceRoot: string) {

    

    
  }

  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  setInfo(info: any[]) {
    this.info = info.scenes.allScenes;
    console.log(this.info);
    this._onDidChangeTreeData.fire();

  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!element) {
      let toReturn = [];
      for(let scene of this.info){
        let d = new Dependency(scene.name, scene, vscode.TreeItemCollapsibleState.Collapsed);
        toReturn.push(d);
      }
      return Promise.resolve(toReturn);
    }
    else {
      let toReturn:any[] = [];
      if(!element.nameable.objects)
        return Promise.resolve(toReturn);
      for(let scene of element.nameable.objects){
        toReturn.push(new Dependency(scene.name, scene, vscode.TreeItemCollapsibleState.Collapsed));
      }
      return Promise.resolve(toReturn);
    }
  }
}

class Dependency extends vscode.TreeItem {
  children: Dependency[] = [];
  constructor(
    public readonly label: string,
    public nameable: any,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.nameable = nameable;
  }

  public addChildren(children: Dependency[]) {
    this.children = children;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'dependency.svg')
  };
}
