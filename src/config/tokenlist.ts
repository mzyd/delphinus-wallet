import L1TokenInfo from "solidity/build/contracts/Token.json";
const tokenList = [
  {
    chainId: "15",
    //chainId: "3",
    //address: L1TokenInfo.networks["3"].address.replace("0x", ""),
    address: L1TokenInfo.networks["15"].address.replace("0x", ""),
  },
  {
    chainId: "16",
    //chainId: "97",
    //address: L1TokenInfo.networks["97"].address.replace("0x", ""),
    address: L1TokenInfo.networks["16"].address.replace("0x", ""),
  },
];

export default tokenList;


