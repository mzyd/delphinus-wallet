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
      <Stack>
      <ul className="list-group pool-list">
        {poolInfoList.map((pi) => (
          <li className="list-group-item">
          Pool - {pi.id} - {pi.chainId1} - {pi.tokenAddress1} - {pi.chainId2} - {pi.tokenAddress2} - {pi.amount} - {pi.share}
          </li>
        ))}
      </ul>
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
