import styled from 'styled-components'

const StyledBannerImageWrapper = styled.div`
  ${({ theme }) => `background-color: ${theme.colors.cardBorder}`};
  flex: none;
  position: relative;
  width: 100%;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  height: 123px;
  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 192px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 256px;
  }
`

export default StyledBannerImageWrapper
