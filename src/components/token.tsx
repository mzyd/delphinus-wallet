// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label, TextField } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { PivotLinkSize, PivotLinkFormat, PivotItem, Pivot } from '@fluentui/react/lib/Pivot';
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Separator } from "@fluentui/react/lib/Separator";
import { buttonStyles, normalLabelStyles, separatorStyles, titleStyles, verticalGapStackTokens } from "./common-styles";
import {
  getAddressOfAccoutAsync,
  queryTokenAmountAsync,
  withdraw,
} from "../libs/utils";
import { deposit, queryBalanceOnL1 } from "../libs/utils-l1";
import "./token.css";
import WithdrawBox from "./withdraw";
import DepositBox from "./deposit";
import { registerTask, unregisterTask } from "../libs/query-fresher";
import L1TokenInfo from "solidity/build/contracts/Token.json";
import tokenList from "../config/tokenlist";

interface IProps {
  account: string;
}

interface TXProps {
  account: string;
  chainId: string;
  tokenAddress: string;
}

const normalStyles = {
  root: [
    {
      fontFamily: "KoHo",
      fontSize: "1rem",
    },
  ],
};

interface TokenInfo {
  chainId: string;
  address: string;
  amountOnL2?: string;
  amountOnETH1?: string;
  amountOnETH2?: string;
  fresh?: boolean;
}

export default function Token(props: IProps) {
  const [currentModal, setCurrentModal] = react.useState<string>();
  const [currentTXProps, setCurrentTXProps] = react.useState<txprops>();
  const [withdrawToken, setWithdrawToken] = react.useState<TokenInfo>();
  const [addressPair, setAddressPair] = react.useState<[string, string]>();
  const [tokenInfoList, setTokenInfoList] =
    react.useState<TokenInfo[]>(tokenList);
  const [inputValues, setInputValues] = react.useState<string[]>(
    tokenList.map((_) => "")
  );

  const setTXProps = (account, cid, addr) => {
     setCurrentTXProps ({
       account: account,
       chainId: cid,
       tokenAddress: addr,
     });
  }

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

    const updatorL2 = (token: any) => async () => {
      if (addressPair) {
        await queryTokenAmountAsync(
          addressPair[1],
          token.chainId,
          token.address,
          (value: string) => {
            setTokenInfoList((_list) =>
              _list?.map((e) =>
                e.chainId === token.chainId && e.address === token.address
                  ? { ...e, amountOnL2: value }
                  : e
              )
            );
          }
        );
      }
    };

    const updatorETH1 = (token: any) => async () => {
      if (addressPair) {
        queryBalanceOnL1(
          addressPair[1],
          token.chainId,
          token.address,
          tokenList[0].chainId
        ).then((value: string) => {
          setTokenInfoList((_list) =>
            _list?.map((e) =>
              e.chainId === token.chainId && e.address === token.address
                ? { ...e, amountOnETH1: value }
                : e
            )
          );
        });
      }
    };

    const updatorETH2 = (token: any) => async () => {
      if (addressPair) {
        queryBalanceOnL1(
          addressPair[1],
          token.chainId,
          token.address,
          tokenList[1].chainId
        ).then((value: string) => {
          setTokenInfoList((_list) =>
            _list?.map((e) =>
              e.chainId === token.chainId && e.address === token.address
                ? { ...e, amountOnETH2: value }
                : e
            )
          );
        });
      }
    };

    for (let token of tokenInfoList) {
      let r = async () => {
        await updatorL2(token)();
        await updatorETH1(token)();
        await updatorETH2(token)();
      };
      r().then(() => {});
    }

    /*
    for (let token of tokenInfoList) {
      registerTask(
        token.chainId + token.address + "L2",
        updatorL2(token),
        30000
      );
      registerTask(
        token.chainId + token.address + "ETH1",
        updatorETH1(token),
        30000
      );
      registerTask(
        token.chainId + token.address + "ETH2",
        updatorETH2(token),
        30000
      );
    }
    */
  }, [addressPair]);

  react.useEffect(() => {
    return () => {
      for (let token of tokenInfoList) {
        unregisterTask(token.chainId + token.address + "L2");
        unregisterTask(token.chainId + token.address + "ETH1");
        unregisterTask(token.chainId + token.address + "ETH2");
      }
    };
  }, []);

  const _items: ICommandBarItemProps[] = [
    {
      key: 'share',
      text: 'Share',
      iconProps: { iconName: 'Share' },
      onClick: () => console.log('Share'),
    },
    {
      key: 'download',
      text: 'Download',
      iconProps: { iconName: 'Download' },
      onClick: () => console.log('Download'),
    },
  ];

  return (
    <>
        <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
          <Pivot>
            {tokenInfoList?.map((item, i) => (
            <PivotItem key={item.chainId + "-" + item.address} linkText={"Chain-" + item.chainId} className="p-2" >
              <Label key={item.chainId + item.address}>
                {item.chainId} - 0x{item.address}
              </Label>
              <Label>
                <span> L2 Balance: {item.amountOnL2 ?? "loading..."}</span>
                <DefaultButton text="Deposit" className="btn-pl2"
                  onClick={() => {
                    setTXProps(addressPair?.[1], item.chainId, item.address);
                    setCurrentModal("Deposit")
                  }}
                />
                <DefaultButton text="Withdraw" className="btn-pl2"
                  onClick={() => {
                    setTXProps(addressPair?.[1], item.chainId, item.address);
                    setCurrentModal("Withdraw")
                  }}
                />
              </Label>
              <Label>
              Synchronizing status
              [Chain-{tokenInfoList[0].chainId}: {item.amountOnETH1 ?? "loading..."}]
              [Chain-{tokenInfoList[1].chainId}: {item.amountOnETH2 ?? "loading..."}]
              </Label>
              <Separator styles={separatorStyles} className="w-100" />
            </PivotItem>
            ))}
          </Pivot>
      </Stack>
      <DepositBox show={currentModal==="Deposit"}
          txprops = {currentTXProps}
          close = {() => {setCurrentModal("")}}
      />
      <WithdrawBox show={currentModal==="Withdraw"}
          txprops = {currentTXProps}
          close = {() => {setCurrentModal("")}}
      />
    </>
  );
}
