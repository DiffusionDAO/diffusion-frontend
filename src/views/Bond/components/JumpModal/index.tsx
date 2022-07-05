import React, { useState } from "react";
import { useRouter } from 'next/router'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { StyledModal, JumpWrap, JumpTitle, JumpDes, TakeCardBtn, JumpBtnCont, JumpInvite } from './styles'


interface JumpModalProps {
  onClose: () => void;
}

const JumpModal: React.FC<JumpModalProps> = ({
  onClose,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  return (
    <StyledModal
      width={500}
      onCancel={onClose}
      visible
      centered
      maskClosable={false}
      footer={[]}
    >
      <JumpWrap>
        <JumpTitle>{t('Your balance is insufficient')}</JumpTitle>
        <JumpDes>{t('There are several ways to get DFS')}</JumpDes>
        <TakeCardBtn onClick={onClose}>
          <JumpBtnCont>{t('Insufficient balance? Buy bonds on this page >')}</JumpBtnCont>
        </TakeCardBtn>
        <TakeCardBtn 
          onClick={() => router.push(`${nftsBaseUrl}/profile/${account.toLowerCase()}`)}
        >
          <JumpBtnCont>{t('Insufficient balance? To synthesize/pledge NFT >')}</JumpBtnCont>
        </TakeCardBtn>
        <TakeCardBtn onClick={onClose}>
          <JumpBtnCont>{t('Insufficient balance? Go and extract/pledge DFS >')}</JumpBtnCont>
        </TakeCardBtn>
        <JumpInvite href="">{t('You can also invite your friends to buy bonds to get DFS')}</JumpInvite>
      </JumpWrap>
    </StyledModal>
  )
}

export default JumpModal