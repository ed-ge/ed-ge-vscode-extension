export default {
  name: "Timer",
  components:[
    {
      type:"TextComponent",
      values:[
        {
          key:"text",
          value:"10"
        },
        {
          key:"font",
          value:"30pt Times"
        },
        {
          key:"fill",
          value:"red"
        },
       
      ]
    },
    {
      type:"CountDownTimer",
    }
  ]

}