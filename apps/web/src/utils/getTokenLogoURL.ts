import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token, WBNB } from '@pancakeswap/sdk'
import { DFS_MAINNET, DFS_TESTNET, USDT_BSC, USDT_TESTNET } from '@pancakeswap/tokens'

const mapping = {
  [ChainId.BSC]: 'smartchain',
}

const getTokenLogoURL =
(token?: Token) => {
    if (token && token.address === WBNB[ChainId.BSC].address || token.address === WBNB[ChainId.BSC_TESTNET].address) {
      return `/images/wbnb.png`
    }
    if (token && token.address === USDT_BSC.address || token.address === USDT_TESTNET.address) {
      return `/images/usdt-assets/usdt.png`
    } 
    if (token && token.address === DFS_MAINNET.address || token.address === DFS_TESTNET.address) {
      return `/images/dfs.png`
    } 
    return null
  }


export default getTokenLogoURL
