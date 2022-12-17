import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/nftMarket/types'
import { Button } from 'antd'
import {
  StyledModal,
  ContentWrap,
  AchievWrap,
  AchievCard,
AchievImg,
  CongratulationsTitle,
  CongratulationsDes,
  StarWrap,
  StarImg,
  BlueHalo,
  RedHalo,
} from './styles'
import ParticleAnimation from '../../../../../../components/ParticleAnimation'

interface CompoundSuccessModalProps {
  nfts: NftToken[]
  onClose: () => void
}

const CompoundSuccessModal: React.FC<CompoundSuccessModalProps> = ({ onClose, nfts }) => {
  const { t } = useTranslation()

  return (
    <StyledModal
      width={500}
      className="no-header star-bg"
      title={t('Compose')}
      onCancel={onClose}
      visible
      centered
      maskClosable={false}
      footer={[]}
    >
      <ContentWrap>
        <CongratulationsTitle>{t('Congratulations')}</CongratulationsTitle>
        <CongratulationsDes>{t('A new NFT was composed successfully')}</CongratulationsDes>
        <AchievWrap>
          <AchievCard>
            <AchievImg src={nfts[0]?.image.thumbnail} />
            <StarWrap>
              <StarImg src="/images/nfts/star.svg" />
            </StarWrap>
          </AchievCard>
          <BlueHalo />
          <RedHalo />
        </AchievWrap>
        <ParticleAnimation />
        <Button type="primary" size="large" style={{ padding: '0px 35px' }} onClick={onClose}>
          {t('Close')}
        </Button>
      </ContentWrap>
    </StyledModal>
  )
}

export default CompoundSuccessModal
