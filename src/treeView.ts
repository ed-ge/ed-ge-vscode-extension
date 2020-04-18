import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  tree = {};
  constructor(private workspaceRoot: string ) {
    this.tree = {
      name:"root",
      children:[
        {
          name:"child",
          children:[]
        }
      ]
    }
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if(!element){
      return Promise.resolve([new Dependency("Root", vscode.TreeItemCollapsibleState.Collapsed)]);
    }
    else{
      return Promise.resolve([]);
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const toDep = (moduleName: string, version: string): Dependency => {
        if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Dependency(
            moduleName,
            vscode.TreeItemCollapsibleState.Collapsed
          );
        } else {
          return new Dependency(moduleName,  vscode.TreeItemCollapsibleState.None);
        }
      };

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map(dep =>
            toDep(dep, packageJson.dependencies[dep])
          )
        : [];
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep =>
            toDep(dep, packageJson.devDependencies[dep])
          )
        : [];
      return deps.concat(devDeps);
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'media', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'media', 'resources', 'dark', 'dependency.svg')
  };
}
