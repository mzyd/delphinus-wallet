// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";

import {
  getAddressOfAccoutAsync,
  queryPoolAmountAsync,
  queryPoolShareAsync,
} from "../libs/utils";

import SupplyBox from "./supply";
import RetrieveBox from "./retrieve";
import SwapBox from "./swap";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import "./token.css";
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

const buttonStyles = {
  root: [
    {
      fontFamily: "KoHo",
      fontSize: "1.2rem",
    },
  ],
};

interface PoolInfo {
  id: string;
  chainId1: string;
  tokenAddress1: string;
  chainId2: string;
  tokenAddress2: string;
  share?: string;
  amount?: string;
}

enum PoolOps {
  Supply,
  Retrieve,
  Swap,
}

export default function Pool(props: IProps) {
  const [addressPair, setAddressPair] = react.useState<[string, string]>();
  const [selectedPool, setSelectedPool] = react.useState<PoolInfo>();
  const [selectedPoolOps, setSelectedPoolOps] = react.useState<PoolOps>();
  const [poolInfoList, setPoolInfoList] = react.useState<PoolInfo[]>([
    {
      id: "1",
      chainId1: "3",
      tokenAddress1: L1TokenInfo.networks[3].address.replace(
        "0x",
        ""
      ),
      chainId2: "97",
      tokenAddress2: L1TokenInfo.networks[97].address.replace(
        "0x",
        ""
      ),
    },
  ]);

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

    const updator = (pool: any) => async () => {
      await queryPoolAmountAsync(
        pool.chainId1,
        pool.tokenAddress1,
        pool.chainId2,
        pool.tokenAddress2,
        (value: string) => {
          setPoolInfoList((_list) =>
            _list?.map((e) => (e.id === pool.id ? { ...e, amount: value } : e))
          );
        }
      );

      if (addressPair) {
        await queryPoolShareAsync(
          addressPair[1],
          pool.chainId1,
          pool.tokenAddress1,
          pool.chainId2,
          pool.tokenAddress2,
          (value: string) => {
            setPoolInfoList((_list) =>
              _list?.map((e) => (e.id === pool.id ? { ...e, share: value } : e))
            );
          }
        );
      }
    };

    for (let pool of poolInfoList) {
      registerTask(pool, updator(pool), 30000);
    }
  }, [addressPair]);

  react.useEffect(() => {
    return () => {
      for (let pool of poolInfoList) {
        unregisterTask(pool);
      }
    };
  }, []);

  return (
    <>
      <Label styles={titleStyles}>Pool List</Label>
      <Stack
        horizontal
        horizontalAlign={"center"}
        tokens={verticalGapStackTokens}
        className="main w-100"
      >
        <Stack horizontal tokens={verticalGapStackTokens}>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Chain1 / Token1</Label>
            {poolInfoList.map((pi) => (
              <span key={pi.id}>
                {pi.chainId1} / 0x{pi.tokenAddress1}
              </span>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Chain2 / Token2</Label>
            {poolInfoList.map((pi) => (
              <span key={pi.id}>
                {pi.chainId2} / 0x{pi.tokenAddress2}
              </span>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>PoolAmount</Label>
            {poolInfoList.map((pi) => (
              <span key={pi.id}>{pi.amount ?? "loading..."}</span>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <Label styles={normalStyles}>Share</Label>
            {poolInfoList.map((pi) => (
              <span key={pi.id}>{pi.share ?? "loading..."}</span>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <div className="button-placeholder"></div>
            {poolInfoList.map((pi) => (
              <DefaultButton
                key={pi.id}
                styles={buttonStyles}
                onClick={() => {
                  setSelectedPool(pi);
                  setSelectedPoolOps(PoolOps.Swap);
                }}
              >
                Swap
              </DefaultButton>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <div className="button-placeholder"></div>
            {poolInfoList.map((pi) => (
              <DefaultButton
                key={pi.id}
                styles={buttonStyles}
                onClick={() => {
                  setSelectedPool(pi);
                  setSelectedPoolOps(PoolOps.Supply);
                }}
              >
                Supply
              </DefaultButton>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            <div className="button-placeholder"></div>
            {poolInfoList.map((pi) => (
              <DefaultButton
                key={pi.id}
                styles={buttonStyles}
                onClick={() => {
                  setSelectedPool(pi);
                  setSelectedPoolOps(PoolOps.Retrieve);
                }}
              >
                Retrieve
              </DefaultButton>
            ))}
          </Stack>
        </Stack>
      </Stack>
      {addressPair && selectedPool && selectedPoolOps === PoolOps.Supply && (
        <SupplyBox
          account={addressPair[0]}
          {...selectedPool}
          close={() => {
            setSelectedPool(undefined);
            setSelectedPoolOps(undefined);
          }}
        />
      )}
      {addressPair && selectedPool && selectedPoolOps === PoolOps.Retrieve && (
        <RetrieveBox
          account={addressPair[0]}
          {...selectedPool}
          close={() => {
            setSelectedPool(undefined);
            setSelectedPoolOps(undefined);
          }}
        />
      )}
      {addressPair && selectedPool && selectedPoolOps === PoolOps.Swap && (
        <SwapBox
          account={addressPair[0]}
          {...selectedPool}
          close={() => {
            setSelectedPool(undefined);
            setSelectedPoolOps(undefined);
          }}
        />
      )}
    </>
  );
}
