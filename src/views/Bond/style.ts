import styled, { css } from 'styled-components'

const MARGIN = 20;
const DRAW_BLIND_BOX_HEIGHT = 355
const DRAW_BLIND_BOX_WIDTH = 556
const PADDING_PERCENT = DRAW_BLIND_BOX_HEIGHT / (DRAW_BLIND_BOX_WIDTH * 100)


export const BondPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`
export const DrawBlindBoxList = styled.div`
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  margin-bottom: 20px;
`

export const DrawBlindBoxItem = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 64%;
  border-radius: 16px;
  position: relative;
  &.item1 {
    background: linear-gradient(135deg,rgba(60, 0, 255, 1), rgba(236, 110, 255, 1));
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
  &.item2 {
    background: linear-gradient(135deg, rgba(255, 161, 110, 1), rgba(255, 112, 86, 1));
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
`

export const DrawBlindBoxCont = styled.div`
  height: calc(100% - 8px);
  border-radius: 14px;
  width: calc(100% - 8px);
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`
export const DrawBlindBoxImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`
export const DrawBlindBoxHeader  = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 50px;
  width: 100%;
  text-indent: 10px;
  border-radius: 16px;
  color: #fff;
  overflow: hidden;
  font-size: 24px;
  font-family: HelveticaNeue-BoldItalic, HelveticaNeue;
  font-weight: normal;
  color: #FFFFFF;
  line-height: 50px;
  text-shadow: 0px 2px 19px rgba(255, 255, 255, 0.5);
  &.item1 {
    background: url('/images/bond/drawBlindBoxHeaderBg1.png');
    background-repeat: no-repeat;
    background-size: contain;
  }
  &.item2 {
    background: url('/images/bond/drawBlindBoxHeaderBg2.png');
    background-repeat: no-repeat;
    background-size: contain;
  }
`

export const DrawBlindBoxFooter = styled.div`
  height: 90px;
  width: 100%;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
`

export const DrawBlindBoxFooterBtn = styled.div`
  width: 120px;
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  &.purpleBtn {
    background: linear-gradient(90deg, #3C00FF, #EC6EFF);
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
  &.orangeBtn {
    background: linear-gradient(90deg, #FFA16E, #FF7056);
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
`

export const DrawBlindBoxFooterBtnBorder = styled.div`
  width: 120px;
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  position: relative;
`
export const DrawBlindBoxFooterBtnBorderImg = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`

export const OverviewCard = styled.div`
  padding: 36px;
  border-radius: 16px;
  background: rgba(171, 182, 255, 0.05);
  border: 1px solid rgba(70, 96, 255, 0.32);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px 0;
`
export const Horizontal = styled.div`
  height: 1px;
  width: 100%;
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.1);
`
export const OverviewCardItem = styled.div`
`
export const OverviewCardItemTitle = styled.div`
  height: 16px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: #FFFFFF;
  line-height: 16px;
  margin-bottom: 20px;
`
export const OverviewCardItemContent = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 32px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 40px;
  text-shadow: 0px 2px 34px rgba(255, 255, 255, 0.5);
`
export const BondListItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  border: 1px solid rgba(70, 96, 255, 0.4);
  background: rgba(171, 182, 255, 0.08);
  padding: 36px;
`
export const BondListItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 100%;
        padding: 0 0 36px 0;
        border-bottom: 1px solid rgba(70, 96, 255, 0.4);
      `;
    }
    return css`
      padding: 0 36px 0 0;
      border-right: 1px solid rgba(70, 96, 255, 0.4);
    `;
  }};
`
export const ImgWrap = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
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
export const BondHeaderName = styled.div`
  width: 100%;
  height: 30px;
  margin-top: 10px;
  font-size: 24px;
  font-family: HelveticaNeue-BoldItalic, HelveticaNeue;
  font-weight: normal;
  color: #FFFFFF;
  line-height: 30px;
  text-shadow: 0px 2px 19px rgba(255, 255, 255, 0.5);
  text-align: center;
`

export const BondListItemContent = styled.div`
  margin: 36px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 100%;
      `;
    }
    return css`
    `;
  }};
`
export const ContentCell = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
      `;
    }
    return css`
      margin: 0 38px;
    `;
  }};
`
export const CellTitle = styled.div`
  width: 100%;
  height: 15px;
  font-size: 13px;
  font-family: HelveticaNeue;
  color: #ABB6FF;
  line-height: 15px;
  margin-bottom: 10px;
  text-align: center;
  align-items: center;
`
export const CellText = styled.div`
  width: 100%;
  height: 24px;
  font-size: 20px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 25px;
  text-align: center;
`
export const TextColor = styled.div`
  ${({ isRise }: { isRise: boolean }) => {
    if (isRise) {
      return css`
        color: rgba(0, 255, 238, 1);
      `;
    }
    return css`
      color: rgba(255, 39, 87, 1);
    `;
  }};
`
export const BondListItemBtn = styled.div`
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background: linear-gradient(90deg, #3C00FF 0%, #EC6EFF 100%);
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(135deg,#3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 100%;
      `;
    }
    return css`
      min-width: 150px;
    `;
  }};
`




