import { ChainId } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/uikit'
import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'

export const getAddress = (address: Pool.Address, chainId?: number): string => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC_TESTNET]
}

export const getMasterChefAddress = (chainId?: number) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getMasterChefV1Address = () => {
  return getAddress(addresses.masterChefV1)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeBunniesAddress = () => {
  return getAddress(addresses.pancakeBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddress(addresses.predictionsV1)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddress(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddress(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddress(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddress(addresses.tradingCompetitionMoD)
}

export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddress(addresses[vaultKey])
}

export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}

export const getCakeFlexibleSideVaultAddress = () => {
  return getAddress(addresses.cakeFlexibleSideVault)
}

export const getBunnySpecialCakeVaultAddress = () => {
  return getAddress(addresses.bunnySpecialCakeVault)
}
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction)
}
export const getBunnySpecialLotteryAddress = () => {
  return getAddress(addresses.bunnySpecialLottery)
}
export const getBunnySpecialXmasAddress = () => {
  return getAddress(addresses.bunnySpecialXmas)
}
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction)
}
export const getAnniversaryAchievement = () => {
  return getAddress(addresses.AnniversaryAchievement)
}

export const getNftSaleAddress = () => {
  return getAddress(addresses.nftSale)
}
export const getPancakeSquadAddress = () => {
  return getAddress(addresses.pancakeSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddress(addresses.potteryDraw)
}

export const getZapAddress = () => {
  return getAddress(addresses.zap)
}
export const getICakeAddress = () => {
  return getAddress(addresses.iCake)
}

export const getBCakeFarmBoosterAddress = () => {
  return getAddress(addresses.bCakeFarmBooster)
}

export const getBCakeFarmBoosterProxyFactoryAddress = () => {
  return getAddress(addresses.bCakeFarmBoosterProxyFactory)
}

export const getNonBscVaultAddress = (chainId?: number) => {
  return getAddress(addresses.nonBscVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddress(addresses.crossFarmingReceiver, chainId)
}

export const getNftMarketAddress = () => {
  return getAddress(addresses.nftMarket)
}
export const getDFSAddress = () => {
  return getAddress(addresses.dfs)
}
export const getPDFSAddress = () => {
  return getAddress(addresses.pdfs)
}
export const getPairAddress = () => {
  return getAddress(addresses.pair)
}
export const getBondAddress = () => {
  return getAddress(addresses.bond)
}
export const getMiningAddress = () => {
  return getAddress(addresses.dfsMining)
}
export const getIDOAddress = () => {
  return getAddress(addresses.pdfs)
}
export const getSocialNFTAddress = () => {
  return getAddress(addresses.socialNFT)
}
export const getStarlightAddress = () => {
  return getAddress(addresses.starlightNft)
}
export const getNFTDatabaseAddress = () => {
  return getAddress(addresses.nftDatabase)
}
export const getHBondAddress = () => {
  return getAddress(addresses.hbond)
}
export const getHDFSAddress = () => {
  return getAddress(addresses.hdfs)
}

export const getDiffusionAICatAddress = () => {
  return getAddress(addresses.diffusionAICat)
}