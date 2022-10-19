/* eslint-disable no-param-reassign */
import { FC, useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useBondContract, useDFSNftContract, useERC20, useNFTMintContract, useTokenContract } from 'hooks/useContract'
import { getDFSAddress, getNftMintAddress } from 'utils/addressHelpers'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useWallet } from 'hooks/useWallet'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatBigNumber } from 'utils/formatBalance'
import {
  BondPageWrap,
  DrawBlindBoxList,
  DrawBlindBoxItem,
  DrawBlindBoxImgWrap,
  BoxLeftAskImg,
  BoxRightAskImg,
  ContentWrap,
  DalaCardList,
  DalaCardListTitle,
  DalaCardCellWrap,
  DalaCardLabelDiv,
  DalaCardValueDiv,
  ColorFont,
  AvailableCount,
  ActionWrap,
  ActionLeft,
  ActionRight,
  CountInput,
  DrawBlindBoxTextBtn,
  DrawBlindBoxPrimaryBtn,
  UnWithdrawCount,
  CountWrap,
} from './style'
import DataCell from '../../components/ListDataCell'
import MintBoxModal from './components/MintBoxModal'
import JumpModal from './components/JumpModal'
import PlayBindBoxModal from './components/PlayMintBoxModal'

const Mint = () => {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { onPresentConnectModal } = useWallet()
  const [mintBoxModalVisible, setBlindBoxModalVisible] = useState<boolean>(false)
  const [jumpModalVisible, setJumpModalVisible] = useState<boolean>(false)
  const [playMintBoxModalVisible, setPlayBindBoxModalVisible] = useState<boolean>(false)
  const [gifUrl, setGifUrl] = useState<string>('/images/mint/ordinary.gif')
  const [seniorCount, setSeniorCount] = useState<number>(1)
  const [maxSenior, setMaxSenior] = useState<BigNumber>(BigNumber.from(1))
  const [ordinaryCount, setOrdinaryCount] = useState<number>(1)
  const [maxOrdinary, setMaxOrdinary] = useState<BigNumber>(BigNumber.from(1))
  const [mintNFTData, setMintNFTData] = useState<any>([])
  const nftMintAddress = getNftMintAddress()
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const [pendingPayout, setPendingPayout] = useState('')

  const dfsAddress = getDFSAddress()
  const DFS = useERC20(dfsAddress)

  const ordinaryPrice = BigNumber.from(10).pow(18).mul(10)
  const seniorPrice = BigNumber.from(10).pow(18).mul(60)
  const NFTMint = useNFTMintContract()
  const bond = useBondContract()

  useEffect(() => {
    if (account) {
      bond.bondInfo(account).then((res) => setPendingPayout(formatBigNumber(res[0], 2)))
      DFS.balanceOf(account)
        .then((res) => {
          if (!res.eq(balance)) {
            setBalance(res)
          }
        })
        .catch((error) => {
          console.log(error)
        })
      DFS.allowance(account, nftMintAddress)
        .then((res) => {
          if (!res.eq(allowance)) setAllowance(res)
        })
        .catch((error) => {
          console.log(error)
        })

      const maxOrd = balance.div(ordinaryPrice)
      const maxSen = balance.div(seniorPrice)
      setMaxOrdinary(maxOrd)
      setMaxSenior(maxSen)
    }
  }, [account, balance])

  const dfsNFT = useDFSNftContract()
  const mint = async (type: string, useBond = false) => {
    if (!account) {
      onPresentConnectModal()
      return
    }
    if (
      (type === 'senior' && balance.lt(seniorPrice.mul(seniorCount))) ||
      (type === 'ordinary' && balance.lt(ordinaryPrice.mul(ordinaryCount)))
    ) {
      setJumpModalVisible(true)
      return
    }
    setGifUrl(`/images/mint/${type}.gif`)
    setPlayBindBoxModalVisible(true)

    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const res =
        type === 'ordinary'
          ? await NFTMint.mintOne(ordinaryCount, useBond)
          : await NFTMint.mintTwo(seniorCount, useBond)
      const recipient = await res.wait()
      const { logs } = recipient
      // eslint-disable-next-line prefer-const
      let levelTokenIds = {}
      for (let i = 1; i <= logs.length; i++) {
        if (i % 2 === 0) {
          const id = BigNumber.from(logs[i - 1].topics[3])
          const tokenId = id.toString()
          // eslint-disable-next-line no-await-in-loop
          const level = await dfsNFT.getItems(tokenId)
          if (!levelTokenIds[level]) levelTokenIds[level] = []
          levelTokenIds[level].push(tokenId)
        }
      }
      const data = Object.keys(levelTokenIds).map((level) => {
        const data = { id: level, level, tokenIds: levelTokenIds[level] }
        return data
      })
      console.log(data)
      setMintNFTData(data)
      setPlayBindBoxModalVisible(false)
      setBlindBoxModalVisible(true)
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
      setPlayBindBoxModalVisible(false)
    }
  }

  const closeBlindBoxModal = () => {
    setBlindBoxModalVisible(false)
    setMintNFTData([])
  }
  const closeJumpModal = () => {
    setJumpModalVisible(false)
  }
  const closePlayBindBoxModal = () => {
    setPlayBindBoxModalVisible(false)
  }
  return (
    <BondPageWrap>
      <DrawBlindBoxList>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <DrawBlindBoxItem className="item1">
              <DrawBlindBoxImgWrap className="item1">
                <BoxLeftAskImg src="/images/mint/orangeLeftAsk.png" />
                <BoxRightAskImg src="/images/mint/orangeRightAsk.png" />
              </DrawBlindBoxImgWrap>
              <ContentWrap>
                <DalaCardList>
                  <DalaCardListTitle>{t('Advanced Mint')}</DalaCardListTitle>
                  <DataCell
                    label={t('Price')}
                    value={`${formatUnits(seniorPrice, 'ether')} DFS`}
                    valueDivStyle={{ fontSize: '14px' }}
                    position="horizontal"
                  />
                  <DataCell
                    label={t('Description')}
                    value={t('Acquire any of the 2 types of NFT cards')}
                    valueDivStyle={{ fontSize: '14px', textAlign: 'right' }}
                    position="horizontal"
                  />
                  <DalaCardCellWrap>
                    <DalaCardLabelDiv>{t('Rewards probability')}</DalaCardLabelDiv>
                    <DalaCardValueDiv>
                      <ColorFont style={{ color: '#FF7056' }}> 98% </ColorFont>
                      {t('Wiseman')}
                      {isMobile ? <br /> : null}
                      <ColorFont style={{ color: '#FF7056' }}> 2% </ColorFont>
                      {t('General Aureate')}
                    </DalaCardValueDiv>
                  </DalaCardCellWrap>
                </DalaCardList>
                <CountWrap>
                  <AvailableCount>
                    {t('Balance')}: {balance ? formatBigNumber(balance, 2) : 0} DFS
                  </AvailableCount>
                  <UnWithdrawCount>
                    {t('Payout')}: {pendingPayout ?? 0} DFS
                  </UnWithdrawCount>
                </CountWrap>
                <ActionWrap>
                  <ActionLeft>
                    <DrawBlindBoxTextBtn
                      className="orangeBtn"
                      onClick={() => {
                        if (seniorCount > 1) setSeniorCount(seniorCount - 1)
                      }}
                    >
                      -
                    </DrawBlindBoxTextBtn>
                    <CountInput
                      value={seniorCount}
                      ismobile={isMobile.toString()}
                      min={1}
                      controls={false}
                      onChange={(val) => setSeniorCount(Number(val))}
                    />
                    <DrawBlindBoxTextBtn
                      className="orangeBtn"
                      onClick={() => {
                        if (seniorCount < maxSenior.toNumber()) setSeniorCount(seniorCount + 1)
                      }}
                    >
                      +
                    </DrawBlindBoxTextBtn>
                    <DrawBlindBoxTextBtn
                      className="orangeBtn"
                      onClick={() => {
                        setSeniorCount(maxSenior.toNumber())
                      }}
                    >
                      {t('Max')}
                    </DrawBlindBoxTextBtn>
                  </ActionLeft>
                  {/* <ActionRight>
                    {allowance.eq(0) ? (
                      <DrawBlindBoxPrimaryBtn
                        className="orangeBtn"
                        style={{ width: '80px' }}
                        onClick={async () => {
                          await DFS.approve(nftMintAddress, MaxUint256)
                        }}
                      >
                        {t('Approve')}
                      </DrawBlindBoxPrimaryBtn>
                    ) : (
                      <></>
                    )}
                  </ActionRight> */}
                </ActionWrap>
                <DrawBlindBoxPrimaryBtn
                  className="orangeBtn"
                  onClick={async () => {
                    if (allowance.eq(0)) {
                      const receipt = await DFS.approve(nftMintAddress, MaxUint256)
                      await receipt.wait()
                    }
                    mint('senior')
                  }}
                >
                  {t('Balance Mint')}
                </DrawBlindBoxPrimaryBtn>
                <DrawBlindBoxPrimaryBtn
                  className="orangeBtn"
                  onClick={() => mint('senior', true)}
                  style={{ marginTop: '20px' }}
                >
                  {t('Payout Mint')}
                </DrawBlindBoxPrimaryBtn>
              </ContentWrap>
            </DrawBlindBoxItem>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <DrawBlindBoxItem className="item2">
              <DrawBlindBoxImgWrap className="item2">
                <BoxLeftAskImg src="/images/mint/purpleLeftAsk.png" />
                <BoxRightAskImg src="/images/mint/purpleRightAsk.png" />
              </DrawBlindBoxImgWrap>
              <ContentWrap>
                <DalaCardList>
                  <DalaCardListTitle>{t('Basic Mint')}</DalaCardListTitle>
                  <DataCell
                    label={t('Price')}
                    value={`${formatBigNumber(ordinaryPrice, 2)} DFS`}
                    valueDivStyle={{ fontSize: '14px' }}
                    position="horizontal"
                  />
                  <DataCell
                    label={t('Description')}
                    value={t('Acquire any of the 2 types of NFT cards')}
                    valueDivStyle={{ fontSize: '14px', textAlign: 'right' }}
                    position="horizontal"
                  />
                  <DalaCardCellWrap>
                    <DalaCardLabelDiv>{t('Rewards probability')}</DalaCardLabelDiv>
                    <DalaCardValueDiv>
                      <ColorFont style={{ color: '#EC6EFF' }}> 98% </ColorFont>
                      {t('Wiseman Silver')}
                      {isMobile ? <br /> : null}
                      <ColorFont style={{ color: '#EC6EFF' }}> 2% </ColorFont>
                      {t('Wiseman NFT')}
                    </DalaCardValueDiv>
                  </DalaCardCellWrap>
                </DalaCardList>
                <CountWrap>
                  <AvailableCount>
                    {t('Balance')}: {balance ? formatBigNumber(balance, 2) : 0} DFS
                  </AvailableCount>
                  <UnWithdrawCount>
                    {t('Payout')}: {pendingPayout ?? 0} DFS
                  </UnWithdrawCount>
                </CountWrap>
                <ActionWrap>
                  <ActionLeft>
                    <DrawBlindBoxTextBtn
                      className="purpleBtn"
                      onClick={() => {
                        if (ordinaryCount > 1) setOrdinaryCount(ordinaryCount - 1)
                      }}
                    >
                      -
                    </DrawBlindBoxTextBtn>
                    <CountInput
                      value={ordinaryCount}
                      ismobile={isMobile.toString()}
                      min={1}
                      controls={false}
                      onChange={(val) => setOrdinaryCount(Number(val))}
                    />
                    <DrawBlindBoxTextBtn
                      className="purpleBtn"
                      onClick={() => {
                        if (ordinaryCount < maxOrdinary.toNumber()) setOrdinaryCount(ordinaryCount + 1)
                      }}
                    >
                      +
                    </DrawBlindBoxTextBtn>
                    <DrawBlindBoxTextBtn
                      className="purpleBtn"
                      onClick={() => {
                        setOrdinaryCount(maxOrdinary.toNumber())
                      }}
                    >
                      {t('Max')}
                    </DrawBlindBoxTextBtn>
                  </ActionLeft>
                  {/* <ActionRight>
                    {allowance.eq(0) ? (
                      <DrawBlindBoxPrimaryBtn
                        className="purpleBtn"
                        onClick={async () => {
                          await DFS.approve(nftMintAddress, MaxUint256)
                        }}
                        style={{ width: '80px' }}
                      >
                        {t('Approve')}
                      </DrawBlindBoxPrimaryBtn>
                    ) : (
                      <></>
                    )}
                  </ActionRight> */}
                </ActionWrap>
                <DrawBlindBoxPrimaryBtn
                  className="purpleBtn"
                  onClick={async () => {
                    if (allowance.eq(0)) {
                      const receipt = await DFS.approve(nftMintAddress, MaxUint256)
                      await receipt.wait()
                    }
                    mint('ordinary')
                  }}
                >
                  {t('Balance Mint')}
                </DrawBlindBoxPrimaryBtn>
                <DrawBlindBoxPrimaryBtn
                  className="purpleBtn"
                  onClick={async () => {
                    mint('ordinary', true)
                  }}
                  style={{ marginTop: '20px' }}
                >
                  {t('Payout Mint')}
                </DrawBlindBoxPrimaryBtn>
              </ContentWrap>
            </DrawBlindBoxItem>
          </Grid>
        </Grid>
      </DrawBlindBoxList>
      {playMintBoxModalVisible ? <PlayBindBoxModal onClose={closePlayBindBoxModal} gifUrl={gifUrl} /> : null}
      {mintBoxModalVisible ? <MintBoxModal data={mintNFTData} onClose={closeBlindBoxModal} /> : null}
      {jumpModalVisible ? <JumpModal onClose={closeJumpModal} /> : null}
    </BondPageWrap>
  )
}
export default Mint
