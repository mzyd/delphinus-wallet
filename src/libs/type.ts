export interface SubstrateAccountInfo {
   account: string;
   address: string;
   injector: any;
}

interface SelectedToken {
  chainId: string;
  tokenAddress: string;
}

interface TXProps {
  substrateAccount: SubstrateAccountInfo;
  seletedToken: SelectedToken;
}

/*
 * Informations that should get via monitor account.
 */

interface BalanceInfo {
  [key:string]: string;
}

interface TokenInfo {
  address: string;
  l2Balance?: string;
  l1Balance?: BalanceInfo;
}

interface ChainInfo{
  chainId: string;
  chainName: string;
  enable: boolean;
  tokens: TokenInfo[];
}






