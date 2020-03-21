export default  {
  name: "StartScene",  
  objects : [
    {
      name: "Scene listener",
      location: {x:0, y:0},
      type: "StartSceneListener",
    },
    {
      name: "Click",
      location: {x:10, y:40},
      type: "Text",
      componentValues: [
        {
          type: "TextComponent",
          values: [
            {
              key: "text",
              value: "Click the mouse to start the collision game.",
            }
          ]
        }
      ]
    },
    {
      name: "Enter",
      location: {x:10, y:80},
      type: "Text",
      componentValues: [
        {
          type: "TextComponent",
          values: [
            {
              key: "text",
              value: "Push 'enter' ('return' on Mac) to start the strategy game.",
            }
          ]
        }
      ]
    },
    {
      name: "Space",
      location: {x:10, y:120},
      type: "Text",
      componentValues: [
        {
          type: "TextComponent",
          values: [
            {
              key: "text",
              value: "Push space to start the drawing test game.",
            }
          ]
        }
      ]
    },
    {
      name: "a",
      location: {x:10,y:160},
      type: "Text",
      componentValues: [
        {
          type: "TextComponent",
          values: [
            {
              key: "text",
              value: "Push 'a' to start the scene test game.",
            }
          ]
        }
      ]
    },
    {
      name: "r",
      location: {x:10,y:200},
      type: "Text",
      componentValues: [
        {
          type: "TextComponent",
          values: [
            {
              key: "text",
              value: "Push 'r' to start the room test game.",
            }
          ]
        }
      ]
    },
    {
      name: "c",
      location: {x:10,y:240},
      type: "Text",
      componentValues: [
        {
          type: "TextComponent",
          values: [
            {
              key: "text",
              value: "Push 'c' to start the circle collision test game.",
            }
          ]
        }
      ]
    },
  ]
}