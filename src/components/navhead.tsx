// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton} from "@fluentui/react/lib/Button";
import { loginL2Account } from "../libs/utils";
import { L1AccountInfo, SubstrateAccountInfo } from "../libs/type";

import MetaMaskLogo from "../icons/metamask.svg";
import PolkaLogo from "../icons/polka.svg";

import "../styles/navhead.css"

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
  setL2Account: () => void;
  charge: () => void;
}

export default function NavHead(props: IProps) {
  return (
    <div className="nav-head">
      <div className="nav-content" key={props.l2Account.account}>
        <img src={PolkaLogo} className="icon"></img>
        {props.l2Account.account}
        <span className="navaddr"> {props.l2Account.address} </span>
        <img src={MetaMaskLogo} className="icon"></img>
        <span className="navaddr"> {props.l1Account.address} </span>
        <div className="navfr">
          <span> ${props.l2Account.balance} </span>
          <button className="btn btn-sm" onClick={() => props.setL2Account()}>
            switch
           </button>
          <button className="btn btn-sm" onClick={() => props.charge()}>
            charge
           </button>
        </div>
      </div>
    </div>
  );
}
