import { FC, useEffect, useState } from 'react'
import Typed from 'react-typed'
import { Grid } from '@material-ui/core'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { getUSDTAddress, getMiningAddress, getDFSAddress, getPairAddress } from 'utils/addressHelpers'
import { MaxUint256 } from '@ethersproject/constants'
import { useBondContract, useDFSContract, useDFSMiningContract, useERC20, usePairContract } from 'hooks/useContract'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'
import { useRouterContract } from 'utils/exchange'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import useSWR from 'swr'

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
import bondDatas from './bondData'
import BondModal from './components/BondModal'
import SettingModal from './components/SettingModal'

const Bond = () => {
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [bondData, setBondData] = useState<any[]>(bondDatas)
  const [bondModalVisible, setBondModalVisible] = useState<boolean>(false)
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false)

  const [usdtAmount, setUsdtAmount] = useState<BigNumber>(BigNumber.from(0))
  const [isApprove, setIsApprove] = useState<boolean>(false)
  const [bondItem, setBondItem] = useState<any>(null)
  const [dfsTotalSupply, setDfsTotalSupply] = useState<number>()
  const [marketPrice, setMarketPrice] = useState<string>()
  const bond = useBondContract()
  const miningAddress = getMiningAddress()
  const dfs = useDFSContract()
  const usdtAddress = getUSDTAddress()
  const usdt = useERC20(usdtAddress, true)
  const pairAddress = getPairAddress()
  const pair = usePairContract(pairAddress)
  const dfsContract = useDFSContract()
  const pancakeRouter = useRouterContract()
  const dfsAddress = getDFSAddress()

  const { data, status } = useSWR('dfsBond', async () => {
    const price = await bond.getPriceInUSDT()
    bondDatas[0].price = formatBigNumber(price, 9)

    const [reserve0, reserve1] = await pair.getReserves()
    const [numerator, denominator] =
      usdtAddress.toLowerCase() < dfsAddress.toLowerCase() ? [reserve0, reserve1] : [reserve1, reserve0]
    const marketPrice = parseFloat(formatUnits(numerator, 18)) / parseFloat(formatUnits(denominator, 18))
    setUsdtAmount(numerator)
    setMarketPrice(marketPrice.toFixed(5))
  })

  useEffect(() => {
    bond.discount().then((res) => {
      bondDatas[0].discount = 100 - res
    })
  }, [account])

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
    usdt
      .approve(pancakeRouter.address, MaxUint256)
      .then((receipt) =>
        dfsContract
          .approve(pancakeRouter.address, MaxUint256)
          .then((res) => res.wait().then((res) => setIsApprove(true))),
      )
  }
  useEffect(() => {
    if (account) {
      usdt.allowance(account, pancakeRouter.address).then((res) => {
        if (res.gt(0)) {
          setIsApprove(true)
        }
      })
    }
  }, [account])
  useEffect(() => {
    const dfsUsdt = bondDatas[0]
    // eslint-disable-next-line no-return-assign, no-param-reassign
    bond
      .terms()
      .then((res) => {
        dfsUsdt.duration = res.vestingTerm / (24 * 3600)
      })
      .catch((error) => {
        console.log(error.reason ?? error.data?.message ?? error.message)
      })
    setBondData([dfsUsdt, ...bondDatas.slice(1)])
    dfsContract
      .totalSupply()
      .then((res) => setDfsTotalSupply(res * parseFloat(marketPrice)))
      .catch((error) => {
        console.log(error.reason ?? error.data?.message ?? error.message)
      })
  }, [account, marketPrice])
  return (
    <BondPageWrap>
      <BondPageHeader>
        <SculptureWrap src="/images/bond/bondSculpture.png" isMobile={isMobile} />
        <HeaderTitle>
          <Typed strings={[t('Bonds')]} typeSpeed={50} cursorChar="" />
        </HeaderTitle>
        {!isMobile && (
          <HeaderDes>
            {t(
              'Sales of bonds is the only way for DFS to be minted, through the sales of bonds to accumulate large asset volume, the central financial agreement will have but not limited to USDT, ETH, BNB and equivalent type of assets. This type of asset will become the core foundation supporting the value of DFS.',
            )}
          </HeaderDes>
        )}
      </BondPageHeader>

      <OverviewWrap>
        <OverviewCard isMobile={isMobile}>
          <OverviewCardItem>
            <OverviewCardItemTitle>{t('Central Financial Agreement Assets')}</OverviewCardItemTitle>
            <OverviewCardItemContent isMobile={isMobile}>
              ${parseFloat(formatBigNumber(usdtAmount, 5)) * 2}
            </OverviewCardItemContent>
          </OverviewCardItem>
          <OverviewCardItem>
            <OverviewCardItemTitle>{t('Price of DFS')}</OverviewCardItemTitle>
            <OverviewCardItemContent isMobile={isMobile}>${marketPrice}</OverviewCardItemContent>
          </OverviewCardItem>
        </OverviewCard>
        {isMobile ? (
          <>
            {/* <OverviewPromptLine style={{ width: 'calc(50% - 25px)' }} />
              <OverviewPromptTitle>{t('Reminder')}</OverviewPromptTitle>
              <OverviewPromptLine style={{ width: 'calc(50% - 25px)' }} /> */}
          </>
        ) : (
          <OverviewPromptWrap>
            <OverviewPromptTitle>{t('Reminder')}</OverviewPromptTitle>
            <OverviewPromptLine style={{ width: 'calc(100% - 50px)' }} />
          </OverviewPromptWrap>
        )}

        {!isMobile && (
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
        )}
      </OverviewWrap>

      <Grid container spacing={2}>
        {bondData.map((item) => (
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
                    <TextColor isRise={item.discount > 0}>{formatNumber(item.discount, 2)}%</TextColor>
                  </CellText>
                </ContentCell>
                <ContentCell isMobile={isMobile}>
                  <CellTitle>{t('Duration')}</CellTitle>
                  <CellText>{item.duration} days</CellText>
                </ContentCell>
              </BondListItemContent>
              {item.status === 'opened' ? (
                <BondListItemBtn onClick={() => openBondModal(item)}>{t('Bonds')}</BondListItemBtn>
              ) : (
                <BondListItemBtnClosed>{t('Not opened')}</BondListItemBtnClosed>
              )}
            </BondListItem>
          </Grid>
        ))}
      </Grid>
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
      {settingModalVisible ? <SettingModal account={account} bondData={bondItem} onClose={closeSettingModal} /> : null}
    </BondPageWrap>
  )
}
export default Bond
