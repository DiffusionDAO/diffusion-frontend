import { useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWallet } from 'hooks/useWallet'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useDFSContract, useDFSMineContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import { MaxUint256 } from '@ethersproject/constants'
import { getMiningAddress } from 'utils/addressHelpers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { formatBigNumber, formatBigNumberToFixed, formatNumber } from 'utils/formatBalance'
import { shorten } from 'helpers'
import useSWR from 'swr'

import {
  RewardPageWrap,
  SwiperWrap,
  SwiperWrapBgImg,
  SwiperItem,
  SwiperItemImg,
  SwiperItemName,
  SwiperItemDes,
  DiffusionGoldWrap,
  DiffusionGoldHeader,
  DiffusionGoldTitle,
  DiffusionGoldDetailJump,
  Petal,
  RewardWrap,
  RewardText,
  RewardValueDiv,
  ExtractBtn,
  MySposWrap,
  MySposHeader,
  MySposTitle,
  MySposDetailJump,
  MySposOveview,
  MySposOveviewItem,
  CoinImg,
  MySposDashboardWrap,
  MySposDashboardList,
  MySposDashboardItem,
  MySposDashboardItemImage,
  MySposDashboardValue,
  MySposDashboardDes,
  MySposDashboardMiddleItem,
  MySposDashboardMiddleItemValue,
  MySposDashboardMiddleItemDes,
  MySposRewardWrap,
  MySposRewardBg,
  CardWrap,
  CardTitle,
  CardItem,
  DataCellWrap,
  MoneyInput,
  BtnWrap,
  StakeBtn,
  TakeOutBtn,
} from './style'
import DataCell from '../../components/ListDataCell'
import DetailModal from './components/DetailModal'
import NoPower from './components/NoPower'
import useInterval from '../../../packages/hooks/src/useInterval'

