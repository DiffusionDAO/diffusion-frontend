import { useTranslation } from 'contexts/Localization'
import { Button, Grid } from '@pancakeswap/uikit'
import { NftToken } from 'state/nftMarket/types'
import { StyledModal, ContentWrap, GetCardWrap, GetCardTitle } from './styles'
import NFTMedia from '../../../components/NFTMedia'
import { CollectibleLinkCard } from '../../../components/CollectibleCard'



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
      onDismiss={onDismiss}
    >
      <ContentWrap>
        <div>
          <CollectibleLinkCard
            isUserNft
            key={`${nfts[0]?.tokenId}-${nfts[0]?.collectionName}`}
            nft={nfts[0]}
            currentAskPrice={
              nfts[0].marketData?.currentAskPrice && nfts[0].marketData?.isTradable && parseFloat(nfts[0].marketData?.currentAskPrice)
            }
          />
        </div>
        <GetCardWrap>
          <GetCardTitle>{t('Consumption')}</GetCardTitle>
          {
            nfts.length && nfts.map((nft) => {
                const { marketData, location } = nft
                return (
                  <CollectibleLinkCard
                    isUserNft
                    key={`${nft?.tokenId}-${nft?.collectionName}`}
                    nft={nft}
                    currentAskPrice={
                      marketData?.currentAskPrice && marketData?.isTradable && parseFloat(marketData?.currentAskPrice)
                    }
                  />
                )
              })
          }
        </GetCardWrap>
        <div role="button" aria-hidden="true" onClick={submitCompound}>{t('Synthetic')}</div>
      </ContentWrap>
    </StyledModal>
  )
}

export default CompoundConfirmModal