import { Grid, Text, Flex } from '@pancakeswap/uikit'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectibleLinkCard } from 'views/Nft/market/components/CollectibleCard'
import GridPlaceholder from 'views/Nft/market/components/GridPlaceholder'

const UserNfts: React.FC<{
  isSelected: boolean
  nfts: NftToken[]
  isLoading: boolean
  selectNft: (param: NftToken, index:number) => void
}> = ({ isSelected, nfts, isLoading, selectNft }) => {
  const { t } = useTranslation()
  const handleCollectibleClick = (nft: NftToken, index: number) => {
    if (isSelected) {
      selectNft(nft, index)
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
          {nfts?.map((nft,i) => {
            const { marketData, location } = nft
            return (
              nft?.tokenId && (
                <CollectibleLinkCard
                  isSelected={isSelected}
                  onClick={() => handleCollectibleClick(nft, i)}
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
