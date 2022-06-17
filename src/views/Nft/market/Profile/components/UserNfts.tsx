import { Grid, Text, Flex } from '@pancakeswap/uikit'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'
import NoNftsImage from '../../components/Activity/NoNftsImage'

const UserNfts: React.FC<{
  isCompound: boolean
  nfts: NftToken[]
  isLoading: boolean
  selectNft: (param: NftToken) => void
}> = ({ isCompound, nfts, isLoading, selectNft }) => {
  const { t } = useTranslation()
  const handleCollectibleClick = (nft: NftToken, location: NftLocation) => {
    if (isCompound) {
      selectNft(nft)
    }
  }
  return (
    <>
      {/* User has no NFTs */}
      {nfts?.length === 0 && !isLoading ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No NFTs found')}
          </Text>
        </Flex>
      ) : // User has NFTs and data has been fetched
      nfts?.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nfts?.map((nft) => {
            const { marketData, location } = nft

            return (
              <CollectibleLinkCard
                isCompound={isCompound}
                isUserNft
                onClick={() => handleCollectibleClick(nft, location)}
                key={`${nft?.tokenId}-${nft?.collectionName}`}
                nft={nft}
                currentAskPrice={
                  marketData?.currentAskPrice && marketData?.isTradable && parseFloat(marketData?.currentAskPrice)
                }
              />
            )
          })}
        </Grid>
      ) : (
        // User NFT data hasn't been fetched
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
