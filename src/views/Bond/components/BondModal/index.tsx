import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { CloseIcon, CogIcon, InfoIcon, useWalletModal } from '@pancakeswap/uikit'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { parseUnits } from '@ethersproject/units'
import { useWallet } from 'hooks/useWallet'
import { useDFSContract, useDFSMineContract, useERC20, usePairContract, usePDFSContract } from 'hooks/useContract'
import { BigNumber, ethers } from 'ethers'
import { USDT } from '@pancakeswap/tokens'
import { MaxUint256 } from '@ethersproject/constants'
import { getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { useSigner } from 'wagmi'
import { useRouterContract } from 'utils/exchange'
import { formatBigNumber, formatNumber } from 'utils/formatBalance'

import {
  StyledModal,
  ContentWrap,
  HeaderWrap,
  BondListItem,
  BondListItemHeader,
  BondListItemContent,
  ContentCell,
  CellTitle,
  CellText,
  TextColor,
  ImgWrap,
  FromImg,
  ToImg,
  BondName,
  BondTime,
  TipsWrap,
  TipsText,
  BondListItemBtn,
  ListItem,
  ListLable,
  ListContent,
  TabList,
  TabItem,
  MoneyLable,
  MoneyInput,
  RecommandWrap,
  CheckBoxWrap,
  CheckBox,
  RecommandLable,
  RecommandInput,
} from './styles'

const { confirm } = Modal

interface BondModalProps {
  bondData: any
  isApprove: boolean
  account: string
  getApprove: () => void
  onClose: () => void
  openSettingModal: () => void
}

const BondModal: React.FC<BondModalProps> = ({
  bondData,
  isApprove,
  account,
  getApprove,
  onClose,
  openSettingModal,
}) => {
  const { t } = useTranslation()
  const { onPresentConnectModal } = useWallet()
  const router = useRouter()
  const [hasReferral, setHasReferral] = useState<boolean>(false)
  const [referral, setReferral] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('mint')
  const [bondPrice, setBondPrice] = useState<string>('0')
  const [marketPrice, setMarketPrice] = useState<string>('0')
  const [dfsBalance, setDfsBalance] = useState<string>()
  const [minPrice, setMinPrice] = useState<BigNumber>()
  const [vestingTerms, setVestingTerms] = useState<number>(0)
  const [maxPayout, setMaxPayout] = useState<string>()
  const [payout, setPayoutFor] = useState<string>('0')
  const [pendingPayout, setPendingPayout] = useState<string>('0')
  const [bondPayout, setBondPayout] = useState<string>('0')
  const [pdfsBalance, setPdfsBalance] = useState<BigNumber>(BigNumber.from(0))

  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const dfsMining = useDFSMineContract()
  const dfs = useDFSContract()
  const pdfs = usePDFSContract()
  const usdtAddress = getUSDTAddress()
  const usdt = useERC20(usdtAddress, true)
  const pairAddress = getPairAddress()
  const pair = usePairContract(pairAddress)

  useEffect(() => {
    dfsMining.getPriceInUSDT().then((res) => {
      console.log(res.toString())
      setBondPrice(formatBigNumber(res, 5))
    })
    pair.getReserves().then((reserves: any) => {
      let marketPrice = reserves[1] / reserves[0]
      if (marketPrice < 1) {
        marketPrice = reserves[0] / reserves[1]
      }
      setMarketPrice(marketPrice.toFixed(5))
    })
  }, [account, amount])

  useEffect(() => {
    if (account) {
      dfsMining
        .referrals(account)
        .then((res) => {
          if (res !== zeroAddress) {
            setHasReferral(true)
            setReferral(res)
          } else {
            setHasReferral(false)
          }
        })
        .catch((error) => console.log(error))
      dfsMining.bondInfo(account).then((res) => setBondPayout(formatBigNumber(res[0], 2)))
      dfsMining
        .pendingPayoutFor(account)
        .then((res) => {
          setPendingPayout(formatBigNumber(res, 18))
        })
        .catch((error) => console.log(error))
      dfs
        .balanceOf(account)
        .then((res) => {
          setDfsBalance(formatBigNumber(res, 18))
        })
        .catch((error) => console.log(error))
      pdfs.releaseInfo(account).then((res) => {
        setPdfsBalance(res.balance)
      })
    }
  }, [account])

  useEffect(() => {
    dfsMining
      .terms()
      .then((res) => {
        setMinPrice(res[0])
        setVestingTerms(res[2])
      })
      .catch((error) => console.log(error))
    dfsMining
      .maxPayout()
      .then((res) => {
        setMaxPayout(formatBigNumber(res, 18))
      })
      .catch((error) => console.log(error))
    if (amount) {
      dfsMining
        .payoutFor(parseUnits(amount, 'ether'))
        .then((payout) => setPayoutFor(formatBigNumber(payout, 4)))
        .catch((error) => console.log(error))
    }
  }, [account, bondPrice, amount])

  const buy = (hasPdfs: boolean) => {
    if (!hasReferral) {
      confirm({
        title: t('You will not be able to add a referrer on your next purchase'),
        icon: <ExclamationCircleOutlined />,
        okText: t('Confirm'),
        okType: 'danger',
        cancelText: t('Cancel'),
        onOk() {
          buySubmit(hasPdfs)
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    } else {
      buySubmit(hasPdfs)
    }
  }

  const buySubmit = async (hasPdfs) => {
    if (!referral) {
      window.alert('missing referral')
      return
    }
    const allowance = await usdt.allowance(account, dfsMining.address)
    if (allowance.eq(0)) {
      const receipt = await usdt.approve(dfsMining.address, MaxUint256)
      await receipt.wait()
    }
    try {
      const receipt = await dfsMining.deposit(parseUnits(amount, 'ether'), referral, hasPdfs)
      await receipt.wait()
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
      return
    }
    setAmount('')
    onClose()
    const parsedAmount = parseUnits(amount, 'ether').toString()
    console.log(parsedAmount)
  }
  const withdraw = () => {
    confirm({
      title: t('Get even bigger gains with undrawn DFS draws'),
      icon: <ExclamationCircleOutlined />,
      okText: t('Continue'),
      okType: 'danger',
      cancelText: t('Go to Mint'),
      onOk() {
        dfsMining.redeem(account).catch((error) => window.alert(error.reason ?? error.data?.message ?? error.message))
      },
      onCancel() {
        router.push(`/mint`)
      },
    })
  }
  const clickTab = (key) => {
    setActiveTab(key)
  }
  const connectWallect = () => {
    onClose()
    onPresentConnectModal()
  }

  return (
    <StyledModal width={500} className="no-header" onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <HeaderWrap>
          <CogIcon width="24px" color="#ABB6FF" onClick={openSettingModal} />
          <CloseIcon width="24px" color="#ABB6FF" onClick={onClose} />
        </HeaderWrap>
        <BondListItem>
          <BondListItemHeader>
            <ImgWrap>
              <FromImg src={bondData?.from} />
              <ToImg src={bondData?.to} />
            </ImgWrap>
            <BondName>{bondData?.name}</BondName>
            <BondTime>{`${bondData?.duration} ${t('days')}`}</BondTime>
          </BondListItemHeader>
          <BondListItemContent>
            <ContentCell>
              <CellTitle>{t('Bond price')}</CellTitle>
              <CellText>${bondPrice ?? 0}</CellText>
            </ContentCell>
            <ContentCell>
              <CellTitle>{t('Market price')}</CellTitle>
              <CellText>${marketPrice ?? 0}</CellText>
            </ContentCell>
          </BondListItemContent>
        </BondListItem>
        {account && (
          <TabList>
            <TabItem className={`${activeTab === 'mint' && 'active'}`} onClick={() => clickTab('mint')}>
              {t('Mint')}
            </TabItem>
            <TabItem className={`${activeTab === 'redeem' && 'active'}`} onClick={() => clickTab('redeem')}>
              {t('Redeem')}
            </TabItem>
          </TabList>
        )}
        {account && isApprove && activeTab === 'mint' && (
          <>
            <MoneyInput
              prefix="$"
              suffix=""
              value={amount}
              onInput={async (e: any) => {
                setAmount(e.target.value)
                if (e.target.value) {
                  setHasReferral(true)
                  try {
                    const payout = await dfsMining.payoutFor(parseUnits(e.target.value, 'ether'))
                    setPayoutFor(formatBigNumber(payout, 4))
                  } catch (error: any) {
                    window.alert(error.reason ?? error.data?.message ?? error.message)
                  }
                } else {
                  setPayoutFor('0')
                }
              }}
            />
            <RecommandWrap>
              <RecommandInput
                value={referral}
                placeholder={t('Referral')}
                onInput={(e: any) => {
                  setReferral(e.target.value)
                  setHasReferral(true)
                }}
                disabled={hasReferral && referral !== ''}
              />
            </RecommandWrap>
            <BondListItemBtn onClick={() => buy(false)}>{t('Buy')}</BondListItemBtn>
            {pdfsBalance.gt(0) && <BondListItemBtn onClick={() => buy(true)}>{t('Buy With PDFS')}</BondListItemBtn>}
          </>
        )}
        {account && isApprove && activeTab === 'redeem' && (
          <BondListItemBtn onClick={withdraw}>{t('Withdraw')}</BondListItemBtn>
        )}
        {account && !isApprove && (
          <>
            <TipsWrap>
              <InfoIcon width="20px" color="#ABB6FF" />
              <TipsText>
                {t('First time bonding a DFS-USDT LP? Approve contract to use your DFS-USDT LP for bonding')}
              </TipsText>
            </TipsWrap>
            <BondListItemBtn onClick={getApprove}>{t('Approve')}</BondListItemBtn>
          </>
        )}

        {!account && (
          <>
            <TipsWrap>
              <InfoIcon width="20px" color="#ABB6FF" />
              <TipsText>{t('Your wallet has to be connected in order to perform this operation')}</TipsText>
            </TipsWrap>
            <BondListItemBtn onClick={connectWallect}>{t('Connection')}</BondListItemBtn>
          </>
        )}
        <ListItem>
          <ListLable>{t('Your balance')}</ListLable>
          <ListContent>{dfsBalance ?? 0} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('You will receive')}</ListLable>
          {activeTab === 'mint' ? (
            <ListContent>{payout ?? 0} DFS</ListContent>
          ) : (
            <ListContent>{pendingPayout ?? 0} DFS</ListContent>
          )}
        </ListItem>
        <ListItem>
          <ListLable>{t('Payout')}</ListLable>
          <ListContent>{bondPayout ?? 0} DFS</ListContent>
        </ListItem>
        {pdfsBalance.gt(0) && (
          <ListItem>
            <ListLable>{t('PDFS Released')}</ListLable>
            <ListContent>{formatBigNumber(pdfsBalance) ?? 0} PDFS</ListContent>
          </ListItem>
        )}

        <ListItem>
          <ListLable>{t('Discount')}</ListLable>
          <ListContent>
            <TextColor isRise={bondData.discount > 0}>{formatNumber(bondData.discount, 2)}%</TextColor>
          </ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Duration')}</ListLable>
          <ListContent>{vestingTerms / (24 * 3600)} Days</ListContent>
        </ListItem>
      </ContentWrap>
    </StyledModal>
  )
}

export default BondModal
