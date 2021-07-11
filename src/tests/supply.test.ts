import Keyring from "@polkadot/keyring";
import BN from "bn.js";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { compressToken, getAPI, supply } from "../libs/utils";

const ss58 = require("substrate-ss58");

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
  const nonce = new BN((await api.query.system.account(sudoAddress)).nonce);
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

export async function main() {
  await deposit("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "15", "33034FD0b1640C928D2Cf21969b89e4dDd3aEDbF");
  await new Promise(resolve => setTimeout(resolve, 5000));
  await deposit("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "16", "8BB852f1Ee7B2a8Ce79876BdEbE713124CD186Ea");
}

main();
