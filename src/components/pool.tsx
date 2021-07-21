// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import PoolView from "../views/poolview";

import {
  queryPoolAmountAsync,
  queryPoolShareAsync,
} from "../libs/utils";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import { PoolInfo, SubstrateAccountInfo } from "../libs/type";

import chainList from "../config/tokenlist";

import "../styles/theme.css";

interface IProps {
  l2Account: SubstrateAccountInfo;
}

enum PoolOps {
  Supply,
  Retrieve,
  Swap,
}

export default function Pool(props: IProps) {
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
    };
  }, []);

  return (<PoolView poolInfoList={poolInfoList}></PoolView>
  );
}
