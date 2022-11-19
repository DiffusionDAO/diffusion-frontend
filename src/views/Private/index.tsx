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
  const [s0, setS0] = useState<number>(0)
  const [s1, setS1] = useState<number>(0)
  const [s2, setS2] = useState<number>(0)
  const [s3, setS3] = useState<number>(0)
  const [s4, setS4] = useState<number>(0)
  const [s5, setS5] = useState<number>(0)
  const [s6, setS6] = useState<number>(0)
  const [s7, setS7] = useState<number>(0)
  const [s8, setS8] = useState<number>(0)
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

  const totalReward = dfsRewardBalance.sub(totalStakedSavings)
  const rewardExcludeWithdrawed = dfsRewardBalance
    .sub(withdrawedSavingReward.add(withdrawedSocialReward))
    .sub(totalStakedSavings)
  const spos = totalPower.toNumber() / 100

  const refresh = async () => {
    const stakers = await dfsMining.getStakers()
    setStakers(stakers)
    stakers.map(async (staker) => {
      const referral = await dfsMining.addressToReferral(staker)
      const level = referral.level
      if (level === 0) {
        setS0(s0 + 1)
      } else if (level === 1) {
        setS1(s1 + 1)
      } else if (level === 2) {
        setS2(s2 + 1)
      } else if (level === 3) {
        setS3(s3 + 1)
      } else if (level === 4) {
        setS4(s4 + 1)
      } else if (level === 5) {
        setS5(s5 + 1)
      } else if (level === 6) {
        setS6(s6 + 1)
      } else if (level === 7) {
        setS7(s7 + 1)
      } else if (level === 8) {
        setS8(s8 + 1)
      }
    })

    const totalPayout = await bond.totalPayout()
    setTotalPayout(totalPayout)

    const totalBondVested = await bond.totalBondVested()
    setTotalBondVested(totalBondVested)

    const dfsBalance = await dfs.balanceOf(account)
    setDfsBalance(dfsBalance)

    const savingInterestEpochLength = await dfsMining.savingInterestEpochLength()
    setSavingInterestEpochLength(savingInterestEpochLength)

    const dfsRewardBalance = await dfs.balanceOf(dfsMineAddress)
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
  }
  const { mutate: refreshMutate } = useSWR('refresh', refresh)
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
      <span>系统内总质押NFT:{}</span>
      <br />
      <span>生态总用户数:{stakers.length}</span>
      <br />
      <span>生态不同等级人数:</span>
      <span>s0: {s0}</span>
      <span>s1: {s1}</span>
      <span>s2: {s2}</span>
      <span>s3: {s3}</span>
      <span>s4: {s4}</span>
      <span>s5: {s5}</span>
      <span>s6: {s6}</span>
      <span>s7: {s7}</span>
      <span>s8: {s8}</span>
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
