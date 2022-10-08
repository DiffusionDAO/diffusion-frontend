import { useState, useEffect } from 'react'
import { Grid, useModal, Text, Flex } from '@pancakeswap/uikit'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectibleActionCard, CollectibleLinkCard } from '../../Nft/market/components/CollectibleCard'
import GridPlaceholder from '../../Nft/market/components/GridPlaceholder'
import ProfileNftModal from '../../Nft/market/components/ProfileNftModal'
import NoNftsImage from '../../Nft/market/components/Activity/NoNftsImage'
import SellModal from '../../Nft/market/components/BuySellModals/SellModal'

interface ProfileNftProps {
  nft: NftToken
  location: NftLocation
}

interface SellNftProps {
  nft: NftToken
  location: NftLocation
  variant: 'sell' | 'edit'
}

const UserNfts: React.FC<
  React.PropsWithChildren<{
    isSelected: boolean
    nfts: NftToken[]
    isLoading: boolean
    selectNft: (param: NftToken) => void
    onSuccessSale?: () => void
    onSuccessEditProfile?: () => void
  }>
> = ({ isSelected, nfts, isLoading, selectNft, onSuccessSale, onSuccessEditProfile }) => {
  const { t } = useTranslation()
  const handleCollectibleClick = (nft: NftToken, location: NftLocation) => {
    if (isSelected) {
      selectNft(nft)
    }
  }
  return (
    <>
      {nfts.length === 0 && !isLoading ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No NFTs found')}
          </Text>
        </Flex>
      ) : nfts.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nfts.map((nft) => {
            const { marketData, location } = nft

            return (
              <CollectibleLinkCard
                isSelected={isSelected}
                isUserNft
                onClick={() => handleCollectibleClick(nft, location)}
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
