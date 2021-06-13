// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {name: 'resolver', constant: true, inputs: [{name: 'node', type: 'bytes32'}], outputs: [{name: '', type: 'address'}], payable: false, type: 'function'},
  {name: 'owner', constant: true, inputs: [{name: 'node', type: 'bytes32'}], outputs:[{name: '', type: 'address'}], payable: false, type: 'function'},
  {name: 'setSubnodeOwner', constant: false,inputs: [{name: 'node', type: 'bytes32'}, {name: "label",type: "bytes32"}, {name: "owner",type: "address"}], outputs: [], payable: false, type: "function"},
  {name: "setTTL", constant: false, inputs:[{name: "node",type: "bytes32"}, {name:"ttl","type":"uint64"}], outputs:[], payable: false, "type":"function"},
  {name: "ttl", constant: true,inputs: [{"name":"node","type":"bytes32"}],outputs: [{"name":"","type":"uint64"}],payable: false,type:"function"},
  {name: "setResolver", constant:false,inputs:[{"name":"node","type":"bytes32"},{name:"resolver","type":"address"}],"outputs":[],"payable":false,"type":"function"},
  {name: "setOwner", constant:false,inputs:[{"name":"node","type":"bytes32"},{name:"owner","type":"address"}],"outputs":[],"payable":false,"type":"function"},
  {name: "Transfer",type:"event",anonymous:false,"inputs":[{"indexed":true,"name":"node",type:"bytes32"},{"indexed":false,"name":"owner","type":"address"}]},
  {name: "NewOwner",type:"event", anonymous:false,inputs: [{"indexed":true,"name":"node",type:"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,name:"owner","type":"address"}]},
  {name: "NewResolver", type:"event", anonymous:false,inputs:[{"indexed":true,"name":"node",type:"bytes32"},{"indexed":false,"name":"resolver","type":"address"}]},
  {name: "NewTTL",type: "event", anonymous: false,"inputs":[{"indexed":true,"name":"node",type:"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}]}
]