import styled, { css } from 'styled-components'

export const RewardPageWrap = styled.div`
  margin: 24px;
`
export const BondPageTitle = styled.div`
  height: 72px;
  font-size: 56px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 72px;
  letter-spacing: 2px;
  margin: 40px 0;
`

export const OverviewCard = styled.div`
  width: 100%;
  margin-bottom: 40px;
  border-radius: 16px;
  background: rgba(171, 182, 255, 0.05);
  border: 1px solid rgba(70, 96, 255, 0.32);
  display: flex;
`
export const OverviewCardItem = styled.div`
  min-width: 350px;
  padding: 36px;
`
export const OverviewCardItemTitle = styled.div`
  height: 16px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: #FFFFFF;
  line-height: 16px;
  margin-bottom: 36px;
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




