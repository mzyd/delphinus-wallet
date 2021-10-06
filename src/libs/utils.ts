import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import l2ServerConfig from "./substrate-node.json";
import l2types from "./types.json";
import { queryCurrentL1Account } from "./utils-l1";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import tokenIndex from "solidity/clients/token-index.json"

import { SubstrateAccountInfo } from "./type";

const BN = require("bn.js");
const ss58 = require("substrate-ss58");
const keyring = new Keyring({ type: "sr25519" });

let api: ApiPromise;

export async function getAPI() {
  if (!api?.isConnected) {
    const provider = new WsProvider(
      `${l2ServerConfig.host}:${l2ServerConfig.port}`
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

function getTokenIndex(
  chainId: string,
  tokenAddress: string,
) {
  const gTokenAddress = compressToken(chainId, tokenAddress).toString(10);
  return Object.entries(tokenIndex).find(x => x[0] === gTokenAddress)![1];
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

    const gTokenAddress = new BN(compressToken(chainId, tokenAddress, true), 16).toString(10);
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
  chainId1: string,
  tokenAddress1: string,
  chainId2: string,
  tokenAddress2: string,
  callback: (v1: string, v2: string) => void
) {
  const fn = async () => {
    const api = await getAPI();
    if (
      compressToken(chainId1, tokenAddress1) >
      compressToken(chainId2, tokenAddress2)
    ) {
      const result = await api.query.swapModule.poolMap(
        "0x" +
          compressToken(chainId1, tokenAddress1, true) +
          compressToken(chainId2, tokenAddress2, true)
      );
      console.log("pool liquidity:", result.toString());
      const values = result
        .toString()
        .replace(/[\[ \]]/g, "")
        .split(",");
      if (values.length !== 2) {
        throw new Error(`Got unexpected pool liquids: ${result.toString()}`);
      }
      callback(values[0], values[1]);
    } else {
      const result = await api.query.swapModule.poolMap(
        "0x" +
          compressToken(chainId2, tokenAddress2, true) +
          compressToken(chainId1, tokenAddress1, true)
      );
      console.log("pool liquidity:", result.toString());
      const values = result
        .toString()
        .replace(/[\[ \]]/g, "")
        .split(",");
      if (values.length !== 2) {
        throw new Error(`Got unexpected pool liquids: ${result.toString()}`);
      }
      callback(values[1], values[0]);
    }
  };
  try {
    await fn();
  } catch (e) {
    callback("failed", "failed");
  }
}

export async function queryPoolShareAsync(
  l2Account: SubstrateAccountInfo,
  chainId1: string,
  tokenAddress1: string,
  chainId2: string,
  tokenAddress2: string,
  callback: (number: string) => void
) {
  const accountAddress = l2Account.address;
  const fn = async () => {
    const api = await getAPI();
    const accountId = ss58.addressToAddressId(accountAddress);
    if (
      compressToken(chainId1, tokenAddress1) >
      compressToken(chainId2, tokenAddress2)
    ) {
      const result = await api.query.swapModule.shareMap(
        accountId +
          compressToken(chainId1, tokenAddress1, true) +
          compressToken(chainId2, tokenAddress2, true)
      );
      callback(result.toString());
    } else {
      const result = await api.query.swapModule.shareMap(
        accountId +
          compressToken(chainId2, tokenAddress2, true) +
          compressToken(chainId1, tokenAddress1, true)
      );
      callback(result.toString());
    }
  };
  try {
    await fn();
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

function compressToken(chainId: string, token: string, query = false) {
  checkNumberString(chainId, "chainId");
  checkNumberString(token, "token", true);

  if (query) {
    const chainIdString = new BN(chainId)
      .toString(16, 24);
    const tokenString = new BN(token, 16)
      .toString(16, 40);
    return chainIdString + tokenString;
  }

  const chainIdString = new BN(chainId).toString(16, 24);
  const tokenString = new BN(token, 16).toString(16, 40);
  return new BN(chainIdString + tokenString, 16);
}

export async function swap(
  l2Account: SubstrateAccountInfo,
  chain_from: string,
  token_from: string,
  chain_to: string,
  token_to: string,
  amount: string
) {
  const account = l2Account.account;
  const api = await getAPI();
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  const signer = l2Account.injector.signer;
  const accountId = ss58.addressToAddressId(l2Account.address);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  try {
    checkNumberString(token_from, "token_from", true);
    checkNumberString(token_to, "token_to", true);
    checkNumberString(chain_from, "chain_from");
    checkNumberString(chain_to, "chain_to");
    checkNumberString(amount, "amount");
  } catch (e) {
    alert(e.message);
    return;
  }
  const tx = api.tx.swapModule.swap(
    l2Account.address,
    compressToken(chain_from, token_from),
    compressToken(chain_to, token_to),
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
  chain_from: string,
  token_from: string,
  chain_to: string,
  token_to: string,
  amount_from: string,
  amount_to: string
) {
  const account = l2Account.account;
  const api = await getAPI();
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  console.log("l2 account name:", account);
  const signer = l2Account.injector.signer;
  const accountId = ss58.addressToAddressId(l2Account.address);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  try {
    checkNumberString(token_from, "token", true);
    checkNumberString(token_to, "token", true);
    checkNumberString(chain_from, "chain");
    checkNumberString(chain_to, "chain");
    checkNumberString(amount_from, "amount");
    checkNumberString(amount_to, "amount");
  } catch (e) {
    alert(e.message);
    return;
  }
  const tx = api.tx.swapModule.poolSupply(
    l2Account.address,
    compressToken(chain_from, token_from),
    compressToken(chain_to, token_to),
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
  chain_from: string,
  token_from: string,
  chain_to: string,
  token_to: string,
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
    checkNumberString(token_from, "token", true);
    checkNumberString(token_to, "token", true);
    checkNumberString(chain_from, "chain");
    checkNumberString(chain_to, "chain");
    checkNumberString(amount_from, "amount");
    checkNumberString(amount_to, "amount");
  } catch (e) {
    alert(e.message);
    return;
  }
  const tx = api.tx.swapModule.poolRetrieve(
    l2Account.address,
    compressToken(chain_from, token_from),
    compressToken(chain_to, token_to),
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
    poolInfo = poolEntries.map(kv => {
      const data = kv[1] as any;
      return [kv[0].args[0].toString(), data[0].toString(), data[1].toString()];
    })
  }

  return poolInfo;
}
