import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'office-ui-fabric-core/dist/css/fabric.min.css'
import SetAccount from './components/account';
import Main from './components/main';

function App() {
  const [account, setAccount] = useState<string>();

  if (account === undefined) {
    setAccount('Bob');
  }

  return (
    <div className="vh-100 vw-100">
      { !account && <SetAccount onClick={setAccount}/> }
      { account && <Main account={account} setAccount={setAccount}/> }
    </div>
  );
}

export default App;
