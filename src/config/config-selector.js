const EthConfig = require("solidity/clients/config");

module.exports = {
  configMap: {
//    "3": EthConfig.ropsten,
//    "97": EthConfig.bsctestnet
    "15": EthConfig.localtestnet1,
    "16": EthConfig.localtestnet2
  }
}
