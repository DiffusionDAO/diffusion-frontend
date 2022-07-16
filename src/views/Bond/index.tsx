import { FC, useState } from 'react'
import Typed from 'react-typed';
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { BondPageWrap, BondPageHeader, SculptureWrap, HeaderTitle, HeaderDes, 
  OverviewWrap, OverviewCard, OverviewPromptList, OverviewPromptItem, OverviewPromptWrap, OverviewPromptLine, OverviewPromptTitle,  Horizontal, OverviewCardItem, OverviewCardItemTitle, 
  OverviewCardItemContent, BondListItem, BondListItemHeader, BondListItemContent, ContentCell, CellTitle, CellText, 
  TextColor, BondListItemBtn, BondListItemBtnClosed, ImgWrap, FromImg, ToImg, BondHeaderName } from './style'
import bondDatasMock from './MockBondData'
import BondModal from './components/BondModal'
import SettingModal from './components/SettingModal'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";

const Bond: FC = () => {
  const { account } = useWeb3React();
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const [bonData, setBondData] = useState<any[]>(bondDatasMock);
  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false);
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);

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
  return (<BondPageWrap>
    <BondPageHeader>
      <SculptureWrap src="/images/bond/bondSculpture.png" isMobile={isMobile} />
      <HeaderTitle>
        <Typed
          strings={['Bond']}
          typeSpeed={50}
          cursorChar=""
        />
      </HeaderTitle>
      <HeaderDes>{t('Digtal market palce for crypto collectionbles and non-fungible tokens nfts')}</HeaderDes>
    </BondPageHeader>

    <OverviewWrap>
      <OverviewCard isMobile={isMobile}>
        <OverviewCardItem isMobile={isMobile}>
          <OverviewCardItemTitle>The Treasury balance</OverviewCardItemTitle>
          <OverviewCardItemContent>
            $123.22
          </OverviewCardItemContent>
        </OverviewCardItem>
        <OverviewCardItem isMobile={isMobile}>
          <OverviewCardItemTitle>The price of DFS</OverviewCardItemTitle>
          <OverviewCardItemContent>
            $123.22M
          </OverviewCardItemContent>
        </OverviewCardItem>
      </OverviewCard>
      <OverviewPromptWrap>
        {
          isMobile ? <>
              <OverviewPromptLine style={{width: 'calc(50% - 25px)'}} />
              <OverviewPromptTitle>{t('prompt')}</OverviewPromptTitle>
              <OverviewPromptLine style={{width: 'calc(50% - 25px)'}}/>
          </>:
          <>
            <OverviewPromptTitle>{t('prompt')}</OverviewPromptTitle>
            <OverviewPromptLine style={{width: 'calc(100% - 50px)'}}/>
          </>
        }
      </OverviewPromptWrap>
      <OverviewPromptList>
        <OverviewPromptItem>{t('Investing in bonds gives you DFS at a discount')}</OverviewPromptItem>
        <OverviewPromptItem>{t('All funds invested in bonds will be added to the liquidity pool')}</OverviewPromptItem>
        <OverviewPromptItem>{t('The DFS obtained by investing in bonds will arrive in full after 5 days')}</OverviewPromptItem>
        <OverviewPromptItem>{t('Investment bonds can draw social NFT blind box when DFS is not in the account')}</OverviewPromptItem>
      </OverviewPromptList>
    </OverviewWrap>


    <Grid container spacing={2}>
      {
        bonData.map(item => (
          <Grid item lg={4} md={4} sm={12} xs={12} key={item.key}>
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
              {
                item.status === 'opened' ? 
                <BondListItemBtn onClick={()=> openBondModal(item)}>{t('Bond')}</BondListItemBtn>
                : 
                <BondListItemBtnClosed onClick={()=> openBondModal(item)}>{t('Not opened')}</BondListItemBtnClosed>
              }
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
  </BondPageWrap>)
}
export default Bond;