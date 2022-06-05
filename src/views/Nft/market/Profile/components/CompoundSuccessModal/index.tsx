import { useTranslation } from 'contexts/Localization'
import { NftToken } from 'state/nftMarket/types'
import { Button } from 'antd'
import { StyledModal, ContentWrap, AchievWrap, AchievCard, AchievImg, CongratulationsTitle, CongratulationsDes } from './styles'

interface CompoundSuccessModalProps {
  nfts: NftToken[]
  onClose: () => void
}

const CompoundSuccessModal: React.FC<CompoundSuccessModalProps> = ({
  onClose,
  nfts
}) => {
  const { t } = useTranslation()

  return (
    <StyledModal
      width={500}
      className="no-header"
      title={t('Synthetic')}
      onCancel={onClose}
      visible
      footer={[]}
    >
      <ContentWrap>
        <CongratulationsTitle>{t('Congratulations')}</CongratulationsTitle>
        <CongratulationsDes>{t('A new NFT was synthesized successfully')}</CongratulationsDes>
        <AchievWrap>
          <AchievCard>
            <AchievImg src={nfts[0]?.image.thumbnail} />
          </AchievCard>
        </AchievWrap>
        <Button type="primary" size='large' style={{ padding: '0px 35px' }} onClick={onClose}>{t('Close')}</Button>
      </ContentWrap>
    </StyledModal>
  )
}

export default CompoundSuccessModal