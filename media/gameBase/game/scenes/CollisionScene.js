
export default {
  name: "CollisionScene",

  objects: [
    {
      name: "CollisionCircle",
      location: { x: 50, y: 50 },
      type: "CollisionCircle"
    },
    {
      name: "Rectangle",
      location: { x: 150, y: 50 },
      type: "Rectangle"
    },
    {
      name: "dot",
      location: { x: 200, y: 200 },
      type: "CollisionDot"
    },
    {
      name: "CollisionCircle",
      location: { x: 250, y: 50 },
      type: "CollisionCircle"
    },
    {
      name: "Rectangle",
      location: { x: 350, y: 50 },
      type: "Rectangle"
    },
    {
      name: "Main Controller",
      location: { x: 100, y: 100 },
      type: "EmptyGameObject",
      children: [],
      components: [
        {
          type: "BackToStartSceneBehavior",
        }
      ]
    }

  ]
}