// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {"name":"supportsInterface","constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},
  {"name":"ABI","constant":true,"inputs":[{"name":"node","type":"bytes32"},{"name":"contentTypes","type":"uint256"}],"outputs":[{"name":"contentType","type":"uint256"},{"name":"data","type":"bytes"}],"payable":false,"type":"function"},
  {"name":"setPubkey","constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"x","type":"bytes32"},{"name":"y","type":"bytes32"}],"outputs":[],"payable":false,"type":"function"},
  {"name":"content","constant":true,"inputs":[{"name":"node","type":"bytes32"}],"outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"type":"function"},
  {"name":"addr","constant":true,"inputs":[{"name":"node","type":"bytes32"}],"outputs":[{"name":"ret","type":"address"}],"payable":false,"type":"function"},
  {"name":"setABI","constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"contentType","type":"uint256"},{"name":"data","type":"bytes"}],"outputs":[],"payable":false,"type":"function"},
  {"name":"name","constant":true,"inputs":[{"name":"node","type":"bytes32"}],"outputs":[{"name":"ret","type":"string"}],"payable":false,"type":"function"},
  {"name":"setName","constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"name","type":"string"}],"outputs":[],"payable":false,"type":"function"},
  {"name":"setContent","constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"hash","type":"bytes32"}],"outputs":[],"payable":false,"type":"function"},
  {"name":"pubkey","constant":true,"inputs":[{"name":"node","type":"bytes32"}],"outputs":[{"name":"x","type":"bytes32"},{"name":"y","type":"bytes32"}],"payable":false,"type":"function"},
  {"name":"setAddr","constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"addr","type":"address"}],"outputs":[],"payable":false,"type":"function"},
  {"type":"constructor","inputs":[{"name":"ensAddr","type":"address"}],"payable":false},
  {"name":"AddrChanged","type":"event","anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"a","type":"address"}]},
  {"name":"ContentChanged","type":"event","anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"hash","type":"bytes32"}]},
  {"name":"NameChanged","type":"event","anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"name","type":"string"}]},
  {"name":"ABIChanged","type":"event","anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"contentType","type":"uint256"}]},
  {"name":"PubkeyChanged","type":"event","anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"x","type":"bytes32"},{"indexed":false,"name":"y","type":"bytes32"}]}
]