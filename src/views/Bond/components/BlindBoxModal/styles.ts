import styled from 'styled-components'
import { Modal, Input } from 'antd'

export const StyledModal = styled(Modal)`
  width: 60%;
`
export const ContentWrap = styled.div`
  display: flex;
  margin: 40px;
  flex-direction: column;
  align-items: center;
`
export const CardItem = styled.div`
  width: 100%;
`
export const CardImg = styled.img`
  width: 100%;
  border-radius: 11px;
`
export const BtnWrap = styled.div`
  width: 228px;
`

export const TakeCardBtn = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 8px;
  color: #fff;
  line-height: 48px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  position: relative;
  background: linear-gradient(90deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const JumpBtnCont = styled.div`
  width: calc(100% - 4px);
  height: 44px;
  line-height: 44px;
  border-radius: 8px;
  background: #141529;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
`
