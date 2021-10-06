// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from "react";
// import {
//   separatorStyles,
//   verticalGapStackTokens,
// } from "../styles/common-styles";
// import { PivotItem, Pivot } from "@fluentui/react/lib/Pivot";
// import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
// import { ICommandBarItemProps } from "@fluentui/react/lib/CommandBar";
// import { Label } from "@fluentui/react";
// import { DefaultButton } from "@fluentui/react/lib/Button";
// import { Separator } from "@fluentui/react/lib/Separator";
import { L1AccountInfo, SubstrateAccountInfo } from "../libs/type";
import UsdtIcon from "../img/tokens/usdt.svg";
import CopyIcon from "../icons/copy.svg";
import { ChainInfo } from "../libs/type";
import "../styles/panel.css";
import "./tokenview.scss";

interface IProps {
  chainInfoList: ChainInfo[];
  l2Account: SubstrateAccountInfo;
  tokenTXModal: (cid: string, tokenaddr: string, method: string) => void;
}

export default function TokenView(props: IProps) {
  const { chainInfoList, l2Account } = props;
  const [currentChainId, setCurrentChainId] = useState(
    chainInfoList[0].chainId
  );
  console.log("chain list", chainInfoList);
  const doCopy = (text: string) => {
    const copied = document.createElement("input");
    copied.setAttribute("value", text);
    document.body.appendChild(copied);
    copied.select();
    document.execCommand("copy");
    document.body.removeChild(copied);
  };
  return (
    <div className="wallet-page">
      <div className="box">
        <div className="balance-tag">L2 Balance: ${l2Account.balance}</div>
        <div className="board token-view">
          <div className="chain-list">
            {chainInfoList.map((item) => (
              <div
                onClick={() => setCurrentChainId(item.chainId)}
                className={`chain-item ${
                  currentChainId === item.chainId ? "active" : ""
                }`}
              >
                <div className="title">
                  {item.chainName}[{item.chainId}]
                </div>
                {/* <div calssName="address"></div> */}
              </div>
            ))}
          </div>
          <div className="token-list">
            {chainInfoList
              .filter((item) => item.chainId === currentChainId)[0]
              .tokens.map((token) => (
                <div className="token-item" key={currentChainId + token.address}>
                  <img src={UsdtIcon} className="icon" />
                  <div className="top">
                    <div className="balance">
                      L1 {token.name}: {token.l1Balance ?? "loading..."}
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="balance">
                      L2 {token.name}: {token.l2Balance ?? "loading..."}
                    </div>
                    <div className="address">
                      {token.address.slice(0, 6)}...{token.address.slice(-6)}
                      <img
                        src={CopyIcon}
                        className="copy-icon"
                        onClick={() => doCopy(token.address)}
                      />
                    </div>
                    <div className="actions">
                      <button
                        className="btn-deposit"
                        onClick={() => {
                          props.tokenTXModal(
                            currentChainId,
                            token.address,
                            "Deposit"
                          );
                        }}
                      >
                        Deposit
                      </button>
                      <button
                        className="btn-withdraw"
                        onClick={() => {
                          props.tokenTXModal(
                            currentChainId,
                            token.address,
                            "Withdraw"
                          );
                        }}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
        <Pivot>
          {props.chainInfoList.map((item, i) => (
            <PivotItem
              key={item.chainId}
              linkText={item.chainName + "[" + item.chainId + "]"}
              className="p-2"
            >
              {item.tokens.map((token, i) => (
                <div key={item.chainId + token.address}>
                  <Label>
                    {token.name} - 0x{token.address}
                  </Label>
                  <Label>
                    <span> L1 Balance: {token.l1Balance ?? "loading..."}</span>
                  </Label>
                  <Label>
                    <span> L2 Balance: {token.l2Balance ?? "loading..."}</span>
                    <DefaultButton
                      text="Deposit"
                      className="fr btn-pl2"
                      onClick={() => {
                        props.tokenTXModal(
                          item.chainId,
                          token.address,
                          "Deposit"
                        );
                      }}
                    />
                    <DefaultButton
                      text="Withdraw"
                      className="fr btn-pl2"
                      onClick={() => {
                        props.tokenTXModal(
                          item.chainId,
                          token.address,
                          "Withdraw"
                        );
                      }}
                    />
                  </Label>
                  <Label>Synchronizing status</Label>
                  <Separator styles={separatorStyles} className="w-100" />
                </div>
              ))}
            </PivotItem>
          ))}
        </Pivot>
      </Stack> */}
    </div>
  );
}
