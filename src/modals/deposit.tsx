// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack } from "@fluentui/react/lib/Stack";
import { deposit } from "../libs/utils-l1";
import { getDepositTxStatus } from "../libs/utils";
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { verticalGapStackTokens } from "../styles/common-styles";
import { Drawer, Tooltip } from "antd";
import InputField from "../components/inputfield";
import "../styles/modal.css";

import { TXProps, SubstrateAccountInfo } from "../libs/type";

interface IProps {
  // show: boolean;
  txprops: TXProps;
  close: () => void;
}

export default function DepositBox(props: IProps) {
  const [amount, setAmount] = react.useState<string>('0');
  const [process, setProcess] = react.useState<string>("");
  const [approveProgress, setApproveProgress] = react.useState<string>();
  const [depositProgress, setDepositProgress] = react.useState<string>();
  const [finalizeProgress, setFinalizeProgress] = react.useState<string>();
  const [progressInfo, setProgressInfo] = react.useState<number>(0);
  const [error, setError] = react.useState<string>();

  const txprops = props.txprops;

  const l2Account = txprops.substrateAccount;
  const selectedToken = txprops.selectedToken;

  const initProgress = () => {
    setProgressInfo(0);
    setApproveProgress("Waiting");
    setDepositProgress("Waiting");
    setFinalizeProgress("Waiting");
  };

  const setStateProgress = (
    state: string,
    hint: string,
    receipt: string,
    ratio: number
  ) => {
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
  };

  const setStateError = (error: string) => {
    setError(error);
    setTimeout(()=>{
      setError('');
    }, 5000)
    setProcess("");
  };

  const okclick = () => {
    initProgress();
    setError("");
    if (amount) {
      setProcess("processing");
      deposit(
        l2Account,
        selectedToken.chainId,
        selectedToken.tokenAddress,
        amount,
        setStateProgress,
        setStateError,
        getDepositTxStatus,
      );
    }
  };

  return (
    <>
      <Drawer
        visible={true}
        onClose={props.close}
        destroyOnClose={true}
        title={"Deposit"}
        placement="right"
        width="320"
      >
        <div className="info-line">
          <div className="label">Chain-Id</div>
          <div className="value">{selectedToken.chainId}</div>
        </div>
        <div className="info-line">
          <div className="label">Token</div>
          <div className="value">
            <Tooltip title={selectedToken.tokenAddress}>
              {selectedToken.tokenAddress.slice(0, 4)}...
              {selectedToken.tokenAddress.slice(-4)}
            </Tooltip>
          </div>
        </div>
        <div className="info-line">
          <div className="label">L2Account</div>
          <div className="value">{l2Account.account}</div>
        </div>
        <div className="info-line vertical">
          <div className="label">Amount</div>
          <InputField
            value={amount}
            disabled={process !== ""}
            onChange={(e: any) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        {process === "processing" && (
          <ProgressIndicator
            label="Processing"
            percentComplete={progressInfo / 100.0}
          />
        )}
        {process && (
          <ul className="list-group">
            <li className="list-group-item">
              Approving token usage:{approveProgress}
            </li>
            <li className="list-group-item">Desposit:{depositProgress}</li>
            <li className="list-group-item">Finalizing:{finalizeProgress}</li>
          </ul>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {!process && (
          <button type="button" className="btn-action" onClick={okclick}>
            Confirm
          </button>
        )}
        {progressInfo === 100 && (
          <button type="button" className="btn-action" onClick={props.close}>
            Done
          </button>
        )}
      </Drawer>

      {/* <Modal
        isOpen={false}
        onDismiss={props.close}
        isBlocking={true}
        className="delphinus-modal"
      >
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            Deposit
          </a>
        </nav>
        <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
          {process === "processing" && (
            <ProgressIndicator
              label="Processing"
              percentComplete={progressInfo / 100.0}
            />
          )}
          {process && (
            <ul className="list-group">
              <li className="list-group-item">
                Approving token usage:{approveProgress}
              </li>
              <li className="list-group-item">Desposit:{depositProgress}</li>
              <li className="list-group-item">Finalizing:{finalizeProgress}</li>
            </ul>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Stack horizontal>
            <Stack verticalAlign={"start"}>
              <Label>Chain-Id:</Label>
              <Label>Token:</Label>
              <Label>Amount:</Label>
              <Label>L2Account:</Label>
            </Stack>
            <Stack verticalAlign={"start"}>
              <Label>{selectedToken.chainId}</Label>
              <Label>{selectedToken.tokenAddress}</Label>
              <TextField
                className="account"
                autoFocus
                disabled={process !== ""}
                onChange={(e: any) => {
                  setAmount(e.target.value);
                }}
              />
              <Label>{l2Account.account}</Label>
            </Stack>
          </Stack>
          {!process && (
            <div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={okclick}
              >
                Ok
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={props.close}
              >
                Cancel
              </button>
            </div>
          )}
          {progressInfo === 100 && (
            <div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={props.close}
              >
                Done
              </button>
            </div>
          )}
        </Stack>
      </Modal> */}
    </>
  );
}
