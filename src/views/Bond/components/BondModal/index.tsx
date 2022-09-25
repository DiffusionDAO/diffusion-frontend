import { FC, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { CloseIcon, CogIcon, InfoIcon, useWalletModal } from '@pancakeswap/uikit'
import { parseUnits } from '@ethersproject/units'
import { useWallet } from 'hooks/useWallet'
import { useBondContract } from 'hooks/useContract'

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
  const [hasRecommand, sethasRecommand] = useState<boolean>(false)
  const [referral, setReferral] = useState<string>()
  const [amount, setAmount] = useState<string>()
  const [activeTab, setActiveTab] = useState<string>('mint')
  const changeRecommand = () => {
    setReferral('')
    sethasRecommand(!hasRecommand)
  }
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const bond = useBondContract()
  const buy = async () => {
    if (referral && account && referral !== account) {
      const existReferral = await bond.referrals(account)
      console.log('existReferral:', existReferral)
      if (existReferral === zeroAddress) {
        // await bond.deposit(amount, referral)
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
        console.log(json)
      }
    }
  }
  const clickTab = (key) => {
    setActiveTab(key)
  }
  const connectWallect = () => {
    onClose()
    onPresentConnectModal()
  }

  return (
    <StyledModal width={500} className="no-header" onCancel={onClose} visible centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <HeaderWrap>
          <CogIcon width="24px" color="#ABB6FF" onClick={openSettingModal} />
          <CloseIcon width="24px" color="#ABB6FF" onClick={onClose} />
        </HeaderWrap>
        <BondListItem>
          <BondListItemHeader>
            <ImgWrap>
              <FromImg src={bondData.from} />
              <ToImg src={bondData.to} />
            </ImgWrap>
            <BondName>{bondData.name}</BondName>
            <BondTime>{bondData.duration}days</BondTime>
          </BondListItemHeader>
          <BondListItemContent>
            <ContentCell>
              <CellTitle>{t('Bond price')}</CellTitle>
              <CellText>${bondData.price}</CellText>
            </ContentCell>
            <ContentCell>
              <CellTitle>{t('Market price')}</CellTitle>
              <CellText>${bondData.price}</CellText>
            </ContentCell>
          </BondListItemContent>
        </BondListItem>
        {/* mint or redeem choice */}
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
            {/* <MoneyLable>Money</MoneyLable> */}
            <MoneyInput
              prefix="$"
              suffix="ALL"
              value={amount}
              onInput={(e: any) => {
                setAmount(e.target.value)
              }}
            />
            <RecommandWrap>
              <CheckBoxWrap onClick={changeRecommand}>
                {hasRecommand ? <img src="/images/nfts/gou.svg" alt="img" style={{ height: '4px' }} /> : <CheckBox />}
              </CheckBoxWrap>
              <RecommandLable onClick={changeRecommand}>{t('Any Referrals?')}</RecommandLable>
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
        {account && isApprove && activeTab === 'redeem' && <BondListItemBtn>{t('Withdraw')}</BondListItemBtn>}
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
          <ListContent>{bondData.balance} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('You will receive')}</ListLable>
          <ListContent>{bondData.getFee} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Max You Can Withdraw')}</ListLable>
          <ListContent>{bondData.maxFee} DFS</ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Your balance')}</ListLable>
          <ListContent>
            <TextColor isRise={bondData.discount > 0}>{bondData.discount}</TextColor>
          </ListContent>
        </ListItem>
        <ListItem>
          <ListLable>{t('Duration')}</ListLable>
          <ListContent>{bondData.duration} Days</ListContent>
        </ListItem>
      </ContentWrap>
    </StyledModal>
  )
}

export default BondModal
