import { useTranslation } from 'contexts/Localization'
import { NftToken } from 'state/nftMarket/types'
import { Button } from 'antd'
import { StyledModal, ContentWrap, TitleText, DesText, BtnWrap } from './styles'

interface CustomModalProps {
  title: string;
  description: string;
  onClose: () => void
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  onClose,
}) => {
  const { t } = useTranslation()

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
        <TitleText>{title}</TitleText>
        <DesText>{description}</DesText>
        <BtnWrap>
          <Button type="primary" size='middle' style={{ marginRight: '10px' }} onClick={onClose}>{t('Cancel')}</Button>
          <Button type="primary" size='middle' onClick={onClose}>{t('Save')}</Button>
        </BtnWrap>
      </ContentWrap>
    </StyledModal>
  )
}

export default CustomModal