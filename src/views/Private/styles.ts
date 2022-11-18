import styled, { css } from 'styled-components'
import { Input } from '@pancakeswap/uikit'
import { Modal } from 'antd'

const SLIDER_HEIGHT = 310
export const RewardPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 20px;
`
export const SwiperWrap = styled.div`
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        padding: 0;
        height: 240px;
      `
    }
    return css`
      padding: 0 20px;
      height: ${SLIDER_HEIGHT}px;
    `
  }};
  .swiper {
    ${({ isMobile }: { isMobile: boolean }) => {
      if (isMobile) {
        return css`
          padding: 0;
        `
      }
      return css`
        padding: 0 40px;
      `
    }};
    .swiper-slide {
      opacity: 0.8;
    }
    .swiper-slide-prev {
      transform: scale(1.2);
    }
    .swiper-slide-active {
      transform: scale(1.6);
      opacity: 1;
    }
    .swiper-slide-next {
      transform: scale(1.2);
    }
    .swiper-button-prev:after {
      display: none;
    }
    .swiper-button-next:after {
      display: none;
    }
    .swiper-button-prev {
      width: 40px;
      height: 40px;
      background: url('/images/reward/left-arrow.png') no-repeat;
      background-size: contain;
    }
    .swiper-button-next {
      width: 40px;
      height: 40px;
      background: url('/images/reward/right-arrow.png') no-repeat;
      background-size: contain;
    }
  }
`
export const SwiperWrapBgImg = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: -2;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: calc(100% + 40px);
        max-width: 200%;
        left: -20px;
        bottom: 0;
      `
    }
    return css`
      width: 100%;
      left: 0;
      bottom: 0;
    `
  }};
`
export const SwiperItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 240px;
      `
    }
    return css`
      height: ${SLIDER_HEIGHT}px;
    `
  }};
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
  color: #ffffff;
`
export const SwiperItemDes = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  font-family: HelveticaNeue;
  color: #abb6ff;
`

export const DiffusionGoldWrap = styled.div`
  width: 100%;
  border: 2px solid #8836ff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 240px;
      `
    }
    return css`
      height: 480px;
    `
  }};
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
export const DiffusionGoldTitle = styled.div`
  font-size: 16px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #abb6ff;
  line-height: 24px;
`

export const DiffusionGoldDetailJump = styled.div`
  font-size: 14px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #d257ff;
  cursor: pointer;
`

export const Petal = styled.img`
  width: 85px;
  height: 85px;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        position: absolute;
        left: 10px;
        top: 60px;
      `
    }
    return css`
      margin-bottom: 40px;
    `
  }};
`

export const RewardText = styled.div`
  height: 14px;
  font-size: 14px;
  font-family: HelveticaNeue-CondensedBold, HelveticaNeue;
  font-weight: normal;
  color: grey;
  line-height: 21px;
`
export const RewardValueDiv = styled.div`
  font-size: 20px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
  line-height: 30px;
  text-shadow: 0px 2px 27px rgba(255, 255, 255, 0.5);
`
export const ExtractBtn = styled.div`
  width: 124px;
  height: 40px;
  margin: 0 0 10px 0;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3c00ff, #ec6eff);
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
export const MySposHeader = styled.div`
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
export const MySposTitle = styled.div`
  font-size: 16px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #abb6ff;
  line-height: 24px;
`
export const MySposDetailJump = styled.div`
  font-size: 14px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
`
export const MySposOveview = styled.div`
  width: 100%;
  position: relative;
  padding: 0px 20px;
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  background: linear-gradient(90deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const MySposOveviewItem = styled.div`
  margin-right: 10px;
`
export const CoinImg = styled.img`
  width: 56px;
  height: 56px;
`
export const MySposDashboardWrap = styled.div`
  width: 100%;
  height: 313px;
  margin: 0 auto;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;
`
export const MySposDashboardList = styled.div`
  max-width: 405px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  position: relative;
`
export const MySposDashboardItem = styled.div`
  width: calc(50% - 8px);
  height: calc(50% - 8px);
  padding: 20px;
  color: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
`
export const MySposDashboardItemImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
`

export const MySposDashboardValue = styled.div`
  width: 100%;
  &.alignLeft {
    text-align: left;
  }
  &.alignRight {
    text-align: right;
  }
`
export const MySposDashboardDes = styled.div`
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #abb6ff;
  text-align: left;
  &.alignLeft {
    text-align: left;
  }
  &.alignRight {
    text-align: right;
  }
`
export const MySposDashboardMiddleItem = styled.div`
  max-width: 50%;
  width: 50%;
  height: 0;
  padding-bottom: 50%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: url('/images/reward/mySposDashboardMiddleItem.png');
  background-repeat: no-repeat;
  background-size: 100%;
`
export const MySposDashboardMiddleItemValue = styled.div`
  width: 100%;
  height: 20px;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  font-size: 20px;
  color: #fff;
`
export const MySposDashboardMiddleItemDes = styled.div`
  width: 182px;
  height: 40px;
  line-height: 40px;
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
  margin: 0 auto;
  background: rgba(12, 0, 44, 0.49);
  border-radius: 12px;
  border: 1px solid rgba(70, 96, 255, 0.32);
  position: relative;
  display: flex;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 100px;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
      `
    }
    return css`
      height: 313px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `
  }};
