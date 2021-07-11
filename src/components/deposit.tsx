// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack } from "@fluentui/react/lib/Stack";
import { deposit } from "../libs/utils-l1";
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import "./withdraw.css";
import { verticalGapStackTokens } from "./common-styles";

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
  const [process, setProcess] = react.useState<string>("");
  const [approveProgress, setApproveProgress] = react.useState<string>();
  const [depositProgress, setDepositProgress] = react.useState<string>();
  const [finalizeProgress, setFinalizeProgress] = react.useState<string>();
  const [progressInfo, setProgressInfo] = react.useState<number>(0);
  const [error, setError] = react.useState<string>();
  //const [l1account, setL1Account] = react.useState<string>();

  if (props.txprops === undefined) {
    return (<></>);
  }
  const txprops = props.txprops;
  console.log(txprops);

  const initProgress = () => {
    setProgressInfo(0);
    setApproveProgress("Waiting");
    setDepositProgress("Waiting");
    setFinalizeProgress("Waiting");
  }

  const setStateProgress = (state: string, hint: string, receipt: string, ratio: number) => {
    if (state === "Approve") {
      setApproveProgress(hint);
    } else if (state === "Deposit") {
      setDepositProgress(hint);
    } else if (state === "Finalize") {
      setFinalizeProgress(hint);
    }
    if (receipt !== "") {
      //setProgressInfo(state + " " + " " + hint + ":" + receipt);
    }
    setProgressInfo(ratio);
  }

  const setStateError = (error:string) => {
    setError(error);
    setProcess("");
  }

  const okclick = () => {
    initProgress();
    setError("");
    if (amount) {
      setProcess("processing");
      deposit(
        txprops.account,
        txprops.chainId,
        txprops.tokenAddress,
        amount,
        setStateProgress,
        setStateError,
      );
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
        {process === "processing" &&
           <ProgressIndicator label="Processing" percentComplete={progressInfo/(100.0)} />
        }
        {process &&
          <ul className="list-group">
            <li className="list-group-item">Approving token usage:{approveProgress}</li>
            <li className="list-group-item">Desposit:{depositProgress}</li>
            <li className="list-group-item">Finalizing:{finalizeProgress}</li>
          </ul>
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
              disabled = {process !== ""}
              onChange={(e: any) => {
                setAmount(e.target.value);
              }}
            />
            <Label>{txprops.account}</Label>
          </Stack>
        </Stack>
        {!process &&
        <div>
            <button type="button" className="btn btn-sm btn-primary"
             onClick={okclick} >
             Ok
            </button>
            <button type="button" className="btn btn-sm btn-secondary"
             onClick={props.close}>
             Cancel
            </button>
        </div>
        }
        {progressInfo === 100 &&
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
