import { FC, useState } from 'react'
import { useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { Grid } from "@material-ui/core";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import nftDatasMock from 'views/Nft/market/Profile/MockNftDatas';
import { BondPageWrap, DrawBlindBoxList, DrawBlindBoxItem, DrawBlindBoxImgWrap, BoxLeftAskImg, BoxRightAskImg, ContentWrap, DalaCardList, DalaCardListTitle, 
  DalaCardCellWrap, DalaCardLabelDiv, DalaCardValueDiv, ColorFont,
  AvailableCount, ActionWrap, ActionLeft, ActionRight, CountInput, DrawBlindBoxTextBtn, DrawBlindBoxPrimaryBtn } from './style'
import DataCell from "../../components/ListDataCell"
import BlindBoxModal from './components/BlindBoxModal'
import JumpModal from './components/JumpModal'
import PlayBindBoxModal from './components/PlayBindBoxModal'
import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks";
import { useTokenContract } from 'hooks/useContract';
import BigNumber from 'bignumber.js';
import { useSWRContract } from 'hooks/useSWRContract';

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
  const [balance,setBalance] = useState<BigNumber>(new BigNumber(0));
  const [seniorCount, setSeniorCount] = useState<number>(1);
  const [maxSenior, setMaxSenior] = useState<number>(10);
  const [ordinaryCount, setOrdinaryCount] = useState<number>(1);
  const [maxOrdinary, setMaxOrdinary] = useState<number>(10);
  const tokenContract = useTokenContract("0xd49f9D8F0aB1C2F056e1F0232d5b9989F8a12CeF")
  console.log("account:",account)
  const {data} = useSWRContract([tokenContract, 'balanceOf', [account]])
  console.log(data)
  // setBalance(data)
  const drawBlind = (type: string) => {
    if (!account) {
      onPresentConnectModal()
      return
    }
    if (balance.toNumber() <= 0) {
      setJumpModalVisible(true)
      return
    }
    setPlayBindBoxModalVisible(true)
    setGifUrl(`/images/mint/${type}.gif`)
    setTimeout(() =>{
      setPlayBindBoxModalVisible(false)
      setBlindBoxModalVisible(true)
    }, 3000)

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
                <DataCell label={t('Price')} value='60 DFS' valueDivStyle={{ fontSize: "14px" }} position="horizontal"/>
                <DataCell label={t('Description')} value={t('Acquire any of the 2 types of NFT cards')} valueDivStyle={{ fontSize: "14px", textAlign: "right" }} position="horizontal"/>
                <DalaCardCellWrap>
                  <DalaCardLabelDiv>{t('Rewards probability')}</DalaCardLabelDiv>
                  <DalaCardValueDiv>
                    <ColorFont style={{color:'#FF7056'}}> 98% </ColorFont>{t('Wiseman')}
                    { isMobile ? <br/> : null}
                    <ColorFont style={{color:'#FF7056'}}> 2% </ColorFont>{t('General Aureate')}
                  </DalaCardValueDiv>
                </DalaCardCellWrap>
              </DalaCardList>
              <AvailableCount>{t('Balance')}: {balance}DFS</AvailableCount>
              <ActionWrap>
                <ActionLeft>
                  <DrawBlindBoxTextBtn className='orangeBtn' onClick={() => {if(seniorCount>0)setSeniorCount(seniorCount-1)}}>-</DrawBlindBoxTextBtn>
                  <CountInput value={seniorCount} isMobile={isMobile} onChange={e => setSeniorCount(parseInt(e.target.value))}/>
                  <DrawBlindBoxTextBtn className='orangeBtn' onClick={() => {if(seniorCount<maxSenior)setSeniorCount(seniorCount+1)}}>+</DrawBlindBoxTextBtn>
                  <DrawBlindBoxTextBtn className='orangeBtn' onClick={() => {setSeniorCount(maxSenior)}}>{t('Max')}</DrawBlindBoxTextBtn>
                </ActionLeft>
                <ActionRight>
                  <DrawBlindBoxPrimaryBtn className='orangeBtn' style={{ width: '80px'}}>{t('Approve')}</DrawBlindBoxPrimaryBtn>
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
                <DataCell label={t('Price')} value='10 DFS' valueDivStyle={{ fontSize: "14px" }} position="horizontal"/>
                <DataCell label={t('Description')} value={t('Acquire any of the 2 types of NFT cards')} valueDivStyle={{ fontSize: "14px", textAlign: "right" }} position="horizontal"/>
                <DalaCardCellWrap>
                  <DalaCardLabelDiv>{t('Rewards probability')}</DalaCardLabelDiv>
                  <DalaCardValueDiv>
                    <ColorFont style={{color: '#EC6EFF'}}> 98% </ColorFont>{t('Wiseman Silver')}
                    { isMobile ? <br/> : null}
                    <ColorFont style={{color: '#EC6EFF'}}> 2% </ColorFont>{t('Wiseman NFT')}
                  </DalaCardValueDiv>
                </DalaCardCellWrap>
              </DalaCardList>
              <AvailableCount>{t('Balance')}: {maxOrdinary}DFS</AvailableCount>
              <ActionWrap>
                <ActionLeft>
                  <DrawBlindBoxTextBtn className='purpleBtn' onClick={() => {if(ordinaryCount>0)setOrdinaryCount(ordinaryCount-1)}}>-</DrawBlindBoxTextBtn>
                  <CountInput value={ordinaryCount} isMobile={isMobile} onChange={e => setOrdinaryCount(parseInt(e.target.value))} />
                  <DrawBlindBoxTextBtn className='purpleBtn' onClick={() => {if(ordinaryCount<maxOrdinary)setOrdinaryCount(ordinaryCount+1)}}>+</DrawBlindBoxTextBtn>
                  <DrawBlindBoxTextBtn className='purpleBtn'onClick={() => {setOrdinaryCount(maxOrdinary)}}>{t('Max')}</DrawBlindBoxTextBtn>
                </ActionLeft>
                <ActionRight>
                  <DrawBlindBoxPrimaryBtn className='purpleBtn' style={{ width: '80px'}}>{t('Approve')}</DrawBlindBoxPrimaryBtn>
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
export default Mint;