// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import chainList from "../config/tokenlist";
import { Dropdown } from "@fluentui/react";

interface IProps {
  default: string;
  chainId: string;
  setToken: (u: string) => void;
}

interface ChainInfo {
  chainId: string;
  tokens: string[];
}

const chainInfoList: ChainInfo[] = chainList.map((c) => ({
  chainId: c.chainId,
  chainName: c.chainName,
  tokens: c.tokens.map((t) => t.address.replace("0x", "")),
}));

const tokenOptions = (chainId: string) =>
  chainInfoList
    .find((c) => c.chainId === chainId)
    ?.tokens?.map((token) => ({
      key: token,
      text: token,
    })) ?? [];

export default function TokenSelector(props: IProps) {
  const [selectedId, setSelectedId] = react.useState<string>(props.default);

  return (
    <div className="hole">
      <div>Token:</div>

      <Dropdown
        placeholder="Select Token"
        options={tokenOptions(props.chainId)}
        onChange={(_, option) => {
          if (option) {
            props.setToken(option.key as string);
          }
        }}
        defaultSelectedKey={props.default}
      />
    </div>
  );
}
