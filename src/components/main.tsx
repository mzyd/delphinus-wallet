// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, * as react from "react";

import { Label } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Separator } from "@fluentui/react/lib/Separator";
import "./main.css";
import { getAddressOfAccoutAsync } from "../libs/utils";
import Token from "./token";
import Pool from "./pool";
import { buttonStyles, normalLabelStyles, separatorStyles, titleStyles, verticalGapStackTokens } from "./common-styles";

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

  const basicInfo = [
    {
      label: "Account",
      defaultValue: addressPair?.[0] || "",
      editable: false,
      buttonText: "Change",
      onClickButton: () => props.setAccount(""),
    },
    {
      label: "Address",
      defaultValue: addressPair?.[1] || "",
      editable: false,
    }
  ];

  return (
    <div className="h-100 w-100 d-flex justify-content-center main">
      <Stack horizontalAlign={"center"} className="w-75">
        <Label styles={titleStyles}>Swapper Wallet</Label>
        <Stack horizontal tokens={verticalGapStackTokens}>
          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            {basicInfo.map((item) => (
              <Label styles={normalLabelStyles} key={item.label}>
                {item.label}
              </Label>
            ))}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            {basicInfo.map((item) =>
              item.editable ? (
                <TextField defaultValue={item.defaultValue} key={item.label} />
              ) : (
                <Label styles={normalLabelStyles} key={item.label}>
                  {item.defaultValue}
                </Label>
              )
            )}
          </Stack>

          <Stack verticalAlign={"start"} tokens={verticalGapStackTokens}>
            {basicInfo.map((item) =>
              item.buttonText ? (
                <PrimaryButton
                  styles={buttonStyles}
                  onClick={() => item.onClickButton?.()}
                  key={item.label}
                >
                  {item.buttonText}
                </PrimaryButton>
              ) : (
                <div className="button-placeholder" key={item.label}></div>
              )
            )}
          </Stack>
        </Stack>
        <Separator styles={separatorStyles} className="w-100" />
        <Token account={props.account}/>
        <Separator styles={separatorStyles} className="w-100" />
        <Pool account={props.account}/>
      </Stack>
    </div>
  );
}
