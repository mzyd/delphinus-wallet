// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import { Modal } from "@fluentui/react";
import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack } from "@fluentui/react/lib/Stack";
import { retrieve } from "../libs/utils";
import "./withdraw.css";
import { verticalGapStackTokens, boxLabelStyles, buttonStyles, titleStyles } from "./common-styles";

interface IProps {
  account: string;
  chainId1: string;
  tokenAddress1: string;
  chainId2: string;
  tokenAddress2: string;
  close: () => void;
}

export default function RetrieveBox(props: IProps) {
  const [amount1, setAmount1] = react.useState<string>("10");
  const [amount2, setAmount2] = react.useState<string>("0");

  return (
    <Modal isOpen={true} onDismiss={props.close} isBlocking={true} className="withdraw">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Remove Liquidity in Delphinus</a>
      </nav>
      <Stack
        verticalAlign={"start"}
        tokens={verticalGapStackTokens}
      >
        <Label>Amount for {props.chainId1} / 0x{props.tokenAddress1}</Label>
        <TextField
          className="account"
          defaultValue={amount1}
          autoFocus
          onChange={(e: any) => {
            setAmount1(e.target.value);
          }}
        />
        <Label>Amount for {props.chainId2} / 0x{props.tokenAddress2}</Label>
        <TextField
          className="account"
          defaultValue={amount2}
          onChange={(e: any) => {
            setAmount2(e.target.value);
          }}
        />
        <div>
        <button type="button" className="btn btn-sm btn-primary"
          onClick={() => {
              (amount1 || amount2) &&
              retrieve(props.account, props.chainId1, props.tokenAddress1, props.chainId2, props.tokenAddress2, amount1 || "0", amount2 || "0");
              props.close();
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