interface Referral {
  self: string
  level: BigNumber
  power: BigNumber
  bondReward: BigNumber
  bondRewardLocked: BigNumber
  lastBondRewardWithdraw: BigNumber
  lockedPower: BigNumber
  unlockedPower: BigNumber
  socialReward: BigNumber
  socialRewardLocked: BigNumber
  lastSocialRewardWithdraw: BigNumber
  savings: BigNumber
  stakedSavings: BigNumber
  lastSavingsWithdraw: BigNumber
}
interface BondRewardDetail {
  contributor: string
  contribution: BigNumber
}
interface PowerRewardDetail {
  contributor: string
  tokenId: string
  contribution: BigNumber
}
const Reward = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  const [access, setAccess] = useState<boolean>(true)
  const [amount, setAmount] = useState('')
  const [activeItem, setActiveItem] = useState<number>(0)
  const [bondRewardDetailModalVisible, setBondRewardDetailModalVisible] = useState<boolean>(false)
  const [powerRewardDetailModalVisible, setSocialRewardDetailModalVisible] = useState<boolean>(false)
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const [pendingSocialReward, setPendingSocialReward] = useState<BigNumber>(BigNumber.from(0))
  const [DfsBalance, setDfsBalance] = useState<BigNumber>(BigNumber.from(0))
  const [totalSavings, setTotalSaving] = useState<BigNumber>(BigNumber.from(0))
  const [pendingBondReward, setPendingBondReward] = useState<BigNumber>(BigNumber.from(0))
  const [referral, setReferral] = useState<Referral>()
  const [nextSavingInterestChange, setNextSavingInterestChangeTime] = useState<Date>()
  const [unpaidBondReward, setUnpaidBondReward] = useState<string>()
  const [soicalRewardVestingSeconds, setSoicalRewardVestingSeconds] = useState<number>(100 * 24 * 3600)
  const [savingsRewardVestingSeconds, setSavingsRewardVestingSeconds] = useState<number>(300 * 24 * 3600)
  const [pendingSavingReward, setPendingSavingsReward] = useState<BigNumber>(BigNumber.from(0))
  const [bondReward, setBondReward] = useState<BigNumber>(BigNumber.from(0))
  const [bondRewardLocked, setBondRewardLocked] = useState<BigNumber>(BigNumber.from(0))
  const [powerRewardContributors, setPowerRewardContributors] = useState<any[]>()
  const [bondRewardContributors, setBondRewardContributors] = useState<any[]>()
  const [subordinates, setSubordinates] = useState<string[]>()
  const [epoch, setEpoch] = useState<any>({})
  const [totalPower, setTotalPower] = useState<BigNumber>(BigNumber.from(0))
  const [totalSocialReward, setTotalSocialReward] = useState<BigNumber>(BigNumber.from(0))
  const [socialRewardPerSecond, setSocialRewardPerSecond] = useState<BigNumber>(BigNumber.from(0))
  const [rewardVestingSeconds, setRewardVestingSeconds] = useState<BigNumber>(BigNumber.from(0))

  const { isMobile } = useMatchBreakpoints()
  const { onPresentConnectModal } = useWallet()
  const dfsMineContract = useDFSMineContract()
  const dfsContract = useDFSContract()
  const dfsMineAddress = getMiningAddress()
  const slidesPerView = isMobile ? 1 : 3
  const swiperWrapBgImgUrl = isMobile ? '/images/reward/swiperWrapBgMobile.png' : '/images/reward/swiperWrapBg.png'
  const swiperSlideData = [
    { name: '0' },
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
    { name: '7' },
    { name: '8' },
  ]

  const openDetailModal = () => {
    setBondRewardDetailModalVisible(true)
  }
  const openUnlockedDetailModal = () => {
    setSocialRewardDetailModalVisible(true)
  }
  const closeUnlockedDetailModal = () => {
    setSocialRewardDetailModalVisible(false)
  }
  const closeDetailModal = () => {
    setBondRewardDetailModalVisible(false)
  }

  const refresh = useCallback(() => {
    if (account) {
      dfsMineContract.epoch().then((res) => {
        setEpoch(res)
        setNextSavingInterestChangeTime(new Date(res.endTime * 1000))
      })

      dfsMineContract.socialRewardVestingSeconds().then((res) => setRewardVestingSeconds(res))
      dfsMineContract.socialRewardPerSecond().then((res) => setSocialRewardPerSecond(res))
      dfsMineContract.totalSocialReward().then((res) => setTotalSocialReward(res))
      dfsMineContract.totalPower().then((res) => setTotalPower(res))
      dfsMineContract.getSubordinates(account).then((res) => setSubordinates(res))
      dfsMineContract.socialRewardVestingSeconds().then((res) => setSoicalRewardVestingSeconds(res))
      dfsMineContract.savingsRewardVestingSeconds().then((res) => setSavingsRewardVestingSeconds(res))
      dfsMineContract.pendingSocialReward(account).then((res) => setPendingSocialReward(res))
      dfsMineContract.pendingBondReward(account).then((res) => setPendingBondReward(res))
      dfsMineContract.pendingSavingReward(account).then((res) => setPendingSavingsReward(res))

      dfsMineContract.totalSavings().then((res) => setTotalSaving(res))
      dfsMineContract.addressToReferral(account).then((res) => {
        setReferral(res)
      })

      dfsMineContract.addressToReferral(account).then((referral) => {
        setReferral(referral)
        setBondReward(referral?.bondReward)
        setBondRewardLocked(referral?.bondRewardLocked)
      })
      dfsContract.balanceOf(account).then((res) => setDfsBalance(res))
    }
  }, [account, amount])
  useInterval(refresh, 3000)

  const updateBondRewardDetailData = async () => {
    if (account) {
      const bondRewardContributors = await dfsMineContract.getBondRewardContributors(account)
      const details = await Promise?.all(
        bondRewardContributors?.map(async (contributor) => {
          return {
            address: isMobile ? shorten(contributor) : contributor,
            value: formatBigNumber(BigNumber.from(await dfsMineContract.bondRewardDetails(account, contributor)), 5),
          }
        }),
      )
      return details
    }
    return []
  }
  const {
    data: bondRewardDetailData,
    status: bondRewardDetailDataStatus,
    mutate: bondRewardDetailDataMutate,
  } = useSWR('BondRewardDetailData', updateBondRewardDetailData)
  useEffect(() => {
    bondRewardDetailDataMutate(updateBondRewardDetailData())
  }, [bondRewardDetailModalVisible, account])

  const updatePowerRewardDetailData = async () => {
    if (account) {
      const powerRewardContributors = await dfsMineContract.getPowerRewardContributors(account)
      const details = await Promise?.all(
        powerRewardContributors?.map(async (contributor) => {
          const reward = await dfsMineContract.powerRewardPerContributor(account, contributor)
          return {
            address: isMobile ? shorten(contributor) : contributor,
            value: reward.toNumber() / 100,
          }
        }),
      )
      return details
    }
    return []
  }
  const {
    data: powerRewardDetailData,
    status: socialRewardDetailDataStatus,
    mutate: powerRewardDetailDataMutate,
  } = useSWR('powerRewardDetailData', updatePowerRewardDetailData)
  useEffect(() => {
    powerRewardDetailDataMutate(updatePowerRewardDetailData())
  }, [powerRewardDetailModalVisible, account])

  const nextSavingPayoutTime = `${nextSavingInterestChange
    ?.toLocaleDateString()
    .replace(/\//g, '-')} ${nextSavingInterestChange?.toTimeString().slice(0, 8)}`

  const currentIndex = totalPower.gt(0) ? formatBigNumber(totalSocialReward?.mul(100).div(totalPower), 2) : '0'
  const savingInterest = (epoch?.length * 3) / savingsRewardVestingSeconds
  const totalSocialRewardNumber = parseFloat(formatUnits(totalSocialReward))
  const totalPowerNumber = totalPower.toNumber()
  const socialRewardInterest =
    (totalSocialRewardNumber * 100 * 24 * 3600) / (rewardVestingSeconds.toNumber() * totalPowerNumber)
  const socialRewardfiveDayROI = 5 * socialRewardInterest
  const sposAPY = 365 * socialRewardInterest
  const savingsfiveDayROI = formatNumber(((1 + savingInterest) ** 15 - 1) * 100, 2)
  const myLockedPower = (referral?.power.toNumber() * 2 - referral?.unlockedPower?.toNumber()) / 100
  const myTotalPower = (referral?.power?.toNumber() + referral?.unlockedPower?.toNumber()) / 100
  const greenPower = referral?.power.toNumber() / 100
  const pendingSocialRewardString = formatBigNumber(BigNumber.from(pendingSocialReward), 5)
  const dfsFromBondReward = formatBigNumber(BigNumber.from(bondReward.add(pendingBondReward) ?? 0), 6)
  const nextRewardSavingNumber = Number.isNaN(savingInterest)
    ? BigNumber.from(0)
    : BigNumber.from(totalSavings)
        .mul(epoch?.length ?? 0)
        .div(savingsRewardVestingSeconds)
  const nextRewardSaving = formatBigNumber(nextRewardSavingNumber, 2)

  const hasPower = useCallback(
    async (address) => {
      const res = await dfsMineContract.addressToReferral(address)
      return res.power !== 0
    },
    [account],
  )

  return (
    <RewardPageWrap>
      {account && access && (
        <>
          <SwiperWrap isMobile={isMobile}>
            <Swiper
              modules={[Navigation]}
              className="rewardSwiper"
              spaceBetween={50}
              initialSlide={0}
              slidesPerView={slidesPerView}
              centeredSlides
              navigation
              onSwiper={(swiper) => {
                swiper.slideTo(referral?.level?.toNumber())
              }}
              onSlideChange={(swiper) => {
                swiper.slideTo(referral?.level?.toNumber())
              }}
              onUpdate={(swiper) => {
                swiper.slideTo(referral?.level?.toNumber())
              }}
            >
              {referral?.level !== undefined &&
                swiperSlideData.map((item, index) => {
                  return (
                    <SwiperSlide key={item.name}>
                      <SwiperItem isMobile={isMobile}>
                        <SwiperItemImg src={`/images/reward/headPortrait${index}.png`} />
                      </SwiperItem>
                    </SwiperSlide>
                  )
                })}
            </Swiper>
            <SwiperWrapBgImg src={swiperWrapBgImgUrl} isMobile={isMobile} />
          </SwiperWrap>

          <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <DiffusionGoldWrap isMobile={isMobile}>
                <DiffusionGoldHeader>
                  <DiffusionGoldTitle>{t('Bond reward')}</DiffusionGoldTitle>
                  <DiffusionGoldDetailJump onClick={openDetailModal}>{`${t('Detail')}`}</DiffusionGoldDetailJump>
                </DiffusionGoldHeader>
                <Petal src="/images/reward/petal.png" isMobile={isMobile} />
                <RewardText>{t('Rewards')}</RewardText>
                <RewardValueDiv>{dfsFromBondReward}</RewardValueDiv>
                <ExtractBtn
                  onClick={async () => {
                    if (dfsFromBondReward !== '0.0') {
                      try {
                        const receipt = await dfsMineContract.withdrawBondReward()
                        await receipt.wait()
                      } catch (error: any) {
                        window.alert(error.reason ?? error.data?.message ?? error.message)
                      }
                    } else {
                      alert('No bond reward')
                    }
                  }}
                >
                  {t('Withdraw')}
                </ExtractBtn>
                <RewardText>{t('Unpaid Bond Rewards')}</RewardText>
                <RewardValueDiv>{formatBigNumber(bondRewardLocked ?? BigNumber.from(0), 2)}</RewardValueDiv>
              </DiffusionGoldWrap>
            </Grid>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <MySposWrap>
                <MySposHeader>
                  <MySposTitle>{t('SPOS value')}</MySposTitle>
                  <MySposDetailJump onClick={openUnlockedDetailModal}>{`${t('Detail')}`}</MySposDetailJump>
                </MySposHeader>
                <MySposOveview>
                  <MySposOveviewItem>
                    <DataCell
                      label={t('Total SPOS')}
                      value={formatNumber(totalPower.toNumber() / 100, 2)}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell
                      label={t('ROI (5 days)')}
                      value={`${formatNumber(Number.isNaN(socialRewardfiveDayROI) ? 0 : socialRewardfiveDayROI, 2)}%`}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell
                      label={t('APY')}
                      value={`${formatNumber(Number.isNaN(sposAPY) ? 0 : sposAPY, 2)}%`}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell label={t('Current Index')} value={currentIndex} valueDivStyle={{ fontSize: '16px' }} />
                  </MySposOveviewItem>
                  <CoinImg src="/images/reward/coin.png" />
                </MySposOveview>
                <Grid container spacing={2}>
                  <Grid item lg={7} md={7} sm={12} xs={12}>
                    <MySposDashboardWrap>
                      <MySposDashboardList>
                        <MySposDashboardItem onClick={() => setActiveItem(1)}>
                          {activeItem === 1 ? (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem1.png" />
                          ) : (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardItem1.png" />
                          )}
                          <MySposDashboardValue className="alignLeft" style={{ color: '#00FFEE' }}>
                            {greenPower ?? '0'}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignLeft">{t('Unlocked SPOS value')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={() => setActiveItem(2)}>
                          {activeItem === 2 ? (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem2.png" />
                          ) : (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardItem2.png" />
                          )}
                          <MySposDashboardValue className="alignRight" style={{ color: 'grey' }}>
                            {myLockedPower ?? '0'}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Locked SPOS value')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={() => setActiveItem(3)}>
                          {activeItem === 3 ? (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem3.png" />
                          ) : (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardItem3.png" />
                          )}
                          <MySposDashboardValue className="alignLeft" style={{ color: '#FF2757' }}>
                            {referral?.unlockedPower?.toNumber() / 100}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignLeft">{t('Networking unlocked SPOS')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={() => setActiveItem(4)}>
                          {activeItem === 4 ? (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem4.png" />
                          ) : (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardItem4.png" />
                          )}
                          <MySposDashboardValue className="alignRight" style={{ color: '#E7A4FF' }}>
                            {subordinates?.filter((address) => hasPower(address)).length ?? 0}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Networking headcount')}</MySposDashboardDes>
                        </MySposDashboardItem>
                      </MySposDashboardList>
                      <MySposDashboardMiddleItem>
                        <MySposDashboardMiddleItemValue>{myTotalPower ?? '0'}</MySposDashboardMiddleItemValue>
                        <MySposDashboardMiddleItemDes>{t('Valid SPOS value')}</MySposDashboardMiddleItemDes>
                      </MySposDashboardMiddleItem>
                    </MySposDashboardWrap>
                  </Grid>
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <MySposRewardWrap isMobile={isMobile}>
                      <MySposRewardBg src="/images/reward/mySposRewardBg.png" />
                      <RewardWrap isMobile={isMobile}>
                        <RewardText>{t('Rewards')}</RewardText>
                        <RewardValueDiv>{pendingSocialRewardString ?? '0'}</RewardValueDiv>
                      </RewardWrap>
                      <ExtractBtn
                        onClick={async () => {
                          if (pendingSocialReward?.gt(0)) {
                            try {
                              const receipt = await dfsMineContract.withdrawSocialReward()
                              await receipt.wait()
                              setPendingBondReward(BigNumber.from(0))
                            } catch (error: any) {
                              window.alert(error.reason ?? error.data?.message ?? error.message)
                            }
                          } else {
                            alert('No social reward')
                          }
                        }}
                      >
                        {t('Withdraw')}
                      </ExtractBtn>
                    </MySposRewardWrap>
                  </Grid>
                </Grid>
              </MySposWrap>
            </Grid>
          </Grid>
          <CardWrap>
            <CardTitle>{t('Coin Jar')}</CardTitle>
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile}>
                  <DataCell
                    label={t('Next payout time')}
                    value={nextSavingPayoutTime}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />
                  <DataCell
                    label={t('Next payout rate')}
                    value={`${(100 * savingInterest).toPrecision(5)}%`}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />
                  <DataCell
                    label={t('ROI (5 days)')}
                    value={`${savingsfiveDayROI}%`}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />
                  <DataCell
                    label={t('Next reward value')}
                    value={`${nextRewardSaving} DFS`}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />

                  {/* <DataCell label='sposAPY' value={rewardData.sposAPY} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label='current index' value={`${rewardData.curIndex}DFS`} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label='total value deposited' value={rewardData.totalValueDeposited} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/> */}
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className="hasBorder">
                  <DataCell
                    label={t('Balance')}
                    value={`${formatBigNumber(DfsBalance ?? BigNumber.from(0), 2)} DFS`}
                    position="horizontal"
                  />

                  <DataCell
                    label={t('Staked')}
                    value={`${formatBigNumber(referral?.stakedSavings ?? BigNumber.from(0), 2)} DFS`}
                    position="horizontal"
                  />

                  <DataCell
                    label={t('Rewards')}
                    value={`${formatBigNumber(pendingSavingReward, 5)} DFS`}
                    position="horizontal"
                  />
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className="hasBorder">
                  <MoneyInput
                    prefix=""
                    suffix="DFS"
                    value={amount?.toString()}
                    onInput={(e: any) => setAmount(e.target.value)}
                  />
                  <BtnWrap>
                    <TakeOutBtn
                      style={{ marginRight: '10px' }}
                      onClick={async () => {
                        const parsedAmount = parseUnits(amount, 'ether')
                        try {
                          const receipt = await dfsMineContract.unstakeSavings(parsedAmount)
                          await receipt.wait()
                          setAmount('')
                        } catch (error: any) {
                          window.alert(error.reason ?? error.data?.message ?? error.message)
                        }
                      }}
                    >
                      {t('Unstake')}
                    </TakeOutBtn>
                    <StakeBtn
                      onClick={async () => {
                        if (amount) {
                          try {
                            const allowance = await dfsContract.allowance(account, dfsMineAddress)
                            if (allowance.eq(0)) {
                              const receipt = await dfsContract.approve(dfsMineAddress, MaxUint256)
                              await receipt.wait()
                            }
                            const parsedAmount = parseUnits(amount, 'ether')

                            let receipt = await dfsMineContract.stakeSavings(parsedAmount)
                            receipt = await receipt.wait()
                            setAmount('')
                          } catch (error: any) {
                            window.alert(error.reason ?? error.data?.message ?? error.message)
                          }
                        }
                      }}
                    >
                      {t('Stake')}
                    </StakeBtn>
                  </BtnWrap>
                </CardItem>
              </Grid>
            </Grid>
          </CardWrap>
        </>
      )}
      {bondRewardDetailModalVisible ? (
        <DetailModal detailData={bondRewardDetailData} onClose={closeDetailModal} />
      ) : null}
      {powerRewardDetailModalVisible ? (
        <DetailModal detailData={powerRewardDetailData} onClose={closeUnlockedDetailModal} />
      ) : null}
      {!account && (
        <NoPower
          title={t('You cannot view this page right now')}
          description={t('Please connect your wallet')}
          btnText={t('Connect')}
          action={onPresentConnectModal}
        />
      )}
      {account && !access && (
        <NoPower
          title={t('You cannot view this page right now')}
          description={t('Please check after bonds purchase')}
          btnText={t('Buy Bonds')}
          action={() => router.push(`/bond`)}
        />
      )}
    </RewardPageWrap>
  )
}
export default Reward
