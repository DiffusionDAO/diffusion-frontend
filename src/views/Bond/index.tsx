import { FC, useState } from 'react'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import nftDatasMock from 'views/Nft/market/Profile/MockNftDatas';
import { BondPageWrap, DrawBlindBoxList, DrawBlindBoxItem, DrawBlindBoxCont, DrawBlindBoxImg, DrawBlindBoxHeader, DrawBlindBoxFooter, 
  DrawBlindBoxFooterBtn, DrawBlindBoxFooterBtnBorder, DrawBlindBoxFooterBtnBorderImg, OverviewCard, Horizontal, OverviewCardItem, OverviewCardItemTitle, 
  OverviewCardItemContent, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, BondListItemBtn, ImgWrap, FromImg, ToImg, BondHeaderName } from './style'
import bondDatasMock from './MockBondData'
import BondModal from './components/BondModal'
import SettingModal from './components/SettingModal'
import BlindBoxModal from './components/BlindBoxModal'
import JumpModal from './components/JumpModal'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";

const Bond: FC = () => {
  const { account } = useWeb3React();
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const [bonData, setBondData] = useState<any[]>(bondDatasMock);
  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false);
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);
  const [blindBoxModalVisible, setBlindBoxModalVisible] = useState<boolean>(false);
  const [jumpModalVisible, setJumpModalVisible] = useState<boolean>(false);
  const [balance,setBalance] = useState(1);

  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [bondItem, setBondItem] = useState<any>(null);


  const openBondModal = (item) => {
    setBondItem(item)
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
  // 抽取盲盒
  const drawBlind = () => {
    if (balance <= 0) {
      setJumpModalVisible(true)
      return
    }
    setBlindBoxModalVisible(true)
  }
  const closeBlindBoxModal = () => {
    setBlindBoxModalVisible(false)
  }
  const closeJumpModal = () => {
    setJumpModalVisible(false)
  }

  return (<BondPageWrap>
    <DrawBlindBoxList>
      <DrawBlindBoxItem className='item1'>
        <DrawBlindBoxCont>
          <DrawBlindBoxImg src="images/bond/drawBlindBoxBg1.png" />
          <DrawBlindBoxHeader className='item1'>{t('Based blind box')}</DrawBlindBoxHeader>
          <DrawBlindBoxFooter>
            <DrawBlindBoxFooterBtn className="purpleBtn" style={{ marginRight: '10px' }} onClick={drawBlind}>{t('A Single')}</DrawBlindBoxFooterBtn>
            <DrawBlindBoxFooterBtnBorder onClick={drawBlind}>
              <DrawBlindBoxFooterBtnBorderImg src="/images/bond/purpleBtnBorderBg.png" />
              {t('Max')}
            </DrawBlindBoxFooterBtnBorder>
          </DrawBlindBoxFooter>
        </DrawBlindBoxCont>
      </DrawBlindBoxItem>
      <DrawBlindBoxItem className='item2'>
        <DrawBlindBoxCont>
          <DrawBlindBoxImg src="images/bond/drawBlindBoxBg2.png" />
          <DrawBlindBoxHeader className='item2'>{t('Senior blind box')}</DrawBlindBoxHeader>
          <DrawBlindBoxFooter>
            <DrawBlindBoxFooterBtn className="orangeBtn"  style={{ marginRight: '10px' }} onClick={drawBlind}>{t('A Single')}</DrawBlindBoxFooterBtn>
            <DrawBlindBoxFooterBtnBorder onClick={drawBlind}>
              <DrawBlindBoxFooterBtnBorderImg src="/images/bond/orangeBtnBorderBg.png" />
              {t('Max')}
            </DrawBlindBoxFooterBtnBorder>
          </DrawBlindBoxFooter>
        </DrawBlindBoxCont>
        </DrawBlindBoxItem>
    </DrawBlindBoxList>

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
        bonData.map(item => (
          <Grid item lg={12} md={12} sm={12} xs={12} key={item.key}>
            <BondListItem>
              <BondListItemHeader isMobile={isMobile}>
                <ImgWrap>
                  <FromImg src={item.from} />
                  <ToImg src={item.to} />
                </ImgWrap>
                <BondHeaderName>{item.name}</BondHeaderName>
              </BondListItemHeader>
              <BondListItemContent isMobile={isMobile}>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>Price</CellTitle>
                  <CellText >${item.price}</CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>Discount</CellTitle>
                  <CellText><TextColor isRise={item.discount>0}>{item.discount}%</TextColor></CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>Duration</CellTitle>
                  <CellText>{item.duration}days</CellText>
                </ContentCell>
              </BondListItemContent>
              <BondListItemBtn onClick={()=> openBondModal(item)} isMobile={isMobile}>Bond</BondListItemBtn>
            </BondListItem>
          </Grid>
        ))
      }
    </Grid>
    {/* bond的弹窗 */}
    {
      bondModalVisible ? <BondModal bondData={bondItem} onClose={closeBondModal} openSettingModal={openSettingModal} 
      account={account} isApprove={isApprove} getApprove={getApprove} /> 
      : null
    }
    {/* bond设置弹窗 */}
    {
      settingModalVisible ? <SettingModal account={account}  bondData={bondItem} onClose={closeSettingModal} /> 
      : null
    }
    {/* 盲盒成功的弹窗 */}
    {
      blindBoxModalVisible ? <BlindBoxModal nftData={nftDatasMock} onClose={closeBlindBoxModal} />
      : null
    }
    {/* 跳转选项的弹窗 */}
    {
      jumpModalVisible ? <JumpModal onClose={closeJumpModal} />
      : null
    }
  </BondPageWrap>)
}
export default Bond;