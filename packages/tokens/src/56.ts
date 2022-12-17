import { ChainId, Token, WBNB, ERC20Token } from '@pancakeswap/sdk'
import { BUSD_BSC, CAKE_MAINNET, USDT_BSC } from './common'

export const bscTokens = {
  wbnb: WBNB[ChainId.BSC],
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new ERC20Token(
    ChainId.BSC,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'BNB',
    'BNB',
    'https://www.pancakeswap.com/',
  ),
  usdt: USDT_BSC,
  busd: BUSD_BSC,
  cake: CAKE_MAINNET,
  dfs: new ERC20Token(
    ChainId.BSC,
    '0x2B806e6D78D8111dd09C58943B9855910baDe005',
    18,
    'DFS',
    'DFS',
    'https://app.diffusiondao.org/',
  ),
}
