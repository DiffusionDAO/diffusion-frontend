import { ReactNode } from 'react'
import { Box, Grid, GridProps, Heading, HeadingProps } from '@pancakeswap/uikit'
import styled from 'styled-components'
const scales = {
  MD: "md",
  LG: "lg",
  XL: "xl",
  XXL: "xxl",
} as const
type Scales = typeof scales[keyof typeof scales];
const style = {
  [scales.MD]: {
    width: "100%",
    widthLG:'50%'
    
  },
  [scales.LG]: {
    width: "40%"
  },
  [scales.XL]: {
    width: "40%"
  },
  [scales.XXL]: {
    width: "40%"
  },
};

const BoxWarp = styled(Box)<HeadingProps>`
  width: ${({ scale }) => style[scale || scales.MD].width};

  ${({ theme }) => theme.mediaQueries.lg} {
    width: ${({ scale }) => style[scale || scales.LG].width};
  }
`

interface MarketPageTitleProps extends GridProps {
  title: string
  description?: ReactNode
}

const MarketPageTitle: React.FC<MarketPageTitleProps> = ({ title, description, children, ...props }) => (
  <Grid gridGap="16px" alignItems="center" gridTemplateColumns={['1fr', null, null, null, '1fr']} {...props}>
    <Box>
      <div style={{display:'flex'}}>
      <Heading as="h1" scale="xl" color="#ffffff" mb="16px" ml='32px' mt='0px' style={{fontSize:'32px'}}>
        {title}
      </Heading>
      <div style={{margin:'10px'}}>
      {description}
      </div>
      </div>
    </Box>
    
    <BoxWarp>{children}</BoxWarp>
    
  </Grid>
)

export default MarketPageTitle
