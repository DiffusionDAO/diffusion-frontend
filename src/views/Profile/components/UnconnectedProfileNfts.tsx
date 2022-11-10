import { Grid, Text, Flex } from '@pancakeswap/uikit'
import { NftToken } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectibleLinkCard } from '../../Nft/market/components/CollectibleCard'
import GridPlaceholder from '../../Nft/market/components/GridPlaceholder'
import NoNftsImage from '../../Nft/market/components/Activity/NoNftsImage'

const UserNfts: React.FC<React.PropsWithChildren<{ nfts: NftToken[]; isLoading: boolean }>> = ({ nfts, isLoading }) => {
  const { t } = useTranslation()
  console.log('UnconnectedProfileNfts UserNfts:')
  return (
    <>
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
            const { marketData } = nft
            return (
              <CollectibleLinkCard
                isSelected={false}
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
