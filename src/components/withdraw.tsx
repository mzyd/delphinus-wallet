// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { withdraw } from "../libs/utils";
import "./withdraw.css";
import { verticalGapStackTokens, titleStyles, boxLabelStyles, buttonStyles } from "./common-styles";

interface IProps {
  account: string;
  chainId: string;
  tokenAddress: string;
  show: boolean;
  close: () => void;
}

export default function WithdrawBox(props: IProps) {
  const [amount, setAmount] = react.useState<string>();
  //const [l1account, setL1Account] = react.useState<string>();

  return (
    <Modal isOpen={props.show} onDismiss={props.close} isBlocking={true}>
      <Stack
        verticalAlign={"start"}
        tokens={verticalGapStackTokens}
        className="withdraw"
      >
        <Label styles={titleStyles}>Withdraw</Label>
        <Label styles={boxLabelStyles}>Amount</Label>
        <TextField
          className="account"
          autoFocus
          onChange={(e: any) => {
            setAmount(e.target.value);
          }}
        />
        {/*
        <Label styles={boxLabelStyles}>L1Account</Label>
        <TextField
          className="account"
          onChange={(e: any) => {
            setL1Account(e.target.value);
          }}
        />
        */}
        <PrimaryButton
          styles={buttonStyles}
          onClick={() =>
            amount &&
            withdraw(
              props.account,
              props.chainId,
              props.tokenAddress,
              amount
            ) &&
            props.close()
          }
        >
          Ok
        </PrimaryButton>
        <PrimaryButton styles={buttonStyles} onClick={props.close}>
          Cancel
        </PrimaryButton>
      </Stack>
    </Modal>
  );
}
