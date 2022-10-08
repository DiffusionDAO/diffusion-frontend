import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { CloseIcon, CogIcon, InfoIcon, useWalletModal } from '@pancakeswap/uikit'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { parseUnits } from '@ethersproject/units'
import { useWallet } from 'hooks/useWallet'
import { useBondContract, useDFSContract, useERC20 } from 'hooks/useContract'
import { BigNumber, ethers } from 'ethers'
import { USDT } from '@pancakeswap/tokens'
import { MaxUint256 } from '@ethersproject/constants'
import { getUSDTAddress } from 'utils/addressHelpers'
import { useSigner } from 'wagmi'
import { useRouterContract } from 'utils/exchange'
import { formatBigNumber } from 'utils/formatBalance'

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
  const [referral, setReferral] = useState<string>()
  const [amount, setAmount] = useState<string>()
  const [activeTab, setActiveTab] = useState<string>('mint')
  const [bondPrice, setBondPrice] = useState<number>(0)
  const [marketPrice, setMarketPrice] = useState<number>(0)
  const [dfsBalance, setDfsBalance] = useState<string>()
  const [minPrice, setMinPrice] = useState<BigNumber>()
  const [vestingTerms, setVestingTerms] = useState<number>(0)
  const [maxPayout, setMaxPayout] = useState<string>()
  const [payout, setPayout] = useState<string>()

  const changeReferral = () => {
    setReferral('')
    setHasReferral(!hasReferral)
  }
  const discount = 11

  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const bond = useBondContract()
  const dfs = useDFSContract()
  const usdtAddress = getUSDTAddress()
  const usdt = useERC20(usdtAddress, true)
  const pancakeRouter = useRouterContract()
  useEffect(() => {
    bond.terms().then((res) => {
      console.log('terms:', res)
      setMinPrice(res[0])
      setVestingTerms(res[2])
    })
    bond.maxPayout().then((res) => {
      setMaxPayout(formatBigNumber(res, 2))
    })
    bond.bondPrice().then((res) => {
      setBondPrice(res.toNumber())
      setMarketPrice((res.toNumber() * discount) / 10)
    })
    if (account) {
      dfs.balanceOf(account).then((res) => {
        console.log('balanceOf:', res)
        setDfsBalance(formatBigNumber(res, 2))
      })
    }
  }, [account])
  const buy = () => {
    if (!hasReferral) {
      confirm({
        title: t('You will not be able to add a referrer on your next purchase'),
        icon: <ExclamationCircleOutlined />,
        okText: t('Confirm'),
        okType: 'danger',
        cancelText: t('Cancel'),
        onOk() {
          buySubmit()
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    } else {
      buySubmit()
    }
  }

  const buySubmit = async () => {
    if (referral && account && referral !== account) {
      const existReferral = await bond.referrals(account)
      if (existReferral === zeroAddress) {
        let allowance = await usdt.allowance(account, pancakeRouter.address)
        if (allowance.eq(0)) {
          let receipt = await usdt.approve(pancakeRouter.address, MaxUint256)
          await receipt.wait()
          receipt = await dfs.approve(pancakeRouter.address, MaxUint256)
          await receipt.wait()
        }
        allowance = await usdt.allowance(account, bond.address)
        if (allowance.eq(0)) {
          const receipt = await usdt.approve(bond.address, MaxUint256)
          await receipt.wait()
        }
        try {
          const receipt = await bond.deposit(parseUnits(amount, 'ether'), minPrice, referral)
          await receipt.wait()
        } catch (error: any) {
          window.alert(error.reason ?? error.data?.message ?? error.message)
        }
        const response = await fetch('https://middle.diffusiondao.org/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: account,
            amount: parseUnits(amount, 'ether'),
            referral,
          }),
        })
        const json = await response.json()
        console.log(json)
      }
    } else {
      window.alert('Cannot set yourself as referral')
    }
  }
  const withdraw = () => {
    confirm({
      title: t('Get even bigger gains with undrawn DFS draws'),
      icon: <ExclamationCircleOutlined />,
      okText: t('Continue'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk() {
        bond.redeem(account)
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
            <BondTime>{bondData?.duration}days</BondTime>
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
              suffix="ALL"
              value={amount}
              onInput={async (e: any) => {
                setAmount(e.target.value)
                try {
                  const payout = await bond.payoutFor(parseUnits(e.target.value, 'ether'))
                  setPayout(formatBigNumber(payout, 2))
                } catch (error: any) {
                  window.alert(error.reason ?? error.data?.message ?? error.message)
                }
              }}
            />
            <RecommandWrap>
              <CheckBoxWrap onClick={changeReferral}>
                {hasReferral ? <img src="/images/nfts/gou.svg" alt="img" style={{ height: '4px' }} /> : <CheckBox />}
              </CheckBoxWrap>
              <RecommandLable onClick={changeReferral}>{t('Any Referrals?')}</RecommandLable>
              {hasReferral ? (
                <RecommandInput
                  value={referral}
                  placeholder={t('address')}
                  onInput={(e: any) => {
                    setReferral(e.target.value)
                  }}
                />
              ) : null}
            </RecommandWrap>
            <BondListItemBtn onClick={buy}>{t('Buy')}</BondListItemBtn>
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
          <ListContent>{payout ?? 0} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Max You Can Buy')}</ListLable>
          <ListContent>{maxPayout ?? 0} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Discount')}</ListLable>
          <ListContent>
            <TextColor isRise={discount > 0}>{10 / discount}</TextColor>
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
