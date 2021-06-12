// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label, TextField } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import {
  getAddressOfAccoutAsync,
  queryTokenAmountAsync,
  withdraw,
} from "../libs/utils";
import { deposit, queryBalanceOnL1 } from "../libs/utils-l1";
import "./token.css";
import WithdrawBox from "./withdraw";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import L1TokenInfo from "solidity/build/contracts/Token.json";

interface IProps {
  account: string;
}

const verticalGapStackTokens: IStackTokens = {
  childrenGap: "1rem",
  padding: "0.5rem",
};

const titleStyles = {
  root: [
    {
      fontFamily: "Girassol",
      fontSize: "4rem",
    },
  ],
};

const normalStyles = {
  root: [
    {
      fontFamily: "KoHo",
      fontSize: "1.2rem",
    },
  ],
};

interface TokenInfo {
  chainId: string;
  address: string;
  amountOnL2?: string;
  amountOnETH1?: string;
  amountOnETH2?: string;
  fresh?: boolean;
}

const defaultTokenInfoList = [
  {
    chainId: "3",
    address: L1TokenInfo.networks["3"].address.replace("0x", ""),
  },
  {
    chainId: "97",
    address: L1TokenInfo.networks["97"].address.replace("0x", ""),
  },
];

export default function Token(props: IProps) {
  const [withdrawToken, setWithdrawToken] = react.useState<TokenInfo>();
  const [addressPair, setAddressPair] = react.useState<[string, string]>();
  const [tokenInfoList, setTokenInfoList] =
    react.useState<TokenInfo[]>(defaultTokenInfoList);
  const [inputValues, setInputValues] = react.useState<string[]>(
    defaultTokenInfoList.map((_) => "")
  );

  react.useEffect(() => {
    if (!addressPair || props.account !== addressPair[0]) {
      getAddressOfAccoutAsync(
        props.account,
        (account: string, address: string) => {
          setAddressPair([account, address]);
        }
      );
    }
  }, []);

  react.useEffect(() => {
    if (!addressPair) {
      return;
    }

    const updatorL2 = (token: any) => async () => {
      if (addressPair) {
        await queryTokenAmountAsync(
          addressPair[1],
          token.chainId,
          token.address,
          (value: string) => {
            setTokenInfoList((_list) =>
              _list?.map((e) =>
                e.chainId === token.chainId && e.address === token.address
                  ? { ...e, amountOnL2: value }
                  : e
              )
            );
          }
        );
      }
    };

    const updatorETH1 = (token: any) => async () => {
      if (addressPair) {
        queryBalanceOnL1(
          addressPair[1],
          token.chainId,
          token.address,
          defaultTokenInfoList[0].chainId
        ).then((value: string) => {
          setTokenInfoList((_list) =>
            _list?.map((e) =>
              e.chainId === token.chainId && e.address === token.address
                ? { ...e, amountOnETH1: value }
                : e
            )
          );
        });
      }
    };

    const updatorETH2 = (token: any) => async () => {
      if (addressPair) {
        queryBalanceOnL1(
          addressPair[1],
          token.chainId,
          token.address,
          defaultTokenInfoList[1].chainId
        ).then((value: string) => {
          setTokenInfoList((_list) =>
            _list?.map((e) =>
              e.chainId === token.chainId && e.address === token.address
                ? { ...e, amountOnETH2: value }
                : e
            )
          );
        });
      }
    };

    for (let token of tokenInfoList) {
      registerTask(
        token.chainId + token.address + "L2",
        updatorL2(token),
        30000
      );
      registerTask(
        token.chainId + token.address + "ETH1",
        updatorETH1(token),
        30000
      );
      registerTask(
        token.chainId + token.address + "ETH2",
        updatorETH2(token),
        30000
      );
    }
  }, [addressPair]);

  react.useEffect(() => {
    return () => {
      for (let token of tokenInfoList) {
        unregisterTask(token.chainId + token.address + "L2");
        unregisterTask(token.chainId + token.address + "ETH1");
        unregisterTask(token.chainId + token.address + "ETH2");
      }
    };
  }, []);

  return (
    <>
      <Label styles={titleStyles}>Token List</Label>
      <Stack
        horizontal
        horizontalAlign={"center"}
        tokens={verticalGapStackTokens}
        className="token w-100"
      >
        <Stack horizontal tokens={verticalGapStackTokens}>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Chain</Label>
            {tokenInfoList?.map((item) => (
              <Label styles={normalStyles} key={item.chainId + item.address}>
                {item.chainId}
              </Label>
            ))}
          </Stack>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Token Address</Label>
            {tokenInfoList?.map((item) => (
              <Label styles={normalStyles} key={item.chainId + item.address}>
                0x{item.address}
              </Label>
            ))}
          </Stack>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Balance(L2)</Label>
            {tokenInfoList?.map((item) => (
              <Label styles={normalStyles} key={item.chainId + item.address}>
                {item.amountOnL2 ?? "loading..."}
              </Label>
            ))}
          </Stack>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Balance(L1-3)</Label>
            {tokenInfoList?.map((item) => (
              <Label styles={normalStyles} key={item.chainId + item.address}>
                {item.amountOnETH1 ?? "loading..."}
              </Label>
            ))}
          </Stack>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Balance(L1-97)</Label>
            {tokenInfoList?.map((item) => (
              <Label styles={normalStyles} key={item.chainId + item.address}>
                {item.amountOnETH2 ?? "loading..."}
              </Label>
            ))}
          </Stack>
        </Stack>
        <Stack horizontal tokens={verticalGapStackTokens}>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <div className="button-placeholder"></div>
            {inputValues?.map((item, i) => (
              <TextField
                className="input"
                value={inputValues?.[i] ?? ""}
                onChange={(e: any) =>
                  setInputValues((value) =>
                    value?.map((v, _i) => (_i === i ? e.target.value : v))
                  )
                }
                key={i}
              />
            ))}
          </Stack>
        </Stack>
        <Stack horizontal tokens={verticalGapStackTokens}>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <div className="button-placeholder"></div>
            {tokenInfoList?.map((item, i) => (
              <DefaultButton
                text="Withdraw"
                onClick={() =>
                  addressPair?.[0] &&
                  withdraw(
                    addressPair?.[0],
                    item.chainId,
                    item.address,
                    inputValues[i]
                  )
                }
                key={item.chainId + item.address}
              />
            ))}
          </Stack>
        </Stack>
        <Stack horizontal tokens={verticalGapStackTokens}>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <div className="button-placeholder"></div>
            {tokenInfoList?.map((item, i) => (
              <DefaultButton
                text="Deposit"
                onClick={() =>
                  addressPair?.[1] &&
                  deposit(
                    addressPair?.[1],
                    item.chainId,
                    item.address,
                    inputValues[i]
                  )
                }
                key={item.chainId + item.address}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
      {addressPair && withdrawToken && (
        <WithdrawBox
          show={withdrawToken ? true : false}
          close={() => setWithdrawToken(undefined)}
          chainId={withdrawToken.chainId}
          tokenAddress={withdrawToken.address}
          account={addressPair[0]}
        />
      )}
    </>
  );
}
