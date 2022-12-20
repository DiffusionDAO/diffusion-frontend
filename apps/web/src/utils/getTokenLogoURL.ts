import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, DFS_MAINNET, DFS_TESTNET, Token, WBNB } from '@pancakeswap/sdk'
import { USDT_BSC, USDT_TESTNET } from '@pancakeswap/tokens'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.BSC_TESTNET]: 'smartchain',
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
    console.log(token)
    return null
  }


export default getTokenLogoURL
