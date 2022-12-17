import { FC, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { CloseIcon, ChevronLeftIcon } from '@pancakeswap/uikit'
import {
  StyledModal,
  ContentWrap,
  HeaderWrap,
  BondListItemBtn,
  SettingItem,
  SettingLabel,
  SettingCont,
  SettingInput,
  SettingTips,
} from './styles'

interface BondModalProps {
  bondData: any
  account: string
  onClose: () => void
}

const SettingModal: React.FC<BondModalProps> = ({ bondData, account, onClose }) => {
  const { t } = useTranslation()
  const [addressValue, setAddressValue] = useState<string>(account)
  return (
    <StyledModal width={500} className="no-header" onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <HeaderWrap>
          <ChevronLeftIcon width="24px" color="#ABB6FF" onClick={onClose} />
          <CloseIcon width="24px" color="#ABB6FF" onClick={onClose} />
        </HeaderWrap>
        <SettingItem>
          <SettingLabel>{t('Slippage')}</SettingLabel>
          <SettingCont>
            <SettingInput className="noBorder" suffix="%" />
            <SettingTips>{t('If the price changes beyond the slip number, the deal may fall through')}</SettingTips>
          </SettingCont>
        </SettingItem>
        <SettingItem>
          <SettingLabel>{t('Recipient wallet address')}</SettingLabel>
          <SettingCont>
            <SettingInput className="noBorder" value={addressValue} />
            <SettingTips>{t('Under current circumstances, this is your current login address')}</SettingTips>
          </SettingCont>
        </SettingItem>
        <BondListItemBtn>{t('Confirm')}</BondListItemBtn>
      </ContentWrap>
    </StyledModal>
  )
}

export default SettingModal
