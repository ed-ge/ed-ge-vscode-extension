import * as vscode from "vscode";
import * as path from "path";

class Dependency extends vscode.TreeItem {
  children: Dependency[] = [];
  constructor(
    public readonly label: string,
    public type: string,
    public nameable: any,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.nameable = nameable;
    if (type === "scene") {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'dependency.svg')
      };
      this.command = {
        command:"sceneTreeDataProvider.selectScene",
        title:"Select Scene",
        arguments:[this],
      };
    }
    if (type === "gameObject") {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'boolean.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'boolean.svg')
      };
      this.command = {
        command:"gameObjectTreeDataProvider.selectGameObject",
        title:"Select Game Object",
        arguments:[this],
      };
    }
    if (type === "component") {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'document.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'document.svg')
      };
    }
    if (type === "componentValue") {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'edit.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'edit.svg')
      };
    }
  }

  public addChildren(children: Dependency[]) {
    this.children = children;
  }

  


}

export default Dependency;