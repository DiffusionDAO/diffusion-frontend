import styled, { css } from 'styled-components'
import { Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'
import { Modal } from 'antd';


export const StyledModal = styled(Modal)`
  width: 60%;
`

export const ContentWrap = styled.div`
`
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
  color: #FFFFFF;
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
  color: #ABB6FF;
`


export const BondListItemBtn = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-bottom: 20px;
  color: #fff;
  text-align: center;
  background: linear-gradient(90deg, #3C00FF 0%, #EC6EFF 100%);
  border-radius: 7px;
  cursor: pointer;
  background: linear-gradient(135deg,#3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`