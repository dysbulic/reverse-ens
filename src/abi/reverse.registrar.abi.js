// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {"name":"claimWithResolver","constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"resolver","type":"address"}],"outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},
  {"name":"claim","constant":false,"inputs":[{"name":"owner","type":"address"}],"outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},
  {"name":"ens","constant":true,"inputs":[],"outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},
  {"name":"defaultResolver","constant":true,"inputs":[],"outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},
  {"name":"node","constant":true,"inputs":[{"name":"addr","type":"address"}],"outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"type":"function"},
  {"name":"setName","constant":false,"inputs":[{"name":"name","type":"string"}],"outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},
  {"type":"constructor","inputs":[{"name":"ensAddr","type":"address"},{"name":"resolverAddr","type":"address"}],"payable":false}
]