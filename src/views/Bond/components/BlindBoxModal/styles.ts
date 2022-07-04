import styled from 'styled-components'
import { Modal,Input } from 'antd';


export const StyledModal = styled(Modal)`
  width: 60%;
`
export const ContentWrap = styled.div`
  margin: 40px; 
`
export const CardItem = styled.div`
  width: 100%;
`
export const CardImg = styled.img`
  width: 100%;
  border-radius: 11px;
`

export const TakeCardBtn = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`