import styled from 'styled-components'
import { Modal, Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'



export const StyledModal = styled(Modal)`
  width: 80%;
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