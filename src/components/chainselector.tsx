// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Dropdown } from "@fluentui/react";
import {
  BridgeMetadata,
} from "../libs/type";


interface IProps {
  default: string;
  setChain: (u: string) => void;
  setToken: (u: string) => void;
  bridgeMetadata: BridgeMetadata;
}

interface ChainInfo {
  chainId: string;
  chainName: string;
  tokens: string[];
}

export default function ChainSelect(props: IProps) {
  const [selectedId, setSelectedId] = react.useState<string>(props.default);

  const chainInfoList: ChainInfo[] = props.bridgeMetadata.chainInfo.map((c) => ({
    chainId: c.chainId,
    chainName: c.chainName,
    tokens: c.tokens.map((t) => t.address.replace("0x", "")),
  }));

  const chainOptions = chainInfoList.map((c) => ({
    key: c.chainId,
    text: "Chain ID: " + c.chainName + "[" + c.chainId + "]",
  }));



  return (
    <div className="hole">
      <div>Chain:</div>
      <Dropdown
        placeholder="Select Chain"
        options={chainOptions}
        onChange={(_, option) => {
          if (option) {
            if (option.key != selectedId) {
              props.setToken(
                chainInfoList.find((c) => c.chainId === option.key)
                  ?.tokens[0] ?? ""
              );
            }
            setSelectedId(option.key as string);
            props.setChain(option.key as string);
          }
        }}
        defaultSelectedKey={props.default}
      />
    </div>
  );
}
