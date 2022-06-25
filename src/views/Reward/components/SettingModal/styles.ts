import styled from 'styled-components'
import { Modal,Input } from 'antd';


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
export const SettingItem = styled.div`
`
export const SettingLabel = styled.div`
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-family: HelveticaNeue;
  color: #ABB6FF;
  line-height: 40px;
`
export const SettingCont = styled.div`
  padding: 10px;
  background: rgba(171, 182, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(171, 182, 255, 0.1);
  margin-bottom: 20px;
`
export const SettingInput = styled(Input)`
  margin-bottom: 10px;
  color: #fff;
  border: none;
  background: none;
  border-bottom: 1px solid rgba(171, 182, 255, 0.1);
  box-shadow: none !important;
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
    color: #ABB6FF;
  }
`
export const SettingTips = styled.div`
  height: 24px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ABB6FF;
  line-height: 24px;
`
