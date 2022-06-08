import styled, { css }  from 'styled-components'

export const SubMenuWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 20px 0;
  border-bottom:1px solid rgba(255, 255, 255, 0.1);
  > div {
    border-bottom: none;
  }
`

export const SelectedCountBox = styled.div`
  color: #fff;
`
export const SelectedCountWrap = styled.span`
  padding: 2px 20px;
  width: 39px;
  height: 27px;
  background: rgba(255,255,255,0.1);
  border-radius: 13px;
  margin-left: 20px;
`

export const SelectWrap = styled.div`
.ant-select-selector {
  background: rgba(171, 182, 255, 0.2);
  border-radius: 8px;
}
`
interface CompoundBtnWrapProps {
  isCompound: boolean;
}
export const CompoundBtnWrap = styled.div`
  padding: 20px;
  height: 90px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hodden;
  ${({ isCompound }: CompoundBtnWrapProps) => {
    if (isCompound) {
      return css`
        justify-content: space-between;
      `;
    }
    return css`
      justify-content: center;
    `;
  }}
`
export const CompoundBtnWrapImg = styled.img`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`
export const SyntheticBtn = styled.img`
  cursor: pointer;
  height: 120px;
  cursor: pointer;
`

export const BackgroundWrap = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
`
export const BackgroundImg = styled.img`
  width: 100%;
  position: absolute;
  right: 60px;
  bottom: 0px;
`
export const HaloWrap = styled.span`
  position: absolute;
  height: 400px;
  width: 400px;
`
export const BlueHalo = styled.span`
  position: absolute;
  height: 400px;
  width: 400px;
  background-color: #3C00FF;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 8s;
  animation-direction: reverse;
  mix-blend-mode: plus-lighter;
  filter: blur(200px)
`
export const RedHalo = styled.span`
  position: absolute;
  height: 200px;
  width: 200px;
  background-color: #EC6EFF;
  border-radius: 50%;
  transform-origin: 100px;
  animation: halo 10s linear infinite;
  animation-duration: 5s;
  mix-blend-mode: plus-lighter;
  filter: blur(100px)
`
export const BackgroundText = styled.div`
  width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
// export const BackgroundTitle = styled.div`
//   width: 100%;
//   font-size: 56px;
//   font-family: HelveticaNeue-Bold, HelveticaNeue;
//   font-weight: bold;
//   color: #FFFFFF;
//   line-height: 72px;
//   letter-spacing: 2px;
//   margin-left: 40px;
//   margin-bottom: 40px;
//   white-space: nowrap;
//   overflow: hidden;
//   animation: typing 4s steps(22), blink .5s step-end infinite alternate;
// `
export const BackgroundTitle = styled.div`
  width: 100%;
  font-size: 56px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 72px;
  letter-spacing: 2px;
  margin-left: 40px;
  margin-bottom: 40px;
  z-index: 2;
`
export const BackgroundDes = styled.div`
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-family: HelveticaNeue;
  color: #ABB6FF;
  line-height: 28px;
  margin-left: 40px;
`
export const ConentWrap = styled.div`
  margin: 20px;
`
