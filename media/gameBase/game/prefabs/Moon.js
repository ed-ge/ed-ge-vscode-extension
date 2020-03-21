export default {
  name: "Moon",
  components: [
    {
      type: "CircleComponent",
      values: [
        {
          key: "radius",
          value: "10"
        },
        {
          key: "fill",
          value: "white"
        },
        {
          key: "stroke",
          value: "black"
        },
      ]
    },
    {
      type: "OrbitBehavior",
    }
  ]
}
