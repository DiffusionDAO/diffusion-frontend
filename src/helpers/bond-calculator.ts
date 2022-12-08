import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Networks } from 'constants/blockchain'
import { ethers } from 'ethers'
import { getAddresses } from 'constants/addresses'
import { BondingCalcContract } from '../abi'

export function getBondCalculator(networkID: Networks, provider: StaticJsonRpcProvider) {
  const addresses = getAddresses(networkID)
  return new ethers.Contract(addresses.OHM_BONDING_CALC_ADDRESS, BondingCalcContract, provider)
}
