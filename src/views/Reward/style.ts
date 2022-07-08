import { Slider } from '@pancakeswap/uikit';
import styled, { css } from 'styled-components'
import { Input } from 'antd';

const SLIDER_HEIGHT = 310
export const RewardPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`
export const SwiperWrap = styled.div`
  width: 100%;
  height: ${SLIDER_HEIGHT}px;
  padding: 0 20px;
  margin-bottom: 20px;
  position: relative;
  .swiper {
    padding: 0 40px;
    .swiper-slide {
      opacity: 0.8
    }
    .swiper-slide-prev {
      transform: scale(1.2);
    }
    .swiper-slide-active {
      transform: scale(1.6);
      opacity: 1
    }
    .swiper-slide-next {
      transform: scale(1.2);
    }
  }
`
export const SwiperWrapBgImg = styled.img`
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -2;
`
export const SwiperItem = styled.div`
  width: 100%;
  height: ${SLIDER_HEIGHT}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const SwiperItemImg = styled.img`
  width: 100px;
`
export const SwiperItemName = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
`
export const SwiperItemDes = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  font-family: HelveticaNeue;
  color: #ABB6FF;
`

export const DiffusionGoldWrap = styled.div`
  width: 100%;
  height: 480px;
  border: 2px solid #8836ff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
`
export const DiffusionGoldBgImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
`
export const DiffusionGoldHeader = styled.div`
  width: 100%;
  padding: 24px;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
`
export const  DiffusionGoldTitle = styled.div`
  font-size: 16px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ABB6FF;
  line-height: 24px;
`

export const DiffusionGoldDetailJump = styled.div`
  font-size: 14px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #D257FF;
  cursor: pointer;
`

export const Petal = styled.img`
  width: 85px;
  height: 85px;
  margin-bottom: 40px;
`
export const RewardText = styled.div`
  height: 21px;
  font-size: 18px;
  font-family: HelveticaNeue-CondensedBold, HelveticaNeue;
  font-weight: normal;
  color: grey;
  line-height: 21px;
`
export const RewardValueDiv = styled.div`
  height: 50px;
  font-size: 35px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 50px;
  text-shadow: 0px 2px 27px rgba(255, 255, 255, 0.5);
`
export const ExtractBtn  = styled.div`
  width: 124px;
  height: 40px;
  margin: 20px 0;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`

export const MySposWrap = styled.div`
  width: 100%;
  padding: 24px;
  min-height: 480px;
  border: 2px solid #e972ff;
  border-radius: 16px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
`
export const MySposWrapBgImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
`
export const  MySposHeader = styled.div`
  width: 100%;
  padding: 24px;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
`
export const  MySposTitle = styled.div`
  font-size: 16px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ABB6FF;
  line-height: 24px;
`
export const MySposDetailJump = styled.div`
  font-size: 14px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
`
export const MySposOveview =  styled.div`
  width: 100%;
  position: relative;
  padding: 0px 20px;
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  border-radius: 12px;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const MySposOveviewItem =  styled.div`
  margin-right: 10px;
`
export const CoinImg = styled.img`
  width: 56px;
  height: 56px;
  position: absolute;
  right: 10px;
  top: 10px;
`
export const MySposConWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

export const MySposDashboardWrap = styled.div`
  width: 100%;
  height: 313px;
  margin: 0 auto;
  border-radius: 12px;
  border: 1px solid rgba(70,96,255,0.3200);
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;
`
export const MySposDashboardList = styled.div`
  max-width: 405px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  position: relative;
`
export const MySposDashboardItem = styled.div`
  width: 197px;
  height: 157px;
  color:#fff;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  &.item1 {
    background: url('/images/reward/mySposDashboardItem1.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &.item2 {
    background: url('/images/reward/mySposDashboardItem2.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &.item3 {
    background: url('/images/reward/mySposDashboardItem3.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &.item4 {
    background: url('/images/reward/mySposDashboardItem4.png');
    background-repeat: no-repeat;
    background-size: 100%;
  }
`
export const MySposDashboardValue = styled.div`

`
export const MySposDashboardDes = styled.div`
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ABB6FF;
`
export const MySposDashboardMiddleItem = styled.div`
  height: 218px;
  width: 218px;
  position: absolute;
  left: calc(50% - 109px);
  top: calc(50% - 109px);
  background: url('/images/reward/mySposDashboardMiddleItem.png');
  background-repeat: no-repeat;
  background-size: 100%;
`
export const MySposDashboardMiddleItemValue = styled.div`
  text-align: center;
  line-height: 218px;
  font-size: 36px;
  color: #fff;
`
export const MySposDashboardMiddleItemDes = styled.div`
  width: 182px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  border: 1px solid #8a7ea5;
  font-size: 13px;
  color: #fff;
  text-align: center;
  position: absolute;
  left: calc(50% - 91px);
  top: calc(50% + 20px);
  background-color: #8b5dfe;
`
export const MySposRewardWrap = styled.div`
  width: 100%;
  height: 313px;
  margin: 0 auto;
  background: rgba(12,0,44,0.4900);
  border-radius: 12px;
  border: 1px solid rgba(70,96,255,0.3200);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const MySposRewardBg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

export const CardWrap = styled.div`
  padding: 24px;
  background: rgba(171,182,255,0.05);
  border-radius: 16px;
  margin-top: 24px;
`

export const CardItem = styled.div`
  width: 100%;
  height: 228px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  &.hasBorder {
    ${({ isMobile }: { isMobile: boolean }) => {
      if (isMobile) {
        return css`
          border-top: 1px solid rgba(70, 96, 255, 0.2);
          padding-top: 24px;
        `;
      }
      return css`
        border-left: 1px solid rgba(70, 96, 255, 0.2);
        padding-left: 24px;
      `;
    }};
  }
`
export const DataCellWrap = styled.div`
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(70, 96, 255, 0.2);
`
export const BalanceWrap = styled.div`
  display: flex;
`
export const MoneyInput = styled(Input)`
  height: 40px;
  margin-bottom: 10px;
  color: #fff;
  box-shadow: none !important;
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(171, 182, 255, 0.1);
  :focus {
    box-shadow: none !important;
  }
  input.ant-input {
    background: none;
    color: #fff;
    :focus {
      box-shadow: none;
    }
  }
  .ant-input-suffix {
    color: rgba(210, 87, 255, 1);
  }
`

export const BtnWrap = styled.div`
  display: flex;
`

export const StakeBtn = styled.div`
  width: calc(50% - 5px);
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const TakeOutBtn = styled.div`
  width: calc(50% - 5px);
  border-radius: 8px;
  color: #fff;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  border: 2px solid #EC6EFF;
`
