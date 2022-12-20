import { SerializedFarmConfig } from '@pancakeswap/farms'
import { bscTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './common'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    v1pid: 264,
    lpSymbol: 'DFS-USDT LP',
    lpAddress: '0xB5951ff6e65d1b3c07Ac1188039170A00aEF8de2',
    token: bscTokens.dfs,
    quoteToken: bscTokens.usdt,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
