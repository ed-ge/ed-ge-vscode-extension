
export default {
  name: "Tile",
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
          value: "green"
        },
        {
          key: "stroke",
          value: "black"
        },
      ]
    },
    {
      type: "TileBehavior",

    },
  ]
}