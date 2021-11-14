import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { SubstrateNodeConfig as L2ServerConfig } from "delphinus-deployment/src/config";
import { getTokenIndex as getTokenIndexFromDeploy } from "delphinus-deployment/src/token-index";
import l2types from "./types.json";
import { queryCurrentL1Account } from "./utils-l1";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";


import { SubstrateAccountInfo } from "./type";

const BN = require("bn.js");
const ss58 = require("substrate-ss58");
const keyring = new Keyring({ type: "sr25519" });

let api: ApiPromise;

export async function getAPI() {
  if (!api?.isConnected) {
    const provider = new WsProvider(
      `${L2ServerConfig.address}:${L2ServerConfig.port}`
    );
    api = await ApiPromise.create({ provider, types: l2types });
  }
  return api;
}

export async function getSubstrateBalance(account: string) {
  const api = await getAPI();
  const account_info = await api.query.system.account(account);
  const balance = account_info.data.free.toHuman();
  return balance;
}

export async function getDepositTxStatus(tx: string) {
  const api = await getAPI();
  const tx_status = await api.query.swapModule.depositMap(tx);
  return tx_status.toHex();
}

async function getL2Accounts(callback: (u: string[]) => void) {
  const injectedSubstrate = await web3Enable("Delphinus");
  const substrateAccounts = await web3Accounts();
  console.log("number of accounts", substrateAccounts.length);
  if (substrateAccounts.length == 0) {
    await setTimeout(() => getL2Accounts(callback), 1000);
  } else {
    callback(substrateAccounts.map((c) => c.address));
  }
}

async function tryLoginL2Account(
  account: string,
  callback: (u: SubstrateAccountInfo) => void
) {
  const injectedSubstrate = await web3Enable("Delphinus");
  const substrateAccounts = await web3Accounts();
  for (var u of substrateAccounts) {
    if (u.address == account) {
      const injector = await web3FromAddress(u.address);
      const balance = await getSubstrateBalance(u.address);
      callback({
        account: u.meta.name!,
        address: u.address,
        injector: injector,
        balance: balance,
      });
    }
  }
}

export function fetchL2Accounts(callback: (u: string[]) => void) {
  getL2Accounts(callback);
}

export function loginL2Account(
  account: string,
  callback: (u: SubstrateAccountInfo) => void
) {
  tryLoginL2Account(account, callback);
}

function getTokenIndex(chainId: string, tokenAddress: string) {
  const gTokenAddress = compressToken(chainId, tokenAddress).toString(10);
  return Object.entries(getTokenIndexFromDeploy()).find((x) => x[0] === gTokenAddress)![1];
}

export async function queryTokenAmountAsync(
  l2Account: SubstrateAccountInfo,
  chainId: string,
  tokenAddress: string,
  callback: (number: string) => void
) {
  const accountAddress = l2Account.address;
  const fn = async () => {
    const api = await getAPI();

    const gTokenAddress = new BN(
      compressToken(chainId, tokenAddress, true),
      16
    ).toString(10);
    const accountIdx = (
      await api.query.swapModule.accountIndexMap(accountAddress)
    ).toString();
    const tokenIdx = getTokenIndex(chainId, tokenAddress);
    const result = await api.query.swapModule.balanceMap([
      accountIdx,
      tokenIdx,
    ]);

    callback(result.toString());
  };
  try {
    await fn();
  } catch (e) {
    callback("failed:" + tokenAddress + "[" + chainId + "]");
  }
}

export async function queryPoolAmountAsync(
  poolIndex: number,
  callback: (v1: string, v2: string) => void
) {
  try {
    const api = await getAPI();
    const result = (await (
      await api.query.swapModule.poolMap(poolIndex)
    ).toJSON()) as any;
    console.log(result);
    callback(result[2].toString(), result[3].toString());
  } catch (e) {
    callback("failed", "failed");
  }
}

export async function queryPoolShareAsync(
  l2Account: SubstrateAccountInfo,
  poolIndex: number,
  callback: (number: string) => void
) {
  try {
    const api = await getAPI();
    const accountIndex = (
      await api.query.swapModule.accountIndexMap(l2Account.address)
    ).toString();
    const share = (
      await api.query.swapModule.shareMap([accountIndex, poolIndex])
    ).toString();
    callback(share);
  } catch (e) {
    callback("failed");
  }
}

/*
async function getSudo() {
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri("//Alice", { name: "Alice default" });
}
*/

const handle_tx_reply = (on_failure: any) => (data: any) => {
  let status = data.status;
  let events = data.events;
  console.log("handle tx reply");
  console.log(events);
  if (status.isInBlock || status.isFinalized) {
    let err_evts = events
      // find/filter for failed events
      .filter((e: any) => {
        let event = e.event;
        api.events.system.ExtrinsicFailed.is(event);
      });
    if (err_evts.length > 0) {
      on_failure(err_evts[0].toString());
    }
  }
};

