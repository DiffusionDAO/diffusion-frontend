/* eslint-disable no-param-reassign */
import { FC, useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useBondContract, useDFSNftContract, useERC20, useNftDrawContract, useTokenContract } from 'hooks/useContract'
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
import BlindBoxModal from './components/BlindBoxModal'
import JumpModal from './components/JumpModal'
import PlayBindBoxModal from './components/PlayBindBoxModal'

const Mint = () => {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { onPresentConnectModal } = useWallet()
  const [blindBoxModalVisible, setBlindBoxModalVisible] = useState<boolean>(false)
  const [jumpModalVisible, setJumpModalVisible] = useState<boolean>(false)
  const [playBindBoxModalVisible, setPlayBindBoxModalVisible] = useState<boolean>(false)
  const [gifUrl, setGifUrl] = useState<string>('/images/mint/ordinary.gif')
  const [seniorCount, setSeniorCount] = useState<number>(1)
  const [maxSenior, setMaxSenior] = useState<BigNumber>(BigNumber.from(1))
  const [ordinaryCount, setOrdinaryCount] = useState<number>(1)
  const [maxOrdinary, setMaxOrdinary] = useState<BigNumber>(BigNumber.from(1))
  const [drawBindData, setDrawBindData] = useState<any>([])
  const nftMintAddress = getNftMintAddress()
  const [balance, setBalance] = useState(BigNumber.from(0))
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const [pendingPayout, setPendingPayout] = useState('')

  const dfsAddress = getDFSAddress()
  const tokenContract = useERC20(dfsAddress)

  const ordinaryPrice = BigNumber.from(10).pow(18).mul(10)
  const seniorPrice = BigNumber.from(10).pow(18).mul(60)
  const NftDraw = useNftDrawContract()
  const bond = useBondContract()

  useEffect(() => {
    if (account) {
      bond.bondInfo(account).then((res) => setPendingPayout(formatBigNumber(res[0], 2)))
      tokenContract.balanceOf(account).then((res) => {
        if (!res.eq(balance)) {
          setBalance(res)
        }
      })
      tokenContract.allowance(account, nftMintAddress).then((res) => {
        if (!res.eq(allowance)) setAllowance(res)
      })
      const maxOrd = balance.div(ordinaryPrice)
      const maxSen = balance.div(seniorPrice)
      setMaxOrdinary(maxOrd)
      setMaxSenior(maxSen)
    }
  }, [account, balance])

  const dfsNFT = useDFSNftContract()
  const DFS = useERC20(getDFSAddress())
  const mint = async (type: string, useVestingBond = true) => {
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
      if (useVestingBond) {
        const receipt = await bond.redeem(account)
        await receipt.wait()
        const pending = await bond.pendingPayoutFor(account)
        setPendingPayout(formatBigNumber(pending, 2))
      }
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const res = type === 'ordinary' ? await NftDraw.mintOne(ordinaryCount) : await NftDraw.mintTwo(seniorCount)
      const recipient = await res.wait()
      const { events } = recipient
      const levels = []

      for (let i = 1; i <= events.length; i++) {
        if (i % 3 === 0) {
          const id = BigNumber.from(events[i - 1].topics[3])
          const tokenId = id.toString()
          // eslint-disable-next-line no-await-in-loop
          const level = await dfsNFT.getItems(tokenId)
          levels.push(level.toString())
        }
      }
      setDrawBindData(formatLevel(levels))
      setPlayBindBoxModalVisible(false)
      setBlindBoxModalVisible(true)
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
      setPlayBindBoxModalVisible(false)
    }
  }
  const formatLevel = (data) => {
    const objItem = data.reduce((allNames: any, name: any) => {
      if (name in allNames) {
        allNames[name]++
      } else {
        allNames[name] = 1
      }
      return allNames
    }, {})
    const newData = []
    Object.keys(objItem).forEach((key) => {
      newData.push({
        id: key,
        type: key,
        count: objItem[key],
      })
    })
    return newData
  }
  const closeBlindBoxModal = () => {
    setBlindBoxModalVisible(false)
    setDrawBindData([])
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
                      isMobile={isMobile}
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
                  <ActionRight>
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
                  </ActionRight>
                </ActionWrap>
                <DrawBlindBoxPrimaryBtn className="orangeBtn" onClick={() => mint('senior', false)}>
                  {t('Balance Mint')}
                </DrawBlindBoxPrimaryBtn>
                <DrawBlindBoxPrimaryBtn
                  className="orangeBtn"
                  onClick={() => mint('senior')}
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
                      isMobile={isMobile}
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
                  <ActionRight>
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
                  </ActionRight>
                </ActionWrap>
                <DrawBlindBoxPrimaryBtn className="purpleBtn" onClick={() => mint('ordinary', false)}>
                  {t('Balance Mint')}
                </DrawBlindBoxPrimaryBtn>
                <DrawBlindBoxPrimaryBtn
                  className="purpleBtn"
                  onClick={() => mint('ordinary')}
                  style={{ marginTop: '20px' }}
                >
                  {t('Payout Mint')}
                </DrawBlindBoxPrimaryBtn>
              </ContentWrap>
            </DrawBlindBoxItem>
          </Grid>
        </Grid>
      </DrawBlindBoxList>
      {/* 铸造加载中的弹窗 */}
      {playBindBoxModalVisible ? <PlayBindBoxModal onClose={closePlayBindBoxModal} gifUrl={gifUrl} /> : null}

      {/* 铸造成功的弹窗 */}
      {blindBoxModalVisible ? <BlindBoxModal data={drawBindData} onClose={closeBlindBoxModal} /> : null}
      {/* 跳转选项的弹窗 */}
      {jumpModalVisible ? <JumpModal onClose={closeJumpModal} /> : null}
    </BondPageWrap>
  )
}
export default Mint
