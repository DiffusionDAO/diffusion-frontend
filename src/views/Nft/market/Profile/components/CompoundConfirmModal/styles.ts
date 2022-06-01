import styled from 'styled-components'
import { Modal, Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'



export const StyledModal = styled(Modal)`
  width: 60%;
`

export const ContentWrap = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    display: flex;
    margin-bottom: 20px;
  }
`

export const GetCardWrap = styled.div`
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(180deg, rgba(171, 182, 255, 0.05) 0%, rgba(171, 182, 255, 0) 100%);
  border: 0px solid;
`
export const GetCardTitle = styled.div`
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 13px;
  font-family: HelveticaNeue-Italic, HelveticaNeue;
  font-weight: normal;
  color: #ABB6FF;
`