`

export const RewardWrap = styled.div`
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        text-align: left;
      `
    }
    return css`
      text-align: center;
    `
  }};
`
export const MySposRewardBg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
`

export const CardWrap = styled.div`
  padding: 24px;
  background: rgba(171, 182, 255, 0.05);
  border-radius: 16px;
  margin-top: 24px;
`
export const CardTitle = styled.div`
  font-size: 24px;
  color: #abb6ff;
  margin-bottom: 20px;
`

export const CardItem = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  &.hasBorder {
    ${({ isMobile }: { isMobile: boolean }) => {
      if (isMobile) {
        return css`
          border-top: 1px solid rgba(70, 96, 255, 0.2);
          padding-top: 24px;
        `
      }
      return css`
        border-left: 1px solid rgba(70, 96, 255, 0.2);
        padding-left: 24px;
      `
    }};
  }
`
export const DataCellWrap = styled.div`
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(70, 96, 255, 0.2);
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
  background: linear-gradient(90deg, #3c00ff, #ec6eff);
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
  border: 2px solid #ec6eff;
`

export const StyledModal = styled(Modal)`
  width: 60%;
`

export const ContentWrap = styled.div``
export const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  > svg {
    cursor: pointer;
  }
`
export const BondListItem = styled.div`
  margin-bottom: 20px;
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(171, 182, 255, 0.1);
`
export const BondListItemHeader = styled.div`
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid rgba(171, 182, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`
export const ImgWrap = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: -20px;
  left: calc(50% - 20px);
`
export const FromImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  left: -15px;
`
export const ToImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  right: -15px;
  z-index: 1;
`
export const BondName = styled.div`
  width: 100%;
  height: 20px;
  margin: 10px 0px;
  font-size: 16px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ffffff;
  line-height: 21px;
  text-align: center;
`
export const BondTime = styled.div`
  font-size: 12px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  color: rgba(171, 182, 255, 1);
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  padding: 2px 8px;
`
export const BondListItemContent = styled.div`
  width: 100%;
  margin: 36px 0;
  display: flex;
  flex-direction: row;
`
export const ContentCell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
export const CellTitle = styled.div`
  width: 100%;
  height: 15px;
  font-size: 13px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  line-height: 15px;
  margin-bottom: 10px;
  text-align: center;
`
export const CellText = styled.div`
  width: 100%;
  height: 24px;
  font-size: 20px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
  line-height: 25px;
  text-align: center;
`
export const TextColor = styled.div`
  ${({ isRise }: { isRise: boolean }) => {
    if (isRise) {
      return css`
        color: rgba(0, 255, 238, 1);
      `
    }
    return css`
      color: rgba(255, 39, 87, 1);
    `
  }};
`

export const TipsWrap = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  line-height: 16px;
  border-radius: 7px;
  margin-bottom: 20px;
  background-color: #000;
`
export const TipsText = styled.div`
  margin-left: 5px;
  font-size: 12px;
  font-family: HelveticaNeue;
  color: #abb6ff;
`
export const TabList = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`
export const TabItem = styled.div`
  width: 50%;
  height: 32px;
  line-height: 32px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  &.active {
    border: 1px solid rgba(171, 182, 255, 0.1);
    background: linear-gradient(135deg, rgba(60, 0, 255, 1), rgba(236, 110, 255, 1));
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
`
export const MoneyLable = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #abb6ff;
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
export const ReferralWrap = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
`
export const CheckBoxWrap = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1;
  cursor: pointer;
  background: linear-gradient(135deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const CheckBox = styled.div`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background-color: antiquewhite;
`
export const ReferralLable = styled.div`
  width: 150px;
  margin: 0 5px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #abb6ff;
  cursor: pointer;
`
export const ReferralInput = styled(Input)`
  width: 100%;
  height: 32px;
  margin-bottom: 10px;
  color: #fff;
  box-shadow: none !important;
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(171, 182, 255, 0.1);
  font-size: 10px;
  :focus {
    box-shadow: none !important;
  }
  input.ant-input {
    background: none;
    color: #fff;
    :focus {
      box-shadow: none;
    }
    &::placeholder {
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #abb6ff;
      line-height: 20px;
    }
  }
  .ant-input-suffix {
    color: #abb6ff;
  }
`
export const BondListItemBtn = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
  background: linear-gradient(90deg, #3c00ff 0%, #ec6eff 100%);
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(135deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const ListItem = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
`
export const ListLable = styled.div`
  height: 15px;
  font-size: 12px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #abb6ff;
  line-height: 15px;
`
export const ListContent = styled.div`
  height: 15px;
  font-size: 12px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ffffff;
  line-height: 15px;
`
