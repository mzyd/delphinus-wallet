// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from 'react';

import { Dropdown, Label, Separator } from "@fluentui/react";
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { loginL1Account } from "./libs/utils-l1";
import "../styles/account.css"
import MetaMaskLogo from "../icons/metamask.svg";
import PolkaLogo from "../icons/polka.svg";

interface IProps {
  accounts?: string[],
  l1Account?: loginL1Account,
  done: () => void
}

const verticalGapStackTokens: IStackTokens = {
  childrenGap: '1rem',
  padding: 10,
};

const separatorStyles = {
  root: [{
    selectors: {
      '::before': {
        background: '#080612',
      },
    }
  }]
};

const titleStyles = {
  root: [{
    fontFamily: 'Girassol',
    fontSize: '4rem'
  }]
}

const normalStyles = {
  root: [{
    fontFamily: 'KoHo',
    fontSize: '1.5rem'
  }]
}

export default function SetAccount(props: IProps) {
  const [account, setAccount] = react.useState<string>();

  const accounts = () => {
    console.log(props.accounts);
    let select_options = props.accounts.map((c) => ({
      key: c.address,
      text: c.address,
    }));
    return select_options;
  };

  return (
    <div className="h-75 w-100 d-flex justify-content-center align-items-center">
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
              defaultSelectedKey={props.accounts[0]}
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
    </div>
  );
}
