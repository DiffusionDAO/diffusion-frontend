import { FC, useEffect, useState } from 'react'
import { useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useNftDrawContract } from 'hooks/useContract'
import {
  BondPageWrap, DrawBlindBoxList, DrawBlindBoxItem, DrawBlindBoxImgWrap, BoxLeftAskImg, BoxRightAskImg, ContentWrap, DalaCardList, DalaCardListTitle,
  DalaCardCellWrap, DalaCardLabelDiv, DalaCardValueDiv, ColorFont,
  AvailableCount, ActionWrap, ActionLeft, ActionRight, CountInput, DrawBlindBoxTextBtn, DrawBlindBoxPrimaryBtn
} from './style'
import DataCell from "../../components/ListDataCell"
import BlindBoxModal from './components/BlindBoxModal'
import JumpModal from './components/JumpModal'
import PlayBindBoxModal from './components/PlayBindBoxModal'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";
import { useFetchBalance } from "./hook/useFetchBalance"
import { mintDatasMock } from './MockMintData'

const Mint: FC = () => {
  const { account } = useWeb3React();
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const [blindBoxModalVisible, setBlindBoxModalVisible] = useState<boolean>(false);
  const [jumpModalVisible, setJumpModalVisible] = useState<boolean>(false);
  const [playBindBoxModalVisible, setPlayBindBoxModalVisible] = useState<boolean>(false);
  const [gifUrl, setGifUrl] = useState<string>('/images/mint/purplePlay.gif');
  const [seniorCount, setSeniorCount] = useState<number>(1);
  const [maxSenior, setMaxSenior] = useState<number>(1);
  const [ordinaryCount, setOrdinaryCount] = useState<number>(1);
  const [maxOrdinary, setMaxOrdinary] = useState<number>(1);
  const { balance } = useFetchBalance()
  const NftDraw = useNftDrawContract()

  const ordinaryPrice = 10
  const seniorPrice = 60

  useEffect(() => {
    if (balance) {
      const maxOrd = balance / ordinaryPrice
      const maxSen = balance / seniorPrice
      setMaxOrdinary(Math.max(maxOrd,1))
      setMaxSenior(Math.max(maxSen,1))
    }
  },[balance])

  const drawBlind = async (type: string) => {
    if (!account) {
      onPresentConnectModal()
      return
    }
    if ((type === 'senior' && balance < seniorPrice*seniorCount) || (type === 'ordinary' && balance < ordinaryPrice*ordinaryCount)) {
      setJumpModalVisible(true)
      return
    }
    setPlayBindBoxModalVisible(true)
    setGifUrl(`/images/mint/${type}.gif`)
    const res = type === 'ordinary' ? await NftDraw.mintOne() : await NftDraw.mintTwo()
    console.log('NftDraw:', res)
    setPlayBindBoxModalVisible(false)
    setBlindBoxModalVisible(true)
  }
  const closeBlindBoxModal = () => {
    setBlindBoxModalVisible(false)
  }
  const closeJumpModal = () => {
    setJumpModalVisible(false)
  }
  const closePlayBindBoxModal = () => {
    setPlayBindBoxModalVisible(false)
  }

  return (<BondPageWrap>
    <DrawBlindBoxList>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <DrawBlindBoxItem className='item1'>
            <DrawBlindBoxImgWrap className='item1'>
              <BoxLeftAskImg src="/images/mint/orangeLeftAsk.png" />
              <BoxRightAskImg src="/images/mint/orangeRightAsk.png" />
            </DrawBlindBoxImgWrap>
            <ContentWrap>
              <DalaCardList>
                <DalaCardListTitle>{t('Premier Mystery Boxes')}</DalaCardListTitle>
                <DataCell label={t('Price')} value={`${seniorPrice} DFS`} valueDivStyle={{ fontSize: "14px" }} position="horizontal" />
                <DataCell label={t('Description')} value={t('Acquire any of the 2 types of NFT cards')} valueDivStyle={{ fontSize: "14px", textAlign: "right" }} position="horizontal" />
                <DalaCardCellWrap>
                  <DalaCardLabelDiv>{t('Rewards probability')}</DalaCardLabelDiv>
                  <DalaCardValueDiv>
                    <ColorFont style={{ color: '#FF7056' }}> 98% </ColorFont>{t('Wiseman')}
                    {isMobile ? <br /> : null}
                    <ColorFont style={{ color: '#FF7056' }}> 2% </ColorFont>{t('General Aureate')}
                  </DalaCardValueDiv>
                </DalaCardCellWrap>
              </DalaCardList>
              <AvailableCount>{t('Balance')}: {balance}DFS</AvailableCount>
              <ActionWrap>
                <ActionLeft>
                  <DrawBlindBoxTextBtn className='orangeBtn' onClick={() => { if (seniorCount > 1) setSeniorCount(seniorCount - 1) }}>-</DrawBlindBoxTextBtn>
                  <CountInput value={seniorCount} isMobile={isMobile} min={1} controls={false} onChange={val => setSeniorCount(Number(val))} />
                  <DrawBlindBoxTextBtn className='orangeBtn' onClick={() => { if (seniorCount < maxSenior) setSeniorCount(seniorCount + 1) }}>+</DrawBlindBoxTextBtn>
                  <DrawBlindBoxTextBtn className='orangeBtn' onClick={() => { setSeniorCount(maxSenior) }}>{t('Max')}</DrawBlindBoxTextBtn>
                </ActionLeft>
                <ActionRight>
                  <DrawBlindBoxPrimaryBtn className='orangeBtn' style={{ width: '80px' }}>{t('Approve')}</DrawBlindBoxPrimaryBtn>
                </ActionRight>
              </ActionWrap>
              <DrawBlindBoxPrimaryBtn className='orangeBtn' onClick={() => drawBlind('senior')}>{t('Play')}</DrawBlindBoxPrimaryBtn>
            </ContentWrap>
          </DrawBlindBoxItem>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <DrawBlindBoxItem className='item2'>
            <DrawBlindBoxImgWrap className='item2'>
              <BoxLeftAskImg src="/images/mint/purpleLeftAsk.png" />
              <BoxRightAskImg src="/images/mint/purpleRightAsk.png" />
            </DrawBlindBoxImgWrap>
            <ContentWrap>
              <DalaCardList>
                <DalaCardListTitle>{t('Deluxe Mystery Boxes')}</DalaCardListTitle>
                <DataCell label={t('Price')} value={`${ordinaryPrice} DFS`} valueDivStyle={{ fontSize: "14px" }} position="horizontal" />
                <DataCell label={t('Description')} value={t('Acquire any of the 2 types of NFT cards')} valueDivStyle={{ fontSize: "14px", textAlign: "right" }} position="horizontal" />
                <DalaCardCellWrap>
                  <DalaCardLabelDiv>{t('Rewards probability')}</DalaCardLabelDiv>
                  <DalaCardValueDiv>
                    <ColorFont style={{ color: '#EC6EFF' }}> 98% </ColorFont>{t('Wiseman Silver')}
                    {isMobile ? <br /> : null}
                    <ColorFont style={{ color: '#EC6EFF' }}> 2% </ColorFont>{t('Wiseman NFT')}
                  </DalaCardValueDiv>
                </DalaCardCellWrap>
              </DalaCardList>
              <AvailableCount>{t('Balance')}: {balance}DFS</AvailableCount>
              <ActionWrap>
                <ActionLeft>
                  <DrawBlindBoxTextBtn className='purpleBtn' onClick={() => { if (ordinaryCount > 1) setOrdinaryCount(ordinaryCount - 1) }}>-</DrawBlindBoxTextBtn>
                  <CountInput value={ordinaryCount} isMobile={isMobile} min={1} controls={false} onChange={val => setOrdinaryCount(Number(val))} />
                  <DrawBlindBoxTextBtn className='purpleBtn' onClick={() => { if (ordinaryCount < maxOrdinary) setOrdinaryCount(ordinaryCount + 1) }}>+</DrawBlindBoxTextBtn>
                  <DrawBlindBoxTextBtn className='purpleBtn' onClick={() => { setOrdinaryCount(maxOrdinary) }}>{t('Max')}</DrawBlindBoxTextBtn>
                </ActionLeft>
                <ActionRight>
                  <DrawBlindBoxPrimaryBtn className='purpleBtn' style={{ width: '80px' }}>{t('Approve')}</DrawBlindBoxPrimaryBtn>
                </ActionRight>
              </ActionWrap>
              <DrawBlindBoxPrimaryBtn className='purpleBtn' onClick={() => drawBlind('ordinary')}>{t('Play')}</DrawBlindBoxPrimaryBtn>
            </ContentWrap>
          </DrawBlindBoxItem>
        </Grid>
      </Grid>
    </DrawBlindBoxList>
    {/* 盲盒加载中的弹窗 */}
    {
      playBindBoxModalVisible ? <PlayBindBoxModal onClose={closePlayBindBoxModal} gifUrl={gifUrl} />
        : null
    }

    {/* 盲盒成功的弹窗 */}
    {
      blindBoxModalVisible ? <BlindBoxModal data={mintDatasMock} onClose={closeBlindBoxModal} />
        : null
    }
    {/* 跳转选项的弹窗 */}
    {
      jumpModalVisible ? <JumpModal onClose={closeJumpModal} />
        : null
    }
  </BondPageWrap>)
}
export default Mint;