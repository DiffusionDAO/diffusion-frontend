import styled from 'styled-components'
import { Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'
import { Modal } from 'antd'

export const StyledModal = styled(Modal)`
  width: 60%;
`

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const TitleText = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
  height: 17px;
  font-size: 15px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ffffff;
  line-height: 17px;
`

export const DesText = styled.div`
  text-align: center;
  margin-top: 20px;
  width: 100%;
  height: 29px;
  font-size: 13px;
  font-family: HelveticaNeue;
  color: #ABB6FF;
  line-height: 15px;
}
`
export const BtnWrap = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
`
