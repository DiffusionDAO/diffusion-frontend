import styled from 'styled-components'
import { Modal, Input } from 'antd'

export const StyledModal = styled(Modal)`
  width: 60%;
`
export const JumpWrap = styled.div`
  display: flex;
  margin: 40px;
  flex-direction: column;
  align-items: center;
`
export const JumpTitle = styled.div`
  width: 100%;
  height: 24px;
  font-size: 20px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ffffff;
  line-height: 24px;
  text-align: center;
`
export const JumpDes = styled.div`
  margin: 20px;
  width: 100%;
  height: 16px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  line-height: 16px;
  text-align: center;
  marginbottom: 40px;
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
  font-size: 14px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ec6eff;
  background: #141529;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
`
export const JumpInvite = styled.a`
  height: 16px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: #ec6eff;
  line-height: 16px;
  text-decoration: revert;
  margin-top: 40px;
`
