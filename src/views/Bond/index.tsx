import { FC, useEffect, useState } from 'react'
import Typed from 'react-typed'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { getUSDTAddress, getBondAddress } from 'utils/addressHelpers'
import { MaxUint256 } from '@ethersproject/constants'
import { useERC20 } from 'hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import {
  BondPageWrap,
  BondPageHeader,
  SculptureWrap,
  HeaderTitle,
  HeaderDes,
  OverviewWrap,
  OverviewCard,
  OverviewPromptList,
  OverviewPromptItem,
  OverviewPromptWrap,
  OverviewPromptLine,
  OverviewPromptTitle,
  Horizontal,
  OverviewCardItem,
  OverviewCardItemTitle,
  OverviewCardItemContent,
  BondListItem,
  BondListItemHeader,
  BondListItemContent,
  ContentCell,
  CellTitle,
  CellText,
  TextColor,
  BondListItemBtn,
  BondListItemBtnClosed,
  ImgWrap,
  FromImg,
  ToImg,
  BondHeaderName,
} from './style'
import bondDatasMock from './MockBondData'
import BondModal from './components/BondModal'
import SettingModal from './components/SettingModal'

const Bond = () => {
  const { account, connector } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [bonData, setBondData] = useState<any[]>(bondDatasMock)
  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false)
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false)

  const [isApprove, setIsApprove] = useState<boolean>(false)
  const [bondItem, setBondItem] = useState<any>(null)

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
  const bondAddress = getBondAddress()
  const usdt = useERC20(getUSDTAddress())
  const getApprove = () => {
    usdt.approve(bondAddress, MaxUint256).then(() => setIsApprove(true))
  }
  useEffect(() => {
    if (account) {
      usdt.allowance(account, bondAddress).then((res) => {
        if (res !== BigNumber.from(0)) setIsApprove(true)
      })
    }
  })
  return (
    <BondPageWrap>
      <BondPageHeader>
        <SculptureWrap src="/images/bond/bondSculpture.png" isMobile={isMobile} />
        <HeaderTitle>
          <Typed strings={[t('Bonds')]} typeSpeed={50} cursorChar="" />
        </HeaderTitle>
        <HeaderDes>
          {t(
            'Sales of bonds is the only way for DFS to be minted, through the sales of bonds to accumulate large asset volume, the central financial agreement will have but not limited to USDT, ETH, BNB and equivalent type of assets. This type of asset will become the core foundation supporting the value of DFS.',
          )}
        </HeaderDes>
      </BondPageHeader>

      <OverviewWrap>
        <OverviewCard isMobile={isMobile}>
          <OverviewCardItem>
            <OverviewCardItemTitle>{t('Central Financial Agreement Assets')}</OverviewCardItemTitle>
            <OverviewCardItemContent isMobile={isMobile}>$89.45M</OverviewCardItemContent>
          </OverviewCardItem>
          <OverviewCardItem>
            <OverviewCardItemTitle>{t('Price of DFS')}</OverviewCardItemTitle>
            <OverviewCardItemContent isMobile={isMobile}>$9.22</OverviewCardItemContent>
          </OverviewCardItem>
        </OverviewCard>
        <OverviewPromptWrap>
          {isMobile ? (
            <>
              <OverviewPromptLine style={{ width: 'calc(50% - 25px)' }} />
              <OverviewPromptTitle>{t('Reminder')}</OverviewPromptTitle>
              <OverviewPromptLine style={{ width: 'calc(50% - 25px)' }} />
            </>
          ) : (
            <>
              <OverviewPromptTitle>{t('Reminder')}</OverviewPromptTitle>
              <OverviewPromptLine style={{ width: 'calc(100% - 50px)' }} />
            </>
          )}
        </OverviewPromptWrap>
        <OverviewPromptList>
          <OverviewPromptItem>{t('Invest in bonds and get DFS at a discounted price')}</OverviewPromptItem>
          <OverviewPromptItem>{t('All funds invested in bonds will be added to the treasury')}</OverviewPromptItem>
          <OverviewPromptItem>{t('DFS will be fully credited in 5 days after bonds purchase')}</OverviewPromptItem>
          <OverviewPromptItem>
            {t(
              'Participate in NFT Gachapon even before the actual DFS has been credited into your account after your bonds purchase',
            )}
          </OverviewPromptItem>
        </OverviewPromptList>
      </OverviewWrap>

      <Grid container spacing={2}>
        {bonData.map((item) => (
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
                  <CellTitle>{t('Price')}</CellTitle>
                  <CellText>${item.price}</CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>{t('Discount')}</CellTitle>
                  <CellText>
                    <TextColor isRise={item.discount > 0}>{item.discount}%</TextColor>
                  </CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>{t('Duration')}</CellTitle>
                  <CellText>{item.duration}days</CellText>
                </ContentCell>
              </BondListItemContent>
              {item.status === 'opened' ? (
                <BondListItemBtn onClick={() => openBondModal(item)}>{t('Bonds')}</BondListItemBtn>
              ) : (
                <BondListItemBtnClosed onClick={() => openBondModal(item)}>{t('Not opened')}</BondListItemBtnClosed>
              )}
            </BondListItem>
          </Grid>
        ))}
      </Grid>
      {/* bond的弹窗 */}
      {bondModalVisible ? (
        <BondModal
          bondData={bondItem}
          onClose={closeBondModal}
          openSettingModal={openSettingModal}
          account={account}
          isApprove={isApprove}
          getApprove={getApprove}
        />
      ) : null}
      {/* bond设置弹窗 */}
      {settingModalVisible ? <SettingModal account={account} bondData={bondItem} onClose={closeSettingModal} /> : null}
    </BondPageWrap>
  )
}
export default Bond