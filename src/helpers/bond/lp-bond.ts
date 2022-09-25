import { ContractInterface } from 'ethers'
import { Networks } from 'constants/blockchain'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { getAddresses } from 'constants/addresses'
import { getBondCalculator } from '../bond-calculator'
import { BondType } from './constants'
import { Bond, BondOpts } from './bond'

// export interface LPBondOpts extends BondOpts {
//   readonly reserveContractAbi: ContractInterface
//   readonly lpUrl: string
// }

// export class LPBond extends Bond {
//   readonly isLP = true

//   readonly lpUrl: string
//   readonly displayUnits: string
//   readonly reserveContractAbi: ContractInterface

//   constructor(lpBondOpts: LPBondOpts) {
//     super(BondType.LP, lpBondOpts)

//     this.lpUrl = lpBondOpts.lpUrl
//     this.reserveContractAbi = lpBondOpts.reserveContractAbi
//     this.displayUnits = 'LP'
//   }

//   async getTreasuryBalance(networkID: Networks, provider: StaticJsonRpcProvider) {
//     const addresses = getAddresses(networkID)

//     const token = this.getContractForReserve(networkID, provider)
//     const tokenAddress = this.getAddressForReserve(networkID)
//     const bondCalculator = getBondCalculator(networkID, provider)
//     const tokenAmount = await token.balanceOf(addresses.TREASURY_ADDRESS)
//     console.log('lp-bond tokenAmount:', tokenAmount)

//     const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount)
//     const markdown = await bondCalculator.markdown(tokenAddress)
//     const tokenUSD = (valuation / 10 ** 9) * (markdown / 10 ** 18)

//     return tokenUSD
//   }

//   public getTokenAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
//     return this.getReserves(networkID, provider, true)
//   }

//   public getTimeAmount(networkID: Networks, provider: StaticJsonRpcProvider) {
//     return this.getReserves(networkID, provider, false)
//   }

//   private async getReserves(networkID: Networks, provider: StaticJsonRpcProvider, isToken: boolean): Promise<number> {
//     const addresses = getAddresses(networkID)

//     const token = this.getContractForReserve(networkID, provider)

//     const [reserve0, reserve1] = await token.getReserves()
//     const token1: string = await token.token1()
//     const isTime = token1.toLowerCase() === addresses.OHM_ADDRESS.toLowerCase()

//     return isToken
//       ? this.toTokenDecimal(false, isTime ? reserve0 : reserve1)
//       : this.toTokenDecimal(true, isTime ? reserve1 : reserve0)
//   }

//   private toTokenDecimal(isTime: boolean, reserve: number) {
//     return isTime ? reserve / 10 ** 9 : reserve / 10 ** 18
//   }
// }

// export class CustomLPBond extends LPBond {
//   constructor(customBondOpts: LPBondOpts) {
//     super(customBondOpts)

//     this.getTreasuryBalance = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
//       const tokenAmount = await super.getTreasuryBalance(networkID, provider)
//       const tokenPrice = this.getTokenPrice()

//       return tokenAmount * tokenPrice
//     }

//     this.getTokenAmount = async (networkID: Networks, provider: StaticJsonRpcProvider) => {
//       const tokenAmount = await super.getTokenAmount(networkID, provider)
//       const tokenPrice = this.getTokenPrice()

//       return tokenAmount * tokenPrice
//     }
//   }
// }
