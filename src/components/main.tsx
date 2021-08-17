// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Nav, INavStyles, INavLinkGroup } from "@fluentui/react";
import "../styles/main.css";
import { loginL2Account } from "../libs/utils";
import { TXProps, L1AccountInfo, SubstrateAccountInfo } from "../libs/type";
import ChargeModal from "../modals/chargemodal";
import NavHead from "./navhead";
import Sidebar from "./sidebar";
import Token from "./token";
import Pool from "./pool";
import Swap from "./swap";
import Supply from "./supply";
import Retrieve from "./retrieve";
import ChargeToken from "../config/charge";

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
  setL2Account: () => void;
}

export default function Main(props: IProps) {
  const [currentPanel, setCurrentPanel] = react.useState<string>("wallet");
  const [currentModal, setCurrentModal] = react.useState<string>("");
  const [currentTXProps, setCurrentTXProps] = react.useState<TXProps>(
    {
      substrateAccount: props.l2Account,
      selectedToken: {
        chainId: "3",
        tokenAddress: ChargeToken.networks["3"].address.replace("0x",""),
      }
    }
  );
  // const navStyles: Partial<INavStyles> = {
  //   root: {
  //     width: 208,
  //     boxSizing: "border-box",
  //     border: "1px solid #eee",
  //     overflowY: "auto",
  //   },
  //   // these link styles override the default truncation behavior
  //   link: {
  //     whiteSpace: "normal",
  //     lineHeight: "inherit",
  //   },
  // };

  // const links = [
  //   {
  //     links: [
  //       {
  //         name: 'Wallet',
  //         key:'wallet',
  //         url: '#wallet',
  //         onClick: () => setCurrentPanel("wallet"),
  //         iconProps: {
  //           //iconName: 'News',
  //           styles: {
  //             root: {
  //               fontSize: 20,
  //               color: '#106ebe',
  //             },
  //           }
  //         }
  //       },
  //       {
  //         name: 'Swapp',
  //         key: 'swap',
  //         url: '#swap',
  //         iconProps: {
  //           //iconName: 'PlayerSettings',
  //           styles: {
  //             root: {
  //               width:0,
  //               fontSize: 20,
  //               color: '#106ebe',
  //             },
  //           }
  //         },
  //         isExpanded: true,
  //         links: [
  //           {
  //             name: 'Within Aggregator',
  //             key: 'aggregator',
  //             url: '#swap/aggregator',
  //             onClick: () => setCurrentPanel("aggregator"),
  //             iconProps: {
  //               //iconName: 'PlayerSettings',
  //               styles: {
  //                 root: {
  //                   fontSize: 20,
  //                   color: '#106ebe',
  //                 },
  //               }
  //             }
  //           },
  //           {
  //             name: 'Cross Chains',
  //             key: 'cross',
  //             url: '#swap/cross',
  //             onClick: () => setCurrentPanel("cross"),
  //             iconProps: {
  //               //iconName: 'PlayerSettings',
  //               styles: {
  //                 root: {
  //                   fontSize: 20,
  //                   color: '#106ebe',
  //                 },
  //               }
  //             },
  //             disable:true,
  //           },
  //         ]
  //       },
  //       {
  //         name: 'Pools',
  //         key: 'pool',
  //         url: '#pools',
  //         iconProps: {
  //           //iconName: 'SwitcherStartEnd',
  //           styles: {
  //             root: {
  //               fontSize: 20,
  //               color: '#106ebe',
  //             },
  //           }
  //         },
  //         isExpanded: true,
  //         links: [
  //           {
  //             name: 'Overview',
  //             key: 'overview',
  //             url: '#pools/overview',
  //             onClick: () => setCurrentPanel("overview"),
  //             iconProps: {
  //               //iconName: 'PlayerSettings',
  //               styles: {
  //                 root: {
  //                   fontSize: 20,
  //                   color: '#106ebe',
  //                 },
  //               }
  //             }
  //           },
  //           {
  //             name: 'Add Liquidity',
  //             key: 'supply',
  //             url: '#pools/supply',
  //             onClick: () => setCurrentPanel("supply"),
  //             iconProps: {
  //               //iconName: 'PlayerSettings',
  //               styles: {
  //                 root: {
  //                   fontSize: 20,
  //                   color: '#106ebe',
  //                 },
  //               }
  //             }
  //           },
  //           {
  //             name: 'Retrieve Liquidity',
  //             key: 'retrieve',
  //             url: '#pools/retrive',
  //             onClick: () => setCurrentPanel("retrieve"),
  //             iconProps: {
  //               //iconName: 'PlayerSettings',
  //               styles: {
  //                 root: {
  //                   fontSize: 20,
  //                   color: '#106ebe',
  //                 },
  //               }
  //             }
  //           },
  //         ]
  //       },
  //     ],
  //   },
  // ];

  return (
    <>
      <NavHead
        l2Account={props.l2Account}
        l1Account={props.l1Account}
        setL2Account={props.setL2Account}
        setPanel={(val) => setCurrentPanel(val)}
        currentPanel={currentPanel}
        charge={()=>{setCurrentModal("Charge")}}
      />
      <div className="main-area">
        <Sidebar
          setPanel={(val) => setCurrentPanel(val)}
          currentPanel={currentPanel}
        />
        <div className="route-area">
          {(currentPanel === "wallet" && (
            <Token l1Account={props.l1Account} l2Account={props.l2Account} />
          )) ||
            (currentPanel === "aggregator" && (
              <Swap l2Account={props.l2Account} />
            )) ||
            (currentPanel === "cross" && (
              <Swap l2Account={props.l2Account} />
            )) ||
            (currentPanel === "supply" && (
              <Supply l2Account={props.l2Account} />
            )) ||
            (currentPanel === "retrieve" && (
              <Retrieve l2Account={props.l2Account} />
            )) ||
            (currentPanel === "overview" && (
              <Pool l2Account={props.l2Account} />
            ))}
                {
            currentModal === "Charge" && (
            <ChargeModal
              txprops = {currentTXProps}
              close={() => {
                setCurrentModal("");
              }}
            />)
          }
        </div>
      </div>
    </>
  );
}
