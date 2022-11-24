import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'

// export const bscRpcProvider = new StaticJsonRpcProvider(BSC_PROD_NODE)
export const bscRpcProvider = new StaticJsonRpcProvider('https://bsctestapi.terminet.io/rpc')

export default null
