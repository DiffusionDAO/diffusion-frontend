import styled, { css } from 'styled-components'

const MARGIN = 20
const DRAW_BLIND_BOX_HEIGHT = 355
const DRAW_BLIND_BOX_WIDTH = 556
const PADDING_PERCENT = DRAW_BLIND_BOX_HEIGHT / (DRAW_BLIND_BOX_WIDTH * 100)

export const BondPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 20px;
`
export const BondPageHeader = styled.div`
  width: 100%;
  margin: 40px 0 20px 0;
  position: relative;
`
export const SculptureWrap = styled.img`
  position: absolute;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 130px;
        right: 0px;
        top: 0px;
      `
    }
    return css`
      right: 0;
      top: -80px;
      width: 400px;
      height: 400px;
    `
  }};
`
export const HeaderTitle = styled.div`
  width: 50%;
  line-height: 100px;
  font-size: 56px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 2px;
`
export const HeaderDes = styled.div`
  width: 50%;
  font-size: 18px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  line-height: 30px;
`
export const OverviewWrap = styled.div`
  margin: 20px 0;
  padding: 20px;
  border-radius: 16px;
  background: rgba(171, 182, 255, 0.05);
  border: 1px solid rgba(70, 96, 255, 0.32);
`

export const OverviewCard = styled.div`
  display: flex;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        flex-wrap: wrap;
        justify-content: flex-start;
      `
    }
    return css`
      flex-wrap: wrap;
      justify-content: flex-start;
    `
  }};
`
export const Horizontal = styled.div`
  height: 1px;
  width: 100%;
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.1);
`
export const OverviewCardItem = styled.div`
  margin-right: 100px;
`
export const OverviewCardItemTitle = styled.div`
  height: 16px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  line-height: 16px;
  margin-bottom: 10px;
`
export const OverviewCardItemContent = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 28px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
  line-height: 40px;
  text-shadow: 0px 2px 34px rgba(255, 255, 255, 0.5);
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        margin-bottom: 20px;
      `
    }
    return css``
  }};
`
export const OverviewPromptWrap = styled.div`
  margin: 20px 0;
  display: flex;
`
export const OverviewPromptLine = styled.div`
  height: 1px;
  margin-top: 19px;
  background-color: rgba(255, 255, 255, 0.1);
`
export const OverviewPromptTitle = styled.div`
  width: 50px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
`
export const OverviewPromptList = styled.div`
  position: relative;
`
export const OverviewPromptItem = styled.div`
  line-height: 30px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
`
export const BondListItem = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  border: 1px solid rgba(70, 96, 255, 0.4);
  background: rgba(171, 182, 255, 0.08);
  padding: 20px;
`
export const BondListItemHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(70, 96, 255, 0.4);
  display: flex;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        padding: 0 0 10px 0;
        justify-content: space-evenly;
      `
    }
    return css`
      padding: 0 0 30px 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `
  }};
`
export const ImgWrap = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
`
export const FromImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 20px;
  position: absolute;
  left: -12px;
`
export const ToImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 20px;
  position: absolute;
  right: -12px;
  z-index: 1;
`
export const BondHeaderName = styled.div`
  height: 30px;
  margin-top: 10px;
  font-size: 24px;
  font-family: HelveticaNeue-BoldItalic, HelveticaNeue;
  font-weight: normal;
  color: #ffffff;
  line-height: 30px;
  text-shadow: 0px 2px 19px rgba(255, 255, 255, 0.5);
  text-align: center;
`

export const BondListItemContent = styled.div`
  width: 100%;
  display: flex;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        margin: 10px 0;
        flex-direction: column;
      `
    }
    return css`
      margin: 30px 0;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
    `
  }};
`
export const ContentCell = styled.div`
  display: flex;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        line-height: 40px;
        flex-direction: row;
        justify-content: space-between;
      `
    }
    return css`
      line-height: 30px;
      flex-direction: column;
    `
  }};
`
export const CellTitle = styled.div`
  font-size: 13px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  text-align: center;
  align-items: center;
`
export const CellText = styled.div`
  font-size: 18px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
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
export const BondListItemBtn = styled.div`
  width: 100%;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(135deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`

export const BondListItemBtnClosed = styled.div`
  width: 100%;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  color: rgba(210, 87, 255, 1);
  text-align: center;
  border-radius: 7px;
  cursor: pointer;
  background: rgba(210, 87, 255, 0.09);
`
