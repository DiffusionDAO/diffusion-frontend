import { ChainId, ERC20Token, WBNB } from '@pancakeswap/sdk'
import { BUSD_TESTNET, CAKE_TESTNET,DFS_TESTNET,USDT_TESTNET } from './common'

export const bscTestnetTokens = {
  wbnb: WBNB[ChainId.BSC_TESTNET],
  cake: CAKE_TESTNET,
  busd: BUSD_TESTNET,
  dfs: DFS_TESTNET,
  usdt: USDT_TESTNET
}
