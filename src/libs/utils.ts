import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import l2ServerConfig from "./substrate-node.json";
import l2types from "./types.json";
import { queryCurrentL1Account } from "./utils-l1";

const BN = require("bn.js");
const ss58 = require("substrate-ss58");
const keyring = new Keyring({ type: "sr25519" });

export function getAddressOfAccoutAsync(
  account: string,
  callback: (uri: string, address: string) => void
) {
  cryptoWaitReady().then(() =>
    callback(account, keyring.addFromUri(`//${account}`).address)
  );
}

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

export async function queryTokenAmountAsync(
  accountAddress: string,
  chainId: string,
  tokenAddress: string,
  callback: (number: string) => void
) {
  const fn = async () => {
    const api = await getAPI();
    const accountId = ss58.addressToAddressId(accountAddress);
    /* This should get wrapped into apis */
    const result = await api.query.swapModule.balanceMap(
      accountId + compressToken(chainId, tokenAddress, true)
    );
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
    if (compressToken(chainId1, tokenAddress1) < compressToken(chainId2, tokenAddress2)) {
      const result = await api.query.swapModule.poolMap(
        "0x" +
        compressToken(chainId1, tokenAddress1, true) +
        compressToken(chainId2, tokenAddress2, true)
      );
      console.log("pool liquidity:", result.toString());
      const values = result.toString().replace(/[\[ \]]/g, "").split(',');
      if (values.length !== 2) {
        throw new Error(`Got unexpected pool liquids: ${result.toString()}`)
      }
      callback(values[0], values[1]);
    } else {
      const result = await api.query.swapModule.poolMap(
        "0x" +
        compressToken(chainId2, tokenAddress2, true) +
        compressToken(chainId1, tokenAddress1, true)
      );
      console.log("pool liquidity:", result.toString());
      const values = result.toString().replace(/[\[ \]]/g, "").split(',');
      if (values.length !== 2) {
        throw new Error(`Got unexpected pool liquids: ${result.toString()}`)
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
  accountAddress: string,
  chainId1: string,
  tokenAddress1: string,
  chainId2: string,
  tokenAddress2: string,
  callback: (number: string) => void
) {
  const fn = async () => {
    const api = await getAPI();
    const accountId = ss58.addressToAddressId(accountAddress);
    if (compressToken(chainId1, tokenAddress1) < compressToken(chainId2, tokenAddress2)) {
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

export async function deposit(
  accountAddress: string,
  chainId: string,
  token: string
) {
  const api = await getAPI();
  const sudo = await getSudo();
  const sudoAddress = (sudo as any).address;
  const nonce = new BN(
    (await api.query.system.account(sudoAddress)).nonce
  );
  const accountId = ss58.addressToAddressId(sudoAddress);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  const tx = api.tx.swapModule.deposit(
    accountAddress,
    compressToken(chainId, token),
    100,
    l2nonce
  );
  tx.signAndSend(sudo, { nonce });
}
*/

export async function withdraw(
  account: string,
  chainId: string,
  token: string,
  amount: string,
  progress: (m:string)=>void,
  error: (m:string)=>void,
) {
  try {
    const api = await getAPI();
    await cryptoWaitReady();
    const keyring = new Keyring({ type: "sr25519" });
    const signer = keyring.addFromUri(`//${account}`);
    const nonce = new BN((await api.query.system.account(signer.address)).nonce);
    const accountId = ss58.addressToAddressId(signer.address);
    const l2nonce = await api.query.swapModule.nonceMap(accountId);
    const l1account = await queryCurrentL1Account(chainId);
    try {
      new BN(amount);
    } catch (e) {
      alert("Bad amount: " + amount);
      return;
    }
    const tx = api.tx.swapModule.withdraw(
      signer.address,
      l1account,
      compressToken(chainId, token),
      new BN(amount),
      l2nonce
    );
    try {
      const ret = await tx.signAndSend(signer, { nonce });
      console.log(ret);
    } catch (e) {
      alert(e);
    }
  } catch {
    return;
  }
}

function checkNumberString(v: string, name: string, hex=false) {
  try {
    new BN(v, hex ? 16: 10);
  } catch (e) {
    throw new Error(`Invalid ${name}: ${v}`);
  }
}

function compressToken(chainId: string, token: string, query = false) {
  checkNumberString(chainId, "chainId");
  checkNumberString(token, "token", true);

  if (query) {
    const chainIdString = new BN(chainId)
      .toString(16, 24)
      .match(/.{2}/g)
      .reverse()
      .join("");
    const tokenString = new BN(token, 16)
      .toString(16, 40)
      .match(/.{2}/g)
      .reverse()
      .join("");
    return tokenString + chainIdString;
  }

  const chainIdString = new BN(chainId).toString(16, 24);
  const tokenString = new BN(token, 16).toString(16, 40);
  return new BN(chainIdString + tokenString, 16);
}

export async function swap(
  account: string,
  chain_from: string,
  token_from: string,
  chain_to: string,
  token_to: string,
  amount: string
) {
  const api = await getAPI();
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  const signer = keyring.addFromUri(`//${account}`);
  const nonce = new BN((await api.query.system.account(signer.address)).nonce);
  const accountId = ss58.addressToAddressId(signer.address);
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
    signer.address,
    compressToken(chain_from, token_from),
    compressToken(chain_to, token_to),
    new BN(amount),
    l2nonce
  );
  try {
    const ret = await tx.signAndSend(signer, { nonce });
    console.log(ret);
  } catch (e) {
    alert(e);
    return;
  }
}

export async function supply(
  account: string,
  chain_from: string,
  token_from: string,
  chain_to: string,
  token_to: string,
  amount_from: string,
  amount_to: string
) {
  const api = await getAPI();
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  console.log("l2 account name:", account);
  const signer = keyring.addFromUri(`//${account}`);
  const nonce = new BN((await api.query.system.account(signer.address)).nonce);
  const accountId = ss58.addressToAddressId(signer.address);
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
    signer.address,
    compressToken(chain_from, token_from),
    compressToken(chain_to, token_to),
    amount_from,
    amount_to,
    l2nonce
  );
  try {
    const ret = await tx.signAndSend(signer, { nonce });
    console.log("transaction supply:", ret);
  } catch (e) {
    alert(e);
    return;
  }
}

export async function retrieve(
  account: string,
  chain_from: string,
  token_from: string,
  chain_to: string,
  token_to: string,
  amount_from: string,
  amount_to: string
) {
  const api = await getAPI();
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  const signer = keyring.addFromUri(`//${account}`);
  const nonce = new BN((await api.query.system.account(signer.address)).nonce);
  const accountId = ss58.addressToAddressId(signer.address);
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
    signer.address,
    compressToken(chain_from, token_from),
    compressToken(chain_to, token_to),
    amount_from,
    amount_to,
    l2nonce
  );
  try {
    const ret = await tx.signAndSend(signer, { nonce });
    console.log(ret);
  } catch (e) {
    alert(e);
    return;
  }
}
