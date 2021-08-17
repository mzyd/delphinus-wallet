// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";

// import { Label } from "@fluentui/react";
// import { DefaultButton } from "@fluentui/react/lib/Button";
// import { loginL2Account } from "../libs/utils";
import { L1AccountInfo, SubstrateAccountInfo } from "../libs/type";
import { Drawer } from "antd";
import Sidebar from "../components/sidebar";
import MetaMaskLogo from "../icons/metamask.svg";
import PolkaLogo from "../icons/polka.svg";

import "../styles/navhead.scss";

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
  currentPanel: string;
  setL2Account: () => void;
  setPanel: (target: string) => void;
  charge: () => void;
}

export default function NavHead(props: IProps) {
  const { setPanel, currentPanel } = props;
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const panelChange = (val:string) => {
    setPanel(val)
    setMobileMenuVisible(false)
  }
  return (
    <div className="nav-head">
      <div className="brand">Delphinus</div>
      <div className="nav-content" key={props.l2Account.account}>
        <div className="box">
          <div className="address-box">
            <div>
              <img src={PolkaLogo} className="icon"></img>
              {props.l2Account.account}
              <span className="navaddr"> {props.l2Account.address} </span>
            </div>
            <div>
              <img src={MetaMaskLogo} className="icon"></img>
              <span className="navaddr"> {props.l1Account.address} </span>
            </div>
          </div>
          <div className="action-area">
            <button
              className="btn-switch"
              onClick={() => props.setL2Account()}
              key={props.l2Account.address}
            >
              Switch
            </button>
            <button className="btn-switch" onClick={() => props.charge()}>
              Charge
            </button>
            <button
              className="btn-switch btn-mobile-menu"
              onClick={() => setMobileMenuVisible(true)}
            >
              Menu
            </button>
          </div>
        </div>
      </div>
      {mobileMenuVisible && (
        <Drawer
          visible={true}
          onClose={() => setMobileMenuVisible(false)}
          destroyOnClose={true}
          className="menu-drawer"
          title={"Menu"}
          placement="left"
        >
          <Sidebar setPanel={panelChange} currentPanel={currentPanel} />
        </Drawer>
      )}
    </div>
  );
}
