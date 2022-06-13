import styled, { css } from 'styled-components'

export const BondPageWrap = styled.div`
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
  padding: 20px;
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
  ${({ isUp }: { isUp: boolean }) => {
    if (isUp) {
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
  ${({ isUp }: { isUp: boolean }) => {
    if (isUp) {
      return css`
        background-image: url("/images/bond/arrow-up-chart.png")
      `;
    }
    return css`
      background-image: url("/images/bond/arrow-down-chart.png")
    `;
  }};
`



