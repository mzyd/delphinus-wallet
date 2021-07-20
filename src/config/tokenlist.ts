import L1TokenInfo from "solidity/build/contracts/Token.json";
import RioTokenInfo from "solidity/build/contracts/Rio.json";
const tokenList = [
  {
    chainId: "15",
    chainName: "local-test-net1",
    enable: true,
    tokens: [
      {
        address:L1TokenInfo.networks["15"].address.replace("0x", ""),
        name:"tToken"
      },
      {
        address:RioTokenInfo.networks["15"].address.replace("0x", ""),
        name:"rio"
      }
    ],
  },
  {
    chainId: "16",
    chainName: "local-test-net2",
    enable:true,
    tokens: [
      {
        address:L1TokenInfo.networks["16"].address.replace("0x", ""),
        name:"sToken"
      }
    ],
  }
/*
  ,
  {
    chainId: "3",
    chainName: "ropsten",
    enable:false,
    tokens: [
      {
        address:L1TokenInfo.networks["3"].address.replace("0x", ""),
      },
      {
        address:RioTokenInfo.networks["3"].address.replace("0x", ""),
      }
    ],
  },
  {
    chainId: "97",
    chainName: "bsctestnet",
    enable:false,
    tokens: [
      {
        address:L1TokenInfo.networks["97"].address.replace("0x", ""),
      }
    ],
  },
*/
];

export default tokenList;


