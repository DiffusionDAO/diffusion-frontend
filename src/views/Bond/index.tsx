import { FC, useState } from 'react'
import Typed from 'react-typed';
import { Grid } from "@material-ui/core";
import { BondPageWrap, BondPageTitle, OverviewCard, OverviewCardItem, OverviewCardItemTitle, OverviewCardItemContent,
  Price, Percent, Icon, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  CellTextColor, BondListItemBtn, ImgWrap, FromImg, ToImg, BondHeaderName } from './style'
import bondDatasMock from './MockBondData'



const Bond: FC = () => {
  const [bonData, setBondData] = useState<any[]>(bondDatasMock);
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
          <Percent isRise={4.02>0}>+4.02</Percent>
          <Icon isRise={4.02>0} />
        </OverviewCardItemContent>
      </OverviewCardItem>

      <OverviewCardItem>
        <OverviewCardItemTitle>Treasury balance</OverviewCardItemTitle>
        <OverviewCardItemContent>
          <Price>$123.22M</Price>
          <Percent isRise={-4.02>0}>-4.02</Percent>
          <Icon isRise={-4.02>0} />
        </OverviewCardItemContent>
      </OverviewCardItem>
    </OverviewCard>

    <Grid container spacing={2}>
      {
        bonData.map(bondItem => (
          <Grid item lg={6} md={6} sm={12} xs={12} key={bondItem.key}>
            <BondListItem>
              <BondListItemHeader>
                <ImgWrap>
                  <FromImg src={bondItem.from} />
                  <ToImg src={bondItem.to} />
                </ImgWrap>
                <BondHeaderName>{bondItem.name}</BondHeaderName>
              </BondListItemHeader>
              <BondListItemContent>
                <ContentCell>
                  <CellTitle>Price</CellTitle>
                  <CellText >${bondItem.price}</CellText>
                </ContentCell>
                <ContentCell>
                  <CellTitle>Discount</CellTitle>
                  <CellTextColor isRise={bondItem.discount>0}>{bondItem.discount}%</CellTextColor>
                </ContentCell>
                <ContentCell>
                  <CellTitle>Duration</CellTitle>
                  <CellText>{bondItem.duration}day</CellText>
                </ContentCell>
              </BondListItemContent>
              <BondListItemBtn>Bond</BondListItemBtn>
            </BondListItem>
          </Grid>
        ))
      }
    </Grid>

  </BondPageWrap>)
}
export default Bond;