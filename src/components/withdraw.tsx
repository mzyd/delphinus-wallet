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

interface TXProps {
  account: string;
  chainId: string;
  tokenAddress: string;
}

interface IProps {
  show: boolean;
  txprops: TXProps;
  close: () => void;
}

export default function DepositBox(props: IProps) {
  const [amount, setAmount] = react.useState<string>();
  const [progress, setProgress] = react.useState<string>();
  const [error, setError] = react.useState<string>();
  //const [l1account, setL1Account] = react.useState<string>();

  if (props.txprops == undefined) {
    return (<></>);
  }
  const txprops = props.txprops;
  console.log(txprops);

  const okclick = () => {
    amount &&
    withdraw (
      txprops.account,
      txprops.chainId,
      txprops.tokenAddress,
      amount,
      (x => setProgress(x)),
      (x => setError(x)),
    );
  }


  return (
    <Modal isOpen={props.show} onDismiss={props.close} isBlocking={true}>
      <Stack
        verticalAlign={"start"}
        tokens={verticalGapStackTokens}
        className="withdraw"
      >
        <Label>Withdraw</Label>
        {
          progress &&
          <div className="alert alert-primary" role="alert">{progress}</div>
        }
        {
          error &&
          <div className="alert alert-danger" role="alert">{error}</div>
        }
        <Stack horizontal>
          <Stack verticalAlign={"start"}>
            <Label>Chain-Id:</Label>
            <Label>Token:</Label>
            <Label>Amount:</Label>
            <Label>L2Account:</Label>
          </Stack>
          <Stack verticalAlign={"start"}>
            <Label>{txprops.chainId}</Label>
            <Label>{txprops.tokenAddress}</Label>
            <TextField
              className="account"
              autoFocus
              disabled = { true}
              onChange={(e: any) => {
                setAmount(e.target.value);
              }}
            />
            <Label>{txprops.account}</Label>
          </Stack>
        </Stack>
        <div>
            <PrimaryButton onClick={okclick} >
             Ok
            </PrimaryButton>
            <PrimaryButton onClick={props.close}>
              Cancel
            </PrimaryButton>
        </div>
      </Stack>
    </Modal>
  );
}
