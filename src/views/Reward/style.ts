import styled, { css } from 'styled-components'
import { Input } from 'antd';

const MARGIN = 24
export const RewardPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

export const DiffusionGoldWrap = styled.div`
  width: 100%;
  height: 400px;
  padding: 0 24px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
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
  height: 50px;
  line-height: 50px;
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
  margin-bottom: 40px;
`
export const ExtractBtn  = styled.div`
  width: 124px;
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

export const MySposWrap = styled.div`
  width: 100%;
  height: 400px;
  padding: 0 24px;
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
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
