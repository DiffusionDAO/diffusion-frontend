import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

// export const bscRpcProvider = new StaticJsonRpcProvider(BSC_PROD_NODE)
export const bscRpcProvider = new StaticJsonRpcProvider('https://data-seed-prebsc-1-s3.binance.org:8545')

export default null
