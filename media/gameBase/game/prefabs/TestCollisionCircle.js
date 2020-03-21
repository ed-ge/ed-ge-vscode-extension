export default {
  name: "TestCollisionCircle",
  components: [
    {
      type: "CircleComponent",
      values: [
        {
          key: "radius",
          value: "50"
        },
        {
          key: "fill",
          value: "black"
        },
        {
          key: "stroke",
          value: "black"
        },
      ]
    },
    {
      type: "MovementBehavior",
    },
    {
      type: "DotBehavior",
    },
    {
      type: "CircleCollider",
      values: [
        {
          key: "radius",
          value: "50",
        }
      ]
    },
  ]
}