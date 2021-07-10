// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { Separator } from "@fluentui/react/lib/Separator";
import { separatorStyles} from "./common-styles";
import { TextField } from "@fluentui/react/lib/TextField";

import {
  getAddressOfAccoutAsync,
  queryPoolAmountAsync,
  queryPoolShareAsync,
} from "../libs/utils";

import RetrieveModal from "./retrievemodal";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import "./withdraw.css";
import chainList from "../config/tokenlist";

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
  liquid?: string;
  amount?: string;
}

enum PoolOps {
  Supply,
  Retrieve,
  Swap,
}

export default function Retrieve(props: IProps) {
  const [addressPair, setAddressPair] = react.useState<[string, string]>();
  const [selectedPoolOps, setSelectedPoolOps] = react.useState<PoolOps>();
  const [poolInfoList, setPoolInfoList] = react.useState<PoolInfo[]>([
    {
      id: "1",
      chainId1: chainList[0].chainId,
      tokenAddress1: chainList[0].tokens[0].address.replace(
        "0x",
        ""
      ),
      chainId2: chainList[1].chainId,
      tokenAddress2: chainList[1].tokens[0].address.replace(
        "0x",
        ""
      ),
    },
  ]);
  const [selectedPool, setSelectedPool] = react.useState<PoolInfo>(poolInfoList[0]);

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
            _list?.map((e) => (e.id === pool.id ? { ...e, liquid: value } : e))
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
      <Stack
        horizontal
        horizontalAlign={"center"}
        tokens={verticalGapStackTokens}
      >
        <Stack tokens={verticalGapStackTokens}>
          <div className="swap-selector" key={selectedPool?.id}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <a className="navbar-brand" href="#">
                Retrieve Liquidity:
              </a>
            </nav>
            <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
              <ul className="list-group">
              <li className="list-group-item">
                From: Chain-id - {selectedPool?.chainId1}
              </li>
              <li className="list-group-item address">
                0x{selectedPool?.tokenAddress1}
              </li>
              <li className="list-group-item">liquidity: {selectedPool?.liquid ?? "loading ..."}
              </li>
              <li className="list-group-item">
                amount: <TextField onChange={(e:any) => {
                    setSelectedPool({...selectedPool, amount: e.target.value});
                  }}
                />
              </li>
              </ul>
              <ul className="list-group">
              <li className="list-group-item">
                To: Chain-id - {selectedPool?.chainId2}
              </li>
              <li className="list-group-item address">
                0x{selectedPool?.tokenAddress2}
              </li>
              <li className="list-group-item">
                liquidity: {selectedPool?.liquid ?? "loading ..."}
              </li>
              <li className="list-group-item">
                amount: <TextField disabled value={selectedPool?.amount}/>
              </li>
              </ul>
              <button type="button" className="btn btn-sm btn-primary"
                onClick={() => {
                  setSelectedPoolOps(PoolOps.Retrieve);
                }}
              >
                Retrieve Liquidity
              </button>
            </Stack>
          </div>
        </Stack>
      </Stack>
      {addressPair && selectedPool && selectedPoolOps === PoolOps.Retrieve && (
        <RetrieveModal
          account={addressPair[0]}
          {...selectedPool}
          close={() => {
            setSelectedPoolOps(undefined);
          }}
        />
      )}
    </>
  );
}
