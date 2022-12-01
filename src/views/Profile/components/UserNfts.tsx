import { Grid, useModal, Text, Flex } from '@pancakeswap/uikit'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectibleActionCard, CollectibleLinkCard } from '../../Nft/market/components/CollectibleCard'
import GridPlaceholder from '../../Nft/market/components/GridPlaceholder'
// import NoNftsImage from '../../Nft/market/components/Activity/NoNftsImage'

const UserNfts: React.FC<
  React.PropsWithChildren<{
    isSelected: boolean
    nfts: NftToken[]
    isLoading: boolean
    selectNft: (param: NftToken, index: number) => void
    onSuccessSale?: () => void
    onSuccessEditProfile?: () => void
  }>
> = ({ isSelected, nfts, isLoading, selectNft, onSuccessSale, onSuccessEditProfile }) => {
  const { t } = useTranslation()
  return (
    <>
      {nfts?.length === 0 && !isLoading ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          {/* <NoNftsImage /> */}
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
          {nfts?.map((nft, i) => {
            const { marketData, location } = nft
            return (
              <CollectibleLinkCard
                isSelected={isSelected}
                isUserNft
                onClick={() => selectNft(nft, i)}
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
      ) : (
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
