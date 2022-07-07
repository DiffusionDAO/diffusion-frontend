import { FC, useState } from 'react'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useTranslation } from 'contexts/Localization'
import noop from 'lodash/noop';
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";
import { RewardPageWrap, SwiperWrap, SwiperWrapBgImg, SwiperMiddleImg, SwiperItem, SwiperItemImg, SwiperItemName, SwiperItemDes,
  DiffusionGoldWrap, DiffusionGoldBgImg, DiffusionGoldHeader, DiffusionGoldTitle, DiffusionGoldDetailJump,
  Petal, RewardText, RewardValueDiv, ExtractBtn, 
  MySposWrap, MySposWrapBgImg, MySposHeader, MySposTitle, MySposDetailJump, MySposOveview, MySposOveviewItem, CoinImg,
  MySposConWrap, MySposDashboard, MySposRewardWrap, MySposRewardBg,
  CardWrap, CardItem, DataCellWrap, BalanceWrap, MoneyInput, BtnWrap, StakeBtn, TakeOutBtn,
 } from './style'
 import DataCell from "./components/DataCell"
 import DetailModal from "./components/DetailModal"
 import NoPower from "./components/NoPower"
 import { data } from "./MockData"
 
 const { rewardData, detailData } = data

const Reward: FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React();
  const [access, setAccess] = useState<boolean>(true);
  const [rewardValue, setRewardValue] = useState('123,123');
  const [money, setMoney] = useState<number>();
  const [detailModalVisible, setBlindBoxModalVisible] = useState<boolean>(false);
  const { isMobile } = useMatchBreakpoints();
  const slidesPerView = isMobile ? 1 : 5;
  
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
          <SwiperWrap>
            <Swiper
              modules={[Navigation]}
              className="rewardSwiper"
              spaceBetween={50}
              slidesPerView={slidesPerView}
              onSlideChange={() => console.log('slide change')}
              centeredSlides
              navigation
              onSwiper={(swiper) => console.log(swiper)}
            >
              {
                swiperSlideData.map((item, index) => {
                  return <SwiperSlide>
                    <SwiperItem>
                      {/* <SwiperItemImg src="/images/reward/headPortrait1.png" /> */}
                      <SwiperItemImg src={`/images/reward/headPortrait${index + 1}.png`} />
                      <SwiperItemName>{item.name}</SwiperItemName>
                      <SwiperItemDes>{item.description}</SwiperItemDes>
                    </SwiperItem>
                  </SwiperSlide>
                })
              }
            </Swiper>
            <SwiperWrapBgImg src="/images/reward/swiperWrapBg.png" />
            <SwiperMiddleImg src="/images/reward/swiperMiddleImg.png" />
            
          </SwiperWrap>
          <Grid container spacing={8}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <DiffusionGoldWrap>
                {/* <DiffusionGoldBgImg src="images/reward/diffusionGoldBg.png" /> */}
                <DiffusionGoldHeader>
                  <DiffusionGoldTitle>{t('My diffusion gold')}</DiffusionGoldTitle>
                  <DiffusionGoldDetailJump onClick={openDetailModal}>{t('Check details >')}</DiffusionGoldDetailJump>
                </DiffusionGoldHeader>
                <Petal src="/images/reward/petal.png" />
                <RewardText>{t('reward')}</RewardText>
                <RewardValueDiv>{rewardValue}</RewardValueDiv>
                <ExtractBtn>{t('Extract')}</ExtractBtn>
              </DiffusionGoldWrap>
            </Grid>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <MySposWrap>
                {/* <MySposWrapBgImg src="images/reward/mySposBg.png" /> */}
                <MySposHeader>
                  <MySposTitle>{t('My diffusion gold')}</MySposTitle>
                  <MySposDetailJump onClick={openDetailModal}>{t('Check details >')}</MySposDetailJump>
                </MySposHeader>
                <MySposOveview>
                  <MySposOveviewItem>
                    <DataCell label={t('Time to next generate revenue')} value={rewardData.nextBaseChange} valueDivStyle={{ fontSize: "16px" }} />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell label={t('Next reward revenue')} value={rewardData.NextRewardRevenue} valueDivStyle={{ fontSize: "16px" }} />
                  </MySposOveviewItem>
                  <MySposOveviewItem>
                    <DataCell label='The current interest rate' value={rewardData.interestRate} valueDivStyle={{ fontSize: "16px" }} />
                  </MySposOveviewItem>
                  <CoinImg src="/images/reward/coin.png" />
                </MySposOveview>
                {/* <MySposConWrap> */}
                <Grid container spacing={2}>
                  <Grid item lg={7} md={7} sm={12} xs={12}>
                    <MySposDashboard />
                  </Grid>
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <MySposRewardWrap>
                      <MySposRewardBg src="/images/reward/mySposRewardBg.png" />
                      <RewardValueDiv>{rewardValue}</RewardValueDiv>
                      <RewardText>{t('reward')}</RewardText>
                      <ExtractBtn>{t('Extract')}</ExtractBtn>
                    </MySposRewardWrap>
                    </Grid>
                  </Grid>
                {/* </MySposConWrap> */}
              </MySposWrap>
            </Grid>
          </Grid>
          <CardWrap>
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile}>
                  <DataCell label='apy' value={rewardData.apy} />
                  <DataCell label='current index' value={rewardData.curIndex} />
                  <DataCell label='total value deposited' value={rewardData.totalValueDeposited} />
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className='hasBorder'>
                  <DataCellWrap>
                    <DataCell label='Next base change' value={rewardData.nextBaseChange} />
                  </DataCellWrap>
                  <DataCell label='The next reward yield' value={rewardData.nextRewardYield} position="horizontal" valueDivStyle={{ fontSize: "14px" }} />
                  <DataCell label='ROI (Return on Investment) (5 days)' value={rewardData.roi} position="horizontal" valueDivStyle={{ fontSize: "14px" }} />
                  <DataCell label='Next bonus amount' value={rewardData.nextBonusAmount} position="horizontal" valueDivStyle={{ fontSize: "14px" }} />
                </CardItem>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <CardItem isMobile={isMobile} className='hasBorder'>
                  <BalanceWrap>
                    <DataCell label='Mortgaged balance' value={rewardData.mortgagedBalance} />
                    <DataCell label='Mortgageable balance' value={rewardData.mortgagedBalance} />
                  </BalanceWrap>
                  <MoneyInput prefix="￥" suffix="ALL" value={money} />
                  <BtnWrap>
                    <TakeOutBtn style={{marginRight: '10px'}}>{t('Take out')}</TakeOutBtn>
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
          title={t('You cannot view this page at present')}
          description={t('Unless you connect to your wallet first')}
          btnText={t('Connect')} 
          action={noop}
        />
      }
      {/* 没有权限 */}
      {
        account && !access &&
        <NoPower 
          title={t('You cannot view this page at present')}
          description={t('Unless you go and buy a $1,000 bond first')}
          btnText={t('To buy bonds')} 
          action={noop}
        />
      }
    </RewardPageWrap>)
}
export default Reward;