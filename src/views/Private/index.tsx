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
import { getHDFSAddress, getMiningAddress, getUSDTAddress } from 'utils/addressHelpers'
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
  const [totalPower, setTotalPower] = useState<BigNumber>(BigNumber.from(0))

  const [runway, setRunway] = useState<number>(0)
  const [savingInterestEpochLength, setSavingInterestEpochLength] = useState<number>(1)
  const [dfsBalance, setDfsBalance] = useState<BigNumber>(BigNumber.from(0))

  const [stakers, setStakers] = useState<string[]>([])

  const dfsMining = useDFSMiningContract()
  const bond = useBondContract()
  const dfs = useDFSContract()
  const hdfs = useHDFSContract()
  const hbond = useHBondContract()

  const n = (24 * 3600) / savingInterestEpochLength

  const refresh = async () => {
    const stakers = await dfsMining.getStakers()
    setStakers(stakers)

    const count = {
      s0: 0,
      s1: 0,
      s2: 0,
      s3: 0,
      s4: 0,
      s5: 0,
      s6: 0,
      s7: 0,
      s8: 0,
      bondUsed: BigNumber.from(0),
      socialReward: BigNumber.from(0),
      savingInterest: BigNumber.from(0),
      unpaid: BigNumber.from(0),
      withdrawable: BigNumber.from(0),
      withdrawed: BigNumber.from(0),
      pending: BigNumber.from(0),
      totalBondReward: BigNumber.from(0),
      totalBondRewardUnwithdrawed: BigNumber.from(0),
      totalBondUsed: BigNumber.from(0),
      totalBondRewardWithdrawed: BigNumber.from(0),
      totalBondRewardUnpaid: BigNumber.from(0),
      totalBondRewardWithdrawable: BigNumber.from(0),
      totalPendingSocialReward: BigNumber.from(0),
      totalPendingSavingInterest: BigNumber.from(0),
      totalSocialReward: BigNumber.from(0),
      totalSavingInterest: BigNumber.from(0),
      level0Staked: BigNumber.from(0),
      level1Staked: BigNumber.from(0),
      level2Staked: BigNumber.from(0),
      level3Staked: BigNumber.from(0),
      level4Staked: BigNumber.from(0),
      level5Staked: BigNumber.from(0),
      level6Staked: BigNumber.from(0),
      pdfsUsed: BigNumber.from(0),
      totalPayout: BigNumber.from(0),
      withdrawedSavingReward: BigNumber.from(0),
      withdrawedSocialReward: BigNumber.from(0),
      dfsRewardBalance: BigNumber.from(0),
    }
    const buyers = await bond.getBuyers()
    await Promise.all(
      buyers.map(async (buyer) => {
        const referralBond = await bond.addressToReferral(buyer)
        count.bondUsed = count.bondUsed.add(referralBond.bondUsed)
        count.withdrawed = count.withdrawed.add(referralBond.bondRewardWithdrawed)

        const pendingBondReward = await bond.pendingBondReward(buyer)
        count.pending = count.pending.add(pendingBondReward)
        count.withdrawable = count?.withdrawable.add(pendingBondReward).add(referralBond?.bondReward)
        count.unpaid = count?.unpaid.add(referralBond?.bondRewardUnpaid.sub(pendingBondReward))
      }),
    )
    count.totalBondReward = await bond.totalBondReward()
    count.totalBondUsed = count.bondUsed
    count.totalBondRewardWithdrawed = count.withdrawed
    count.totalBondRewardUnpaid = count.unpaid
    count.totalBondRewardWithdrawable = count.totalBondReward.sub(count.totalBondRewardWithdrawed).sub(count.unpaid)
    count.totalBondRewardUnwithdrawed = count.totalBondReward.sub(count.totalBondRewardWithdrawed)

    let socialReward = BigNumber.from(0)
    let savingInterest = BigNumber.from(0)
    let pendingSocialReward = BigNumber.from(0)
    let pendingSavingInterest = BigNumber.from(0)
    await Promise.all(
      stakers.map(async (staker) => {
        pendingSocialReward = pendingSocialReward.add(await dfsMining.pendingSocialReward(staker))
        pendingSavingInterest = pendingSavingInterest.add(await dfsMining.pendingSavingInterest(staker))

        const referralStake = await dfsMining.addressToReferral(staker)
        const level = referralStake.level
        socialReward = socialReward.add(referralStake?.socialReward)
        savingInterest = savingInterest.add(referralStake?.savingInterest)
        switch (level.toNumber()) {
          case 0:
            return count.s0++
          case 1:
            return count.s1++
          case 2:
            return count.s2++
          case 3:
            return count.s3++
          case 4:
            return count.s4++
          case 5:
            return count.s5++
          case 6:
            return count.s6++
          default:
            return 0
        }
      }),
    )
    count.totalPendingSocialReward = pendingSocialReward
    count.totalPendingSavingInterest = pendingSavingInterest
    count.totalSocialReward = socialReward
    count.totalSavingInterest = savingInterest

    count.level0Staked = await dfsMining.level0Staked()
    count.level1Staked = await dfsMining.level1Staked()
    count.level2Staked = await dfsMining.level2Staked()
    count.level3Staked = await dfsMining.level3Staked()
    count.level4Staked = await dfsMining.level4Staked()
    count.level5Staked = await dfsMining.level5Staked()
    count.level6Staked = await dfsMining.level6Staked()

    count.pdfsUsed = await bond.pdfsUsed()

    count.totalPayout = await bond.totalPayout()

    count.withdrawedSocialReward = await dfsMining.withdrawedSocialReward()

    count.withdrawedSavingReward = await dfsMining.withdrawedSavingReward()

    const dfsBalance = await dfs.balanceOf(account)
    setDfsBalance(dfsBalance)

    const savingInterestEpochLength = await dfsMining.savingInterestEpochLength()
    setSavingInterestEpochLength(savingInterestEpochLength)

    count.dfsRewardBalance = await dfs.balanceOf(bond.address)

    // setSocialRewardInterest((await dfsMining.socialRewardInterest()).toNumber())
    // setSavingRewardInterest((await dfsMining.savingRewardInterest()).toNumber())
    setTotalPower(await dfsMining.totalPower())
    setTotalStakedSavings(await dfsMining.totalStakedSavings())

    return count
  }
  const { data, mutate: refreshMutate } = useSWR('refresh', refresh)
  useEffect(() => {
    refreshMutate(refresh())
  }, [account, runway])

  const totalReward = data?.dfsRewardBalance
    .sub(data?.totalBondUsed)
    .sub(data?.withdrawedSavingReward?.add(data?.withdrawedSocialReward))
    .sub(data?.totalSocialReward.add(data?.totalPendingSocialReward))
    .sub(data?.totalSavingInterest.add(data?.totalPendingSavingInterest))
    .sub(totalStakedSavings)

  const totalRewardNumber = parseFloat(formatUnits(totalReward ?? 0))
  const spos = totalPower.toNumber() / 100

  const buySubmit = async () => {
    if (account) {
      const allowance = await hdfs.allowance(account, hbond.address)
      if (allowance.eq(0)) {
        const receipt = await hdfs.approve(hbond.address, MaxUint256)
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
      <span>DFS奖励池总余额:{formatUnits(totalReward ?? 0)}</span>
      <br />
      <span>DFS奖励池已领取:</span>
      <span>{formatUnits(data?.withdrawedSavingReward.add(data?.withdrawedSocialReward) ?? 0)}</span>
      <br />
      <span>债券总销售量: {formatUnits(data?.totalPayout ?? 0)}</span>
      <br />
      <span>债券已使用:{formatUnits(data?.totalBondUsed ?? 0)}</span>
      <br />
      <span>PDFS已使用:{formatUnits(data?.pdfsUsed ?? 0)}</span>
      <br />
      <span>债券未使用:{formatUnits(data?.totalPayout.sub(data?.totalBondUsed) ?? 0)}</span>
      <br />
      <span>债券奖励总额: {formatUnits(data?.totalBondReward ?? 0)}</span>
      <br />
      <span>债券奖励已领取: {formatUnits(data?.totalBondRewardWithdrawed ?? 0)}</span>
      <br />
      <span>债券奖励未领取: {formatUnits(data?.totalBondRewardUnwithdrawed ?? 0)}</span>
      <br />
      <span>债券奖励可领取: {formatUnits(data?.totalBondRewardWithdrawable ?? 0)}</span>
      <br />
      <span>债券奖励未支付: {formatUnits(data?.totalBondRewardUnpaid ?? 0)}</span>
      <br />

      <span>社交奖励总余额:</span>
      <span>{parseFloat(formatUnits(totalReward ?? 0)) * 0.95}</span>
      <br />
      <span>社交奖励已领取:{formatUnits(data?.withdrawedSocialReward ?? 0)}</span>
      <br />
      <span>社交奖励未领取:{formatUnits(data?.totalSocialReward.add(data?.totalPendingSocialReward) ?? 0)}</span>
      <br />
      <span>零钱奖励总余额:</span>
      <span>{parseFloat(formatUnits(totalReward ?? 0)) * 0.05}</span>
      <br />
      <span>零钱奖励已领取:{formatUnits(data?.withdrawedSavingReward ?? 0)}</span>
      <br />
      <span>
        零钱奖励未领取部分:{formatUnits(data?.totalSavingInterest.add(data?.totalPendingSavingInterest) ?? 0)}
      </span>
      <br />
      <span>零钱罐质押DFS:{formatUnits(totalStakedSavings)}</span>
      <br />
      <span>系统内总质押NFT:</span>
      <br />
      <span>智者碎片:{data?.level0Staked.toNumber()} </span>
      <span>智者:{data?.level1Staked.toNumber()} </span>
      <span>金色智者:{data?.level2Staked.toNumber()} </span>
      <span>将军:{data?.level3Staked.toNumber()} </span>
      <span>金色将军:{data?.level4Staked.toNumber()} </span>
      <span>议员:{data?.level5Staked.toNumber()} </span>
      <span>皇冠议员:{data?.level6Staked.toNumber()} </span>
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
      <span>总SPOS:</span>
      <span>{spos}</span>
      <br />
      <span>跑道天数:</span>
      <input
        style={{ color: 'black', width: '10%' }}
        onInput={(e: any) => {
          setRunway(e?.target?.value)
        }}
      />
      <br />
      <span>SPOS建议利率:</span>
      <span>{runway && runway !== 0 && spos !== 0 && (totalRewardNumber * 95) / (runway * spos)}%</span>
      <br />
      <span>零钱罐建议利率:</span>
      <span>
        {runway && runway !== 0 && (totalRewardNumber * 5) / (n * runway * parseFloat(formatUnits(totalStakedSavings)))}{' '}
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
