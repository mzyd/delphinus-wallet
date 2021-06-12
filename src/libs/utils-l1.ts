const BN = require("bn.js");

const abi: any = require("solidity/clients/bridge/abi");
const ss58 = require("substrate-ss58");
const configSelector: any = require("../config/config-selector");

//const bridges = new Map<string, any>();

async function getBridge(chainId: string, mode = true) {
  //let bridge = bridges.get(chainId + mode.toString());
  //if (!bridge) {
  //try {
    try {
      let bridge = await abi.getBridge(configSelector.configMap[chainId], mode);
      //}
      //  bridges.set(chainId + mode.toString(), bridge);
      //}
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
  amount: string
) {
  console.log('call deposit');
  try {
    let bridge = await getBridge(chainId);
    let token_address = "0x" + tokenAddress;
    console.log('token_address is ' + token_address);
    //let token_id = bridge.encode_l1address(token_address);

    //let balance = await token.methods.balanceOf(bridge.account).call();
    //console.log("balance is", balance);
    //console.log("token id is", token_id.toString(16));
    let balance = await bridge.balanceOf(ss58.addressToAddressId(accountAddress), token_address);
    console.log("before deposit balance in bridge is", balance);
    console.log("test deposit...");

    try {
      await bridge.deposit(token_address, parseInt(amount), ss58.addressToAddressId(accountAddress));
    } catch (e) {
      alert(e.message);
      return;
    }

    balance = await bridge.balanceOf(ss58.addressToAddressId(accountAddress), token_address);
    console.log("after deposit balance in bridge is", balance);
  } catch {}
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
