const BN = require("bn.js");

const abi: any = require("solidity/clients/bridge/abi");
const ss58 = require("substrate-ss58");
const configSelector: any = require("../config/config-selector");

async function getBridge(chainId: string, mode = true) {
    try {
      let bridge = await abi.getBridge(configSelector.configMap[chainId], mode);
      return bridge;
    } catch(e) {
      if (e.message === "UnmatchedNetworkId") {
        alert("Please switch your metamask to correct chain!");
      }
      throw e;
    }
}

export async function deposit(
  accountAddress: string,
  chainId: string,
  tokenAddress: string,
  amount: string,
  progress: (string) => void,
  error: (string) => void
) {
  console.log('call deposit');
  try {
    let bridge = await getBridge(chainId);
    let token_address = "0x" + tokenAddress;
    console.log('token_address is ' + token_address);
    let token_id = ss58.addressToAddressId(accountAddress);
    let r = bridge.deposit(token_address, parseInt(amount), token_id);
    r.when("Approve", "Sending", () => progress("Waiting For Approve ..."))
     .when("Approve", "transactionHash", (tx) => progress("Approving Tx:" + tx))
     .when("Approve", "receipt", (tx) => progress("Tx Approved:" + tx))
     .when("snapshot", "Approving", () => progress("Approving ..."));
    await r;
  } catch (e){
    error(e.message);
  }
}

export async function queryBalanceOnL1(
  accountAddress: string,
  tokenChainId: string,
  tokenAddress: string,
  fromChainId: string,
) {
  //console.log(tokenChainId, tokenAddress, fromChainId);
  let bridge = await getBridge(tokenChainId, false);
  let fullTokenAddress = new BN(tokenChainId).shln(160).add(new BN(tokenAddress, 16));
  let balance = await bridge.balanceOf(ss58.addressToAddressId(accountAddress), "0x" + fullTokenAddress.toString(16));
  return balance;
}


export async function queryCurrentL1Account(
  chainId: string
) {
  let bridge = await getBridge(chainId);

  return bridge.encode_l1address(bridge.account);
}
