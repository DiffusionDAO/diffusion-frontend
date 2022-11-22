import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import {
  useBondContract,
  useDFSContract,
  useDFSMiningContract,
  useERC20,
  useHBondContract,
  useHDFSContract,
} from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import { MaxUint256 } from '@ethersproject/constants'
import { getMiningAddress, getUSDTAddress } from 'utils/addressHelpers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { formatBigNumber, formatBigNumberToFixed, formatNumber } from 'utils/formatBalance'
import useSWR from 'swr'
import { escapeRegExp } from 'utils'

import {
  StyledModal,
  ContentWrap,
  HeaderWrap,
  BondListItem,
  BondListItemHeader,
  BondListItemContent,
  ContentCell,
  CellTitle,
  CellText,
  TextColor,
  ImgWrap,
  FromImg,
  ToImg,
  BondName,
  BondTime,
  TipsWrap,
  TipsText,
  BondListItemBtn,
  ListItem,
  ListLable,
  ListContent,
  TabList,
  TabItem,
  MoneyLable,
  MoneyInput,
  ReferralWrap,
  CheckBoxWrap,
  CheckBox,
  ReferralLable,
  ReferralInput,
} from './styles'

const zeroAddress = '0x0000000000000000000000000000000000000000'

const Private = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  const [amount, setAmount] = useState('')

  const inputRef = useRef<HTMLInputElement>()
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
  const enforcer = async (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setAmount(nextUserInput)
    }
  }

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
  const [dfsBalance, setDfsBalance] = useState<BigNumber>(BigNumber.from(0))

  const [level0Staked, setLevel0Staked] = useState<BigNumber>(BigNumber.from(0))
  const [level1Staked, setLevel1Staked] = useState<BigNumber>(BigNumber.from(0))
  const [level2Staked, setLevel2Staked] = useState<BigNumber>(BigNumber.from(0))
  const [level3Staked, setLevel3Staked] = useState<BigNumber>(BigNumber.from(0))
  const [level4Staked, setLevel4Staked] = useState<BigNumber>(BigNumber.from(0))
  const [level5Staked, setLevel5Staked] = useState<BigNumber>(BigNumber.from(0))
  const [level6Staked, setLevel6Staked] = useState<BigNumber>(BigNumber.from(0))

  const [stakers, setStakers] = useState<string[]>([])
  const [totalPayout, setTotalPayout] = useState<BigNumber>(BigNumber.from(0))
  const [totalBondVested, setTotalBondVested] = useState<BigNumber>(BigNumber.from(0))

  const dfsMineAddress = getMiningAddress()
  const dfsMining = useDFSMiningContract()
  const bond = useBondContract()
  const dfs = useDFSContract()
  const hdfs = useHDFSContract()
  const hbond = useHBondContract()
  const usdt = useERC20(getUSDTAddress())

  const n = (24 * 3600) / savingInterestEpochLength

  const rewardExcludeWithdrawed = dfsRewardBalance
    .sub(withdrawedSavingReward.add(withdrawedSocialReward))
    .sub(totalStakedSavings)
  const totalReward = dfsRewardBalance.sub(totalPayout).sub(withdrawedSavingReward.add(withdrawedSocialReward))
  const spos = totalPower.toNumber() / 100

  const refresh = async () => {
    const totalLevelCount = { s0: 0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, s6: 0, s7: 0, s8: 0, bondUsed: 0 }
    const stakers = await dfsMining.getStakers()
    setStakers(stakers)
    const levelCount = await Promise.all(
      stakers.map(async (staker) => {
        const referral = await bond.addressToReferral(staker)
        const level = referral.level
        return { level: level.toNumber(), bondUsed: referral.bondUsed }
      }),
    )

    levelCount.map((l) => {
      totalLevelCount.bondUsed += l.bondUsed
      switch (l.level) {
        case 0:
          return totalLevelCount.s0++
        case 1:
          return totalLevelCount.s1++
        case 2:
          return totalLevelCount.s2++
        case 3:
          return totalLevelCount.s3++
        case 4:
          return totalLevelCount.s4++
        case 5:
          return totalLevelCount.s5++
        case 6:
          return totalLevelCount.s6++
        default:
          return 0
      }
    })

    setLevel0Staked(await dfsMining.level0Staked())
    setLevel1Staked(await dfsMining.level1Staked())
    setLevel2Staked(await dfsMining.level2Staked())
    setLevel3Staked(await dfsMining.level3Staked())
    setLevel4Staked(await dfsMining.level4Staked())
    setLevel5Staked(await dfsMining.level5Staked())
    setLevel6Staked(await dfsMining.level6Staked())

    const totalPayout = await bond.totalPayout()
    setTotalPayout(totalPayout)

    const totalBondVested = await bond.totalBondVested()
    setTotalBondVested(totalBondVested)

    const dfsBalance = await dfs.balanceOf(account)
    setDfsBalance(dfsBalance)

    const savingInterestEpochLength = await dfsMining.savingInterestEpochLength()
    setSavingInterestEpochLength(savingInterestEpochLength)

    const dfsRewardBalance = await dfs.balanceOf(bond.address)
    setDfsRewardBalance(dfsRewardBalance)

    const withdrawedSocialReward = await dfsMining.withdrawedSocialReward()
    setWithdrawedSocialReward(withdrawedSocialReward)

    const withdrawedSavingReward = await dfsMining.withdrawedSavingReward()
    setWithdrawedSavingReward(withdrawedSavingReward)

    setSocialRewardInterest((await dfsMining.socialRewardInterest()).toNumber())
    setSavingRewardInterest((await dfsMining.savingRewardInterest()).toNumber())
    setTotalSocialReward(await dfsMining.totalSocialReward())
    setTotalPower(await dfsMining.totalPower())
    setTotalStakedSavings(await dfsMining.totalStakedSavings())

    return totalLevelCount
  }
  const { data, mutate: refreshMutate } = useSWR('refresh', refresh)
  useEffect(() => {
    refreshMutate(refresh())
  }, [account, runway])

  const buySubmit = async () => {
    if (account) {
      const allowance = await usdt.allowance(account, hbond.address)
      if (allowance.eq(0)) {
        const receipt = await usdt.approve(hbond.address, MaxUint256)
        await receipt.wait()
      }
      try {
        const receipt = await hbond.deposit(parseUnits(amount, 'ether'))
        await receipt.wait()
      } catch (error: any) {
        window.alert(error.reason ?? error.data?.message ?? error.message)
        return
      }
      setAmount('')
    }
  }

  return (
    <StyledModal width={500} style={{ color: 'white' }} className="no-header" open closable maskClosable footer={[]}>
      <span>DFS奖励池总余额:{formatUnits(totalReward)}</span>
      <br />
      <span>社交奖励总余额:</span>
      <span>{parseFloat(formatUnits(totalReward)) * 0.95}</span>
      <br />
      <span>零钱奖励总余额:</span>
      <span>{parseFloat(formatUnits(totalReward)) * 0.05}</span>
      <br />
      <span>债券总销售量: {formatUnits(totalPayout, 18)}</span>
      <br />
      <span>payout余额:{formatUnits(totalPayout.sub(totalBondVested), 18)}</span>
      <br />
      <span>payout已释放:{formatUnits(totalBondVested, 18)}</span>
      <br />
      <span>社交奖励已发放部分:{formatUnits(withdrawedSocialReward, 18)}</span>
      <br />
      <span>社交奖励未发放部分:{formatUnits(totalReward.mul(95).div(100).sub(withdrawedSocialReward), 18)}</span>
      <br />
      <span>零钱罐已发放部分:{formatUnits(withdrawedSavingReward, 18)}</span>
      <br />
      <span>零钱罐未发放部分:{formatUnits(totalReward.mul(5).div(100).sub(withdrawedSavingReward), 18)}</span>
      <br />
      <span>总Spos值:{totalPower.toNumber() / 100}</span>
      <br />
      <span>零钱罐质押DFS:{formatUnits(totalStakedSavings, 18)}</span>
      <br />
      <span>系统内总质押NFT:</span>
      <span>智者碎片:{level0Staked.toNumber()} </span>
      <span>智者:{level1Staked.toNumber()} </span>
      <span>金色智者:{level2Staked.toNumber()} </span>
      <span>将军:{level3Staked.toNumber()} </span>
      <span>金色将军:{level4Staked.toNumber()} </span>
      <span>议员:{level5Staked.toNumber()} </span>
      <span>皇冠议员:{level6Staked.toNumber()} </span>
      <br />
      <span>生态总用户数:{stakers.length}</span>
      <br />
      <span>生态不同等级人数:</span>
      <span>s0: {data?.s0} </span>
      <span>s1: {data?.s1} </span>
      <span>s2: {data?.s2} </span>
      <span>s3: {data?.s3} </span>
      <span>s4: {data?.s4} </span>
      <span>s5: {data?.s5} </span>
      <span>s6: {data?.s6} </span>
      <span>s7: {data?.s7} </span>
      <span>s8: {data?.s8} </span>
      <br />
      <span>DFS奖励池已发放:</span>
      <span>{formatUnits(withdrawedSavingReward.add(withdrawedSocialReward))}</span>
      <br />
      <span>总SPOS:</span>
      <span>{spos}</span>
      <br />
      <span>质押DFS:</span>
      <span>{formatUnits(totalStakedSavings)}</span>
      <br />
      <span>跑道天数:</span>
      <input
        style={{ color: 'black', width: '10%' }}
        onInput={(e: any) => {
          setRunway(e?.target?.value)
        }}
      />
      <span>SPOS建议利率:</span>
      <span>
        {runway &&
          runway !== 0 &&
          spos !== 0 &&
          parseFloat(formatUnits(rewardExcludeWithdrawed.div(runway * spos))) * 95 * 100}
        %
      </span>
      <span>零钱罐建议利率:</span>
      <span>
        {runway &&
          runway !== 0 &&
          (parseFloat(formatUnits(rewardExcludeWithdrawed, 18)) * 5) /
            (n * runway * parseFloat(formatUnits(totalStakedSavings)))}
        %
      </span>
      <ContentWrap>
        {account && (
          <>
            <MoneyInput
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              inputMode="decimal"
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              prefix="$"
              value={amount}
              ref={inputRef}
              onChange={async (e: any) => {
                await enforcer(e.target.value.replace(/,/g, '.'))
              }}
            />
            <BondListItemBtn onClick={() => buySubmit()}>{t('Buy')}</BondListItemBtn>
          </>
        )}

        <ListItem>
          <ListLable>{t('DFS balance')}</ListLable>
          <ListContent>{formatBigNumber(dfsBalance, 5) ?? 0} DFS</ListContent>
        </ListItem>
      </ContentWrap>
    </StyledModal>
  )
}
export default Private
