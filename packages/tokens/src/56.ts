import { ChainId, Token, WBNB, DFS_MAINNET, ERC20Token } from '@pancakeswap/sdk'
import { BUSD_BSC, USDT_BSC } from './common'

export const bscTokens = {
  wbnb: WBNB[ChainId.BSC],
  // bnb here points to the wbnb contract. Wherever the currency BNB is required, conditional checks for the symbol 'BNB' can be used
  bnb: new ERC20Token(
    ChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'BNB',
    'BNB',
    'https://www.app.diffusiondao.org/',
  ),
  usdt: USDT_BSC,
  busd: BUSD_BSC,
  dfs: DFS_MAINNET
}
