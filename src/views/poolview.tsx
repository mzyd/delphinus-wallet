// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

// import { Stack } from "@fluentui/react/lib/Stack";
import { PoolInfo } from "../libs/type";
import EthIcon from "../img/tokens/eth-pure.svg";
import "./poolview.scss";

interface IProps {
  poolInfoList: PoolInfo[];
}

export default function PoolView(props: IProps) {
  const { poolInfoList } = props;
  console.log(poolInfoList);
  return (
    <>
      <div className="pools-page">
        <div className="box">
          <div className="board">
            <div className="pool-list">
              {poolInfoList.map((item) => (
                <div className="pool-item">
                  <div className="left">
                    <img src={EthIcon} className="icon" />
                    <div>
                      <div className="token-pair">
                        {item.tokenName1} - {item.tokenName2}
                      </div>
                      <div className="chain-pair">
                        {item.chainName1}[{item.chainId1}] - {item.chainName2}[
                        {item.chainId2}]
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div>
                      Vol: <span className="value">{item.amount}</span>
                    </div>
                    <div>
                      Share: <span className="value">{item.share}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <table className="table">
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
                {poolInfoList.map((pi) => (
                  <tr key="pool-{pi.id}">
                    <th>{pi.id}</th>
                    <th>{pi.tokenName1}</th>
                    <th>
                      {pi.chainName1}[{pi.chainId1}]
                    </th>
                    <th>{pi.tokenName2}</th>
                    <th>
                      {pi.chainName2}[{pi.chainId2}]
                    </th>
                    <th>{pi.amount}</th>
                    <th>{pi.share}</th>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>
      </div>

      {/* <Stack>
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
            {poolInfoList.map((pi) => (
              <tr key="pool-{pi.id}">
                <th>{pi.id}</th>
                <th>{pi.tokenName1}</th>
                <th>
                  {pi.chainName1}[{pi.chainId1}]
                </th>
                <th>{pi.tokenName2}</th>
                <th>
                  {pi.chainName2}[{pi.chainId2}]
                </th>
                <th>{pi.amount}</th>
                <th>{pi.share}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </Stack> */}
    </>
  );
}
