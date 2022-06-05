import { useTranslation } from 'contexts/Localization'
import { NftToken } from 'state/nftMarket/types'
import { StyledModal, ContentWrap, CardListWrap, CardListTitle, CardItem, CardImg, 
  CardName, SyntheticBtn, AchievWrap, AchievCard, AchievImg } from './styles'

interface CompoundConfirmModalProps {
  nfts: NftToken[]
  onDismiss: () => void
  submitCompound: () => void
}

const CompoundConfirmModal: React.FC<CompoundConfirmModalProps> = ({
  onDismiss,
  submitCompound,
  nfts
}) => {
  const { t } = useTranslation()

  return (
    <StyledModal
      title={t('Synthetic')}
      onCancel={onDismiss}
      visible
      footer={[]}
    >
      <ContentWrap>
        <AchievWrap>
          <AchievCard>
            <AchievImg src={nfts[0]?.image.thumbnail} />
          </AchievCard>
        </AchievWrap>
        <CardListWrap>
          <CardListTitle>{t('Consumption')}</CardListTitle>
          {
            nfts.length && nfts.map((nft) => {
                const { marketData, location } = nft
                return (
                  <CardItem key={`${nft?.tokenId}-${nft?.collectionName}`}>
                    <CardImg src={nft?.image.thumbnail} />
                    <CardName>{nft.name}</CardName>
                  </CardItem>
                )
              })
          }
        </CardListWrap>
        <SyntheticBtn role="button" aria-hidden="true" onClick={submitCompound}>{t('Synthetic')}</SyntheticBtn>
      </ContentWrap>
    </StyledModal>
  )
}

export default CompoundConfirmModal