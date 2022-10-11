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
import { getMineAddress } from 'utils/addressHelpers'
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
import useInterval from '../../../packages/hooks/src/useInterval'

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

  const { isMobile } = useMatchBreakpoints()
  const { onPresentConnectModal } = useWallet()
  const dfsMineContract = useDFSMineContract()
  const dfsContract = useDFSContract()
  const dfsMineAddress = getMineAddress()
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
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const [reward, setReward] = useState([])
  // const { data:reward } = useSWRContract([dfsMineContract, 'getReward', [account ?? zeroAddress]])

  const [
    pendingReward,
    DfsBalance,
    totalRewards,
    totalSavings,
    rewardVestingSeconds,
    bondRewardVestingSeconds,
    savingVestingSeconds,
    rewardPerSecond,
    savingsPerSecond,
    nextSavingsStakingPayoutTime,
    epochLength,
    stakedSavings,
    socialReward,
    bondReward,
  ] = [...(reward ?? [])]
  console.log(
    pendingReward,
    DfsBalance,
    totalRewards,
    totalSavings,
    rewardVestingSeconds,
    bondRewardVestingSeconds?.toString(),
    savingVestingSeconds,
    rewardPerSecond?.toString(),
    savingsPerSecond,
    nextSavingsStakingPayoutTime,
    epochLength,
    stakedSavings,
    socialReward?.toString(),
    bondReward?.toString(),
  )
  const nextTime = nextSavingsStakingPayoutTime ? new Date(nextSavingsStakingPayoutTime?.toNumber() * 1000) : 0
  const nextSavingInterestChange =
    nextTime !== 0
      ? `${nextTime?.toLocaleDateString().replace(/\//g, '-')} ${nextTime?.toTimeString().slice(0, 8)}`
      : '0'
  const rewardInterest = formatNumber(
    Number.isNaN(epochLength / rewardVestingSeconds) ? 0 : (epochLength / rewardVestingSeconds) * 100,
    2,
  )
  console.log('epochLength:', epochLength?.toString(), savingVestingSeconds?.toString())
  const savingInterest = Number.isNaN(epochLength / savingVestingSeconds)
    ? 0
    : (epochLength / savingVestingSeconds) * 100
  console.log(savingInterest)
  const fiveDayROI = formatNumber(Number.isNaN(savingInterest) ? 0 : (1 + savingInterest / 100) ** 15 - 1, 2)
  console.log((1 + savingInterest / 100) ** 15 - 1)
  const lockedPower = useMemo(() => {
    return formatBigNumber(
      BigNumber.from(me?.power ?? 0)
        .mul(2)
        .sub(BigNumber.from(me?.totalUnlockedPower ?? 0)),
      3,
    )
  }, [me])
  const totalPowerOfUser = formatBigNumber(
    BigNumber.from(me?.power ?? 0).add(BigNumber.from(me?.totalUnlockedPower ?? 0)),
    3,
  )
  const greenPower = formatBigNumber(BigNumber.from(me?.power ?? 0), 3)
  const totalUnlockedPower = formatBigNumber(BigNumber.from(me?.totalUnlockedPower ?? 0), 3)

  // const pendingRewardString = formatBigNumber(BigNumber.from(pendingReward ?? 0), 5)
  const now = Math.floor(Date.now() / 1000)
  // const socialRewardSeconds = me?.lastSocialRewardWithdraw ? (now - me?.lastSocialRewardWithdraw) : 0
  // console.log("socialRewardSeconds:", socialRewardSeconds)
  // const pendingRewardString = formatBigNumber(BigNumber.from(rewardPerSecond ? rewardPerSecond?.mul(socialRewardSeconds) : 0), 5)
  const pendingRewardString = formatBigNumber(BigNumber.from(pendingReward ?? 0), 5)

  const bondRewardSeconds = me?.lastBondRewardWidthdraw ? now - me?.lastBondRewardWidthdraw : 0
  const bondRewardLocked = me?.bondRewardLocked ?? 0
  // const userPendingBondReward = bondRewardLocked * bondRewardSeconds / bondRewardVestingSeconds
  // console.log("userPendingBondReward:", userPendingBondReward)
  const dfsFromBondReward = formatBigNumber(BigNumber.from(bondReward ?? 0), 6)
  const nextRewardSavingNumber = Number.isNaN(savingInterest) ? 0 : totalSavings * savingInterest
  const nextRewardSaving = formatBigNumber(
    BigNumber.from(Number.isNaN(nextRewardSavingNumber) ? '0' : nextRewardSavingNumber?.toString()),
    3,
  )
  // const dfsFromBondReward = '0'
  // const pendingRewardString = "0"
  // const nextRewardSaving = '0'
  const bondRewardDetailKeys = Object.keys(me?.dfsBondRewardDetail ?? {})
  const unlockedPowerDetailKeys = Object.keys(me?.unlockedPowerDetail ?? {})
  const bondRewardDetailData = bondRewardDetailKeys.map((key) => {
    return {
      address: isMobile ? shorten(key) : key,
      value: formatBigNumber(BigNumber.from(me?.dfsBondRewardDetail[key]), 5),
    }
  })
  const socialRewardDetailData = unlockedPowerDetailKeys.map((key) => {
    return {
      address: isMobile ? shorten(key) : key,
      value: formatBigNumber(BigNumber.from(Object.values(me?.unlockedPowerDetail[key])[0]), 5),
    }
  })
  useEffect(() => {
    if (account) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      fetch('https://middle.diffusiondao.org/referrals').then((res) =>
        res.json().then((response) => {
          setReferrals(response)
          setMe(response[account])
        }),
      )
    }
  }, [account])
  useEffect(() => {
    if (account) {
      dfsMineContract
        .getReward(account)
        .then((res) => setReward(res))
        .catch((error) => console.log(error))
    }
  }, [account, me])
  const updateSwiper = useCallback(
    (swiper) => {
      if (me?.level) {
        console.log('updateSwiper:', me?.level)
        swiper?.slideTo(me?.level, 50, false)
      }
    },
    [me?.level],
  )
  // useInterval(() => {
  //   if (me.level && me.level <= 7) {
  //     me.level++
  //     setMe(me)
  //     console.log('me.level:', me.level)
  //   }
  // }, 1000)
  return (
    <RewardPageWrap>
      {account && access && (
        <>
          <SwiperWrap isMobile={isMobile}>
            <Swiper
              modules={[Navigation]}
              className="rewardSwiper"
              spaceBetween={50}
              slidesPerView={slidesPerView}
              centeredSlides
              navigation
              // onSwiper={updateSwiper}
              onSlideChange={updateSwiper}
              onUpdate={updateSwiper}
              // onActiveIndexChange={updateSwiper}
            >
              {me?.level &&
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
                      setMe(json[account])
                    } else {
                      alert('No bond reward')
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
                            {lockedPower ?? '0'}
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
                            {totalUnlockedPower ?? '0'}
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
                            {
                              Object.values(referrals).filter((referral: any) => BigNumber.from(referral.power).gt(0))
                                .length
                            }
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Networking headcount')}</MySposDashboardDes>
                        </MySposDashboardItem>
                      </MySposDashboardList>
                      <MySposDashboardMiddleItem>
                        <MySposDashboardMiddleItemValue>{totalPowerOfUser ?? '0'}</MySposDashboardMiddleItemValue>
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
                          if (socialReward !== 0) {
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
                            setMe(json[account])
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
                    label={t('Next payout timing')}
                    value={nextSavingInterestChange}
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
                      label={t('Available limit')}
                      value={`${formatBigNumber(DfsBalance ?? BigNumber.from(0), 2)} DFS`}
                      position="horizontal"
                    />
                  </DataCellWrap>
                  <DataCell
                    label={t('Staked limit')}
                    value={`${formatBigNumber(BigNumber.from(me?.stakedSavings ?? 0), 2)} DFS`}
                    position="horizontal"
                  />
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className="hasBorder">
                  <MoneyInput
                    prefix="$"
                    suffix="ALL"
                    value={amount?.toString()}
                    onInput={(e: any) => setAmount(e.target.value)}
                  />
                  <BtnWrap>
                    <TakeOutBtn
                      style={{ marginRight: '10px' }}
                      onClick={async () => {
                        const parsedAmount = parseUnits(amount, 'ether')
                        const receipt = await dfsMineContract.unstakeSavings(parsedAmount)
                        await receipt.wait()
                        const response = await fetch('https://middle.diffusiondao.org/unstakeSavings', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            address: account,
                            amount: parsedAmount.toString(),
                          }),
                        })
                        const json = await response.json()
                        setMe(json[account])
                      }}
                    >
                      {t('Unstake')}
                    </TakeOutBtn>
                    <StakeBtn
                      onClick={async () => {
                        if (amount) {
                          const allowance = await dfsContract.allowance(account, dfsMineAddress)
                          if (allowance.eq(0)) {
                            await dfsContract.approve(dfsMineAddress, MaxUint256)
                          }
                          const parsedAmount = parseUnits(amount, 'ether')
                          console.log(parsedAmount.toString())
                          let receipt = await dfsMineContract.stakeSavings(parsedAmount)
                          receipt = await receipt.wait()
                          console.log(receipt)
                          const response = await fetch('https://middle.diffusiondao.org/stakeSavings', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              address: account,
                              amount: parsedAmount.toString(),
                            }),
                          })
                          const json = await response.json()
                          setMe(json[account])
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
