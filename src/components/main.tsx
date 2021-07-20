// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton} from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Nav } from '@fluentui/react';
import "../styles/main.css";
import { loginL2Account } from "../libs/utils";
import { L1AccountInfo, SubstrateAccountInfo } from "../libs/type";
import Token from "./token";
import Pool from "./pool";
import Swap from "./swap";
import Supply from "./supply";
import Retrieve from "./retrieve";

const navigationStyles = {
  root: {
    height: '100vh',
    boxSizing: 'border-box',
    border: '1px solid #eee',
    overflowY: 'auto',
  },
};

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
  setL2Account: () => void;
}

export default function Main(props: IProps) {
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
            <Label key={props.l2Account.account}>
              {props.l2Account.account}
              <span className="navaddr"> {props.l2Account.address} </span>
              <span> ${props.l2Account.balance} </span>
              <span className="navaddr"> {props.l1Account.address} </span>
              <DefaultButton className="navfr"
                onClick={() => props.setL2Account()}
                key={props.l2Account.address} >
              switch
              </DefaultButton>
            </Label>
          </div>
          {
            (currentPanel === "wallet" && <Token l2Account={props.l2Account}/>)
            || (currentPanel === "swap" && <Swap l2Account={props.l2Account}/>)
            || (currentPanel === "supply" && <Supply l2Account={props.l2Account}/>)
            || (currentPanel === "retrieve" && <Retrieve l2Account={props.l2Account}/>)
            || (currentPanel === "pool" && <Pool l2Account={props.l2Account}/>)
          }
        </Stack>
      </Stack>
  );
}
