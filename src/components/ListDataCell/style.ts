import styled, { css } from 'styled-components'

export const CellWrap = styled.div`
  width: 100%;
  display: flex;
  ${({ position }: { position: string }) => {
    if (position === 'horizontal') {
      return css`
        flex-direction: row;
        justify-content: space-between;
      `;
    }
    return css`
      flex-direction: column;
    `;
  }};
`

export const LabelDiv = styled.div`
  height: 30px;
  font-size: 12px;
  font-family: HelveticaNeue-Medium, HelveticaNeue;
  font-weight: 500;
  color: #ABB6FF;
  line-height: 30px;
`
export const ValueDiv = styled.div`
  height: 40px;
  font-size: 22px;
  font-family: HelveticaNeue-Bold, HelveticaNeue;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 40px;
`