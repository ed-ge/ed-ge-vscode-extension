export default {
  name:"StrategyScene",
  objects: [
    {
      name:"Napster",
      type:'Napster',
      location:{x:0,y:0}
    },
    {
      name:"Main Controller",
      location: {x:100, y:100},
      type: 'EmptyGameObject',
      children:[],
      components:[
        {
          type:'BackToStartSceneBehavior',
        }
      ]
    }
  ]
}