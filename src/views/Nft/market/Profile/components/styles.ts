import styled, { css } from 'styled-components'

const HEADER_HEIGHT = 400
const MARGIN = 20
const NAV_HEIGHT = 56
const TOP_HEIGHT = MARGIN + NAV_HEIGHT + 100

export const SubMenuWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 20px 0;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  > div {
    border-bottom: none;
  }
`
export const SubMenuRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

export const SelectedCountBox = styled.div`
  color: #fff;
`
export const SelectedCountWrap = styled.span`
  padding: 2px 10px;
  height: 27px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 13px;
  margin-left: 5px;
`

export const SelectWrap = styled.div`
  .ant-select-selector {
    background: rgba(171, 182, 255, 0.2);
    border-radius: 8px;
  }
`
interface ComposeBtnWrapProps {
  isSelected: boolean
}
export const ComposeBtnWrap = styled.div`
  padding: 20px;
  height: 90px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hodden;
  ${({ isSelected }: ComposeBtnWrapProps) => {
    if (isSelected) {
      return css`
        justify-content: space-between;
      `
    }
    return css`
      justify-content: center;
    `
  }}
`
export const ComposeBtnWrapImg = styled.img`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`
export const ComposeBtn = styled.img`
  cursor: pointer;
  height: 120px;
`
export const AccountNftWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 20px;
  position: relative;
`
export const NftSculptureWrap = styled.div`
  top: -50px;
  right: 0px;
  background: url('/images/nfts/nft-sculpture-wrap.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 360px;
        width: 360px;
        position: absolute;
        right: -35px;
      `
    }
    return css`
      height: 500px;
      width: 500px;
      position: absolute;
    `
  }};
`
export const NftSculptureGif = styled.img`
  position: absolute;
  left: 0px;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 300px;
        width: 300px;
        bottom: -40px;
      `
    }
    return css`
      height: 500px;
      width: 500px;
      bottom: -60px;
    `
  }};
`
export const NftGearImg = styled.img`
  position: absolute;
  animation: gear 10s linear infinite;
  animation-duration: 10s;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 150px;
        height: 150px;
        left: 0px;
        bottom: -30px;
      `
    }
    return css`
      width: 180px;
      height: 180px;
      left: 0px;
      bottom: -50px;
    `
  }};
`
export const NftBallImg = styled.img`
  width: 50px;
  height: 50px;
  position: absolute;
  animation: ball 3s ease-in-out infinite;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        bottom: 200px;
        left: 330px;
      `
    }
    return css`
      bottom: 300px;
      left: 425px;
    `
  }};
`
export const BackgroundWrap = styled.div`
  position: relative;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 300px;
        margin-top: 440px;
      `
    }
    return css`
      height: 400px;
      margin-top: 0px;
    `
  }};
`
export const BackgroundText = styled.div`
  max-width: 500px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
export const BackgroundTitle = styled.div`
  width: 100%;
  font-size: 56px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #ffffff;
  line-height: 72px;
  letter-spacing: 2px;
  margin-bottom: 40px;
  z-index: 2;
`
export const BackgroundDes = styled.div`
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-family: HelveticaNeue;
  color: #abb6ff;
  line-height: 28px;
`
export const ContentWrap = styled.div``
