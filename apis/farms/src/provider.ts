import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const bscProvider = new StaticJsonRpcProvider(
  {
    url: 'https://nodes.pancakeswap.com',
    skipFetchSetup: true,
  },
  56,
)

export const bscTestnetProvider = new StaticJsonRpcProvider(
  {
    url: 'https://data-seed-prebsc-1-s2.binance.org:8545',
    skipFetchSetup: true,
  },
  97,
)

export const goerliProvider = new StaticJsonRpcProvider(
  {
    url: 'https://eth-goerli.nodereal.io/v1/8a4432e42df94dcca2814fde8aea2a2e',
    skipFetchSetup: true,
  },
  5,
)
