// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Stack } from "@fluentui/react/lib/Stack";
import { PoolInfo } from "../libs/type";

interface IProps {
  poolInfoList: PoolInfo[];
}

export default function PoolView(props: IProps) {
  return (
    <>
      <Stack>
        <table className="table">
          <thead className="thead-dark">
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
          {props.poolInfoList.map((pi) => (
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
      </Stack>
    </>
  );
}
