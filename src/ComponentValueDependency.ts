import * as vscode from "vscode";
import * as path from "path";
import Dependency from "./Dependency";

class ComponentValueDependency extends Dependency {
  key:string
  contextValue = "componentValue";
  constructor(
    public label:string,
    public value:string,
    public component:any,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.value = value;
    this.key = this.label;
    this.label = this.key + " - " + this.value;

    this.iconPath = {
      light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'edit.svg'),
      dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'edit.svg')
    };
  }
}

export default ComponentValueDependency;