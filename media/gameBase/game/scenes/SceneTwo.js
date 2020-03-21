
export default {
  name: "SceneTwo",

  objects: [
    {
      name: "counter",
      type: 'Text',
      location: { x: 10, y:80},
      componentValues: [
        {
          type: 'TextComponent',
          values: [
            {
              key: "text",
              value: "A"
            }
          ]
        }
      ]
    },
    {
      name: "timer",
      type: 'Timer',
      location: { x: 10, y:40},
      componentValues: [
        {
          type: 'CountDownTimer',
          values: [
            {
              key: "toSceneText",
              value: "SceneTwoB"
            }
          ]
        }
      ]
    },
    {
      name: "Main Controller",
      location: { x: 100, y:100},
      type: 'EmptyGameObject',
      children: [],
      components: [
        {
          type: 'BackToStartSceneBehavior',
        }
      ]
    }
  ]
}