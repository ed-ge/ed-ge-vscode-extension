import * as vscode from 'vscode';
import Dependency from "./Dependency"
import ComponentValueDependency from './ComponentValueDependency';
import ADependency from './ADependency';
import EdGePanel from "./EdGePanel.js"

export class ComponentTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
  
  async addComponent() {
    
    const result = await vscode.window.showQuickPick(EdGePanel.Components,{
      placeHolder: "Pick a new component",
    })

    vscode.window.showInformationMessage(`Got: ${result}`);

    EdGePanel.getPanel().webview.postMessage(
      {
        command: 'addComponent',
        text: JSON.stringify({ componentName: result, uuid: EdGePanel.gameObject.nameable.uuid, component:result }),
      }
    );
  }

  async editComponentValue(componentValue: any) {

    const result = await vscode.window.showInputBox({
      value: componentValue.value,
      placeHolder: 'Edit the value of ' + componentValue.key,
      // validateInput: text => {
      //   //vscode.window.showInformationMessage(`Validating: ${text}`);
      //   return text.trim() === '' ? 'The value cannot be blank!' : null;
      // }
    });
    vscode.window.showInformationMessage(`Edited the value of ${componentValue.key} to be: ${result}`);
    componentValue.component.nameable[componentValue.key] = result;
    EdGePanel.getPanel().webview.postMessage(
      {
        command: 'editComponentValue',
        text: JSON.stringify({ key: componentValue.key, value: result, uuid: componentValue.component.nameable.uuid }),
      }
    );
    this.refresh();

  }

  tree = new ADependency("root", "scene", {}, vscode.TreeItemCollapsibleState.Collapsed);
  gameObject: any;
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

  selectGameObject(gameObject: any): any {
    this.gameObject = gameObject;
    
    EdGePanel.selectGameObject(gameObject);
    
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    let toReturn = [];
    if (!element && this.gameObject) {
      toReturn.push(new ComponentValueDependency("x", this.gameObject.nameable.x, this.gameObject));
      toReturn.push(new ComponentValueDependency("y", this.gameObject.nameable.y, this.gameObject));
      toReturn.push(new ComponentValueDependency("scaleX", this.gameObject.nameable.scaleX, this.gameObject));
      toReturn.push(new ComponentValueDependency("scaleY", this.gameObject.nameable.scaleY, this.gameObject));
      toReturn.push(new ComponentValueDependency("rotation", this.gameObject.nameable.rotation, this.gameObject));
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
        if (key != "uuid")
          toReturn.push(new ComponentValueDependency(key, element.nameable[key], element))
      }
      return Promise.resolve(toReturn);
    }
  }
}