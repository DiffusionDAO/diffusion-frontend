import { FC, useState } from 'react'
import Typed from 'react-typed';
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { BondPageWrap, BondHeaderWrap, BondPageText, BondPageTitle, BondPageDes, OverviewCard, Horizontal, OverviewCardItem, OverviewCardItemTitle, 
  OverviewCardItemContent, Price, Percent, Icon, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, BondListItemBtn, ImgWrap, FromImg, ToImg, BondHeaderName, BondSculptureWrap, BondSculptureGif, BondGearImg, BondBallImg  } from './style'
import bondDatasMock from './MockBondData'
import BondModal from './components/BondModal'
import SettingModal from './components/SettingModal'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";

const Bond: FC = () => {
  const [bonData, setBondData] = useState<any[]>(bondDatasMock);
  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false);
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const { account } = useWeb3React();
  const { isMobile } = useMatchBreakpoints();

  // 打开bond窗口
  const openBondModal = () => {
    setBondModalVisible(true)
  }
  const closeBondModal = () => {
    setBondModalVisible(false)
  }
  // 打开设置窗口
  const openSettingModal = () => {
    setSettingModalVisible(true)
  }
  const closeSettingModal = () => {
    setSettingModalVisible(false)
  }
  const getApprove = () => {
    setIsApprove(true)
  }
  return (<BondPageWrap>
    <BondSculptureWrap isMobile={isMobile}>
      <BondSculptureGif isMobile={isMobile} src="/images/bond/bond-sculpture.gif" alt="" />
      <BondGearImg isMobile={isMobile} src="/images/gear.png" alt="" />
      <BondBallImg isMobile={isMobile} src="/images/ball.png" alt="" />
    </BondSculptureWrap>
    <BondHeaderWrap isMobile={isMobile}>
      <BondPageText>
        <BondPageTitle>
          <Typed
            strings={['Bond']}
            typeSpeed={50}
            cursorChar=""
          />
        </BondPageTitle>
        <BondPageDes>Digtal market palce for crypto collectionbles and non-fungible tokens nfts</BondPageDes>
      </BondPageText>
      <OverviewCard>
        <OverviewCardItem isMobile={isMobile} className="borderBottom">
          <OverviewCardItemTitle>Our price</OverviewCardItemTitle>
          <OverviewCardItemContent>
            <Price>$123.22M</Price>
            <Percent isRise={4.02>0}>+4.02</Percent>
            <Icon isRise={4.02>0} />
          </OverviewCardItemContent>
        </OverviewCardItem>
        {
          isMobile ? <Horizontal /> : null
        }
        <OverviewCardItem isMobile={isMobile}>
          <OverviewCardItemTitle>Treasury balance</OverviewCardItemTitle>
          <OverviewCardItemContent>
            <Price>$123.22M</Price>
            <Percent isRise={-4.02>0}>-4.02</Percent>
            <Icon isRise={-4.02>0} />
          </OverviewCardItemContent>
        </OverviewCardItem>
      </OverviewCard>
    </BondHeaderWrap>


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
                  <CellText><TextColor isRise={bondItem.discount>0}>{bondItem.discount}%</TextColor></CellText>
                </ContentCell>
                <ContentCell>
                  <CellTitle>Duration</CellTitle>
                  <CellText>{bondItem.duration}days</CellText>
                </ContentCell>
              </BondListItemContent>
              <BondListItemBtn onClick={openBondModal}>Bond</BondListItemBtn>
            </BondListItem>
            {/* bond的弹窗 */}
            {
              bondModalVisible ? <BondModal bondData={bondItem} onClose={closeBondModal} openSettingModal={openSettingModal} 
              account={account} isApprove={isApprove} getApprove={getApprove} /> 
              : null
            }
            {
              settingModalVisible ? <SettingModal account={account}  bondData={bondItem} onClose={closeSettingModal} /> 
              : null
            }
          </Grid>
        ))
      }
    </Grid>
  </BondPageWrap>)
}
export default Bond;