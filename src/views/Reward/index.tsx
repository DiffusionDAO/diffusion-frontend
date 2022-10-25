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
import { useBondContract, useDFSContract, useDFSMineContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import { MaxUint256 } from '@ethersproject/constants'
import { getMiningAddress } from 'utils/addressHelpers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { formatBigNumber, formatBigNumberToFixed, formatNumber } from 'utils/formatBalance'
import { shorten } from 'helpers'

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

interface StakeInfo {
  self: string
  level: BigNumber
  power: BigNumber
  lockedPower: BigNumber
  unlockedPower: BigNumber
  socialReward: BigNumber
  socialRewardLocked: BigNumber
  lastSocialRewardWithdraw: BigNumber
  savings: BigNumber
  stakedSavings: BigNumber
  lastSavingsWithdraw: BigNumber
}
interface Referral {
  self: string
  level: BigNumber
  bondReward: BigNumber
  bondRewardLocked: BigNumber
  lastBondRewardWithdraw: BigNumber
}
const Reward = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  const [access, setAccess] = useState<boolean>(true)
  const [amount, setAmount] = useState('')
  const [activeItem, setActiveItem] = useState<number>(0)
  const [bondRewardDetailModalVisible, setBondRewardDetailModalVisible] = useState<boolean>(false)
  const [socialRewardDetailModalVisible, setSocialRewardDetailModalVisible] = useState<boolean>(false)
  const [referrals, setReferrals] = useState({})
  const [me, setMe] = useState<any>({})
  const [stake, setStake] = useState<StakeInfo>()
  const [stakers, setStakers] = useState<string[]>()
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const [bondReward, setBondReward] = useState<BigNumber>()
  const [pendingSocialReward, setPendingReward] = useState()
  const [DfsBalance, setDfsBalance] = useState<BigNumber>()
  const [totalSavings, setTotalSaving] = useState<BigNumber>()
  const [socialReward, setSocialReward] = useState<BigNumber>()
  const [pendingBondReward, setPendingBondReward] = useState<BigNumber>()
  const [referral, setReferral] = useState<Referral>()
  const [nextSavingInterestChange, setNextSavingInterestChangeTime] = useState<Date>()
  const [unpaidBondReward, setUnpaidBondReward] = useState<string>()

  const { isMobile } = useMatchBreakpoints()
  const { onPresentConnectModal } = useWallet()
  const dfsMineContract = useDFSMineContract()
  const dfsContract = useDFSContract()
  const bondContract = useBondContract()
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

  useEffect(() => {
    if (account) {
      dfsMineContract.pendingSocialReward(account).then((res) => setPendingReward(res))
      dfsMineContract.totalRewards().then((res) => setTotalSaving(res))
      dfsMineContract.stakeInfo(account).then((stakeInfo) => {
        setStake(stakeInfo)
      })
      dfsMineContract.getStakers().then((res) => setStakers(res))
      dfsMineContract.epoch().then((res) => setNextSavingInterestChangeTime(new Date(res.endTime * 1000)))
      bondContract.pendingBondReward(account).then((res) => setPendingBondReward(res))

      bondContract.addressToReferral(account).then((referral) => {
        setReferral(referral)
        setUnpaidBondReward(
          formatBigNumber(BigNumber.from(referral?.bondRewardLocked?.sub(pendingBondReward ?? BigNumber.from(0))), 6),
        )
      })
      dfsContract.balanceOf(account).then((res) => setDfsBalance(res))
    }
  }, [account, amount])

  const rewardVestingSeconds = 100 * 24 * 3600
  const savingVestingSeconds = 300 * 24 * 3600
  const nextTime = new Date(Date.now())
  // const nextTime = nextSavingsStakingPayoutTime ? new Date(nextSavingsStakingPayoutTime?.toNumber() * 1000) : new Date(Date.now())
  const nextSavingPayoutTime = `${nextSavingInterestChange
    ?.toLocaleDateString()
    .replace(/\//g, '-')} ${nextSavingInterestChange?.toTimeString().slice(0, 8)}`
  const epochLength = 8 * 3600
  const rewardInterest = formatNumber(
    Number.isNaN(epochLength / rewardVestingSeconds) ? 0 : (epochLength / rewardVestingSeconds) * 100,
    2,
  )
  const savingInterest = Number.isNaN(epochLength / savingVestingSeconds)
    ? 0
    : (epochLength / savingVestingSeconds) * 100

  const fiveDayROI = formatNumber(Number.isNaN(savingInterest) ? 0 : ((1 + savingInterest / 100) ** 15 - 1) * 100, 2)
  const myLockedPower = BigNumber.from(stake?.power ?? 0)
    .mul(2)
    .toString()
  const myTotalPower = BigNumber.from(stake?.power?.add(stake?.unlockedPower ?? 0) ?? 0).toString()
  const greenPower = BigNumber.from(stake?.power ?? 0).toString()

  const now = Math.floor(Date.now() / 1000)

  const pendingRewardString = formatBigNumber(BigNumber.from(pendingSocialReward ?? 0), 5)
  const dfsFromBondReward = formatBigNumber(BigNumber.from(referral?.bondReward ?? 0), 6)
  const nextRewardSavingNumber = Number.isNaN(savingInterest)
    ? BigNumber.from(0)
    : BigNumber.from(totalSavings ?? 0)
        .mul(epochLength)
        .div(savingVestingSeconds)
  const nextRewardSaving = formatBigNumber(nextRewardSavingNumber, 2)
  const bondRewardDetailKeys = Object.keys(me?.dfsBondRewardDetail ?? {})
  const unlockedPowerDetailKeys = Object.keys(me?.unlockedPowerDetail ?? {})
  const bondRewardDetailData = bondRewardDetailKeys.map((key) => {
    return {
      address: isMobile ? shorten(key) : key,
      value: formatBigNumber(BigNumber.from(me?.dfsBondRewardDetail[key] ?? 0), 5),
    }
  })
  const socialRewardDetailData = unlockedPowerDetailKeys.map((key) => {
    return {
      address: isMobile ? shorten(key) : key,
      value: formatBigNumber(BigNumber.from(Object.values(me?.unlockedPowerDetail[key])[0] ?? 0), 5),
    }
  })
  useEffect(() => {
    if (account) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      fetch('https://middle.diffusiondao.org/referrals').then((res) =>
        res
          .json()
          .then((response) => {
            setMe(response[account])
            setReferrals(response)
          })
          .catch((error) => console.log(error)),
      )
    }
  }, [account])

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
                swiper.slideTo(stake?.level?.toNumber())
              }}
              onSlideChange={(swiper) => {
                swiper.slideTo(stake?.level?.toNumber())
              }}
              onUpdate={(swiper) => {
                swiper.slideTo(stake?.level?.toNumber())
              }}
              // onActiveIndexChange={updateSwiper}
            >
              {stake?.level !== undefined &&
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
                  <DiffusionGoldTitle>{t('My social networking rewards')}</DiffusionGoldTitle>
                  <DiffusionGoldDetailJump onClick={openDetailModal}>{`${t('Detail')}>`}</DiffusionGoldDetailJump>
                </DiffusionGoldHeader>
                <Petal src="/images/reward/petal.png" isMobile={isMobile} />
                <RewardText>{t('Rewards')}</RewardText>
                <RewardValueDiv>{dfsFromBondReward}</RewardValueDiv>
                <ExtractBtn
                  onClick={async () => {
                    if (dfsFromBondReward !== '0.0') {
                      const receipt = await dfsMineContract.withdrawBondReward()
                      await receipt.wait()
                      const response = await fetch('https://middle.diffusiondao.org/withdrawBondReward', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          address: account,
                        }),
                      })
                      const json = await response.json()
                      setStake(json[account])
                    } else {
                      alert('No bond reward')
                    }
                  }}
                >
                  {t('Withdraw')}
                </ExtractBtn>
                <RewardText>{t('Unpaid Bond Rewards')}</RewardText>
                <RewardValueDiv>
                  {formatBigNumber(referral?.bondRewardLocked?.sub(pendingBondReward ?? 0) ?? BigNumber.from(0), 2)}
                </RewardValueDiv>
              </DiffusionGoldWrap>
            </Grid>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <MySposWrap>
                <MySposHeader>
                  <MySposTitle>{t('My SPOS value')}</MySposTitle>
                  <MySposDetailJump onClick={openUnlockedDetailModal}>{`${t('Detail')}>`}</MySposDetailJump>
                </MySposHeader>
                <MySposOveview>
                  <MySposOveviewItem>
                    <DataCell label={t('Next payout')} value="0" valueDivStyle={{ fontSize: '16px' }} />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell label={t('Next reward')} value="0" valueDivStyle={{ fontSize: '16px' }} />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell
                      label={t('Current interest')}
                      value={`${rewardInterest}%`}
                      valueDivStyle={{ fontSize: '16px' }}
                    />
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
                            {stake?.unlockedPower?.toString() ?? '0'}
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
                            {stakers?.length ?? 0}
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
                        <RewardValueDiv>{pendingRewardString ?? '0'}</RewardValueDiv>
                      </RewardWrap>
                      <ExtractBtn
                        onClick={async () => {
                          if (socialReward.gt(0)) {
                            const receipt = await dfsMineContract.claim()
                            await receipt.wait()
                            const response = await fetch('https://middle.diffusiondao.org/withdrawSoicalReward', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                address: account,
                              }),
                            })
                            const json = await response.json()
                            setStake(json[account])
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
                    value={`${savingInterest.toPrecision(5)}%`}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />
                  <DataCell
                    label={t('ROI (5 days)')}
                    value={`${fiveDayROI}%`}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />
                  <DataCell
                    label={t('Next reward value')}
                    value={`${nextRewardSaving} DFS`}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />

                  {/* <DataCell label='apy' value={rewardData.apy} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label='current index' value={`${rewardData.curIndex}DFS`} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label='total value deposited' value={rewardData.totalValueDeposited} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/> */}
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className="hasBorder">
                  <DataCellWrap>
                    <DataCell
                      label={t('Balance')}
                      value={`${formatBigNumber(DfsBalance ?? BigNumber.from(0), 2)} DFS`}
                      position="horizontal"
                    />
                  </DataCellWrap>
                  <DataCell
                    label={t('Staked')}
                    value={`${formatBigNumber(stake?.stakedSavings ?? BigNumber.from(0), 2)} DFS`}
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
      {socialRewardDetailModalVisible ? (
        <DetailModal detailData={socialRewardDetailData} onClose={closeUnlockedDetailModal} />
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
