import { ethers } from 'ethers'
import { Networks } from 'constants/blockchain'
import { LpReserveContract } from '../abi'
import { daiOHM } from './bond'

export async function getMarketPrice(
  networkID: Networks,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<number> {
  const mimTimeAddress = daiOHM.getAddressForReserve(networkID)
  const pairContract = new ethers.Contract(mimTimeAddress, LpReserveContract, provider)
  const reserves = await pairContract.getReserves()
  const marketPrice = reserves[1] / reserves[0]
  return marketPrice
}
