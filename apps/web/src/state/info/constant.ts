import { infoClient, infoClientETH, infoStableSwapClient } from 'utils/graphql'
import { INFO_CLIENT, INFO_CLIENT_ETH, BLOCKS_CLIENT, BLOCKS_CLIENT_ETH } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import { PCS_V2_START, PCS_ETH_START, ETH_TOKEN_BLACKLIST, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = 'BNB' | 'ETH'

export const multiChainQueryMainToken = {
  BNB: 'BNB',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  BNB: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
}

export const multiChainStartTime = {
  BNB: PCS_V2_START,
  ETH: PCS_ETH_START,
}

export const multiChainId = {
  BNB: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: '/eth',
}

export const multiChainQueryClient = {
  BNB: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  BNB: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  BNB: 'BscScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  BNB: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
