export default {
  name: "Rectangle",
  components: [
    {
      type: "RectangleComponent",
      values: [
        {
          key: "width",
          value: "100"
        },
        {
          key: "height",
          value: "100"
        },
        {
          key: "fill",
          value: "red"
        },
        {
          key: "stroke",
          value: "blue"
        },
      ]
    },
    {
      type: "AABBCollider",
      values: [
        {
          key: "width",
          value: "100",
        },
        {
          key: "height",
          value: "100"
        }
      ]
    }
  ]
}