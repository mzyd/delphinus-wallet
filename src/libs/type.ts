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

export interface SelectedToken {
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

export interface TokenInfo {
  address: string;
  name: string;
  l2Balance?: string;
  l1Balance?: string;
}

export interface ChainInfo{
  chainId: string;
  chainName: string;
  enable: boolean;
  tokens: TokenInfo[];
}

export interface TokenInfoFull {
  tokenAddress: string;
  tokenName: string;
  chainId: string;
  chainName: string;
  index: number;
}

export interface PoolInfo {
  id: number;
  tokens: TokenInfoFull[];
  share?: string;
  amount?: string;
}

export interface BridgeMetadata {
  chainInfo: ChainInfo[];
  poolInfo: PoolInfo[];
  snap: string;
}
