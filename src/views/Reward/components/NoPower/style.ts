import styled, { css } from 'styled-components'

export const NoConnectWrap = styled.div`
  width: 100%;
  margin-top: 150px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
export const NoConnectConLeft = styled.div`
  width: 50%;
  max-width: 524px;
  display: flex;
  flex-direction: column;
`
export const NoConnectConLeftTitle = styled.div`
  width: 100%;
  height: 104px;
  font-size: 44px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 53px;
  letter-spacing: 1px;
`
export const NoConnectConLeftDes = styled.div`
  width: 100%;
  height: 26px;
  line-height: 26px;
  margin: 40px 0;
  font-size: 22px;
  font-family: HelveticaNeue-CondensedBold, HelveticaNeue;
  font-weight: normal;
  color: #ABB6FF;
  background: linear-gradient(91deg, #E861FA 0%, #FFA9D3 51%, #DB55FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
export const NoConnectConLeftBtn = styled.div`
  width: 124px;
  height: 40px;
  margin: 20px 0;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const NoConnectConRight = styled.div`
  max-width: 395px;
  display: flex;
  position: relative;
`
export const NoConnectConRightImg = styled.img`
  width: 100%;
`
export const NoConnectConRightLine = styled.img`
  width: 265px;
  height: 132px;
  position: absolute;
  left: -200px;
  bottom: 30px;
`