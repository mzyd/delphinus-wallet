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
  amount:string;
  close: () => void;
}

const dropdownStyles: Partial<IDropdownStyles> = {};

export default function SwapModal(props: IProps) {
  const [fromTokenKey, setFromTokenKey] = react.useState<number>(0);
  const [defaultValue, setDefaultValue] = react.useState<number>(10);

  return (
    <Modal isOpen={true} onDismiss={props.close} isBlocking={true} className="withdraw">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Confirm Swap</a>
      </nav>
      <Stack
        verticalAlign={"start"}
        tokens={verticalGapStackTokens}
      >
        <Label>From:
        <span className="address"> 0x{props.tokenAddress1} </span>
        </Label>
        <TextField className="account" defaultValue={props.amount} disabled />
        <Label>To:
        <span className="address"> 0x{props.tokenAddress2} </span>
        </Label>
        <TextField className="account" disabled defaultValue={props.amount} />
        <div>
        <button type="button" className="btn btn-sm btn-primary"
          onClick={() => {
              swap(
                props.account,
                props.chainId1,
                props.tokenAddress1,
                props.chainId2,
                props.tokenAddress2,
                props.amount
              );
            }
          }
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
