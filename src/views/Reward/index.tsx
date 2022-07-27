import { FC, useState } from 'react'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useWalletModal } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import useAuth from 'hooks/useAuth'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useTranslation } from 'contexts/Localization'
import noop from 'lodash/noop';
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";
import { RewardPageWrap, SwiperWrap, SwiperWrapBgImg, SwiperItem, SwiperItemImg, SwiperItemName, SwiperItemDes,
  DiffusionGoldWrap, DiffusionGoldHeader, DiffusionGoldTitle, DiffusionGoldDetailJump,
  Petal, RewardWrap, RewardText, RewardValueDiv, ExtractBtn, 
  MySposWrap, MySposHeader, MySposTitle, MySposDetailJump, MySposOveview, MySposOveviewItem, CoinImg,
  MySposDashboardWrap, MySposDashboardList, MySposDashboardItem, MySposDashboardItemImage, MySposDashboardValue, MySposDashboardDes, 
  MySposDashboardMiddleItem, MySposDashboardMiddleItemValue, MySposDashboardMiddleItemDes, MySposRewardWrap, MySposRewardBg,
  CardWrap, CardTitle, CardItem, DataCellWrap, MoneyInput, BtnWrap, StakeBtn, TakeOutBtn,
 } from './style'
 import DataCell from "../../components/ListDataCell"
 import DetailModal from "./components/DetailModal"
 import NoPower from "./components/NoPower"
 import { data } from "./MockData"
 
 const { rewardData, detailData } = data

