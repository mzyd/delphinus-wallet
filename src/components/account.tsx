// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from 'react';

import { Label } from '@fluentui/react';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { Separator } from '@fluentui/react/lib/Separator';
import './account.css';

interface IProps {
  onClick: (account: string) => void
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
    fontSize: '8rem'
  }]
}

const normalStyles = {
  root: [{
    fontFamily: 'KoHo',
    fontSize: '4rem'
  }]
}

const buttonStyles = {
  root: [{
    fontFamily: 'KoHo',
    fontSize: '1rem'
  }]
}

export default function SetAccount(props: IProps) {
  const [account, setAccount] = react.useState<string>();
  return (
    <div className="h-75 w-100 d-flex justify-content-center align-items-center">
      <Stack>
      <Label styles={titleStyles}>Welcome to Swapper</Label>
        <Separator styles={separatorStyles}/>
        <Stack tokens={verticalGapStackTokens}>
          <Label styles={normalStyles}>Please enter your account</Label>
          <TextField className="account" autoFocus onChange={(e: any) => { setAccount(e.target.value)}} placeholder="E.g., Alice"/>
          <PrimaryButton styles={buttonStyles} onClick={() => account && props.onClick(account)}>GO ON</PrimaryButton>
        </Stack>
      </Stack>
    </div>
  );
}
