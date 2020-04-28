There are three parts that need to be updated simultaneously:
- The files
- The webview
- The tree view

Essentially, the model is the file system.

The webview is a static view for now.

The treeview is both a view and a controller.

This is how things go on the initial boot:

- The user opens the ed-ge webview

- The private extension coonstructor gets called

- In extension.ts, _update get called()

- _update called _getHtmlForWebview() to get the html, which is pulled from media/index.html, which references media/preview.js

- preview.js call new Preview()

- The preview constructor calls preview.get()

-preview.get sets the vscode member variable and posts message 'getScenes' to the vscode extension.

- extension.ts (178) switches on 'getScenes' and setsup a code-based rollup. It writes the rollup to rollup.js. It turns around and reads rollup.js as a text file.
It then sends the contents of rollup.js back to preview.js with an 'allScenes' message.

- preview.js (201) switches on 'allScenes'. It imports the rollup text as a base64-encoded module. It extracts the last of scenes as a member variable (app.scenes). In calls Base.main to start te game with updating turned off.

- preview.js sends a message back to extension.ts called 'object' with all the scenes modified to remove circular loops.

  - extension.ts switches on 'object'. It calls setInfo on the static CatCodingPanel treeView setInfo reference.

  - SceneTreeDataProvider sets its info to the scene data. It calls its internal refresh function

  - SceneTreeDataProvider refreshes and getChildren is called with a null argument. It returns an array of thenable references to each scene

- preview.js sends a message back to extension.js called 'Components' with Base.Components

  - preview.ts swithes on Components and sets the static member variable Components on CatCodingPanel to be the Components

- When a user clicks on a scene name, sceneTreeDataProvider.selectScene is called, as defined in ADependency (22)

  - That click calls gameObjectTreeDataProvider.selectScene with a reference to that scene

  - GameObjectTreeDataProvider sends a 'selectScene' message to preview.js

    - preview.js sets the current scene to be the selected scene.

  -GameObjectTreeDataProvider refreshes.

    -GameObjectTreeDataProvider.getChild is called with a null argument

    -GameObjectTreeDataProvider.getChild returns a list of gameObjects in the scene wrapped in ADependency

- When a user clicks on a game object name, gameObjectTReeDataProvider.selectGameObject gets fired.

  - ComponentTreeDataProvider.selectGameObject is called with a reference to the component.

  - ComponentTreeDataProvider.selectGameObject  sets its gameObject member variables and refreshes itself.

  - ComponentTreeDataProvidergetChild gets called with a null argument

    - getChild returns the transform variables and a list of component names wrapped in ADependency

    - getChild is called for each Component. The actual component values are recutred as an array of ComponentValueDependency values

    -



