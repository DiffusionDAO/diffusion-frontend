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
