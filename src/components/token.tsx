// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { queryTokenAmountAsync } from "../libs/utils";
import { queryTokenL1Balance } from "../libs/utils-l1";
import { TXProps, SubstrateAccountInfo, ChainInfo,
    L1AccountInfo, TokenInfo } from "../libs/type";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import WithdrawBox from "../modals/withdraw";
import DepositBox from "../modals/deposit";
import TokenView from "../views/tokenview";


import chainList from "../config/tokenlist";

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
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

  const tokenTXModal = (cid:string, tokenaddr:string, method:string) => {
     setTXProps(cid, tokenaddr);
     setCurrentModal(method)
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
      props.l2Account,
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
        ? { ...e, l1Balance: balance}
        : e
    );
    return tis;
  }

  const updateL1State = async (chainId:string, tokenAddress: string) => {
    await queryTokenL1Balance(
      chainId,
      tokenAddress,
      props.l1Account
    ).then((value: string) => {
      setTokenInfoList((_list) =>
        _list?.map((e) =>
          e.chainId === chainId
            ? { ...e, tokens: updateTokenL1Balance(chainId, tokenAddress, e.tokens, value)}
            : e
        )
      );
    });
  };

  const updateStates = async (chainId:string, tokenAddress: string) => {
    await updateL2Balance(chainId, tokenAddress);
    await updateL1State(chainId, tokenAddress);
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
  }, [props.l1Account]);

  return (
    <>
      <TokenView chainInfoList={chainInfoList} tokenTXModal={tokenTXModal}></TokenView>
      {currentTXProps &&
      <DepositBox show={currentModal==="Deposit"}
          txprops = {currentTXProps!}
          close = {() => {setCurrentModal("")}}
      />
      }
      {currentTXProps &&
      <WithdrawBox show={currentModal==="Withdraw"}
          txprops = {currentTXProps!}
          close = {() => {setCurrentModal("")}}
      />
      }
    </>
  );
}
