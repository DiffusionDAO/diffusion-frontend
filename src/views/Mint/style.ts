import styled, { css } from 'styled-components'
import { InputNumber } from 'antd'

export const BondPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 20px;
`
export const DrawBlindBoxList = styled.div`
  margin-bottom: 20px;
`

export const DrawBlindBoxItem = styled.div`
  width: 100%;
  border-radius: 16px;
  &.item1 {
    border: 2px solid #ff7056;
  }
  &.item2 {
    border: 2px solid #ec6eff;
  }
`
export const DrawBlindBoxImgWrap = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 64%;
  border-radius: 16px;
  position: relative;
  &.item1 {
    border-bottom: 2px solid #ff7056;
    background: url('/images/mint/drawBlindBoxBg1.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
  &.item2 {
    border-bottom: 2px solid #ec6eff;
    background: url('/images/mint/drawBlindBoxBg2.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
`
export const BoxLeftAskImg = styled.img`
  width: 20%;
  position: absolute;
  top: 0px;
  left: 20%;
  animation: ball 3s ease-in-out infinite;
`
export const BoxRightAskImg = styled.img`
  width: 30%;
  position: absolute;
  bottom: 0px;
  left: 40%;
  animation: ball 3s ease-in-out infinite;
`

export const DrawBlindBoxImg = styled.img`
  width: 100%;
  height: 100%;
`
export const ContentWrap = styled.div`
  padding: 20px;
`
export const DalaCardList = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`
export const DalaCardListTitle = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 24px;
  font-family: HelveticaNeue-BoldItalic, HelveticaNeue;
  font-weight: normal;
  color: #ffffff;
  text-shadow: 0px 2px 19px rgba(255, 255, 255, 0.5);
`
export const DalaCardCellWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const DalaCardLabelDiv = styled.div`
  text-align: left;
  font-size: 12px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #abb6ff;
  line-height: 40px;
`
export const DalaCardValueDiv = styled.div`
  text-align: right;
  font-size: 14px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
  line-height: 40px;
`
export const ColorFont = styled.span``
export const CountWrap = styled.div`
  display: flex;
`
export const AvailableCount = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
`
export const UnWithdrawCount = styled.div`
  text-align: right;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
`
export const ActionWrap = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`
export const ActionLeft = styled.div`
  display: flex;
`
export const ActionRight = styled.div``
export const DrawBlindBoxTextBtn = styled.div`
  width: 38px;
  height: 38px;
  font-size: 12px;
  border-radius: 8px;
  margin-right: 5px;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
  &.orangeBtn {
    color: #ff7056;
    border: 1px solid #ff7056;
  }
  &.purpleBtn {
    color: #ec6eff;
    border: 1px solid #ec6eff;
  }
`
export const DrawBlindBoxPrimaryBtn = styled.div`
  height: 40px;
  font-size: 12px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  &.orangeBtn {
    background: linear-gradient(90deg, #ffa16e, #ff7056);
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
  &.purpleBtn {
    background: linear-gradient(90deg, #3c00ff, #ec6eff);
    background-size: 400% 400%;
    animation: gradient 5s ease infinite;
  }
`
export const CountInput = styled(InputNumber)`
  height: 40px;
  margin-right: 5px;
  color: #fff;
  box-shadow: none !important;
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(171, 182, 255, 0.1);
  :focus {
    box-shadow: none !important;
  }
  input.ant-input-number-input {
    height: 40px;
    background: none;
    color: #fff;
    :focus {
      box-shadow: none;
    }
  }
  ${({ ismobile }: { ismobile: string }) => {
    if (ismobile === 'true') {
      return css`
        width: 80px;
      `
    }
    return css`
      width: 180px;
    `
  }};
`
