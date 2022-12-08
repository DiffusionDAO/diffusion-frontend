import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/nftMarket/types'
import { Button } from 'antd'
import { StyledModal, ContentWrap, TitleText, DesText, BtnWrap } from './styles'

interface CustomModalProps {
  title: string
  description: string
  onConfirm: () => void
  onClose: () => void
  cancelText?: string
  okText?: string
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  onClose,
  onConfirm,
  cancelText = 'Cancel',
  okText = 'Confirm',
}) => {
  const { t } = useTranslation()

  return (
    <StyledModal width={500} className="no-header" onCancel={onClose} open centered maskClosable={false} footer={[]}>
      <ContentWrap>
        <TitleText>{title}</TitleText>
        <DesText>{description}</DesText>
        <BtnWrap>
          <Button type="primary" size="middle" style={{ marginRight: '10px' }} onClick={onClose}>
            {t(cancelText)}
          </Button>
          <Button type="primary" size="middle" onClick={onConfirm}>
            {t(okText)}
          </Button>
        </BtnWrap>
      </ContentWrap>
    </StyledModal>
  )
}

export default CustomModal
