import { FC, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { CloseIcon, ChevronLeftIcon  } from '@pancakeswap/uikit'
import { StyledModal, ContentWrap, HeaderWrap,   BondListItemBtn, SettingItem,
  SettingLabel, SettingCont, SettingInput, SettingTips } from './styles'

interface BondModalProps {
  bondData: any;
  account: string;
  onClose: () => void;
}

const ExtractModal: React.FC<BondModalProps> = ({
  bondData,
  account,
  onClose,
}) => {
  const { t } = useTranslation()
  const [addressValue, setAddressValue] = useState<string>(account);
  return (
    <StyledModal
      width={500}
      className="no-header"
      onCancel={onClose}
      visible
      centered
      maskClosable={false}
      footer={[]}
    >
      <ContentWrap>
        {/* 头部按钮 */}
        <HeaderWrap>
          <ChevronLeftIcon width="24px" color="#ABB6FF" onClick={onClose} />
          <CloseIcon width="24px" color="#ABB6FF" onClick={onClose} />
        </HeaderWrap>
        {/* 中间内容 */}
        <SettingItem>
          <SettingLabel>Slippage</SettingLabel>
          <SettingCont>
            <SettingInput className="noBorder" suffix="%" />
            <SettingTips>If the price changes beyond the slip number, trading may resume</SettingTips>
          </SettingCont>
        </SettingItem>
        <SettingItem>
          <SettingLabel>Receive the address</SettingLabel>
          <SettingCont>
            <SettingInput className="noBorder"  value={addressValue} />
            <SettingTips>By default, it is the current login address</SettingTips>
          </SettingCont>
        </SettingItem>
        {/* 按钮 */}
        <BondListItemBtn>Confirm</BondListItemBtn>
      </ContentWrap>
    </StyledModal>
  )
}

export default ExtractModal