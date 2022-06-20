import styled, { css } from 'styled-components'

const HEADER_HEIGHT = 400;
const MARGIN = 20;
const NAV_HEIGHT = 56;
const TOP_HEIGHT = MARGIN + NAV_HEIGHT + 100;
const SCULPTURE_WRAP_HEIGHT = HEADER_HEIGHT + TOP_HEIGHT;

export const BondPageWrap = styled.div`
  margin: ${MARGIN}px;
`
export const BondSculptureWrap = styled.div`
  top: -${TOP_HEIGHT}px;
  background: url('/images/bond/bond-sculpture-wrap.png');
  background-repeat: no-repeat;
  background-size: cover;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: calc(${SCULPTURE_WRAP_HEIGHT}px - 100px);
        width: calc(${SCULPTURE_WRAP_HEIGHT}px - 100px);
        position: absolute;
        right: -40px;
      `;
    }
    return css`
      height: ${SCULPTURE_WRAP_HEIGHT}px;
      width: ${SCULPTURE_WRAP_HEIGHT}px;
      position: absolute;
      right: -140px;
    `;
  }};
`
export const BondSculptureGif = styled.img`
  position: absolute;
  left: -100px;
  bottom: -94px;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: calc(${SCULPTURE_WRAP_HEIGHT}px - 100px);
        width: calc(${SCULPTURE_WRAP_HEIGHT}px - 100px);
      `;
    }
    return css`
      height: ${SCULPTURE_WRAP_HEIGHT}px;
      width: ${SCULPTURE_WRAP_HEIGHT}px;
    `;
  }};
`
export const BondGearImg = styled.img`
  position: absolute;
  animation: gear 10s linear infinite;
  animation-duration: 10s;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 150px;
        height: 150px;
        left: 160px;
        bottom: -30px;
      `;
    }
    return css`
      width: 180px;
      height: 180px;
      left: 250px;
      bottom: -50px;
    `;
  }};
`
export const BondBallImg = styled.img`
  width: 50px;
  height: 50px;
  position: absolute;
  animation: ball 3s ease-in-out infinite;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        bottom: 200px;
        left: -40px;
      `;
    }
    return css`
      bottom: 300px;
      left: -25px;
    `;
  }};
`
export const BondHeaderWrap = styled.div`
  width: 100%;
  margin-bottom: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        margin-top: 300px;
        height: calc(${HEADER_HEIGHT}px + 150px);
      `;
    }
    return css`
      margin-top: 0px;
      height: ${HEADER_HEIGHT}px;
    `;
  }};
`
export const BondPageText = styled.div`
  max-width: 500px;
`
export const BondPageTitle = styled.div`
  width: 100%;
  height: 72px;
  font-size: 56px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 72px;
  letter-spacing: 2px;
  margin: 40px 0;
`
export const BondPageDes = styled.div`
  width: 100%;
  font-size: 16px;
  font-family: HelveticaNeue;
  color: #ABB6FF;
  line-height: 26px;
`

export const OverviewCard = styled.div`
  padding: 36px;
  border-radius: 16px;
  background: rgba(171, 182, 255, 0.05);
  border: 1px solid rgba(70, 96, 255, 0.32);
  display: flex;
  flex-wrap: wrap;
`
export const Horizontal = styled.div`
  height: 1px;
  width: 100%;
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.1);
`
export const OverviewCardItem = styled.div`
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 100%;
      `;
    }
    return css`
      min-width: 40%;
    `;
  }};
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
`
export const Price = styled.div`
  height: 38px;
  font-size: 32px;
  line-height: 39px;
  text-shadow: 0px 2px 34px rgba(255, 255, 255, 0.5);
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
`
export const Percent = styled.div`
  height: 24px;
  font-size: 14px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  line-height: 24px;
  border-radius: 12px;
  padding: 0 10px;
  margin: 0 10px;
  ${({ isRise }: { isRise: boolean }) => {
    if (isRise) {
      return css`
        color: rgba(0, 255, 238, 1);
        background: rgba(0, 255, 238, 0.24);
      `;
    }
    return css`
      color: rgba(255, 39, 87, 1);
      background: rgba(255, 39, 87, 0.24)
    `;
  }};
`
export const Icon = styled.div`
  width: 16px;
  height: 16px;
  ${({ isRise }: { isRise: boolean }) => {
    if (isRise) {
      return css`
        background-image: url("/images/bond/arrow-up-chart.png")
      `;
    }
    return css`
      background-image: url("/images/bond/arrow-down-chart.png")
    `;
  }};
`

export const BondListItem = styled.div`
  border-radius: 15px;
  border: 1px solid rgba(70, 96, 255, 0.4);
  background: rgba(171, 182, 255, 0.08);
  padding: 36px;
`
export const BondListItemHeader = styled.div`
  width: 100%;
  padding: 0 0 36px 0;
  border-bottom: 1px solid rgba(70, 96, 255, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
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
  height: 20px;
  margin-top: 10px;
  font-size: 16px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 21px;
  text-align: center;
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
  color: #ABB6FF;
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
  width: 100%;
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
`




