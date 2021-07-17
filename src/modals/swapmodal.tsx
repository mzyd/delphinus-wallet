// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack } from "@fluentui/react/lib/Stack";
import { swap } from "../libs/utils";
import {
  verticalGapStackTokens,
} from "../styles/common-styles";
import "../styles/modal.css";
import { IDropdownStyles } from "@fluentui/react/lib/Dropdown";

interface IProps {
  account: string;
  chainId0: string;
  token0: string;
  chainId1: string;
  token1: string;
  amount?:string;
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
        <Label>Amount for {props.chainId0} / 0x{props.token0}</Label>
        <TextField
          className="account" disabled
          defaultValue={props.amount}
        />
        <Label>Amount for {props.chainId1} / 0x{props.token1}</Label>
        <TextField
          className="account" disabled
          defaultValue={props.amount}
        />
        <div>
        <button type="button" className="btn btn-sm btn-primary"
          onClick={() => {
              swap(
                props.account,
                props.chainId0,
                props.token0,
                props.chainId1,
                props.token1,
                props.amount!
              );
              props.close()
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
