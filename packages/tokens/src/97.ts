import { ChainId, ERC20Token, WBNB,DFS_TESTNET } from '@pancakeswap/sdk'
import { BUSD_TESTNET,USDT_TESTNET } from './common'

export const bscTestnetTokens = {
  wbnb: WBNB[ChainId.BSC_TESTNET],
  bnb: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'BNB',
    'BNB',
    'https://www.app.diffusiondao.org/',
  ),
  busd: BUSD_TESTNET,
  dfs: DFS_TESTNET,
  usdt: USDT_TESTNET
}
