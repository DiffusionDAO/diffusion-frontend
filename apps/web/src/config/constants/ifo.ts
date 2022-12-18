import { ERC20Token, ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './lp'
import { Ifo } from './types'

export const cakeBnbLpToken = new ERC20Token(ChainId.BSC, CAKE_BNB_LP_MAINNET, 18, 'CAKE-BNB LP')

const ifos: Ifo[] = [
 
]

export default ifos
