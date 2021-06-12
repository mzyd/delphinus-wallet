const EthConfig = require("solidity/clients/config-web");

module.exports = {
  configMap: {
    "3": EthConfig.ropsten,
    "97": EthConfig.bsctestnet
  }
}