export async function withdraw(
  l2Account: SubstrateAccountInfo,
  chainId: string,
  token: string,
  amount: string,
  progress: (m: string) => void,
  error: (m: string) => void
) {
  const account = l2Account.account;
  try {
    const api = await getAPI();
    await cryptoWaitReady();
    const keyring = new Keyring({ type: "sr25519" });
    const signer = l2Account.injector.signer;
    const nonce = new BN(
      (await api.query.system.account(l2Account.address)).nonce
    );
    const accountId = ss58.addressToAddressId(l2Account.address);
    const l2nonce = await api.query.swapModule.nonceMap(accountId);
    const l1account = await queryCurrentL1Account(chainId);
    try {
      new BN(amount);
    } catch (e) {
      alert("Bad amount: " + amount);
      return;
    }
    const tx = api.tx.swapModule.withdraw(
      l2Account.address,
      l1account,
      getTokenIndex(chainId, token),
      new BN(amount),
      l2nonce
    );
    try {
      const ret = await tx.signAndSend(
        l2Account.address,
        { signer: signer },
        handle_tx_reply(console.log)
      );
      console.log(ret);
    } catch (e) {
      alert(e);
    }
  } catch {
    return;
  }
}

function checkNumberString(v: string, name: string, hex = false) {
  try {
    new BN(v, hex ? 16 : 10);
  } catch (e) {
    throw new Error(`Invalid ${name}: ${v}`);
  }
}

export function compressToken(chainId: string, token: string, query = false) {
  checkNumberString(chainId, "chainId");
  checkNumberString(token, "token", true);

  if (query) {
    const chainIdString = new BN(chainId).toString(16, 24);
    const tokenString = new BN(token, 16).toString(16, 40);
    return chainIdString + tokenString;
  }

  const chainIdString = new BN(chainId).toString(16, 24);
  const tokenString = new BN(token, 16).toString(16, 40);
  return new BN(chainIdString + tokenString, 16);
}

export async function swap(
  l2Account: SubstrateAccountInfo,
  tokenIndex0: number,
  tokenIndex1: number,
  amount: string
) {
  const api = await getAPI();
  await cryptoWaitReady();
  const signer = l2Account.injector.signer;
  const accountId = ss58.addressToAddressId(l2Account.address);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  try {
    checkNumberString(amount, "amount");
  } catch (e) {
    alert(e.message);
    return;
  }
  const tx = api.tx.swapModule.swap(
    l2Account.address,
    tokenIndex0,
    tokenIndex1,
    new BN(amount),
    l2nonce
  );
  try {
    const ret = await tx.signAndSend(
      l2Account.address,
      { signer: signer },
      handle_tx_reply(console.log)
    );
    console.log(ret);
  } catch (e) {
    alert(e);
    return;
  }
}

export async function supply(
  l2Account: SubstrateAccountInfo,
  tokenIndex0: number,
  tokenIndex1: number,
  amount_from: string,
  amount_to: string
) {
  const account = l2Account.account;
  const api = await getAPI();
  await cryptoWaitReady();
  console.log("l2 account name:", account);
  const signer = l2Account.injector.signer;
  const accountId = ss58.addressToAddressId(l2Account.address);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  try {
    checkNumberString(amount_from, "amount");
    checkNumberString(amount_to, "amount");
  } catch (e) {
    alert(e.message);
    return;
  }
  const tx = api.tx.swapModule.poolSupply(
    l2Account.address,
    tokenIndex0,
    tokenIndex1,
    amount_from,
    amount_to,
    l2nonce
  );
  try {
    const ret = await tx.signAndSend(
      l2Account.address,
      { signer: signer },
      handle_tx_reply(console.log)
    );
    console.log("transaction supply:", ret);
  } catch (e) {
    alert(e);
    return;
  }
}

export async function retrieve(
  l2Account: SubstrateAccountInfo,
  tokenIndex0: number,
  tokenIndex1: number,
  amount_from: string,
  amount_to: string
) {
  const account = l2Account.account;
  const api = await getAPI();
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  const signer = l2Account.injector.signer;
  const accountId = ss58.addressToAddressId(l2Account.address);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  try {
    checkNumberString(amount_from, "amount");
    checkNumberString(amount_to, "amount");
  } catch (e) {
    alert(e.message);
    return;
  }
  const tx = api.tx.swapModule.poolRetrieve(
    l2Account.address,
    tokenIndex0,
    tokenIndex1,
    amount_from,
    amount_to,
    l2nonce
  );
  try {
    const ret = await tx.signAndSend(
      l2Account.address,
      { signer: signer },
      handle_tx_reply(console.log)
    );
    console.log(ret);
  } catch (e) {
    alert(e);
    return;
  }
}

export async function charge(
  l2Account: SubstrateAccountInfo,
  amount: string,
  progress: (a: string) => void,
  error: (a: string) => void
) {
  const account = l2Account.account;
  try {
    progress("Waiting for process.");
    const api = await getAPI();
    await cryptoWaitReady();
    const signer = l2Account.injector.signer;
    try {
      new BN(amount);
    } catch (e) {
      error("Bad amount: " + amount);
      return;
    }
    const tx = api.tx.swapModule.charge(new BN(amount));
    try {
      const ret = await tx.signAndSend(
        l2Account.address,
        { signer: signer },
        handle_tx_reply(console.log)
      );
      console.log(ret);
    } catch (e) {
      error(e.toString());
      return;
    }
  } catch (e) {
    error(e.toString());
    return;
  }
}

let poolInfo: any[];

export async function getPoolList() {
  if (!poolInfo) {
    const api = await getAPI();
    const poolEntries = await api.query.swapModule.poolMap.entries();
    poolInfo = poolEntries.map((kv) => {
      const data = kv[1] as any;
      return [
        kv[0].args[0].toString(),
        data[0].toString(),
        data[1].toString(),
      ].map((x) => parseInt(x));
    });
  }

  return poolInfo;
}
