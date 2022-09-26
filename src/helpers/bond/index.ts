import { Networks } from 'constants/blockchain'
import MimIcon from 'assets/tokens/MIM.svg'
import AvaxIcon from 'assets/tokens/AVAX.svg'
import MimTimeIcon from 'assets/tokens/TIME-MIM.svg'
import AvaxTimeIcon from 'assets/tokens/TIME-AVAX.svg'
// import { LPBond, CustomLPBond } from './lp-bond'
// import { StableBond, CustomBond } from './stable-bond'
import {
  StableBondContract,
  TestContract,
  LpBondContract,
  WavaxBondContract,
  StableReserveContract,
  LpReserveContract,
} from '../../abi'

// export const dai = new StableBond({
//   name: 'dai',
//   displayName: 'USDT',
//   bondToken: 'USDT',
//   bondIconSvg: MimIcon,
//   bondContractABI: StableBondContract,
//   testContractABI: TestContract,
//   reserveContractAbi: StableReserveContract,
//   networkAddrs: {
//     [Networks.BSC]: {
//       bondAddress: '0x635763D7952A48257D12FE2e1461a0BFC27b5541',
//       reserveAddress: '0xa76cfDbEdF7883428B0e847AC354DeBA21B58CfC',
//     },
//   },
//   tokensInStrategy: '60500000000000000000000000',
// })

// export const daiOHM = new LPBond({
//   name: 'dai_ohm_lp',
//   displayName: 'PDFS-USDT LP',
//   bondToken: 'USDT',
//   bondIconSvg: MimTimeIcon,
//   bondContractABI: LpBondContract,
//   testContractABI: TestContract,
//   reserveContractAbi: LpReserveContract,
//   networkAddrs: {
//     [Networks.BSC]: {
//       bondAddress: '0x635763D7952A48257D12FE2e1461a0BFC27b5541',
//       reserveAddress: '0x3a5beff5ae20fc1170b508c48849bda10af715e1',
//     },
//   },
//   lpUrl:
//     'https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb54f16fB19478766A268F172C9480f8da1a7c9C3',
// })

export default []
