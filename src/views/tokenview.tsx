// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { separatorStyles, verticalGapStackTokens } from "../styles/common-styles";
import { PivotItem, Pivot } from '@fluentui/react/lib/Pivot';
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Separator } from "@fluentui/react/lib/Separator";



import { ChainInfo } from "../libs/type";
import "../styles/panel.css";

interface IProps {
  chainInfoList: ChainInfo[];
  tokenTXModal: (cid:string, tokenaddr:string, method:string) => void;
}

export default function TokenView(props: IProps) {
  return (
        <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
          <Pivot>
            {props.chainInfoList.map((item, i) => (
            <PivotItem key={item.chainId} linkText={item.chainName + "[" + item.chainId + "]"} className="p-2" >
              {item.tokens.map((token, i) => (
              <div key={item.chainId + token.address}>
                <Label >
                  {token.name} - 0x{token.address}
                </Label>
                <Label>
                  <span> L1 Balance: {token.l1Balance ?? "loading..."}</span>
                </Label>
                <Label>
                  <span> L2 Balance: {token.l2Balance ?? "loading..."}</span>
                  <DefaultButton text="Deposit" className="fr btn-pl2"
                    onClick={() => {
                      props.tokenTXModal(item.chainId, token.address, "Deposit");
                    }}
                  />
                  <DefaultButton text="Withdraw" className="fr btn-pl2"
                    onClick={() => {
                      props.tokenTXModal(item.chainId, token.address, "Withdraw");
                    }}
                  />
                </Label>
                <Label>
                Synchronizing status
                </Label>
                <Separator styles={separatorStyles} className="w-100" />
              </div>
              ))}
            </PivotItem>
            ))}
          </Pivot>
      </Stack>

  );
}
