// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {name: "ens", constant: true, inputs: [],outputs:[{name:"",type:"address"}],payable:false,type:"function"},
  {name: "expiryTimes", constant: true, inputs: [{name:"",type:"bytes32"}],outputs:[{name:"",type:"uint256"}],payable:false,type:"function"},
  {name: "register", constant:false,inputs:[{name:"subnode",type:"bytes32"},{name:"owner",type:"address"}],outputs:[],payable:false,type:"function"},
  {name: "rootNode",constant: true, inputs:[], outputs:[{name:"",type:"bytes32"}],payable:false,type:"function"},
  {type: "constructor", inputs:[{name:"ensAddr",type:"address"},{name:"node",type:"bytes32"}]}
]