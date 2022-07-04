import { FC, useState } from 'react'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { BondPageWrap, DrawBlindBoxItem, DrawBlindBoxCont, DrawBlindBoxImg, DrawBlindBoxHeader, DrawBlindBoxHeaderBg, DrawBlindBoxFooter, DrawBlindBoxFooterBtn, OverviewCard, Horizontal, OverviewCardItem, OverviewCardItemTitle, 
  OverviewCardItemContent, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, BondListItemBtn, ImgWrap, FromImg, ToImg, BondHeaderName } from './style'
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
  const { t } = useTranslation()


  const openBondModal = () => {
    setBondModalVisible(true)
  }
  const closeBondModal = () => {
    setBondModalVisible(false)
  }
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
    <Grid container spacing={2}>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <DrawBlindBoxItem className='item1'>
          <DrawBlindBoxCont>
            <DrawBlindBoxImg src="images/bond/drawBlindBoxBg1.png" />
            <DrawBlindBoxHeader className='item1'>{t('Based blind box')}</DrawBlindBoxHeader>
            <DrawBlindBoxFooter>
              <DrawBlindBoxFooterBtn type="primary" size='middle' style={{ marginRight: '10px' }}>{t('A Single')}</DrawBlindBoxFooterBtn>
              <DrawBlindBoxFooterBtn type="primary" size='middle' style={{ marginRight: '10px' }}>{t('Max')}</DrawBlindBoxFooterBtn>
            </DrawBlindBoxFooter>
          </DrawBlindBoxCont>
        </DrawBlindBoxItem>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <DrawBlindBoxItem className='item2'>
          <DrawBlindBoxCont>
            <DrawBlindBoxImg src="images/bond/drawBlindBoxBg1.png" />
            <DrawBlindBoxHeader className='item2'>{t('Senior blind box')}</DrawBlindBoxHeader>
            <DrawBlindBoxFooter>
              <DrawBlindBoxFooterBtn type="primary" size='middle' style={{ marginRight: '10px' }}>{t('A Single')}</DrawBlindBoxFooterBtn>
              <DrawBlindBoxFooterBtn type="primary" size='middle' style={{ marginRight: '10px' }}>{t('Max')}</DrawBlindBoxFooterBtn>
            </DrawBlindBoxFooter>
          </DrawBlindBoxCont>
        </DrawBlindBoxItem>
      </Grid>
    </Grid>

    <OverviewCard>
        <OverviewCardItem>
          <OverviewCardItemTitle>The Treasury balance</OverviewCardItemTitle>
          <OverviewCardItemContent>
            $123.22
          </OverviewCardItemContent>
        </OverviewCardItem>
        {
          isMobile ? <Horizontal /> : null
        }
        <OverviewCardItem>
          <OverviewCardItemTitle>The price of DFS</OverviewCardItemTitle>
          <OverviewCardItemContent>
            $123.22M
          </OverviewCardItemContent>
        </OverviewCardItem>
        {
          isMobile ? <Horizontal /> : null
        }
        <OverviewCardItem>
          <OverviewCardItemTitle>Straight driving performance</OverviewCardItemTitle>
          <OverviewCardItemContent>
            1000000U
          </OverviewCardItemContent>
        </OverviewCardItem>
      </OverviewCard>


    <Grid container spacing={2}>
      {
        bonData.map(bondItem => (
          <Grid item lg={12} md={12} sm={12} xs={12} key={bondItem.key}>
            <BondListItem>
              <BondListItemHeader isMobile={isMobile}>
                <ImgWrap>
                  <FromImg src={bondItem.from} />
                  <ToImg src={bondItem.to} />
                </ImgWrap>
                <BondHeaderName>{bondItem.name}</BondHeaderName>
              </BondListItemHeader>
              <BondListItemContent isMobile={isMobile}>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>Price</CellTitle>
                  <CellText >${bondItem.price}</CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>Discount</CellTitle>
                  <CellText><TextColor isRise={bondItem.discount>0}>{bondItem.discount}%</TextColor></CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>Duration</CellTitle>
                  <CellText>{bondItem.duration}days</CellText>
                </ContentCell>
              </BondListItemContent>
              <BondListItemBtn onClick={openBondModal} isMobile={isMobile}>Bond</BondListItemBtn>
            </BondListItem>
            {/* bond的弹窗 */}
            {
              bondModalVisible ? <BondModal bondData={bondItem} onClose={closeBondModal} openSettingModal={openSettingModal} 
              account='xxx' isApprove={isApprove} getApprove={getApprove} /> 
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