import * as vscode from "vscode";
import * as path from "path";

abstract class Dependency extends vscode.TreeItem {
  public children: Dependency[] = [];
  public type:string = "";
  public nameable:any;
  public value:string="";

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  public addChildren(children: Dependency[]) {
    this.children = children;
  }

  


}

export default Dependency;