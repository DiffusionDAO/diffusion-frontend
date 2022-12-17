import { SerializedFarmConfig } from '@pancakeswap/farms'
import { bscTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './common'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    v1pid: 264,
    lpSymbol: 'USDT-BNB LP',
    lpAddress: '0x0dcBC4ab46b4ebE333d0017831f4E66900077eb8',
    token: bscTokens.usdt,
    quoteToken: bscTokens.wbnb,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
