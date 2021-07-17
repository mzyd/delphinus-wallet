// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { withdraw } from "../libs/utils";
import { verticalGapStackTokens } from "../styles/common-styles";
import "../styles/modal.css";

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

export default function WithdrawBox(props: IProps) {
  const [amount, setAmount] = react.useState<string>();
  const [progress, setProgress] = react.useState<string>();
  const [process, setProcess] = react.useState<string>("");
  const [error, setError] = react.useState<string>();
  //const [l1account, setL1Account] = react.useState<string>();

  if (props.txprops == undefined) {
    return (<></>);
  }
  const txprops = props.txprops;
  console.log(txprops);

  const okclick = () => {
    console.log("withdraw account:", txprops.account);
    console.log("tokenAddress:", txprops.tokenAddress);
    if (amount) {
      setProcess("processing");
      withdraw (
        txprops.account,
        txprops.chainId,
        txprops.tokenAddress,
        amount,
        (x => setProgress(x)),
        (x => setError(x)),
      );
      setProcess("done");
    }
  }


  return (
    <Modal isOpen={props.show} onDismiss={props.close} isBlocking={true} className="withdraw">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Deposit</a>
      </nav>
      <Stack
        verticalAlign={"start"}
        tokens={verticalGapStackTokens}
      >
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
            <Label>L2Account:</Label>
            <Label>Chain-Id:</Label>
            <Label>Token:</Label>
            <Label>Amount:</Label>
          </Stack>
          <Stack verticalAlign={"start"}>
            <Label>{txprops.account}</Label>
            <Label>{txprops.chainId}</Label>
            <Label>{txprops.tokenAddress}</Label>
            <TextField
              className="account"
              autoFocus
              onChange={(e: any) => {
                setAmount(e.target.value);
              }}
            />
          </Stack>
        </Stack>
        {!process &&
        <div>
            <PrimaryButton onClick={okclick} >
             Ok
            </PrimaryButton>
            <PrimaryButton onClick={props.close}>
              Cancel
            </PrimaryButton>
        </div>
        }
        {process && process == "done" &&
        <div>
            <button type="button" className="btn btn-sm btn-primary"
             onClick={props.close} >
             Done
            </button>
        </div>
        }
      </Stack>
    </Modal>
  );
}
