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
  >img {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
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
export const SyntheticBtn = styled.div`
  color: #fff;
  cursor: pointer;
  width: 150px;
  height: 90px;
  text-align: center;
  line-height: 90px;
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
  top: -530px;
`
export const BackgroundText = styled.div`
  width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
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
  white-space: nowrap;
  overflow: hidden;
  animation: typing 4s steps(22), blink .5s step-end infinite alternate;
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
