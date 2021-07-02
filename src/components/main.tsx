// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, * as react from "react";

import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { DefaultButton, IconButton} from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Separator } from "@fluentui/react/lib/Separator";
import { Nav, initializeIcons } from '@fluentui/react';
import "./main.css";
import { getAddressOfAccoutAsync } from "../libs/utils";
import Token from "./token";
import Pool from "./pool";
import { buttonStyles, normalLabelStyles, separatorStyles, titleStyles, verticalGapStackTokens } from "./common-styles";

const navigationStyles = {
  root: {
    height: '100vh',
    boxSizing: 'border-box',
    border: '1px solid #eee',
    overflowY: 'auto',
    paddingTop: '10vh',
  },
};

const links = [
  {
    links: [
      {
        name: 'Wallet',
        key:'key1',
        url: '/',
        iconProps: {
          iconName: 'News',
          styles: {
            root: {
              fontSize: 20,
              color: '#106ebe',
            },
          }
        }
      },
      {
        name: 'Swap',
        key: 'key2',
        url: '/',
        iconProps: {
          iconName: 'PlayerSettings',
          styles: {
            root: {
              fontSize: 20,
              color: '#106ebe',
            },
          }
        }
      },
      {
        name: 'Liquid Pool',
        key: 'key3',
        url: '/',
        iconProps: {
          iconName: 'SwitcherStartEnd',
          styles: {
            root: {
              fontSize: 20,
              color: '#106ebe',
            },
          }
        }
      },
    ],
  },
];

interface IProps {
  account: string;
  setAccount: (account: string) => void;
}

export default function Main(props: IProps) {
  const [addressPair, setAddressPair] = react.useState<[string, string]>();

  if (!addressPair || props.account !== addressPair[0]) {
    getAddressOfAccoutAsync(
      props.account,
      (account: string, address: string) => {
        setAddressPair([account, address]);
      }
    );
  }

  const basicInfo = {
      account: addressPair?.[0] || "",
      onClickButton: () => props.setAccount(""),
      address: addressPair?.[1] || "",
  };

  const navHead = {
    backgroundColor: "#cccccc",
    color: "white",
    lineHeight: '50px',
    padding: '0 20px',
  };

  return (
      <Stack horizontal className="vw-100">
        <Stack>
          <Nav
            groups={links}
            selectedKey='key1'
            styles={navigationStyles}
          />
        </Stack>
        <Stack disableShrink={true} grow={1}>
          <div style={navHead}>
            <Label key={basicInfo.account}>
              {basicInfo.account}
              <span className="navaddr"> {basicInfo.address} </span>
              <DefaultButton className="navfr"
                onClick={() => item.onClickButton?.()}
                key={basicInfo.address} >
              switch
              </DefaultButton>
            </Label>
          </div>
          <Token account={props.account}/>
        </Stack>
      </Stack>
  );
}
