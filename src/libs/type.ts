export interface SubstrateAccountInfo {
   account: string;
   address: string;
   injector: any;
   balance: string;
}

export interface L1AccountInfo {
   address: string;
   chainId: string;
   //chainName: string;
   web3: any;
}

interface SelectedToken {
  chainId: string;
  tokenAddress: string;
}

export interface TXProps {
  substrateAccount: SubstrateAccountInfo;
  selectedToken: SelectedToken;
}

/*
 * Informations that should get via monitor account.
 */

interface BalanceInfo {
  [key:string]: string;
}

export interface TokenInfo {
  address: string;
  name: string;
  l2Balance?: string;
  l1Balance?: BalanceInfo;
}

export interface ChainInfo{
  chainId: string;
  chainName: string;
  enable: boolean;
  tokens: TokenInfo[];
}






