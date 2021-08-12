// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { loginL2Account } from "../libs/utils";
import { L1AccountInfo, SubstrateAccountInfo } from "../libs/type";

import MetaMaskLogo from "../icons/metamask.svg";
import PolkaLogo from "../icons/polka.svg";

import "../styles/navhead.scss";

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
  setL2Account: () => void;
}

export default function NavHead(props: IProps) {
  return (
    <div className="nav-head">
      <div className="brand">Delphinus</div>
      <div className="nav-content" key={props.l2Account.account}>
        <div className="box">
          <div>
            <img src={PolkaLogo} className="icon"></img>
            {props.l2Account.account}
            <span className="navaddr"> {props.l2Account.address} </span>
            <img src={MetaMaskLogo} className="icon"></img>
            <span className="navaddr"> {props.l1Account.address} </span>
          </div>
          <div>
            <button
              className="btn-switch"
              onClick={() => props.setL2Account()}
              key={props.l2Account.address}
            >
              switch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
