import { Grid, Text, Flex } from '@pancakeswap/uikit'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectibleLinkCard, CollectibleActionCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'
// import NoNftsImage from '../../components/Activity/NoNftsImage'

const UserNfts: React.FC<{
  isSelected: boolean
  nfts: NftToken[]
  isLoading: boolean
  selectNft: (param: NftToken) => void
}> = ({ isSelected, nfts, isLoading, selectNft }) => {
  const { t } = useTranslation()
  const handleCollectibleClick = (nft: NftToken, location: NftLocation) => {
    if (isSelected) {
      selectNft(nft)
    }
  }
  return (
    <>
      {nfts?.length === 0 && !isLoading ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <Text pt="8px" bold>
            {t('No NFTs found')}
          </Text>
        </Flex>
      ) : nfts?.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nfts?.map((nft) => {
            const { marketData, location } = nft
            return (
              nft?.tokenId && (
                <CollectibleLinkCard
                  isSelected={isSelected}
                  onClick={() => handleCollectibleClick(nft, location)}
                  key={`${nft?.tokenId}-${nft?.collectionName}`}
                  nft={nft}
                  currentAskPrice={
                    marketData?.currentAskPrice && marketData?.isTradable && parseFloat(marketData?.currentAskPrice)
                  }
                />
              )
            )
          })}
        </Grid>
      ) : (
        // null
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
