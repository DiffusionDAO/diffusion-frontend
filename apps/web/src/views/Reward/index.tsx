import { useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useMatchBreakpoints, useModal } from '@pancakeswap/uikit'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useBondContract, useDFSContract, useDFSMiningContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import { MaxUint256 } from '@ethersproject/constants'
import { getBondAddress, getMiningAddress } from 'utils/addressHelpers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { formatBigNumber, formatBigNumberToFixed, formatNumber } from '@pancakeswap/utils/formatBalance'
import { shorten } from 'helpers'
import useSWR from 'swr'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import ConnectWalletButton from 'components/ConnectWalletButton'

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


interface Referral {
  self: string
  level: BigNumber
  power: BigNumber
  bondReward: BigNumber
  bondRewardUnpaid: BigNumber
  lastBondRewardWithdraw: BigNumber
  lockedPower: BigNumber
  unlockedPower: BigNumber
  socialReward: BigNumber
  socialRewardLocked: BigNumber
  lastSocialRewardWithdraw: BigNumber
  savings: BigNumber
  stakedSavings: BigNumber
  lastSavingsWithdraw: BigNumber
  savingInterestEndTime: number
}

const Reward = () => {
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const router = useRouter()
  const [access, setAccess] = useState<boolean>(true)
  const [amount, setAmount] = useState('')
  const [activeItem, setActiveItem] = useState<number>(0)
  const [bondRewardDetailModalVisible, setBondRewardDetailModalVisible] = useState<boolean>(false)
  const [powerRewardDetailModalVisible, setSocialRewardDetailModalVisible] = useState<boolean>(false)
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const [pendingSocialReward, setPendingSocialReward] = useState<BigNumber>(BigNumber.from(0))
  const [socialReward, setSocialReward] = useState<BigNumber>(BigNumber.from(0))

  const [DfsBalance, setDfsBalance] = useState<BigNumber>(BigNumber.from(0))
  const [totalSavingsReward, setTotalSavingReward] = useState<BigNumber>(BigNumber.from(0))
  const [totalStakedSavings, setTotalStakedSavings] = useState<BigNumber>(BigNumber.from(0))
  const [referralStake, setReferralStake] = useState<Referral>()
  const [nextSavingInterestChange, setNextSavingInterestChangeTime] = useState<number>(0)
  const [pendingSavingInterest, setPendingSavingInterest] = useState<BigNumber>(BigNumber.from(0))
  const [bondReward, setBondReward] = useState<BigNumber>(BigNumber.from(0))
  const [bondRewardUnpaid, setBondRewardUnpaid] = useState<BigNumber>(BigNumber.from(0))
  const [children, setChildren] = useState<string[]>()
  const [totalPower, setTotalPower] = useState<BigNumber>(BigNumber.from(0))
  const [socialRewardInterest, setSocialRewardInterest] = useState<number>(0)
  const [savingRewardInterest, setSavingRewardInterest] = useState<number>(0)
  const [requireRefresh, setRefresh] = useState<boolean>(false)
  const [savingInterestEpochLength, setSavingInterestEpochLength] = useState<number>(1)
  const [stakedSavings, setStakedSavings] = useState<BigNumber>(BigNumber.from(0))
  const [savingInterestDenominator, setSavingInterestDenominator] = useState<BigNumber>(BigNumber.from(0))
  const [socialRewardDenominator, setSocialRewardDenominator] = useState<BigNumber>(BigNumber.from(0))

  const [swiperRef, setSwiperRef] = useState<SwiperCore>(null)
  const [activeIndex, setActiveIndex] = useState(1)

  const { isMobile } = useMatchBreakpoints()
  const dfsMining = useDFSMiningContract()
  const bond = useBondContract()
  const dfsContract = useDFSContract()
  const dfsMineAddress = getMiningAddress(chainId)

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

  const refresh = async () => {
    const savingInterestEpoch = await dfsMining.savingInterestEpochLength()
    setSavingInterestEpochLength(savingInterestEpoch)
    setSocialRewardInterest((await dfsMining.socialRewardInterest()).toNumber())
    setSavingRewardInterest((await dfsMining.savingRewardInterest()).toNumber())
    setTotalPower(await dfsMining.totalPower())
    setTotalStakedSavings(await dfsMining.totalStakedSavings())
    setSavingInterestDenominator(await dfsMining.savingInterestDenominator())
    setSocialRewardDenominator(await dfsMining.socialRewardDenominator())
    if (account) {
      const addressToReferralStake = await dfsMining.addressToReferral(account)
      const referralBond = await bond.addressToReferral(account)
      setReferralStake(addressToReferralStake)
      setBondReward(referralBond?.bondReward)
      setSocialReward(addressToReferralStake?.socialReward)
      setStakedSavings(addressToReferralStake?.stakedSavings)
      const now = Date.now()
      if (now >= addressToReferralStake?.savingInterestEndTime * 1000) {
        const n = Math.ceil((now - addressToReferralStake?.savingInterestEndTime * 1000) / (savingInterestEpoch * 1000))
        setNextSavingInterestChangeTime(
          addressToReferralStake?.savingInterestEndTime * 1000 + n * savingInterestEpoch * 1000,
        )
      } else {
        setNextSavingInterestChangeTime(addressToReferralStake?.savingInterestEndTime * 1000)
      }
      setPendingSocialReward(await dfsMining.pendingSocialReward(account))
      setBondRewardUnpaid(referralBond?.bondRewardUnpaid)
      const dfsBalance = await dfsContract.balanceOf(account)
      setDfsBalance(dfsBalance)

      setPendingSavingInterest(addressToReferralStake?.savingInterest.add(await dfsMining.pendingSavingInterest(account)))
    }
  }
  const { mutate: refreshMutate } = useSWR('refresh', refresh)
  useEffect(() => {
    refreshMutate(refresh())
  }, [account, amount, requireRefresh])

  const updateChildren = async () => {
    if (account) {
      const getChildren = await bond.getChildren(account)
      setChildren(getChildren)
      const childrenHasPower = await Promise.all(
        getChildren.map(async (sub) => {
          const child = await dfsMining.addressToReferral(sub)
          if (child?.power?.toString() !== '0') {
            return child
          }
          return null
        }),
      )
      return childrenHasPower
    }
    return null
  }
  const { data: childrenHasPower, status, mutate } = useSWR('updateChildren', updateChildren)
  useEffect(() => {
    mutate(updateChildren())
  }, [account])

  const updateBondRewardDetailData = async () => {
    if (account) {
      const bondRewardContributors = await bond.getBondRewardContributors(account)
      const details = await Promise?.all(
        bondRewardContributors?.map(async (contributor) => {
          return {
            address: isMobile ? shorten(contributor) : contributor,
            value: formatBigNumber(BigNumber.from(await bond.bondRewardDetails(account, contributor)), 5),
          }
        }),
      )
      return details.reverse()
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
      const powerRewardContributors = await dfsMining.getPowerRewardContributors(account)
      const details = await Promise?.all(
        powerRewardContributors?.map(async (contributor) => {
          const reward = await dfsMining.powerRewardPerContributor(account, contributor)
          return {
            address: isMobile ? shorten(contributor) : contributor,
            value: reward.toNumber() / 100,
          }
        }),
      )
      return details.reverse()
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

  const nowDate = new Date(nextSavingInterestChange)
  const nextSavingPayoutTime = `${nowDate?.toLocaleDateString().replace(/\//g, '-')} ${nowDate
    .toTimeString()
    .slice(0, 8)}`

  const totalPowerNumber = totalPower.toNumber() / 100
  const socialRewardfiveDayROI = (5 * socialRewardInterest) / socialRewardDenominator.toNumber()
  const sposAPY = (365 * socialRewardInterest) / socialRewardDenominator.toNumber()
  const n = (24 * 3600) / savingInterestEpochLength
  const savingsfiveDayROI = (savingRewardInterest * n * 5 * 100) / savingInterestDenominator.toNumber()
  const myLockedPower = (referralStake?.power?.toNumber() * 2 - referralStake?.unlockedPower?.toNumber()) / 100
  const myTotalPower = (referralStake?.power?.toNumber() + referralStake?.unlockedPower?.toNumber()) / 100
  const greenPower = referralStake?.power.toNumber() / 100
  const nextRewardSavingNumber =
    (parseFloat(formatUnits(stakedSavings, 18)) * savingRewardInterest) / savingInterestDenominator.toNumber()

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }

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
              onSwiper={setSwiperRef}
              onSlideChange={(swiper) => {
                const index = referralStake?.level?.toNumber()
                setActiveIndex(index / slidesPerView)
                swiperRef.slideTo(index)
              }}
              onActiveIndexChange={updateActiveIndex}
            >
              {referralStake?.level !== undefined &&
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
                <RewardValueDiv>
                  {formatBigNumber(BigNumber.from(bondReward ?? 0), 6)}
                </RewardValueDiv>
                <ExtractBtn
                  onClick={async () => {
                    try {
                      const receipt = await bond.withdrawBondReward()
                      await receipt.wait()
                      setRefresh(true)
                    } catch (error: any) {
                      window.alert(error.reason ?? error.data?.message ?? error.message)
                    }
                  }}
                >
                  {t('Withdraw')}
                </ExtractBtn>
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
                      value={formatNumber(totalPowerNumber , 2)}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell
                      label={t('ROI (5 days)')}
                      value={`${formatNumber(
                        Number.isNaN(socialRewardfiveDayROI) ? 0 : socialRewardfiveDayROI * 100,
                        2,
                      )}%`}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell
                      label={t('APY')}
                      value={`${formatNumber(Number.isNaN(sposAPY) ? 0 : sposAPY * 100, 2)}%`}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
                  </MySposOveviewItem>
                  {/* <MySposOveviewItem>
                    <DataCell label={t('Current Index')} value={currentIndex} valueDivStyle={{ fontSize: '16px' }} />
                  </MySposOveviewItem> */}
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
                          <MySposDashboardDes className="alignLeft">{t('SPOS')}</MySposDashboardDes>
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
                          <MySposDashboardDes className="alignRight">{t('Locked SPOS')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={() => setActiveItem(3)}>
                          {activeItem === 3 ? (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem3.png" />
                          ) : (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardItem3.png" />
                          )}
                          <MySposDashboardValue className="alignLeft" style={{ color: '#FF2757' }}>
                            {referralStake?.unlockedPower?.toNumber() / 100}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignLeft">{t('Unlocked SPOS')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={() => setActiveItem(4)}>
                          {activeItem === 4 ? (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem4.png" />
                          ) : (
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardItem4.png" />
                          )}
                          <MySposDashboardValue className="alignRight" style={{ color: '#E7A4FF' }}>
                            {childrenHasPower?.filter((sub) => sub !== null).length ?? 0}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Networking headcount')}</MySposDashboardDes>
                        </MySposDashboardItem>
                      </MySposDashboardList>
                      <MySposDashboardMiddleItem>
                        <MySposDashboardMiddleItemValue>{myTotalPower ?? '0'}</MySposDashboardMiddleItemValue>
                        <MySposDashboardMiddleItemDes>{t('Valid SPOS')}</MySposDashboardMiddleItemDes>
                      </MySposDashboardMiddleItem>
                    </MySposDashboardWrap>
                  </Grid>
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <MySposRewardWrap isMobile={isMobile}>
                      <MySposRewardBg src="/images/reward/mySposRewardBg.png" />
                      <RewardWrap isMobile={isMobile}>
                        <RewardText>{t('Mint')}</RewardText>
                        <RewardValueDiv>
                          {formatBigNumber(socialReward.add(pendingSocialReward), 5) ?? '0'}
                        </RewardValueDiv>
                      </RewardWrap>
                      <ExtractBtn
                        onClick={async () => {
                          try {
                            const receipt = await dfsMining.withdrawSocialReward()
                            await receipt.wait()
                            setRefresh(true)
                          } catch (error: any) {
                            window.alert(error.reason ?? error.data?.message ?? error.message)
                          }
                        }}
                      >
                        {t('Withdraw')}
                      </ExtractBtn>
                      {/* <ExtractBtn
                        onClick={async () => {
                          try {
                            const receipt = await dfsMining.updatePool()
                            await receipt.wait()
                          } catch (error: any) {
                            window.alert(error.reason ?? error.data?.message ?? error.message)
                          }
                        }}
                      >
                        {t('Refresh')}
                      </ExtractBtn> */}
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
                    value={`${(savingRewardInterest / 10000).toPrecision(3)}%`}
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
                    label={t('Next reward')}
                    value={`${nextRewardSavingNumber} DFS`}
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
                    value={`${formatBigNumber(DfsBalance ?? BigNumber.from(0), 9)} DFS`}
                    position="horizontal"
                  />

                  <DataCell
                    label={t('Staked')}
                    value={`${formatBigNumber(stakedSavings, 9)} DFS`}
                    position="horizontal"
                  />

                  <DataCell
                    label={t('Rewards')}
                    value={`${parseFloat(formatBigNumber(pendingSavingInterest, 9))} DFS`}
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
                          const receipt = await dfsMining.unstakeSavings(parsedAmount)
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
                            console.log(formatUnits(allowance, 18))
                            if (allowance.eq(0)) {
                              const receipt = await dfsContract.approve(dfsMineAddress, MaxUint256)
                              await receipt.wait()
                            }
                            // allowance = await dfsContract.allowance(account, bondAddress)
                            // console.log(formatUnits(allowance,18))
                            // if (allowance.eq(0)) {
                            //   const receipt = await dfsContract.approve(bondAddress, MaxUint256)
                            //   await receipt.wait()
                            // }
                            const parsedAmount = parseUnits(amount, 'ether')
                            console.log(formatUnits(parsedAmount, 18))

                            let receipt = await dfsMining.stakeSavings(parsedAmount)
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
        <DetailModal detailData={powerRewardDetailData} onClose={closeUnlockedDetailModal} isBond={false}/>
      ) : null}
      {/* {!account && (
        <NoPower
          title={t('You cannot view this page right now')}
          description={t('Please connect your wallet')}
          btnText={t('Connect')}
          action={onPresentWalletModal}
        />
      )} */}
      {/* {account && !access && (
        <NoPower
          title={t('You cannot view this page right now')}
          description={t('Please check after bonds purchase')}
          btnText={t('Buy Bonds')}
          action={() => router.push(`/bond`)}
        />
      )} */}
    </RewardPageWrap>
  )
}
export default Reward
