// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react/lib/TextField";
import InputField from "./inputfield";

import { queryPoolAmountAsync, queryPoolShareAsync } from "../libs/utils";
import RetrieveModal from "../modals/retrievemodal";
import ChainSelector from "./chainselector";
import TokenSelector from "./tokenselector";
import { Label, Separator } from "@fluentui/react";
import { SubstrateAccountInfo } from "../libs/type";

import "../styles/panel.css";
import chainList from "../config/tokenlist";

interface IProps {
  l2Account: SubstrateAccountInfo;
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

const chainInfoList: ChainInfo[] = chainList.map((c) => ({
  chainId: c.chainId,
  tokens: c.tokens.map((t) => t.address.replace("0x", "")),
}));

export default function Retrieve(props: IProps) {
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
  const [share, setShare] = react.useState<string>();

  react.useEffect(() => {
    const _token0 = token0;
    const _token1 = token1;
    const _chainId0 = chainId0;
    const _chainId1 = chainId1;

    const updator = async () => {
      await queryPoolAmountAsync(
        chainId0,
        token0,
        chainId1,
        token1,
        (v0: string, v1: string) => {
          if (
            _token0 === token0 &&
            _token1 === token1 &&
            _chainId0 === chainId0 &&
            _chainId1 === chainId1
          ) {
            setLiquid0(v0);
            setLiquid1(v1);
          }
        }
      );

      await queryPoolShareAsync(
        props.l2Account,
        chainId0,
        token0,
        chainId1,
        token1,
        (value: string) => {
          if (
            _token0 === token0 &&
            _token1 === token1 &&
            _chainId0 === chainId0 &&
            _chainId1 === chainId1
          ) {
            setShare(value);
          }
        }
      );
    };
    resetPool();
    updator();
  }, [chainId0, chainId1, token0, token1]);

  const chainOptions = chainInfoList.map((c) => ({
    key: c.chainId,
    text: "Chain ID: " + c.chainId,
  }));

  const tokenOptions = (chainId: string) =>
    chainInfoList
      .find((c) => c.chainId === chainId)
      ?.tokens?.map((token) => ({
        key: token,
        text: "Token: " + token,
      })) ?? [];

  const resetPool = () => {
    setLiquid0("loading...");
    setLiquid1("loading...");
    setShare("loading...");
  };

  return (
    <>
      <div className="action-box">
        <div className="header">Retrieve Liquidity</div>
        <div className="content">
          <div>
            <ChainSelector
              default={chainId0}
              setToken={setToken0}
              setChain={setChainId0}
            />
            <TokenSelector
              default={token0}
              chainId={chainId0}
              setToken={setToken0}
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

          <div className="tag">SHARE {share && <span>: {share}</span>}</div>
          <div>
            <ChainSelector
              default={chainId1}
              setToken={setToken1}
              setChain={setChainId1}
            />
            <TokenSelector
              default={token1}
              chainId={chainId1}
              setToken={setToken1}
            />
          </div>
          {liquid1 && <div className="liquidity">Liquidity: {liquid1}</div>}
          <div className="will-get">You will get: {amount1}</div>
          <button
            type="button"
            className="btn-confirm"
            disabled={token0 === token1 && chainId0 === chainId1}
            onClick={() => {
              setSelectedPoolOps(PoolOps.Retrieve);
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
                Retrieve Liquidity:
              </a>
            </nav>
            <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
              <ul className="list-group">
                <ChainSelector
                    default={chainId0}
                    setToken={setToken0}
                    setChain={setChainId0}
                />
                <div className="p-1" />
                <TokenSelector
                    default={token0}
                    chainId={chainId0}
                    setToken={setToken0}
                />
                <div className="p-1" />
                <TextField
                  label="Liquidity"
                  underlined
                  readOnly
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
              <Separator>Share: {share ?? "loading..."}</Separator>
              <ul className="list-group">
                <ChainSelector
                    default={chainId1}
                    setToken={setToken1}
                    setChain={setChainId1}
                />
                <div className="p-1" />
                <TokenSelector
                    default={token1}
                    chainId={chainId1}
                    setToken={setToken1}
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
                  setSelectedPoolOps(PoolOps.Retrieve);
                }}
              >
                Retrieve Liquidity
              </button>
            </Stack>
          </div>
        </Stack>
      </Stack> */}
      {selectedPoolOps === PoolOps.Retrieve && (
        <RetrieveModal
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
