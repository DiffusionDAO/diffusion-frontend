import { useTranslation } from 'contexts/Localization'
import { Button, Grid } from '@pancakeswap/uikit'
import { NftToken } from 'state/nftMarket/types'
import { StyledModal, ContentWrap } from './styles'
import NFTMedia from '../../../components/NFTMedia'
import { CollectibleActionCard } from '../../../components/CollectibleCard'



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
      title={t('合成')}
      onDismiss={onDismiss}
    >
      <ContentWrap>
        <div>
          <div>得到</div>
          <NFTMedia height={320} width={320} mb="8px" borderRadius="8px" />
        </div>
        <div>
          <div>消耗</div>
          {
            nfts.length && (
            <Grid
              gridGap="16px"
              gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
              alignItems="start"
            >
              {nfts.map((nft) => {
                const { marketData, location } = nft
                return (
                  <CollectibleActionCard
                    isUserNft
                    key={`${nft?.tokenId}-${nft?.collectionName}`}
                    nft={nft}
                    currentAskPrice={
                      marketData?.currentAskPrice && marketData?.isTradable && parseFloat(marketData?.currentAskPrice)
                    }
                    nftLocation={location}
                  />
                )
              })}
            </Grid>
          )
        }
        </div>
        <div>
          <Button variant="primary" scale="md" mr="8px" onClick={submitCompound}>{t('开始合成')}</Button>
        </div>
      </ContentWrap>
    </StyledModal>
  )
}

export default CompoundConfirmModal