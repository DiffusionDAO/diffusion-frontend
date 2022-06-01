import styled, { css }  from 'styled-components'
import compoundBtnWrapSvg from "../../../../../../public/images/nfts/compoundBtnWrap.svg"

export const SubMenuWrap = styled.div`
  position: relative;
  margin: 20px 0;
  border-bottom:1px solid rgba(255, 255, 255, 0.1);
  > div {
    border-bottom: none;
  }
`
export const CountWrap = styled.span`
  padding: 2px 20px;
  width: 39px;
  height: 27px;
  background: rgba(255,255,255,0.1);
  border-radius: 13px;
  margin-left: 20px;
`

export const SelectWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`
interface CompoundBtnWrapProps {
  isCompound: boolean;
}
export const CompoundBtnWrap = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  background-image: url(${compoundBtnWrapSvg});
  background-repeat: no-repeat;
  background-size: cover;
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