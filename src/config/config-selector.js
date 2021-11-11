const EthConfig = require("solidity/clients/config");
const Secrets =  {
  "infura_id":"1c8e4178f8954e01a95c8eef7b8af2b7",
  "getblock_key":"182a8e0d-c03a-44ac-b856-41d2e47801db",
  "accounts": {
     "deployer": {
       "priv": "0xf6392ba9b8cb91490a3e06fe141d5140df89e73931b0e3570bad0de7ef1f25c3"
     },
  }
}

module.exports = {
  /* No secrets should leak into userland via chainname(secrets) */
  configMap: {
    "3": EthConfig.EthConfig.ropsten(Secrets),
    "97": EthConfig.EthConfig.bsctestnet(Secrets),
    "15": EthConfig.EthConfig.localtestnet1(Secrets),
    "16": EthConfig.EthConfig.localtestnet2(Secrets),
  },
  //snap: "15"
  snap: "3"
}
