import { FC, useState, useEffect } from 'react'
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
import { useDFSContract, useDFSMineContract, useMulticallContract } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useSWRContract, useSWRMulticall } from 'hooks/useSWRContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import dfsMineAbi from 'config/abi/dfsMine.json'
import { getDFSContract, getMineContract } from 'utils/contractHelpers'
import { MaxUint256 } from '@ethersproject/constants'
import { getMineAddress } from 'utils/addressHelpers'
import { formatUnits } from '@ethersproject/units'
import { formatBigNumber, formatBigNumberToFixed } from 'utils/formatBalance'

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
// import { data } from './MockData'

// const { rewardData, detailData } = data

const Reward = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  const [access, setAccess] = useState<boolean>(true)
  const [stakeAmount, setStakeAmount] = useState<BigNumber>()
  const [activeItem, setActiveItem] = useState<number>(0)
  const [detailModalVisible, setBlindBoxModalVisible] = useState<boolean>(false)
  const [referrals, setReferrals] = useState({})
  const [me, setMe] = useState<any>({})

  const { isMobile } = useMatchBreakpoints()
  const { onPresentConnectModal } = useWallet()
  const dfsMineContract = useDFSMineContract()
  const dfsContract = useDFSContract()
  const dfsMineAddress = getMineAddress()
  const slidesPerView = isMobile ? 1 : 5
  const swiperWrapBgImgUrl = isMobile ? '/images/reward/swiperWrapBgMobile.png' : '/images/reward/swiperWrapBg.png'
  const swiperSlideData = [
    { name: 'No Bonus1', description: 'No bonus for now' },
    { name: 'No Bonus2', description: 'No bonus for now' },
    { name: 'No Bonus3', description: 'No bonus for now' },
    { name: 'No Bonus4', description: 'No bonus for now' },
    { name: 'No Bonus5', description: 'No bonus for now' },
    { name: 'No Bonus6', description: 'No bonus for now' },
    { name: 'No Bonus7', description: 'No bonus for now' },
    { name: 'No Bonus8', description: 'No bonus for now' },
    { name: 'No Bonus9', description: 'No bonus for now' },
  ]

  const openDetailModal = () => {
    setBlindBoxModalVisible(true)
  }

  const closeDetailModal = () => {
    setBlindBoxModalVisible(false)
  }
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const [reward, setReward] = useState([])
  const { data } = useSWRContract([dfsMineContract, 'getReward', [account ?? zeroAddress]])
  const [
    totalRewards,
    totalSavings,
    vestingSeconds,
    savingVestingSeconds,
    rewardPerSecond,
    savingsPerSecond,
    savingInterestTime,
    stakedSavings,
    DfsBalance,
  ] = [...(data ?? [])]
  const time = new Date((savingInterestTime?.toNumber() + 8 * 3600) * 1000)
  const nextSavingInterestChange = `${time.toLocaleDateString().replace(/\//g, '-')} ${time.toTimeString().slice(0, 8)}`
  const fiveDayROI = ((1 + savingsPerSecond?.toNumber()) ** 15 - 1)?.toString()
  const savingInterest = ((8 * 3600) / savingVestingSeconds) * 100
  useEffect(() => {
    if (account) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      fetch('https://middle.diffusiondao.org/referrals').then((res) =>
        res.json().then((response) => {
          setReferrals(response)
          setMe(response[account])
        }),
      )
      // dfsMineContract.getReward(account).then(res => {
      //   console.log(res)
      //   setReward(res)
      // })
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
              initialSlide={me?.level}
              slidesPerView={slidesPerView}
              centeredSlides
              navigation
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={() => console.log('slide change')}
            >
              {swiperSlideData.map((item, index) => {
                return (
                  <SwiperSlide key={item.name}>
                    <SwiperItem isMobile={isMobile}>
                      <SwiperItemImg src={`/images/reward/headPortrait${index}.png`} />
                      {/* <SwiperItemName>{item.name}</SwiperItemName>
                      <SwiperItemDes>{item.description}</SwiperItemDes> */}
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
                  <DiffusionGoldDetailJump onClick={openDetailModal}>{`${t('Detail')}  >`}</DiffusionGoldDetailJump>
                </DiffusionGoldHeader>
                <Petal src="/images/reward/petal.png" isMobile={isMobile} />
                <RewardText>{t('Rewards')}</RewardText>
                <RewardValueDiv>{BigNumber.from(me.dfs ?? BigNumber.from(0))?.toString()}</RewardValueDiv>
                <ExtractBtn
                  onClick={async () => {
                    await dfsMineContract.withdrawSocialReward()
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
                  <MySposDetailJump onClick={openDetailModal}>{`${t('Detail')}  >`}</MySposDetailJump>
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
                      value={rewardPerSecond?.toString()}
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
                            {BigNumber.from(me?.power ?? BigNumber.from(0))?.toString()}
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
                            {BigNumber.from(me?.power ?? 0)
                              .mul(2)
                              .sub(BigNumber.from(me?.totalUnlockedPower ?? BigNumber.from(0)))
                              ?.toString()}
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
                            {BigNumber.from(me?.totalUnlockedPower ?? BigNumber.from(0))?.toString()}
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
                            {Object.keys(referrals).length}
                          </MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Networking headcount')}</MySposDashboardDes>
                        </MySposDashboardItem>
                      </MySposDashboardList>
                      <MySposDashboardMiddleItem>
                        <MySposDashboardMiddleItemValue>
                          {BigNumber.from(me?.power ?? 0)
                            .add(BigNumber.from(me?.totalUnlockedPower ?? BigNumber.from(0)))
                            ?.toString()}
                        </MySposDashboardMiddleItemValue>
                        <MySposDashboardMiddleItemDes>{t('Valid SPOS value')}</MySposDashboardMiddleItemDes>
                      </MySposDashboardMiddleItem>
                    </MySposDashboardWrap>
                  </Grid>
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <MySposRewardWrap isMobile={isMobile}>
                      <MySposRewardBg src="/images/reward/mySposRewardBg.png" />
                      <RewardWrap isMobile={isMobile}>
                        <RewardText>{t('Rewards')}</RewardText>
                        {/* <RewardValueDiv>{pendingReward?.toString()}</RewardValueDiv> */}
                        <RewardValueDiv>0</RewardValueDiv>
                      </RewardWrap>
                      <ExtractBtn
                        onClick={async () => {
                          await dfsMineContract.withdrawSocialReward()
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
                    value={fiveDayROI}
                    position="horizontal"
                    valueDivStyle={{ fontSize: '14px' }}
                  />
                  <DataCell
                    label={t('Next reward value')}
                    value={`${totalSavings * savingInterest} DFS`}
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
                    value={`${stakedSavings?.toString()} DFS`}
                    position="horizontal"
                  />
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className="hasBorder">
                  <MoneyInput
                    prefix="$"
                    suffix="ALL"
                    value={stakeAmount?.toString()}
                    onInput={(e: any) => setStakeAmount(e.target.value)}
                  />
                  <BtnWrap>
                    <TakeOutBtn
                      style={{ marginRight: '10px' }}
                      onClick={async () => {
                        await dfsMineContract.unstakeSavings(stakeAmount)
                      }}
                    >
                      {t('Unstake')}
                    </TakeOutBtn>
                    <StakeBtn
                      onClick={async () => {
                        if (stakeAmount) {
                          const allowance = await dfsContract.allowance(account, dfsMineAddress)
                          if (allowance.eq(0)) {
                            await dfsContract.approve(dfsMineAddress, MaxUint256)
                          }
                          await dfsMineContract.stakeSavings(stakeAmount)
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
      {detailModalVisible ? <DetailModal detailData={me.unlockedPower} onClose={closeDetailModal} /> : null}
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
