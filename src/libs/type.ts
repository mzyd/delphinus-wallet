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

export interface PoolInfo {
  id: string;
  chainId1: string;
  chainName1: string;
  tokenAddress1: string;
  tokenName1: string;
  chainId2: string;
  chainName2: string;
  tokenAddress2: string;
  tokenName2: string;
  share?: string;
  amount?: string;
}






