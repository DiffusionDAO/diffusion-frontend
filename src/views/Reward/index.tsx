import { FC, useState } from 'react'
import { Grid } from "@material-ui/core";
import { useTranslation } from 'contexts/Localization'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";
import { RewardPageWrap, DiffusionGoldWrap, DiffusionGoldBgImg, DiffusionGoldHeader, DiffusionGoldTitle, DiffusionGoldDetailJump,
  Petal, RewardText, RewardValueDiv, ExtractBtn, 
  MySposWrap, MySposWrapBgImg, MySposHeader, MySposTitle, MySposDetailJump, 
  CardWrap, CardItem,
 } from './style'

const Reward: FC = () => {
  const { t } = useTranslation()
  const [rewardValue, setRewardValue] = useState('123,123');
  const { isMobile } = useMatchBreakpoints();

  return (
    <RewardPageWrap>
      <Grid container spacing={2}>
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
          </MySposWrap>
        </Grid>
      </Grid>

      <CardWrap>
        <Grid container spacing={2}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <CardItem isMobile={isMobile} className='hasBorder' />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <CardItem isMobile={isMobile} className='hasBorder' />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <CardItem isMobile={isMobile} />
          </Grid>
        </Grid>
      </CardWrap>

    </RewardPageWrap>)
}
export default Reward;