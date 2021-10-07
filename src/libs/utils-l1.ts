import BN from "bn.js";
import {
    L1AccountInfo,
    SubstrateAccountInfo,
    BridgeMetadata,
} from "./type";
import { getPoolList } from "./utils";

const TokenInfo = require("solidity/build/contracts/ERC20.json")
const Client = require("web3subscriber/client")

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
  l2Account: SubstrateAccountInfo,
  chainId: string,
  tokenAddress: string, // hex without 0x prefix
  amount: string,
  progress: (s:string, h:string, r:string, ratio:number) => void,
  error: (m:string) => void,
  querying: (m:string) => Promise<string>,
) {
  const accountAddress = l2Account.address;
  console.log('call deposit', accountAddress, chainId, tokenAddress, amount);
  try {
    let bridge = await getBridge(chainId);
    let token_address = "0x" + tokenAddress;
    let token_id = ss58.addressToAddressId(accountAddress);
    let r = bridge.deposit(token_address, parseInt(amount), token_id);
    r.when("snapshot", "Approve",
        () => progress("Approve", "Wait confirm ...", "", 10))
     .when("Approve", "transactionHash",
        (tx:string) => progress("Approve", "Transaction Sent", tx, 20))
     .when("Approve", "receipt",
        (tx:any) => progress("Approve", "Done", tx.blockHash, 30))
     .when("snapshot", "Deposit",
        () => progress("Deposit", "Wait confirm ...", "", 40))
     .when("Deposit", "transactionHash",
        (tx:string) => progress("Desposit", "Transaction Sent", tx, 50))
     .when("Deposit", "receipt",
        (tx:any) => progress("Deposit", "Done", tx.blockHash, 70));
    let tx = await r;
    console.log(tx);
    const p = async () => {
      let tx_status = await querying(tx.transactionHash);
      //FIXME: tx_status:Codec should be parsed to number
      console.log("tx_status", tx_status);
      if (tx_status === "0x00") {
        progress("Waiting for L2 confirm", "Waiting L2", "", 80);
        await setTimeout(() => {}, 1000);
        await p();
      }
      else if (tx_status === "0x01") {
        //FIXME: we need to put the receipt status into a list for further querying
        progress("Waiting for L2 processing", "Waiting L2", "", 100);
        return;
      }
      else if (tx_status === "0x02") {
        progress("Finalize", "Done", "", 100);
        return;
      }
      else throw("Unexpected TxStatus");
    };
    await p();
  } catch (e){
    error(e.message);
  }
}

export async function queryTokenL1Balance(
  chainId: string,
  tokenAddress: string,
  l1Account:L1AccountInfo
) {
  let config = configSelector.configMap[chainId];
  let web3 = await Client.initWeb3(config, true);
  let token= Client.getContractByAddress(web3, new BN(tokenAddress, 16).toString(16, 20), TokenInfo, l1Account.address);
  console.log("nid is", await web3.eth.net.getId());
  console.log("token is", token);
  let balance = await Client.getBalance(token, l1Account.address);
  return balance;
}

export async function queryBridgeStatus(
  l2Account: SubstrateAccountInfo,
  tokenChainId: string,
  tokenAddress: string,
  fromChainId: string,
) {
  const accountAddress = l2Account.address;
  let bridge = await getBridge(fromChainId);
  let fullTokenAddress = new BN(tokenChainId).shln(160).add(new BN(tokenAddress, 16));
  console.log(fullTokenAddress.toString(16), ss58.addressToAddressId(accountAddress));
  let balance = await bridge.balanceOf(ss58.addressToAddressId(accountAddress), "0x" + fullTokenAddress.toString(16));
  return balance;
}


export async function queryCurrentL1Account(
  chainId: string
) {
  let bridge = await getBridge(chainId);
  return bridge.encode_l1address(bridge.account);
}

export function loginL1Account(cb:(u: L1AccountInfo) => void) {
  Client.getAccountInfo(null, true).then((account:L1AccountInfo) => cb(account));
}

async function prepareMetaData() {
    let meta_bridge = await getBridge(configSelector.snap);
    let pool_list = await getPoolList();
    let pools = pool_list.map(info => {
      let poolidx = info[0];
      let t1 = meta_bridge.getTokenInfo(info[1]);
      let t2 = meta_bridge.getTokenInfo(info[2]);
      return {
          id: poolidx,
          tokens: [t1,t2],
      }
    });
    return {
      chainInfo: meta_bridge.getMetaData().chainInfo,
      poolInfo: pools,
      snap: configSelector.snap,
    }
}

export function loadMetadata(
    cb:(metadata: BridgeMetadata) => void
) {
    prepareMetaData().then(meta => cb(meta));
}

export function getTokenIndex(
  metadata: BridgeMetadata,
  chainId: string,
  tokenAddress: string
) {
  const chain = metadata.chainInfo.find(x => x.chainId === chainId);
  const token = chain?.tokens.find(t => t.address === tokenAddress);
  return token!.index;
}