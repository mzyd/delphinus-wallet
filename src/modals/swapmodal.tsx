// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
// import { Modal } from "@fluentui/react";
// import { Label } from "@fluentui/react";
// import { TextField } from "@fluentui/react/lib/TextField";
// import { Stack } from "@fluentui/react/lib/Stack";
import { IDropdownStyles } from "@fluentui/react/lib/Dropdown";
import { Drawer, Tooltip } from "antd";

import { swap } from "../libs/utils";
import { SubstrateAccountInfo } from "../libs/type";

// import { verticalGapStackTokens } from "../styles/common-styles";
import "../styles/modal.css";

interface IProps {
  l2Account: SubstrateAccountInfo;
  chainId0: string;
  token0: string;
  chainId1: string;
  token1: string;
  amount?: string;
  close: () => void;
}

// const dropdownStyles: Partial<IDropdownStyles> = {};

export default function SwapModal(props: IProps) {
  // const [fromTokenKey, setFromTokenKey] = react.useState<number>(0);
  // const [defaultValue, setDefaultValue] = react.useState<number>(10);

  return (
    <>
      <Drawer
        visible={true}
        onClose={props.close}
        destroyOnClose={true}
        title={"Confirm Swap"}
        placement="right"
        width="320"
      >
        <div className="chain-id">Chain-Id {props.chainId0}</div>
        <div className="info-line">
          <div className="label">Amount</div>
          <div className="value">{props.amount}</div>
        </div>
        <div className="info-line">
          <div className="label">Token</div>
          <div className="value">
            <Tooltip title={props.token0}>
              {props.token0.slice(0, 4)}...
              {props.token0.slice(-4)}
            </Tooltip>
          </div>
        </div>
        <div className="chain-id">Chain-Id {props.chainId1}</div>
        <div className="info-line">
          <div className="label">Amount</div>
          <div className="value">{props.amount}</div>
        </div>
        <div className="info-line">
          <div className="label">Token</div>
          <div className="value">
            <Tooltip title={props.token1}>
              {props.token1.slice(0, 4)}...
              {props.token1.slice(-4)}
            </Tooltip>
          </div>
        </div>
        <button
          type="button"
          className="btn-action"
          onClick={() => {
            swap(
              props.l2Account,
              props.chainId0,
              props.token0,
              props.chainId1,
              props.token1,
              props.amount!
            );
            props.close();
          }}
        >
          Confirm
        </button>
      </Drawer>
      {/* <Modal
        isOpen={false}
        onDismiss={props.close}
        isBlocking={true}
        className="delphinus-modal"
      >
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            Confirm Swap
          </a>
        </nav>
        <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
          <Label>
            Amount for {props.chainId0} / 0x{props.token0}
          </Label>
          <TextField className="account" disabled defaultValue={props.amount} />
          <Label>
            Amount for {props.chainId1} / 0x{props.token1}
          </Label>
          <TextField className="account" disabled defaultValue={props.amount} />
          <div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                swap(
                  props.l2Account,
                  props.chainId0,
                  props.token0,
                  props.chainId1,
                  props.token1,
                  props.amount!
                );
                props.close();
              }}
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
        </Stack>
      </Modal> */}
    </>
  );
}