const Reward: FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React();
  const router = useRouter()
  const [access, setAccess] = useState<boolean>(true);
  const [rewardValue, setRewardValue] = useState('123,123');
  const [money, setMoney] = useState<number>();
  const [activeItem, setActiveItem] = useState<number>(0);
  const [detailModalVisible, setBlindBoxModalVisible] = useState<boolean>(false);
  const { isMobile } = useMatchBreakpoints();
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const slidesPerView = isMobile ? 1 : 5;
  const swiperWrapBgImgUrl = isMobile ? '/images/reward/swiperWrapBgMobile.png':'/images/reward/swiperWrapBg.png'
  const swiperSlideData = [
    { name: 'No Bonus1', description:'No bonus for now' },
    { name: 'No Bonus2', description:'No bonus for now' },
    { name: 'No Bonus3', description:'No bonus for now' },
    { name: 'No Bonus4', description:'No bonus for now' },
    { name: 'No Bonus5', description:'No bonus for now' },
    { name: 'No Bonus6', description:'No bonus for now' },
    { name: 'No Bonus7', description:'No bonus for now' },
    { name: 'No Bonus8', description:'No bonus for now' },
    { name: 'No Bonus9', description:'No bonus for now' },
  ]

  const openDetailModal = () => {
    setBlindBoxModalVisible(true)
  }

  const closeDetailModal = () => {
    setBlindBoxModalVisible(false)
  }

  return (
    <RewardPageWrap>
      {
        account && access && 
        <>
          <SwiperWrap isMobile={isMobile}>
            <Swiper
              modules={[Navigation]}
              className="rewardSwiper"
              spaceBetween={50}
              initialSlide={4} // 初始索引设置
              slidesPerView={slidesPerView} // 一次展示块的数量
              centeredSlides
              navigation
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={() => console.log('slide change')}
            >
              {
                swiperSlideData.map((item, index) => {
                  return <SwiperSlide>
                    <SwiperItem isMobile={isMobile}>
                      <SwiperItemImg src={`/images/reward/headPortrait${index}.png`} />
                      {/* <SwiperItemName>{item.name}</SwiperItemName>
                      <SwiperItemDes>{item.description}</SwiperItemDes> */}
                    </SwiperItem>
                  </SwiperSlide>
                })
              }
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
                <RewardValueDiv>{rewardValue}</RewardValueDiv>
                <ExtractBtn>{t('Withdraw')}</ExtractBtn>
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
                    <DataCell label={t('Next payout')} value={rewardData.nextBaseChange} valueDivStyle={{ fontSize: "16px" }} />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell label={t('Next reward')} value={rewardData.NextRewardRevenue} valueDivStyle={{ fontSize: "16px" }} />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell label={t('Current interest')} value={rewardData.interestRate} valueDivStyle={{ fontSize: "16px" }} />
                  </MySposOveviewItem>
                  <CoinImg src="/images/reward/coin.png" />
                </MySposOveview>
                <Grid container spacing={2}>
                  <Grid item lg={7} md={7} sm={12} xs={12}>
                    <MySposDashboardWrap>
                      <MySposDashboardList>
                        <MySposDashboardItem onClick={()=>setActiveItem(1)}>
                          {
                            activeItem === 1 ? 
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem1.png" />
                            : <MySposDashboardItemImage src="/images/reward/mySposDashboardItem1.png" />
                          }
                          <MySposDashboardValue className="alignLeft" style={{ color: '#00FFEE' }}>{rewardData.apy}</MySposDashboardValue>
                          <MySposDashboardDes className="alignLeft">{t('Unlocked SPOS value')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={()=>setActiveItem(2)}>
                          {
                            activeItem === 2 ? 
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem2.png" />
                            : <MySposDashboardItemImage src="/images/reward/mySposDashboardItem2.png" />
                          }
                          <MySposDashboardValue className="alignRight" style={{ color: 'grey' }}>{rewardData.apy}</MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Locked SPOS value')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={()=>setActiveItem(3)}>
                          {
                            activeItem === 3 ? 
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem3.png" />
                            : <MySposDashboardItemImage src="/images/reward/mySposDashboardItem3.png" />
                          }
                          <MySposDashboardValue className="alignLeft" style={{ color: '#FF2757' }}>{rewardData.apy}</MySposDashboardValue>
                          <MySposDashboardDes className="alignLeft">{t('Networking unlocked SPOS')}</MySposDashboardDes>
                        </MySposDashboardItem>
                        <MySposDashboardItem onClick={()=>setActiveItem(4)}>
                          {
                            activeItem === 4 ? 
                            <MySposDashboardItemImage src="/images/reward/mySposDashboardActiveItem4.png" />
                            : <MySposDashboardItemImage src="/images/reward/mySposDashboardItem4.png" />
                          }
                          <MySposDashboardValue className="alignRight" style={{ color: '#E7A4FF' }}>{rewardData.apy}</MySposDashboardValue>
                          <MySposDashboardDes className="alignRight">{t('Networking headcount')}</MySposDashboardDes>
                        </MySposDashboardItem>
                      </MySposDashboardList>
                      <MySposDashboardMiddleItem>
                        <MySposDashboardMiddleItemValue>{rewardData.interestRate}</MySposDashboardMiddleItemValue>
                        <MySposDashboardMiddleItemDes>{t('Valid SPOS value')}</MySposDashboardMiddleItemDes>
                      </MySposDashboardMiddleItem>
                    </MySposDashboardWrap>
                  </Grid>
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <MySposRewardWrap isMobile={isMobile}>
                      <MySposRewardBg src="/images/reward/mySposRewardBg.png" />
                      <RewardWrap isMobile={isMobile}>
                        <RewardText>{t('Rewards')}</RewardText>
                        <RewardValueDiv>{rewardValue}</RewardValueDiv>
                      </RewardWrap>
                      <ExtractBtn>{t('Withdraw')}</ExtractBtn>
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
                  <DataCell label={t('Next payout timing')} value={rewardData.nextBaseChange} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label={t('Next payout rate')} value={rewardData.nextRewardYield} position="horizontal" valueDivStyle={{ fontSize: "14px" }} />
                  <DataCell label={t('ROI (5 days)')} value={rewardData.roi} position="horizontal" valueDivStyle={{ fontSize: "14px" }} />
                  <DataCell label={t('Next reward value')} value={rewardData.nextBonusAmount} position="horizontal" valueDivStyle={{ fontSize: "14px" }} />

                  {/* <DataCell label='apy' value={rewardData.apy} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label='current index' value={rewardData.curIndex} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/>
                  <DataCell label='total value deposited' value={rewardData.totalValueDeposited} position="horizontal" valueDivStyle={{ fontSize: "14px" }}/> */}
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className='hasBorder'>
                  <DataCellWrap>
                    <DataCell label={t('Available limit')} value={rewardData.mortgagedBalance} position="horizontal" />
                  </DataCellWrap>
                  <DataCell label={t('Staked limit')} value={rewardData.mortgagedBalance} position="horizontal" />
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className='hasBorder'>
                  <MoneyInput prefix="￥" suffix="ALL" value={money} />
                  <BtnWrap>
                    <TakeOutBtn style={{marginRight: '10px'}}>{t('Cancel Staking')}</TakeOutBtn>
                    <StakeBtn>{t('Stake')}</StakeBtn>
                  </BtnWrap>
                </CardItem>
              </Grid>
            </Grid>
          </CardWrap>
        </>
      }
      {/* 详情的弹窗 */}
      {
        detailModalVisible ? <DetailModal detailData={detailData} onClose={closeDetailModal} />
        : null
      }
      {/* 没有连接钱包 */}
      {
        !account && 
        <NoPower 
          title={t('You cannot view this page right now')}
          description={t('Please connect your wallet')}
          btnText={t('Connect')} 
          action={onPresentConnectModal}
        />
      }
      {/* 没有权限 */}
      {
        account && !access &&
        <NoPower 
          title={t('You cannot view this page right now')}
          description={t('Please check after bonds purchase')}
          btnText={t('Buy Bonds')} 
          action={() => router.push(`/bond`)}
        />
      }
    </RewardPageWrap>)
}
export default Reward;