import { FC, useState } from 'react'
import { useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import nftDatasMock from 'views/Nft/market/Profile/MockNftDatas';
import { BondPageWrap, DrawBlindBoxList, DrawBlindBoxItem, DrawBlindBoxImgWrap, ContentWrap, DalaCardList, DalaCardListTitle,
  AvailableCount, ActionWrap, ActionLeft, ActionRight, CountInput, DrawBlindBoxTextBtn, DrawBlindBoxPrimaryBtn } from './style'
import mintDatasMock from './MockMintData'
import DataCell from "../../components/ListDataCell"
import BlindBoxModal from './components/BlindBoxModal'
import JumpModal from './components/JumpModal'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";

const Bond: FC = () => {
  const { account } = useWeb3React();
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const [blindBoxModalVisible, setBlindBoxModalVisible] = useState<boolean>(false);
  const [jumpModalVisible, setJumpModalVisible] = useState<boolean>(false);
  const [balance,setBalance] = useState(1);
  const [count, setCount] = useState<number>();

  // 抽取盲盒
  const drawBlind = () => {
    if (!account) {
      onPresentConnectModal()
      return
    }
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
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <DrawBlindBoxItem className='item1'>
            <DrawBlindBoxImgWrap className='item1' />
            <ContentWrap>
              <DalaCardList>
                <DalaCardListTitle>{t('Senior blind box')}</DalaCardListTitle>
                <DataCell label={t('Time to next generate revenue')} value={mintDatasMock[0].price} valueDivStyle={{ fontSize: "16px" }} position="horizontal"/>
                <DataCell label={t('Time to next generate revenue')} value={mintDatasMock[0].contains} valueDivStyle={{ fontSize: "16px" }} position="horizontal"/>
                <DataCell label={t('Time to next generate revenue')} value={mintDatasMock[0].probability} valueDivStyle={{ fontSize: "16px" }} position="horizontal"/>
              </DalaCardList>
              <AvailableCount>{t('Available count:')}{mintDatasMock[0].availableCount}</AvailableCount>
              <ActionWrap>
                <ActionLeft>
                  <DrawBlindBoxTextBtn className='orangeBtn'>-</DrawBlindBoxTextBtn>
                  <CountInput value={count} isMobile={isMobile} />
                  <DrawBlindBoxTextBtn className='orangeBtn'>+</DrawBlindBoxTextBtn>
                  <DrawBlindBoxTextBtn className='orangeBtn'>{t('Max')}</DrawBlindBoxTextBtn>
                </ActionLeft>
                <ActionRight>
                  <DrawBlindBoxPrimaryBtn className='orangeBtn' style={{ width: '80px'}}>{t('Approve')}</DrawBlindBoxPrimaryBtn>
                </ActionRight>
              </ActionWrap>
              <DrawBlindBoxPrimaryBtn className='orangeBtn'>{t('Single')}</DrawBlindBoxPrimaryBtn>
            </ContentWrap>
          </DrawBlindBoxItem>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <DrawBlindBoxItem className='item2'>
            <DrawBlindBoxImgWrap className='item2' />
            <ContentWrap>
              <DalaCardList>
                <DalaCardListTitle>{t('Senior blind box')}</DalaCardListTitle>
                <DataCell label={t('Time to next generate revenue')} value={mintDatasMock[0].price} valueDivStyle={{ fontSize: "16px" }} position="horizontal"/>
                <DataCell label={t('Time to next generate revenue')} value={mintDatasMock[0].contains} valueDivStyle={{ fontSize: "16px" }} position="horizontal"/>
                <DataCell label={t('Time to next generate revenue')} value={mintDatasMock[0].probability} valueDivStyle={{ fontSize: "16px" }} position="horizontal"/>
              </DalaCardList>
              <AvailableCount>{t('Available count:')}{mintDatasMock[0].availableCount}</AvailableCount>
              <ActionWrap>
                <ActionLeft>
                  <DrawBlindBoxTextBtn className='purpleBtn'>-</DrawBlindBoxTextBtn>
                  <CountInput value={count} isMobile={isMobile} />
                  <DrawBlindBoxTextBtn className='purpleBtn'>+</DrawBlindBoxTextBtn>
                  <DrawBlindBoxTextBtn className='purpleBtn'>{t('Max')}</DrawBlindBoxTextBtn>
                </ActionLeft>
                <ActionRight>
                  <DrawBlindBoxPrimaryBtn className='purpleBtn' style={{ width: '80px'}}>{t('Approve')}</DrawBlindBoxPrimaryBtn>
                </ActionRight>
              </ActionWrap>
              <DrawBlindBoxPrimaryBtn className='purpleBtn'>{t('Single')}</DrawBlindBoxPrimaryBtn>
            </ContentWrap>
          </DrawBlindBoxItem>
        </Grid>
      </Grid>
    </DrawBlindBoxList>

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