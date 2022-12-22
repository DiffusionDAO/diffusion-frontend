import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }

export const bsc: Chain = {
  id: 56,
  name: 'Binance Smart Chain',
  network: 'bsc',
  rpcUrls: {
    public: 'https://red-purple-meme.bsc.quiknode.pro/4dabd14fa4d6d0e7be2de8fb6b6d6519f68e43e7/', //'https://bsc-dataseed1.defibit.io',
    default: 'https://red-purple-meme.bsc.quiknode.pro/4dabd14fa4d6d0e7be2de8fb6b6d6519f68e43e7/',
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  multicall: {
    address: '0x146337E3cda296bFFE9f109056b3DBe8396bF4f9',
    blockCreated: 15921452,
  },
}

export const bscTest: Chain = {
  id: 97,
  name: 'BNB Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
    default: 'https://data-seed-prebsc-1-s3.binance.org:8545/',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 17422483,
  },
  testnet: true,
}

export { rinkeby, mainnet, goerli }
