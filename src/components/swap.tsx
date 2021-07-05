// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { swap } from "../libs/utils";
import {
  verticalGapStackTokens,
  boxLabelStyles,
  buttonStyles,
  titleStyles,
} from "./common-styles";
import "./withdraw.css";
import { Dropdown, IDropdownStyles } from "@fluentui/react/lib/Dropdown";

interface IProps {
  account: string;
  chainId1: string;
  tokenAddress1: string;
  chainId2: string;
  tokenAddress2: string;
  close: () => void;
}

const dropdownStyles: Partial<IDropdownStyles> = {};

export default function SwapBox(props: IProps) {
  const [fromTokenKey, setFromTokenKey] = react.useState<number>(0);
  const [amount, setAmount] = react.useState<string>("10");

  const options = [
    {
      key: 0,
      text: `${props.chainId1}/0x${props.tokenAddress1}`,
    },
    {
      key: 1,
      text: `${props.chainId2}/0x${props.tokenAddress2}`,
    },
  ];

  return (
    <Modal isOpen={true} onDismiss={props.close} isBlocking={true} className="withdraw">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Swap in Delphinus</a>
      </nav>
      <Stack
        verticalAlign={"start"}
        tokens={verticalGapStackTokens}
      >
        <Label>From</Label>
        <Dropdown
          defaultSelectedKey={fromTokenKey}
          options={options}
          onChange={(e, item) => {
            item && setFromTokenKey(item.key as number);
          }}
          styles={dropdownStyles}
        />

        <Label>To</Label>
        <TextField
          className="account"
          value={options[1 - fromTokenKey].text}
          disabled
        />

        <Label>
          Will send amount of token {options[fromTokenKey].text}
        </Label>
        <TextField
          className="account"
          defaultValue={amount}
          onChange={(e: any) => {
            setAmount(e.target.value);
          }}
        />

        <Label>
          Will receive amount of token {options[1 - fromTokenKey].text}
        </Label>
        <TextField className="account" disabled value={amount} />

        <div>
        <button type="button" className="btn btn-sm btn-primary"
          onClick={() => {
            if (amount && fromTokenKey === 0) {
              swap(
                props.account,
                props.chainId1,
                props.tokenAddress1,
                props.chainId2,
                props.tokenAddress2,
                amount
              );
            }
            if (amount && fromTokenKey === 1) {
              swap(
                props.account,
                props.chainId2,
                props.tokenAddress2,
                props.chainId1,
                props.tokenAddress1,
                amount
              );
            }
            props.close();
          }}
        >
          Ok
        </button>
        <button type="button" className="btn btn-sm btn-secondary"
          onClick={props.close}>
          Cancel
        </button>
        </div>
      </Stack>
    </Modal>
  );
}
