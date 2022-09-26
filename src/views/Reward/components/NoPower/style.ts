import styled, { css } from 'styled-components'

export const NoConnectWrap = styled.div`
  width: 100%;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`
export const NoConnectConLeft = styled.div`
  max-width: 524px;
  display: flex;
  flex-direction: column;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 100%;
      `
    }
    return css`
      width: 50%;
    `
  }};
`
export const NoConnectConLeftTitle = styled.div`
  width: 100%;
  line-height: 50px;
  margin-top: 40px;
  font-size: 44px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
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
  color: #abb6ff;
  background: linear-gradient(91deg, #e861fa 0%, #ffa9d3 51%, #db55ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
export const NoConnectConLeftBtn = styled.div`
  width: 184px;
  height: 40px;
  margin: 20px 0;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const NoConnectConRight = styled.div`
  max-width: 395px;
  display: flex;
  position: relative;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        display: none;
      `
    }
    return css`
      width: 50%;
    `
  }};
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
