import React, { useState } from 'react';
import * as react from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'office-ui-fabric-core/dist/css/fabric.min.css'
import SetAccount from './components/account';
import { SubstrateAccountInfo } from "./libs/type";
import { loginL2Account } from "./libs/utils";
import Main from './components/main';


interface PageState {
  selectingAccount: boolean;
  l2Account?: SubstrateAccountInfo;
}

function App() {
  const [pageState, setPageState] = react.useState<PageState>({selectingAccount:true});
  const setL2Account = (account) => {
    console.log("l2Account", account);
    setPageState({...pageState, l2Account:account, selectingAccount:false});
  };

  react.useEffect(() => {
    loginL2Account(
      "Bob",
      setL2Account
    );
  }, []);

  return (
    <div className="vh-100 vw-100">
      { (pageState.selectingAccount === true) && <div>Please login</div> }
      { (pageState.selectingAccount === false) &&
        (pageState.l2Account != undefined)
        && <Main l2Account={pageState.l2Account!} setAccount={setL2Account}/> }
    </div>
  );
}

export default App;
