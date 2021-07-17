// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { PivotItem, Pivot } from '@fluentui/react/lib/Pivot';
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Separator } from "@fluentui/react/lib/Separator";

import {
  getAddressOfAccoutAsync,
  queryTokenAmountAsync,
  withdraw
} from "../libs/utils";
import { queryBalanceOnL1 } from "../libs/utils-l1";
import { TXProps, SubstrateAccountInfo } from "../libs/type";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import WithdrawBox from "../modals/withdraw";
import DepositBox from "../modals/deposit";

import { separatorStyles, verticalGapStackTokens } from "../styles/common-styles";
import "../styles/panel.css";

import chainList from "../config/tokenlist";

interface IProps {
  l2Account: SubstrateAccountInfo;
}

export default function Token(props: IProps) {
  const [currentModal, setCurrentModal] = react.useState<string>();
  const [currentTXProps, setCurrentTXProps] = react.useState<TXProps>();
  const [chainInfoList, setTokenInfoList] =
    react.useState<ChainInfo[]>(chainList.filter((x)=> x.enable));

  const setTXProps = (cid:string, addr:string) => {
     setCurrentTXProps ({
       substrateAccount: props.l2Account,
       selectedToken: {
         chainId: cid,
         tokenAddress: addr,
       }
     });
  }

  const updateTokenL2Balance = (chainId:string, tokenAddress:string,
      tokenInfos:TokenInfo[], balance:string) => {
    let tis = tokenInfos.map((e) =>
      e.address === tokenAddress
        ? { ...e, l2Balance: balance}
        : e
    );
    return tis;
  }

  const updateL2Balance = async (chainId:string, tokenAddress:string) => {
    console.log("updateL2Balance");
    await queryTokenAmountAsync(
      props.l2Account.address,
      chainId,
      tokenAddress,
      (value: string) => {
        setTokenInfoList((_list) =>
          _list?.map((e) =>
            e.chainId === chainId
              ? { ...e, tokens: updateTokenL2Balance(chainId, tokenAddress, e.tokens, value)}
              : e
          )
        );
      }
    );
  };

  const updateTokenL1Balance = (chainId:string, tokenAddress:string,
      tokenInfos:TokenInfo[], balance:string) => {
    let tis = tokenInfos.map((e) =>
      e.address === tokenAddress
        ? { ...e, l1Balance: {...e.l1Balance, [chainId]:balance}}
        : e
    );
    return tis;
  }

  const updateL1State = async (chainId:string, tokenAddress: string, queryId:string) => {
    await queryBalanceOnL1(
      props.l2Account,
      chainId,
      tokenAddress,
      queryId,
    ).then((value: string) => {
      setTokenInfoList((_list) =>
        _list?.map((e) =>
          e.chainId === chainId
            ? { ...e, tokens: updateTokenL1Balance(queryId, tokenAddress, e.tokens, value)}
            : e
        )
      );
    });
  };

  const updateStates = async (chainId:string, tokenAddress: string) => {
    await updateL2Balance(chainId, tokenAddress);
    for (let chain of chainInfoList) {
      console.log(chainId, chain.chainId);
      await updateL1State(chainId, tokenAddress, chain.chainId);
    }
  };

  react.useEffect(() => {
    let p = new Promise((resolve,reject) => {resolve(1);});
    for (let chain of chainInfoList) {
      for (let token of chain.tokens) {
        p = p.then(() => updateStates(chain.chainId, token.address))
      }
    };
    p.then(()=>console.log("done"));
    //await p; // This is dangerous since ui might trigger switch bridge
  }, []);

  return (
    <>
        <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
          <Pivot>
            {chainInfoList?.map((item, i) => (
            <PivotItem key={item.chainId} linkText={"Chain-" + item.chainId} className="p-2" >
              {item.tokens.map((token, i) => (
              <div key={item.chainId + token.address}>
                <Label >
                  {item.chainId} - 0x{token.address}
                </Label>
                <Label>
                  <span> L2 Balance: {token.l2Balance ?? "loading..."}</span>
                  <DefaultButton text="Deposit" className="btn-pl2"
                    onClick={() => {
                      setTXProps(addressPair![1], item.chainId, token.address);
                      setCurrentModal("Deposit")
                    }}
                  />
                  <DefaultButton text="Withdraw" className="btn-pl2"
                    onClick={() => {
                      setTXProps(addressPair![0], item.chainId, token.address);
                      setCurrentModal("Withdraw")
                    }}
                  />
                </Label>
                <Label>
                Synchronizing status
                {chainInfoList?.map((chain) => (
                  <span key={chain.chainId + "-" + token.address + "-balance"}>
                  [Chain-{chain.chainId}: {
                    token.l1Balance?.[chain.chainId] ?? "loading..."}]
                  </span>
                ))}
                </Label>
                <Separator styles={separatorStyles} className="w-100" />
              </div>
              ))}
            </PivotItem>
            ))}
          </Pivot>
      </Stack>
      <DepositBox show={currentModal==="Deposit"}
          txprops = {currentTXProps!}
          close = {() => {setCurrentModal("")}}
      />
      <WithdrawBox show={currentModal==="Withdraw"}
          txprops = {currentTXProps!}
          close = {() => {setCurrentModal("")}}
      />
    </>
  );
}
