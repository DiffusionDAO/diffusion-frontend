import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { CloseIcon, CogIcon, InfoIcon, useWalletModal } from '@pancakeswap/uikit'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { parseUnits } from '@ethersproject/units'
import { useWallet } from 'hooks/useWallet'
import { useBondContract, useDFSContract, useERC20 } from 'hooks/useContract'
import { ethers } from 'ethers'
import { USDT } from '@pancakeswap/tokens'
import { MaxUint256 } from '@ethersproject/constants'
import { getUSDTAddress } from 'utils/addressHelpers'
import { useSigner } from 'wagmi'
import { useRouterContract } from 'utils/exchange'

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
  const [hasRecommand, sethasRecommand] = useState<boolean>(false)
  const [referral, setReferral] = useState<string>()
  const [amount, setAmount] = useState<string>()
  const [activeTab, setActiveTab] = useState<string>('mint')
  const changeReferral = () => {
    setReferral('')
    sethasRecommand(!hasRecommand)
  }
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const bond = useBondContract()
  const buy = () => {
    if (!hasRecommand) {
      confirm({
        title: t('在下次购买时将无法添加推荐人'),
        icon: <ExclamationCircleOutlined />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
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
  const usdtAddress = getUSDTAddress()
  console.log(usdtAddress)
  const usdt = useERC20(usdtAddress, true)
  const dfs = useDFSContract()
  const pancakeRouter = useRouterContract()
  const buySubmit = async () => {
    if (referral && account && referral !== account) {
      const existReferral = await bond.referrals(account)
      if (existReferral === zeroAddress) {
        console.log('before usdt allowance')
        let allowance = await usdt.allowance(account, pancakeRouter.address)
        if (allowance.eq(0)) {
          console.log('before usdt approve')
          let receipt = await usdt.approve(pancakeRouter.address, MaxUint256)
          await receipt.wait()
          receipt = await dfs.approve(pancakeRouter.address, MaxUint256)
          await receipt.wait()
        }
        console.log('before usdt allowance')
        allowance = await usdt.allowance(account, bond.address)
        if (allowance.eq(0)) {
          console.log('before usdt approve')
          const receipt = await usdt.approve(bond.address, MaxUint256)
          await receipt.wait()
        }
        console.log('before deposit')
        const receipt = await bond.deposit(amount, 100, referral)
        console.log('after deposit')
        await receipt.wait()
        const response = await fetch('https://middle.diffusiondao.org/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: account,
            amount: parseUnits(amount, 'ether').toString(),
            referral,
          }),
        })
        const json = await response.json()
      }
    }
  }
  const withdraw = () => {
    confirm({
      title: t('您使用未提取的dfs进行抽卡的话，可获得更大的收益'),
      icon: <ExclamationCircleOutlined />,
      okText: '依然提取',
      okType: 'danger',
      cancelText: '去抽卡',
      onOk() {
        console.log('OK')
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
              <CellText>${bondData?.price}</CellText>
            </ContentCell>
            <ContentCell>
              <CellTitle>{t('Market price')}</CellTitle>
              <CellText>${bondData?.price}</CellText>
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
              onInput={(e: any) => {
                setAmount(e.target.value)
              }}
            />
            <RecommandWrap>
              <CheckBoxWrap onClick={changeReferral}>
                {hasRecommand ? <img src="/images/nfts/gou.svg" alt="img" style={{ height: '4px' }} /> : <CheckBox />}
              </CheckBoxWrap>
              <RecommandLable onClick={changeReferral}>{t('Any Referrals?')}</RecommandLable>
              {hasRecommand ? (
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
          <ListContent>{bondData?.balance} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('You will receive')}</ListLable>
          <ListContent>{bondData?.getFee} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Max You Can Withdraw')}</ListLable>
          <ListContent>{bondData?.maxFee} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Your balance')}</ListLable>
          <ListContent>
            <TextColor isRise={bondData?.discount > 0}>{bondData?.discount}</TextColor>
          </ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Duration')}</ListLable>
          <ListContent>{bondData?.duration} Days</ListContent>
        </ListItem>
      </ContentWrap>
    </StyledModal>
  )
}

export default BondModal
