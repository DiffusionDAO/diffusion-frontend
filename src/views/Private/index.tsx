import { useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWallet } from 'hooks/useWallet'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useDFSContract, useDFSMiningContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import { MaxUint256 } from '@ethersproject/constants'
import { getMiningAddress } from 'utils/addressHelpers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { formatBigNumber, formatBigNumberToFixed, formatNumber } from 'utils/formatBalance'
import { shorten } from 'helpers'
import useSWR from 'swr'

import DataCell from '../../components/ListDataCell'

const Private = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const zeroAddress = '0x0000000000000000000000000000000000000000'

  const [totalStakedSavings, setTotalStakedSavings] = useState<BigNumber>(BigNumber.from(0))
  const [savingRewardEpoch, setSavingRewardEpoch] = useState<any>({})
  const [totalPower, setTotalPower] = useState<BigNumber>(BigNumber.from(0))
  const [totalSocialReward, setTotalSocialReward] = useState<BigNumber>(BigNumber.from(0))
  const [socialRewardInterest, setSocialRewardInterest] = useState<number>(0)
  const [savingRewardInterest, setSavingRewardInterest] = useState<number>(0)
  const [dfsRewardBalance, setDfsRewardBalance] = useState<BigNumber>(BigNumber.from(0))
  const [withdrawedSocialReward, setWithdrawedSocialReward] = useState<BigNumber>(BigNumber.from(0))
  const [withdrawedSavingReward, setWithdrawedSavingReward] = useState<BigNumber>(BigNumber.from(0))
  const [runway, setRunway] = useState<number>(0)
  const [savingInterestEpochLength, setSavingInterestEpochLength] = useState<number>(1)

  const dfsMineContract = useDFSMiningContract()
  const dfsContract = useDFSContract()
  const dfsMineAddress = getMiningAddress()

  const refresh = async () => {
    const savingInterestEpochLength = await dfsMineContract.savingInterestEpochLength()
    setSavingInterestEpochLength(savingInterestEpochLength)

    const dfsRewardBalance = await dfsContract.balanceOf(dfsMineAddress)
    setDfsRewardBalance(dfsRewardBalance)

    const withdrawedSocialReward = await dfsMineContract.withdrawedSocialReward()
    setWithdrawedSocialReward(withdrawedSocialReward)

    const withdrawedSavingReward = await dfsMineContract.withdrawedSavingReward()
    setWithdrawedSavingReward(withdrawedSavingReward)

    setSocialRewardInterest((await dfsMineContract.socialRewardInterest()).toNumber())
    setSavingRewardInterest((await dfsMineContract.savingRewardInterest()).toNumber())
    setTotalSocialReward(await dfsMineContract.totalSocialReward())
    setTotalPower(await dfsMineContract.totalPower())
    setTotalStakedSavings(await dfsMineContract.totalStakedSavings())
  }
  const { mutate: refreshMutate } = useSWR('refresh', refresh)
  useEffect(() => {
    refreshMutate(refresh())
  }, [account, runway])

  const n = (24 * 3600) / savingInterestEpochLength

  const rewardExcludeWithdrawed = dfsRewardBalance.sub(withdrawedSavingReward.add(withdrawedSocialReward))
  const spos = totalPower.toNumber() / 100
  return (
    <div style={{ color: 'white', display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
      <span>DFS奖励池总余额</span>
      <span>{formatUnits(dfsRewardBalance)}</span>
      <br />
      <span>DFS奖励池已发放</span>
      <span>{formatUnits(withdrawedSavingReward.add(withdrawedSocialReward))}</span>
      <br />
      <span>总SPOS</span>
      <span>{spos}</span>
      <br />
      <span>质押DFS</span>
      <span>{formatUnits(totalStakedSavings)}</span>
      <br />
      <span>跑道天数</span>
      <input
        style={{ color: 'black', width: '10%' }}
        onInput={(e: any) => {
          setRunway(e?.target?.value)
        }}
      />
      <span>SPOS建议利率</span>
      <span>
        {runway &&
          runway !== 0 &&
          spos !== 0 &&
          parseFloat(formatUnits(rewardExcludeWithdrawed.div(runway * spos))) * 95 * 100}
        %
      </span>
      <br />
      <span>零钱罐建议利率</span>
      <span>
        {runway &&
          runway !== 0 &&
          (parseFloat(formatUnits(rewardExcludeWithdrawed, 18)) * 5) /
            (n * runway * parseFloat(formatUnits(totalStakedSavings)))}
        %
      </span>
    </div>
  )
}
export default Private
