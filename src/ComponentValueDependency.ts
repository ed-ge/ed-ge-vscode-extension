import * as vscode from "vscode";
import * as path from "path";
import Dependency from "./Dependency";

class ComponentValueDependency extends Dependency {
  
  contextValue = "componentValue";
  constructor(
    public readonly label: string,
    public value: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.value = value;

    this.iconPath = {
      light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'edit.svg'),
      dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'edit.svg')
    };
  }
}

export default ComponentValueDependency;