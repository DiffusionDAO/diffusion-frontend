import { ERC20Token } from './entities/token'

export enum ChainId {
  ETHEREUM = 1,
  RINKEBY = 4,
  GOERLI = 5,
  BSC = 56,
  BSC_TESTNET = 97,
}

export const ChainIdName:Record<string, ChainId> = {
  '1': ChainId.ETHEREUM,
  '4': ChainId.RINKEBY ,
  '5': ChainId.GOERLI,
  '56': ChainId.BSC,
  '97': ChainId.BSC_TESTNET,
}
export const FACTORY_ADDRESS = '0xdF024b5dda32fc4045e4142877B4DF38B03363b1'

const FACTORY_ADDRESS_ETH = '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362'

export const FACTORY_ADDRESS_MAP: Record<number, string> = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS_ETH,
  [ChainId.RINKEBY]: FACTORY_ADDRESS_ETH,
  [ChainId.GOERLI]: FACTORY_ADDRESS_ETH,
  [ChainId.BSC]: FACTORY_ADDRESS,
  [ChainId.BSC_TESTNET]: '0x9d19eb33607fB9074FAf66F40ed9b939a2379e50',
}
export const INIT_CODE_HASH = '0x5e1db4a23bd803343b915006b0696e1028c9047271b929a9c0af25b5d163882a'

const INIT_CODE_HASH_ETH = '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d'
export const INIT_CODE_HASH_MAP: Record<number, string> = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH_ETH,
  [ChainId.RINKEBY]: INIT_CODE_HASH_ETH,
  [ChainId.GOERLI]: INIT_CODE_HASH_ETH,
  [ChainId.BSC]: INIT_CODE_HASH,
  [ChainId.BSC_TESTNET]: '0xa24de591e8003a41827b073feb573a6bd9c8689bfc04c783079b867e66cf2e79',
}

export const DFS_MAINNET = new ERC20Token(
  ChainId.BSC,
  '0xB38Ca15cDA6520538C40cf50b5fF876bAfEd2Af5',
  18,
  'DFS',
  'Diffusion Token',
  'https://app.diffusiondao.org/',
)

export const DFS_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  '0x1CEb1Af7d3bd2E5f89415111f370A47746Fb34a3',
  18,
  'DFS',
  'Diffusion Token',
  'https://app.diffusiondao.org/',
)

export const DFS = {
  [ChainId.BSC]: DFS_MAINNET,
  [ChainId.BSC_TESTNET]: DFS_TESTNET,
}


export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.RINKEBY]: new ERC20Token(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.GOERLI]: new ERC20Token(
    ChainId.GOERLI,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
}

export const WBNB = {
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
}


export const WNATIVE: Record<number, ERC20Token> = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.RINKEBY]: WETH9[ChainId.RINKEBY],
  [ChainId.GOERLI]: WETH9[ChainId.GOERLI],
  [ChainId.BSC]: WBNB[ChainId.BSC],
  [ChainId.BSC_TESTNET]: WBNB[ChainId.BSC_TESTNET],
}

export const NATIVE: Record<
  number,
  {
    name: string
    symbol: string
    decimals: number
  }
> = {
  [ChainId.ETHEREUM]: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  [ChainId.RINKEBY]: { name: 'Rinkeby Ether', symbol: 'RIN', decimals: 18 },
  [ChainId.GOERLI]: { name: 'Goerli Ether', symbol: 'GOR', decimals: 18 },
  [ChainId.BSC]: {
    name: 'Binance Smart Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'Binance Smart Chain Testnet Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
}
