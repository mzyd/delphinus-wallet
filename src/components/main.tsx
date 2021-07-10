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
import Swap from "./swap";
import Supply from "./supply";
import Retrieve from "./retrieve";
import { buttonStyles, normalLabelStyles, separatorStyles, titleStyles, verticalGapStackTokens } from "./common-styles";

const navigationStyles = {
  root: {
    height: '100vh',
    boxSizing: 'border-box',
    border: '1px solid #eee',
    overflowY: 'auto',
  },
};

interface IProps {
  account: string;
  setAccount: (account: string) => void;
}

export default function Main(props: IProps) {
  const [addressPair, setAddressPair] = react.useState<[string, string]>();
  const [currentPanel, setCurrentPanel] = react.useState<string>("wallet");

  const links = [
    {
      links: [
        {
          name: 'Wallet',
          key:'wallet',
          url: '',
          onClick: () => setCurrentPanel("wallet"),
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
          key: 'swap',
          url: '',
          onClick: () => setCurrentPanel("swap"),
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
          name: 'Add Liqidity',
          key: 'supply',
          url: '',
          onClick: () => setCurrentPanel("supply"),
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
          name: 'Retrieve Liqidity',
          key: 'retrieve',
          url: '',
          onClick: () => setCurrentPanel("retrieve"),
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
          name: 'All Pools',
          key: 'pool',
          url: '',
          onClick: () => setCurrentPanel("pool"),
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
          <div className="brand">Delphinus</div>
          <Nav
            groups={links}
            selectedKey={currentPanel}
            styles={navigationStyles}
          />
        </Stack>
        <Stack disableShrink={true} grow={1}>
          <div style={navHead}>
            <Label key={basicInfo.account}>
              {basicInfo.account}
              <span className="navaddr"> {basicInfo.address} </span>
              <DefaultButton className="navfr"
                onClick={() => basicInfo.onClickButton?.()}
                key={basicInfo.address} >
              switch
              </DefaultButton>
            </Label>
          </div>
          {
            (currentPanel === "wallet" && <Token account={props.account}/>)
            || (currentPanel === "swap" && <Swap account={props.account}/>)
            || (currentPanel === "supply" && <Supply account={props.account}/>)
            || (currentPanel === "retrieve" && <Retrieve account={props.account}/>)
            || (currentPanel === "pool" && <Pool account={props.account}/>)
          }
        </Stack>
      </Stack>
  );
}
