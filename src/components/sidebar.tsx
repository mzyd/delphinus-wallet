// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import WalletIcon from "../icons/sidebar/wallet.svg";
import SwapIcon from "../icons/sidebar/swap.svg";
import AddLiquidityIcon from "../icons/sidebar/addLiquidity.svg";
import RetrieveLiquidityIcon from "../icons/sidebar/retrieveLiquidity.svg";
import AllPoolsIcon from "../icons/sidebar/allPools.svg";

import WalletIconActive from "../icons/sidebar/wallet-active.svg";
import SwapIconActive from "../icons/sidebar/swap-active.svg";
import AddLiquidityIconActive from "../icons/sidebar/addLiquidity-active.svg";
import RetrieveLiquidityIconActive from "../icons/sidebar/retrieveLiquidity-active.svg";
import AllPoolsIconActive from "../icons/sidebar/allPools-active.svg";

import "../styles/sidebar.scss";

interface IProps {
  setPanel: (target: string) => void;
  currentPanel: string;
}

export default function Sidebar(props: IProps) {
  const { setPanel, currentPanel } = props;
  const links = [
    {
      name: "Wallet",
      key: "wallet",
      url: "#wallet",
      onClick: () => setPanel("wallet"),
      icon: currentPanel === "wallet" ? WalletIconActive : WalletIcon,
    },
    {
      name: "Swap",
      key: "aggregator",
      url: "#swap/aggregator",
      onClick: () => setPanel("aggregator"),
      icon: currentPanel === "aggregator" ? SwapIconActive : SwapIcon,
    },
    {
      name: "Add Liquidity",
      key: "supply",
      url: "#pools/supply",
      onClick: () => setPanel("supply"),
      icon:
        currentPanel === "supply" ? AddLiquidityIconActive : AddLiquidityIcon,
    },
    {
      name: "Retrieve Liquidity",
      key: "retrieve",
      url: "#pools/retrive",
      onClick: () => setPanel("retrieve"),
      icon:
        currentPanel === "retrieve"
          ? RetrieveLiquidityIconActive
          : RetrieveLiquidityIcon,
    },
    {
      name: "All pools",
      key: "overview",
      url: "#pools/overview",
      onClick: () => setPanel("overview"),
      icon: currentPanel === "overview" ? AllPoolsIconActive : AllPoolsIcon,
    },
    // {
    //   name: "Cross Chains",
    //   key: "cross",
    //   url: "#swap/cross",
    //   onClick: () => setPanel("cross"),
    //   iconProps: {
    //     //iconName: 'PlayerSettings',
    //     styles: {
    //       root: {
    //         fontSize: 20,
    //         color: "#106ebe",
    //       },
    //     },
    //   },
    //   disable: true,
    // },
  ];

  return (
    <div className="sidebar">
      {links.map((item) => (
        <div
          onClick={item.onClick}
          className={`sidebar-item ${
            item.key === currentPanel ? "active" : ""
          }`}
        >
          <img src={item.icon} className="icon" />
          {item.name}
        </div>
      ))}
    </div>
  );
}
