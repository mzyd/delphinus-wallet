// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, * as react from "react";

import { Dropdown, Label } from "@fluentui/react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { Separator } from "@fluentui/react/lib/Separator";
import { separatorStyles } from "./common-styles";
import { TextField } from "@fluentui/react/lib/TextField";

import {
  queryPoolAmountAsync,
  queryPoolShareAsync,
} from "../libs/utils";

import SupplyModal from "../modals/supplymodal";
import { registerTask, unregisterTask } from "../libs/query-fresher";
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

export default function Supply(props: IProps) {
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
      <Stack
        horizontal
        horizontalAlign={"center"}
        tokens={verticalGapStackTokens}
      >
        <Stack tokens={verticalGapStackTokens}>
          <div className="swap-selector" key="retrieve">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <a className="navbar-brand" href="#">
                Add Liquidity:
              </a>
            </nav>
            <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
              <ul className="list-group">
                <Dropdown
                  placeholder="Select Chain"
                  options={chainOptions}
                  onChange={(_, option) => {
                    if (option) {
                      if (option.key != chainId0) {
                        setToken0(
                          chainInfoList.find((c) => c.chainId === option.key)
                            ?.tokens[0] ?? ""
                        );
                      }
                      setChainId0(option.key as string);
                    }
                  }}
                  defaultSelectedKey={chainId0}
                />
                <div className="p-1" />
                <Dropdown
                  placeholder="Select Token"
                  options={tokenOptions(chainId0)}
                  onChange={(_, option) => {
                    if (option) {
                      setToken0(option.key as string);
                    }
                  }}
                  defaultSelectedKey={token0}
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
                <Dropdown
                  placeholder="Select Chain"
                  options={chainOptions}
                  onChange={(_, option) => {
                    if (option) {
                      if (option.key != chainId1) {
                        setToken1(
                          chainInfoList.find((c) => c.chainId === option.key)
                            ?.tokens[0] ?? ""
                        );
                      }
                      setChainId1(option.key as string);
                    }
                  }}
                  selectedKey={chainId1}
                />
                <div className="p-1" />
                <Dropdown
                  placeholder="Select Token"
                  options={tokenOptions(chainId1)}
                  onChange={(_, option) => {
                    if (option) {
                      setToken1(option.key as string);
                    }
                  }}
                  selectedKey={token1}
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
                  setSelectedPoolOps(PoolOps.Supply);
                }}
              >
                Add Liquidity
              </button>
            </Stack>
          </div>
        </Stack>
      </Stack>
      {selectedPoolOps === PoolOps.Supply && (
        <SupplyModal
          account={addressPair[0]}
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
