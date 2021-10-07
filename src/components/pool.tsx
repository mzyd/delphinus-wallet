// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import PoolView from "../views/poolview";
import { Stack } from "@fluentui/react/lib/Stack";

import {
  queryPoolAmountAsync,
  queryPoolShareAsync,
} from "../libs/utils";

import { registerTask, unregisterTask } from "../libs/query-fresher";
import {
    PoolInfo,
    SubstrateAccountInfo,
    BridgeMetadata,
} from "../libs/type";

import "../styles/theme.css";

interface IProps {
  l2Account: SubstrateAccountInfo;
  bridgeMetadata: BridgeMetadata;
}

enum PoolOps {
  Supply,
  Retrieve,
  Swap,
}

export default function Pool(props: IProps) {
  const [poolInfoList, setPoolInfoList] = react.useState<PoolInfo[]>(props.bridgeMetadata.poolInfo);

  const updator = async (pool: PoolInfo) => {
    await queryPoolAmountAsync(
      pool.id,
      (value: string) => {
        setPoolInfoList((_list) =>
          _list?.map((e) => (e.id === pool.id ? { ...e, amount: value } : e))
        );
        console.log("poolinfolist", poolInfoList);
        console.log("pool-id", pool.id);
      }
    );

    await queryPoolShareAsync(
      props.l2Account,
      pool.id,
      (value: string) => {
        setPoolInfoList((_list) =>
          _list?.map((e) => (e.id === pool.id ? { ...e, share: value } : e))
        );
      }
    );
  };


  react.useEffect(() => {
    for (var pool of poolInfoList) {
      updator(pool);
    }
  }, []);

  return (<PoolView poolInfoList={poolInfoList}></PoolView>);
}
