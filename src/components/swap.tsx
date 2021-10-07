// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react/lib/TextField";
import { queryPoolAmountAsync } from "../libs/utils";
import SwapModal from "../modals/swapmodal";
import ChainSelector from "./chainselector";
import InputField from "./inputfield";
import TokenSelector from "./tokenselector";
import { Dropdown, Label, Separator } from "@fluentui/react";
import { TXProps, SubstrateAccountInfo, BridgeMetadata, TokenInfoFull } from "../libs/type";

import "../styles/panel.css";

interface IProps {
  l2Account: SubstrateAccountInfo;
  bridgeMetadata: BridgeMetadata;
}

const verticalGapStackTokens: IStackTokens = {
  childrenGap: "1rem",
  padding: "0.5rem",
};

enum PoolOps {
  Supply,
  Retrieve,
  Swap,
}

interface ChainInfo {
  chainId: string;
  tokens: string[];
}

export default function Swap(props: IProps) {
  const chainInfoList: ChainInfo[] = props.bridgeMetadata.chainInfo.map((c) => ({
    chainId: c.chainId,
    tokens: c.tokens.map((t) => t.address.replace("0x", "")),
  }));

  const [selectedPoolOps, setSelectedPoolOps] = react.useState<PoolOps>();
  const [chainId0, setChainId0] = react.useState<string>(
    chainInfoList[0].chainId
  );
  const [chainId1, setChainId1] = react.useState<string>(
    chainInfoList[1].chainId
  );
  const [token0, setToken0] = react.useState<string>(
    chainInfoList[0].tokens[0]
  );
  const [token1, setToken1] = react.useState<string>(
    chainInfoList[1].tokens[0]
  );
  const [amount0, setAmount0] = react.useState<string>("0");
  const [amount1, setAmount1] = react.useState<string>(amount0);
  const [liquid0, setLiquid0] = react.useState<string>();
  const [liquid1, setLiquid1] = react.useState<string>();

  react.useEffect(() => {
    const _token0 = token0;
    const _token1 = token1;
    const _chainId0 = chainId0;
    const _chainId1 = chainId1;

    const updator = async () => {
      const tokenEqual = (x: TokenInfoFull, chainId: string, token: string) => {
        console.log(x);
      return x.tokenAddress.toLowerCase() === token?.toLowerCase() && x.chainId === chainId;
      }

      const pool = props.bridgeMetadata.poolInfo.find(
        (x) =>
          (tokenEqual(x.tokens[0], chainId0, token0) &&
            tokenEqual(x.tokens[1], chainId1, token1)) ||
          (tokenEqual(x.tokens[1], chainId0, token0) &&
            tokenEqual(x.tokens[0], chainId1, token1))
      );

      pool && await queryPoolAmountAsync(
        pool.id,
        (v0: string, v1: string) => {
          if (pool.tokens[0].tokenAddress === token0) {
            setLiquid0(v0);
            setLiquid1(v1);
          } else {
            setLiquid0(v1);
            setLiquid1(v0);
          }
        }
      );
    };
    resetPool();
    updator();
  }, [chainId0, chainId1, token0, token1]);

  const resetPool = () => {
    setLiquid0("loading...");
    setLiquid1("loading...");
  };

  return (
    <>
      <div className="action-box">
        <div className="header">Swap</div>
        <div className="content">
          <div className="tag">FROM</div>
          <div>
            <ChainSelector
              default={chainId0}
              setToken={setToken0}
              setChain={setChainId0}
              bridgeMetadata={props.bridgeMetadata}
            />
            <TokenSelector
              default={token0}
              chainId={chainId0}
              setToken={setToken0}
              bridgeMetadata={props.bridgeMetadata}
            />
            <InputField
              label="Amount"
              value={amount0}
              onChange={(e: any) => {
                setAmount0(e.target.value);
                setAmount1(e.target.value);
              }}
            />

            {liquid0 && <div className="liquidity">Liquidity: {liquid0}</div>}
            <div className="available">Available: 1024 USDT</div>
          </div>

          <div className="tag">TO</div>
          <div>
            <ChainSelector
              default={chainId1}
              setToken={setToken1}
              setChain={setChainId1}
              bridgeMetadata={props.bridgeMetadata}
            />
            <TokenSelector
              default={token1}
              chainId={chainId1}
              setToken={setToken1}
              bridgeMetadata={props.bridgeMetadata}
            />
          </div>
          {liquid1 && (
            <div className="liquidity">
              Liquidity: {liquid1}
            </div>
          )}
          <div className="will-get">You will get: {amount1}</div>
          <button
            type="button"
            className="btn-confirm"
            disabled={token0 === token1 && chainId0 === chainId1}
            onClick={() => {
              setSelectedPoolOps(PoolOps.Swap);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
      {/* <Stack
        horizontal
        horizontalAlign={"center"}
        tokens={verticalGapStackTokens}
      >
        <Stack tokens={verticalGapStackTokens}>
          <div className="swap-selector" key="retrieve">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <a className="navbar-brand" href="#">
                Swap:
              </a>
            </nav>
            <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
              <ul className="list-group">
                <ChainSelector
                  default={chainId0}
                  setToken={setToken0}
                  setChain={setChainId0}
                  bridgeMetadata={props.bridgeMetadata}
                />
                <div className="p-1" />
                <TokenSelector
                  default={token0}
                  chainId={chainId0}
                  setToken={setToken0}
                  bridgeMetadata={props.bridgeMetadata}
                />
                <div className="p-1" />
                <TextField
                  label="Liquidity"
                  readOnly
                  underlined
                  disabled
                  value={liquid0 ?? "loading ..."}
                />
                <div className="p-1" />
                <TextField
                  label="Amount"
                  underlined
                  value={amount0 ?? "loading ..."}
                  onChange={(e: any) => {
                    setAmount0(e.target.value);
                    setAmount1(e.target.value);
                  }}
                />
              </ul>
              <Separator> To </Separator>
              <ul className="list-group">
                <ChainSelector
                  default={chainId1}
                  setToken={setToken1}
                  setChain={setChainId1}
                  bridgeMetadata={props.bridgeMetadata}
                />
                <div className="p-1" />
                <TokenSelector
                  default={token1}
                  chainId={chainId1}
                  setToken={setToken1}
                  bridgeMetadata={props.bridgeMetadata}
                />
                <div className="p-1" />
                <TextField
                  label="Liquidity"
                  readOnly
                  underlined
                  disabled
                  value={liquid1 ?? "loading ..."}
                />
                <div className="p-1" />
                <TextField
                  label="Amount"
                  readOnly
                  underlined
                  disabled
                  value={amount1 ?? "loading ..."}
                />
              </ul>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={token0 === token1 && chainId0 === chainId1}
                onClick={() => {
                  setSelectedPoolOps(PoolOps.Swap);
                }}
              >
                Swap
              </button>
            </Stack>
          </div>
        </Stack>
      </Stack> */}
      {selectedPoolOps === PoolOps.Swap && (
        <SwapModal
          l2Account={props.l2Account}
          chainId0={chainId0}
          chainId1={chainId1}
          token0={token0}
          token1={token1}
          amount={amount0}
          close={() => {
            setSelectedPoolOps(undefined);
          }}
        />
      )}
    </>
  );
}
