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
export const FACTORY_ADDRESS = '0x6bC286FCe1F82EFcE35ADc5dd99D30C1Ea262bfb'

const FACTORY_ADDRESS_ETH = '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362'

export const FACTORY_ADDRESS_MAP: Record<number, string> = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS_ETH,
  [ChainId.RINKEBY]: FACTORY_ADDRESS_ETH,
  [ChainId.GOERLI]: FACTORY_ADDRESS_ETH,
  [ChainId.BSC]: FACTORY_ADDRESS,
  [ChainId.BSC_TESTNET]: '0x245E9d086FE10B30B5EeF0f33b00377144465888',
}
export const INIT_CODE_HASH = '0xde7cd9bf65ddeffbdbf1b84453ff36d33a5f0a7cb82671c9b690cca5bbc9e88c'

const INIT_CODE_HASH_ETH = '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d'
export const INIT_CODE_HASH_MAP: Record<number, string> = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH_ETH,
  [ChainId.RINKEBY]: INIT_CODE_HASH_ETH,
  [ChainId.GOERLI]: INIT_CODE_HASH_ETH,
  [ChainId.BSC]: INIT_CODE_HASH,
  [ChainId.BSC_TESTNET]: '0xf9f345a12b4e926ac097945222523cfc5c523d2f309c926975cc3c67a193d198',
}

export const DFS_MAINNET = new ERC20Token(
  ChainId.BSC,
  '0x2B806e6D78D8111dd09C58943B9855910baDe005',
  18,
  'DFS',
  'Diffusion Token',
  'https://app.diffusiondao.org/',
)

export const DFS_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  '0x63A19519A1820b78DD568d43c1E0833089a9b611',
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
