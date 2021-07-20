// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Stack } from "@fluentui/react/lib/Stack";

import {
  queryPoolAmountAsync,
  queryPoolShareAsync,
} from "../libs/utils";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import { SubstrateAccountInfo } from "../libs/type";

import chainList from "../config/tokenlist";

import "../styles/theme.css";

interface IProps {
  l2Account: SubstrateAccountInfo;
}

interface PoolInfo {
  id: string;
  chainId1: string;
  chainName1: string;
  tokenAddress1: string;
  tokenName1: string;
  chainId2: string;
  chainName2: string;
  tokenAddress2: string;
  tokenName2: string;
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
      chainId1: chainList[0].chainId,
      chainName1: chainList[0].chainName,
      tokenAddress1: chainList[0].tokens[0].address.replace(
        "0x",
        ""
      ),
      tokenName1: chainList[0].tokens[0].name,
      chainId2: chainList[1].chainId,
      chainName2: chainList[1].chainName,
      tokenAddress2: chainList[1].tokens[0].address.replace(
        "0x",
        ""
      ),
      tokenName2: chainList[1].tokens[0].name,
    },
  ]);

  react.useEffect(() => {

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
          props.l2Account,
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
      <Stack>
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Token Name</th>
              <th scope="col">Chain Name</th>
              <th scope="col">Token Name</th>
              <th scope="col">Chain Name</th>
              <th scope="col">Vol</th>
              <th scope="col">Share</th>
            </tr>
          </thead>
          <tbody>
        {poolInfoList.map((pi) => (
            <tr key="pool-{pi.id}">
              <th>{pi.id}</th>
              <th>{pi.tokenName1}</th>
              <th>{pi.chainName1}[{pi.chainId1}]</th>
              <th>{pi.tokenName2}</th>
              <th>{pi.chainName2}[{pi.chainId2}]</th>
              <th>{pi.amount}</th>
              <th>{pi.share}</th>
            </tr>
        ))}
          </tbody>
        </table>
      <div className="button-container">
        {poolInfoList.map((pi) => (
          <>
          <button type="button" className="btn btn-sm btn-primary"
            key={pi.id}
            onClick={() => {
              setSelectedPool(pi);
              setSelectedPoolOps(PoolOps.Supply);
            }}
          >
            Add Liqidity
          </button>
          <button type="button" className="btn btn-sm btn-primary"
            key={pi.id}
            onClick={() => {
              setSelectedPool(pi);
              setSelectedPoolOps(PoolOps.Retrieve);
            }}
          >
            Retrieve Liqidity
          </button>
          </>
        ))}
      </div>
      </Stack>
    </>
  );
}
