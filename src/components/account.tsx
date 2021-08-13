// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-nocheck
import * as react from "react";

import { Dropdown } from "@fluentui/react";
// import { IStackTokens } from "@fluentui/react/lib/Stack";
import { Modal } from "antd";
import { L1AccountInfo } from "../libs/type";
import "../styles/account.scss";
import MetaMaskLogo from "../icons/metamask.svg";
import PolkaLogo from "../icons/polka.svg";

interface IProps {
  accounts?: string[];
  l1Account?: L1AccountInfo;
  done: (u: string) => void;
}

// const verticalGapStackTokens: IStackTokens = {
//   childrenGap: "1rem",
//   padding: 10,
// };

// const separatorStyles = {
//   root: [
//     {
//       selectors: {
//         "::before": {
//           background: "#080612",
//         },
//       },
//     },
//   ],
// };

// const titleStyles = {
//   root: [
//     {
//       fontFamily: "Girassol",
//       fontSize: "4rem",
//     },
//   ],
// };

// const normalStyles = {
//   root: [
//     {
//       fontFamily: "KoHo",
//       fontSize: "1.5rem",
//     },
//   ],
// };

export default function SetAccount(props: IProps) {
  const [account, setAccount] = react.useState<string>();

  const accounts = () => {
    console.log(props.accounts);
    let select_options = props!.accounts!.map((c) => ({
      key: c,
      text: c,
    }));
    return select_options;
  };

  return (
    <>
      <Modal visible={true} title="Welcome to Delphinus" footer={null}>
        <div className="modal-label">
          Connecting Account for Aggregate Layer
        </div>

        {props.accounts && props.accounts.length != 0 && (
          <div>
            <div className="hole">
            <img src={PolkaLogo} className="chain-icon"></img>
              <Dropdown
                placeholder="Select Account From Polkadot Wallets"
                className="account-dropdown"
                options={accounts()}
                onChange={(_, option) => {
                  console.log("option is:", option);
                  if (option) {
                    setAccount(option.key as string);
                    props.done(option.key as string);
                  }
                }}
                //defaultSelectedKey={props.accounts[0]}
              />
            </div>
          </div>
        )}
        {(props.accounts === undefined || props.accounts.length === 0) && (
          <a href="https://polkadot.js.org/extension/">
            connecting aggregate layer with polkadot.js
          </a>
        )}
        <div className="modal-label">Connecting Account for Source Layer</div>
        {props.l1Account === undefined && (
          <a href="https://polkadot.js.org/extension/">
            connecting source layer with metamask
          </a>
        )}
        {props.l1Account && (
          <div className="metamask-zone">
            <img src={MetaMaskLogo} className="chain-icon"></img>
            <span className="address">{props.l1Account.address}</span>
          </div>
        )}
      </Modal>
      {/* <div className="h-75 w-100 d-flex justify-content-center align-items-center">
      <Stack>
      <Label styles={titleStyles}>Welcome to Delphinus</Label>
        <Separator styles={separatorStyles}/>
        <Stack tokens={verticalGapStackTokens}>
          <Label styles={normalStyles}>Connecting Account for Aggregate Layer</Label>
          {props.accounts && props.accounts.length != 0 &&
          <div>
          <img src={PolkaLogo} className="chain-icon"></img>
          <Dropdown
              placeholder="Select Account From Polkadot Wallets"
              options={accounts()}
              onChange={(_, option) => {
                console.log("option is:", option);
                if (option) {
                  setAccount(option.key as string);
                  props.done(option.key as string);
                }
              }}
              //defaultSelectedKey={props.accounts[0]}
          />
          </div>
          }
          {(props.accounts === undefined || props.accounts.length === 0) &&
          <a href="https://polkadot.js.org/extension/">connecting aggregate layer with polkadot.js</a>
          }
          <Label styles={normalStyles}>Connecting Account for Source Layer</Label>
          {(props.l1Account === undefined) &&
          <a href="https://polkadot.js.org/extension/">connecting source layer with metamask</a>
          }
          {(props.l1Account) &&
          <div><img src={MetaMaskLogo} className="chain-icon"></img><span>{props.l1Account.address}</span></div>
          }

        </Stack>
      </Stack>
    </div> */}
    </>
  );
}
