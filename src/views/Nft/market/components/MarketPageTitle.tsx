import { ReactNode } from 'react'
import { Box, Grid, GridProps, Heading } from '@pancakeswap/uikit'

interface MarketPageTitleProps extends GridProps {
  title: string
  description?: ReactNode
}

const MarketPageTitle: React.FC<MarketPageTitleProps> = ({ title, description, children, ...props }) => (
  <Grid gridGap="16px" alignItems="center" gridTemplateColumns={['1fr', null, null, null, '1fr']} {...props}>
    <Box>
      <div style={{display:'flex'}}>
      <Heading as="h1" scale="xl" color="#ffffff" mb="16px" ml='32px' mt='0px'>
        {title}
      </Heading>
      <div style={{margin:'10px'}}>
      {description}
      </div>
      </div>
    </Box>
    <Box>{children}</Box>
    
  </Grid>
)

export default MarketPageTitle
