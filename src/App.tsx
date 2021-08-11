import React, { useState } from 'react';
import * as react from "react";
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'office-ui-fabric-core/dist/css/fabric.min.css'
import SetAccount from './components/account';
import { L1AccountInfo, SubstrateAccountInfo } from "./libs/type";
import { loginL2Account, fetchL2Accounts } from "./libs/utils";
import { loginL1Account } from "./libs/utils-l1";
import Main from './components/main';
const Client = require("web3subscriber/client")

function App() {
  const [l2Account, setL2Account] = react.useState<SubstrateAccountInfo>();
  const [l1Account, setL1Account] = react.useState<L1AccountInfo>();
  const [l2Addresses, setL2Addresses] = react.useState<string[]>();
  const updateL1AccountAddress = (l1address:string) => {
    console.log("switch account:", l1address);
    setL1Account({...l1Account!, address:l1address});
  }
  const updateL1Account = (account:L1AccountInfo) => {
    setL1Account(account);
    Client.subscribeAccountChange(true, updateL1AccountAddress);
  };
  const updateL2Account = (account:SubstrateAccountInfo) => {
    setL2Account(account);
    console.log("l2account updated");
  };

  const switchL2Account = () => {
    setL2Account(undefined);
  }

  const confirmAccount = (u:string) => {
    console.log("l2account confirmed");
    loginL2Account(u, updateL2Account);
  };

  react.useEffect(() => {
    fetchL2Accounts(setL2Addresses);
    loginL1Account(updateL1Account);

  }, []);

  return (
    <div className="vh-100 vw-100">
      { (l2Account === undefined || l1Account === undefined)
        && <SetAccount done={confirmAccount} accounts={l2Addresses} l1Account={l1Account} ></SetAccount> }
      { (l2Account !== undefined && l1Account !== undefined)
        && <Main
            l1Account={l1Account!}
            l2Account={l2Account!}
            setL2Account={switchL2Account}/>
      }
    </div>
  );
}

export default App;
