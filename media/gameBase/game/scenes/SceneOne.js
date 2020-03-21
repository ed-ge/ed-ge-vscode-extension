export default {
  name: "SceneOne",

  objects: [
    {
      name: "Rotating Square",
      location: { x: 200, y: 200 },
      type: 'RotatingSquare',
    },
    {
      name: "Text Timer",
      location: { x: 200, y: 200 },
      type: 'Text',
    },
    {
      name: "Oscillating Circle",
      location: { x: 100, y: 100 },
      type: 'OscillatingCircle',
      children: [
        {
          name: "Moon",
          location: { x: 0, y: 0 },
          type: 'Moon',
        },
      ]
    },
    {
      name: "Triangle",
      location: { x: 300, y: 300 },
      type: "EmptyGameObject",
      components: [
        {
          type: "TriangleComponent",
          values: [
            {
              key:"fill",
              value:"white"
            },
            {
              key:"stroke",
              value:"red"
            },
            {
              key: "pointAX",
              value: "0",
            },
            {
              key: "pointAY",
              value: "0",
            },
            {
              key: "pointBX",
              value: "100",
            },
            {
              key: "pointBY",
              value: "100",
            },
            {
              key: "pointCX",
              value: "200",
            },
            {
              key: "pointCY",
              value: "0 ",
            },
          ]
        }
      ]
    },
    {
      name: "Main Controller",
      location: { x: 100, y: 100 },
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