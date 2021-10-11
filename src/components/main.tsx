// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Nav, INavStyles, INavLinkGroup } from "@fluentui/react";
import "../styles/main.css";
import { loginL2Account } from "../libs/utils";
import {
    TXProps,
    L1AccountInfo,
    SubstrateAccountInfo,
    BridgeMetadata,
} from "../libs/type";
import ChargeModal from "../modals/chargemodal";
import NavHead from "./navhead";
import Sidebar from "./sidebar";
import Token from "./token";
import Pool from "./pool";
import Swap from "./swap";
import Supply from "./supply";
import Retrieve from "./retrieve";
import ChargeToken from "../config/charge";

const charge_address = ChargeToken.networks['3'].address.replace("0x","");

interface IProps {
  l2Account: SubstrateAccountInfo;
  l1Account: L1AccountInfo;
  bridgeMetadata: BridgeMetadata;
  setL2Account: () => void;
}

export default function Main(props: IProps) {
  const snap = props.bridgeMetadata.snap;
  const [currentPanel, setCurrentPanel] = react.useState<string>("wallet");
  const [currentModal, setCurrentModal] = react.useState<string>("");
  const [currentTXProps, setCurrentTXProps] = react.useState<TXProps>(
    {
      substrateAccount: props.l2Account,
      selectedToken: {
        chainId: snap,
        //tokenAddress: ChargeToken.networks[snap].address.replace("0x",""),
        tokenAddress: "0x12",
      }
    }
  );

  return (
    <>
      <NavHead
        l2Account={props.l2Account}
        l1Account={props.l1Account}
        setL2Account={props.setL2Account}
        setPanel={(val) => setCurrentPanel(val)}
        currentPanel={currentPanel}
        charge={()=>{
          setCurrentTXProps({
            ...currentTXProps,
            selectedToken: {
              chainId: snap,
              tokenAddress: charge_address,
            }
          });
          setCurrentModal("Charge")}
        }
      />
      <div className="main-area">
        <Sidebar
          setPanel={(val) => setCurrentPanel(val)}
          currentPanel={currentPanel}
        />
        <div className="route-area">
            {(currentPanel === "wallet" && (
              <Token l1Account={props.l1Account}
                   l2Account={props.l2Account}
                   bridgeMetadata={props.bridgeMetadata}
              />
            )) ||
            (currentPanel === "aggregator" && (
              <Swap l2Account={props.l2Account}
                    bridgeMetadata={props.bridgeMetadata}
               />
            )) ||
            (currentPanel === "cross" && (
              <Swap l2Account={props.l2Account}
                    bridgeMetadata={props.bridgeMetadata}
               />
            )) ||
            (currentPanel === "supply" && (
              <Supply l2Account={props.l2Account}
                    bridgeMetadata={props.bridgeMetadata}
               />
            )) ||
            (currentPanel === "retrieve" && (
              <Retrieve l2Account={props.l2Account}
                    bridgeMetadata={props.bridgeMetadata}
               />
            )) ||
            (currentPanel === "overview" && (
              <Pool l2Account={props.l2Account}
                    bridgeMetadata={props.bridgeMetadata}
               />
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
