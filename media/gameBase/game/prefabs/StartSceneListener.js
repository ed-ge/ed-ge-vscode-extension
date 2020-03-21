import Base from "../../engine/Base.js"
import StartSceneInputListener from "../behaviors/StartSceneInputListener.js"

export default{
  name:"StartSceneListener",
  components:[
    {
      type:"StartSceneInputListener",
    }
  ]
}


/*export default class StartSceneListener extends Base.GameObject {
  constructor(x, y) {
    super(x, y);
    let startSceneInputListener = new StartSceneInputListener();
    this.addComponent(startSceneInputListener);


  }
}*/