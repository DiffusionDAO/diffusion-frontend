import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { StyledModal, JumpWrap, JumpTitle, JumpDes, TakeCardBtn, JumpBtnCont, JumpInvite } from './styles'

interface JumpModalProps {
  onClose: () => void
}

const InsufficientBalance: React.FC<JumpModalProps> = ({ onClose }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  return (
    <StyledModal width={500} onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <JumpWrap>
        <JumpTitle>{t('Insufficient balance')}</JumpTitle>
        <JumpDes>{t('There are several ways to receive DFS')}</JumpDes>
        <TakeCardBtn onClick={onClose}>
          <JumpBtnCont>{t('Insufficient balance? Purchase bonds on this page >')}</JumpBtnCont>
        </TakeCardBtn>
        <TakeCardBtn onClick={() => router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)}>
          <JumpBtnCont>{t('Insufficient balance? Compose/stake NFT >')}</JumpBtnCont>
        </TakeCardBtn>
        <TakeCardBtn onClick={onClose}>
          <JumpBtnCont>{t('Insufficient balance? Withdraw/stake DFS >')}</JumpBtnCont>
        </TakeCardBtn>
        <JumpInvite href="">{t('You should invite your friends to purchase bonds for DFS')}</JumpInvite>
      </JumpWrap>
    </StyledModal>
  )
}

export default InsufficientBalance
