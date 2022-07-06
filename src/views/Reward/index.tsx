import { FC, useState } from 'react'
import { Grid } from "@material-ui/core";
import { useTranslation } from 'contexts/Localization'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";
import { RewardPageWrap, DiffusionGoldWrap, DiffusionGoldBgImg, DiffusionGoldHeader, DiffusionGoldTitle, DiffusionGoldDetailJump,
  Petal, RewardText, RewardValueDiv, ExtractBtn, 
  MySposWrap, MySposWrapBgImg, MySposHeader, MySposTitle, MySposDetailJump, MySposOveview, MySposOveviewItem, CoinImg,
  MySposConWrap, MySposDashboard, MySposRewardWrap, MySposRewardBg,
  CardWrap, CardItem, DataCellWrap, BalanceWrap, MoneyInput, BtnWrap, StakeBtn, 
 } from './style'
 import DataCell from "./components/DataCell"
 import { rewardData } from "./MockData"

const Reward: FC = () => {
  const { t } = useTranslation()
  const [rewardValue, setRewardValue] = useState('123,123');
  const [money, setMoney] = useState<number>();
  const { isMobile } = useMatchBreakpoints();

  return (
    <RewardPageWrap>
      <Grid container spacing={8}>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <DiffusionGoldWrap>
            <DiffusionGoldBgImg src="images/reward/diffusionGoldBg.png" />
            <DiffusionGoldHeader>
              <DiffusionGoldTitle>{t('My diffusion gold')}</DiffusionGoldTitle>
              <DiffusionGoldDetailJump>{t('Check details >')}</DiffusionGoldDetailJump>
            </DiffusionGoldHeader>
            <Petal src="/images/reward/petal.png" />
            <RewardText>{t('reward')}</RewardText>
            <RewardValueDiv>{rewardValue}</RewardValueDiv>
            <ExtractBtn>{t('Extract')}</ExtractBtn>
          </DiffusionGoldWrap>
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <MySposWrap>
            <MySposWrapBgImg src="images/reward/mySposBg.png" />
            <MySposHeader>
              <MySposTitle>{t('My diffusion gold')}</MySposTitle>
              <MySposDetailJump>{t('Check details >')}</MySposDetailJump>
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
                <StakeBtn style={{marginRight: '10px'}}>{t('Take out')}</StakeBtn>
                <StakeBtn>{t('Stake')}</StakeBtn>
              </BtnWrap>
            </CardItem>
          </Grid>
        </Grid>
      </CardWrap>

    </RewardPageWrap>)
}
export default Reward;