import { FC } from 'react'
import Typed from 'react-typed';
import { BondPageWrap, BondPageTitle, OverviewCard, OverviewCardItem, OverviewCardItemTitle, OverviewCardItemContent,
  Price, Percent, Icon } from './style'


const Bond: FC = () => {
  return (<BondPageWrap>
    <BondPageTitle>
      <Typed
        strings={['Bond']}
        typeSpeed={50}
        cursorChar=""
      />
    </BondPageTitle>
    <OverviewCard>
      <OverviewCardItem>
        <OverviewCardItemTitle>Our price</OverviewCardItemTitle>
        <OverviewCardItemContent>
          <Price>$123.22M</Price>
          <Percent isUp={4.02>0}>+4.02</Percent>
          <Icon isUp={4.02>0} />
        </OverviewCardItemContent>
      </OverviewCardItem>

      <OverviewCardItem>
        <OverviewCardItemTitle>Treasury balance</OverviewCardItemTitle>
        <OverviewCardItemContent>
          <Price>$123.22M</Price>
          <Percent isUp={-4.02>0}>-4.02</Percent>
          <Icon isUp={-4.02>0} />
        </OverviewCardItemContent>
      </OverviewCardItem>
    </OverviewCard>

  </BondPageWrap>)
}
export default Bond;