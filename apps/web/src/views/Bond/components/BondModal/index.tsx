import { FC, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { CloseIcon, CogIcon, InfoIcon } from '@pancakeswap/uikit'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { parseUnits, formatUnits, parseEther } from '@ethersproject/units'
import {
  useBondContract,
  useDFSContract,
  useDFSMiningContract,
  useERC20,
  usePairContract,
  usePDFSContract,
} from 'hooks/useContract'
import { BigNumber } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { getDFSAddress, getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { formatBigNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import { escapeRegExp } from 'utils'
import { useRouterContract } from 'utils/exchange'
import { estimateGas } from 'utils/calls'
import { USDT_BSC } from '@pancakeswap/tokens'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'

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
  ReferralWrap,
  CheckBoxWrap,
  CheckBox,
  ReferralLable,
  ReferralInput,
} from './styles'

const { confirm } = Modal

interface BondModalProps {
  bondData: any
  isApprove?: boolean
  account?: string
  getApprove?: () => void
  onClose?: () => void
  openSettingModal?: () => void
}

const BondModal: React.FC<BondModalProps> = ({
  bondData,
  isApprove,
  account,
  getApprove,
  onClose,
  openSettingModal,
}) => {
  const {chainId} = useActiveChainId()
  const { t } = useTranslation()
  const router = useRouter()

  const [hasReferral, setHasReferral] = useState<boolean>(false)
  const [referral, setReferral] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('mint')
  const [bondPrice, setBondPrice] = useState<string>('0')
  const [marketPrice, setMarketPrice] = useState<number>(0)
  const [dfsBalance, setDfsBalance] = useState<string>()
  const [minPrice, setMinPrice] = useState<BigNumber>()
  const [vestingTerms, setVestingTerms] = useState<string>('')
  const [payout, setPayoutFor] = useState<string>('0')
  const [pendingPayout, setPendingPayout] = useState<BigNumber>(BigNumber.from(0))
  const [bondUnused, setBondUnused] = useState<BigNumber>(BigNumber.from(0))
  const [bondUsed, setBondUsed] = useState<BigNumber>(BigNumber.from(0))
  const [refresh, setRefresh] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>()
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
  const enforcer = async (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setAmount(nextUserInput)
      if (nextUserInput) {
        try {
          const payoutFor = await bond.payoutFor(parseEther(nextUserInput))
          setPayoutFor(formatBigNumber(payoutFor, 4))
        } catch (error: any) {
          window.alert(error.reason ?? error.data?.message ?? error.message)
        }
      }
    }
  }
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const dfsMining = useDFSMiningContract()
  const dfs = useDFSContract()
  const pdfs = usePDFSContract()
  const usdtAddress = getUSDTAddress(chainId)
  const dfsAddress = getDFSAddress(chainId)
  const usdt = useERC20(usdtAddress, true)
  const pairAddress = getPairAddress(chainId)
  const pair = usePairContract(pairAddress)
  const bond = useBondContract()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  useEffect(() => {
    if (account) {
      bond
        .parent(account)
        .then((res) => {
          if (res !== zeroAddress) {
            setHasReferral(true)
            setReferral(res)
          } else {
            setHasReferral(false)
          }
        })
        .catch((error) => console.log(error))
    }
  }, [account])

  useEffect(() => {
    bond
      .vestingTerm()
      .then((res) => {
        if (res / (24 * 3600) >= 1) {
          setVestingTerms(`${formatNumber(res / (24 * 3600), 2)} Days`)
        } else if (res / 3600 >= 1) {
          setVestingTerms(`${formatNumber(res / 3600, 2)} Hours`)
        } else if (res / 60 >= 1) {
          setVestingTerms(`${formatNumber(res / 60, 2)} Minutes`)
        }
      })
      .catch((error) => console.log(error))

      pair.getReserves().then(reserves=>{
        const [numerator, denominator] = usdtAddress.toLowerCase() < dfsAddress.toLowerCase() ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]]
        const marketPriceNumber = parseFloat(formatUnits(numerator)) / parseFloat(formatUnits(denominator)) 
        setMarketPrice(marketPriceNumber)
        setBondPrice(formatNumber(marketPriceNumber * (10000 - bondData.discount) / 10000,2))
      })
        

    if (account) {
      bond
        .pendingPayoutFor()
        .then((res) => {
          console.log('pendingPayoutFor:', formatUnits(res, 18))
          setPendingPayout(res)
        })
        .catch((error) => console.log(error))

      setRefresh(false)

      bond.addressToReferral(account).then((res) => {
        setBondUsed(res.bondUsed)
      })

      bond.unusedOf(account).then((res) => setBondUnused(res))

      dfs
        .balanceOf(account)
        .then((res) => {
          setDfsBalance(formatBigNumber(res, 18))
        })
        .catch((error) => console.log(error))
    }
  }, [account, amount, refresh, activeTab])

  const buy = () => {
    if (!hasReferral) {
      confirm({
        title: t('You have to set referral for the first time'),
        icon: <ExclamationCircleOutlined />,
        okText: t('Confirm'),
        okType: 'danger',
        onOk() {
          buySubmit()
        },
      })
    } else {
      buySubmit()
    }
  }

  const buySubmit = async () => {
    if (!hasReferral) {
      return
    }
    const allowance = await usdt.allowance(account, bond.address)
    if (allowance.eq(0)) {
      const receipt = await usdt.approve(bond.address, MaxUint256)
      await receipt.wait()
    }
    try {
      const gasEstimation = await estimateGas(bond, 'deposit', [parseUnits(amount, 'ether'), referral], {}, 1000)
      console.log('gasEstimation:', gasEstimation.toNumber())
      const receipt = await bond.deposit(parseUnits(amount, 'ether'), referral)
      await receipt.wait()
    } catch (error: any) {
      window.alert(error.reason ?? error.data?.message ?? error.message)
      return
    }
    setAmount('')
  }
  const withdraw = () => {
    confirm({
      title: t('Get even bigger gains with undrawn DFS draws'),
      icon: <ExclamationCircleOutlined />,
      okText: t('Continue'),
      okType: 'danger',
      cancelText: t('Go to Mint'),
      async onOk() {
        try {
          const receipt = await bond.redeem()
          await receipt.wait()
          setRefresh(true)
        } catch (error: any) {
          window.alert(error.reason ?? error.data?.message ?? error.message)
        }
      },
      onCancel() {
        router.push(`/mint`)
      },
    })
  }
  const clickTab = (key) => {
    setActiveTab(key)
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
            <BondTime>{`${vestingTerms.split(' ')[0]} ${t(vestingTerms.split(' ')[1])}`}</BondTime>
          </BondListItemHeader>
          <BondListItemContent>
            <ContentCell>
              <CellTitle>{t('Bond price')}</CellTitle>
              <CellText>${bondPrice ?? 0}</CellText>
            </ContentCell>
            <ContentCell>
              <CellTitle>{t('Market price')}</CellTitle>
              <CellText>${formatNumber(marketPrice, 2) ?? 0}</CellText>
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
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              inputMode="decimal"
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              prefix="$"
              value={amount}
              ref={inputRef}
              onChange={async (e: any) => {
                await enforcer(e.target.value.replace(/,/g, '.'))
              }}
            />
            <ReferralWrap>
              <ReferralInput
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                type="text"
                pattern="^[0-9|a-z|A-Z]*$"
                value={referral}
                placeholder={t('Referral')}
                onInput={(e: any) => {
                  setReferral(e.target.value)
                  setHasReferral(true)
                }}
                disabled={hasReferral && referral !== ''}
              />
            </ReferralWrap>
            <BondListItemBtn onClick={() => buy()}>{t('Buy')}</BondListItemBtn>
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
            <ConnectWalletButton />
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
            <ListContent>{formatUnits(pendingPayout, 18)} DFS</ListContent>
          )}
        </ListItem>
        <ListItem>
          <ListLable>{t('Unused')}</ListLable>
          <ListContent>{formatBigNumber(bondUnused, 18)} DFS</ListContent>
        </ListItem>

        <ListItem>
          <ListLable>{t('Discount')}</ListLable>
          <ListContent>
            <TextColor isRise={bondData.discount > 0}>{formatNumber(bondData.discount / 100, 2)}%</TextColor>
          </ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Duration')}</ListLable>
          <ListContent>{`${vestingTerms.split(' ')[0]} ${t(vestingTerms.split(' ')[1])}`}</ListContent>
        </ListItem>
      </ContentWrap>
    </StyledModal>
  )
}

export default BondModal
