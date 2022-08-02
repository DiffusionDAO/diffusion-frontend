import { useCallback } from 'react'
import { BunnyPlaceholderIcon, AutoRenewIcon, Button, Flex, Grid, Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { useCollectionNfts } from '../../hooks/useCollectionNfts'
import { getDFSNFTAddress } from 'utils/addressHelpers'
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from '@ethersproject/units'

interface CollectionNftsProps {
  collection: Collection
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection }) => {
  const { address: collectionAddress } = collection || {}
  const { t } = useTranslation()
  const { nfts, isFetchingNfts, page, setPage, resultSize, isLastPage } = useCollectionNfts(collectionAddress)
  const dfsNFTAddress = getDFSNFTAddress()
  nfts.map(nft => {
    if (nft.collectionAddress === dfsNFTAddress) {
      nft.image.thumbnail = `/images/nfts/${nft.attributes[0].value}`
    }
  })
  const handleLoadMore = useCallback(() => {
    setPage(page + 1)
  }, [setPage, page])

  if ((!nfts || nfts?.length === 0) && isFetchingNfts) {
    return <GridPlaceholder />
  }

  return (
    <>
      {resultSize && (
        <Flex p="16px">
          <Text bold>
            {resultSize} {t('Results')}
          </Text>
        </Flex>
      )}
      {nfts.length > 0 ? (
        <>
          <Grid
            gridGap="16px"
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nfts.map((nft) => {
              let currentAskPriceAsNumber:any = nft.marketData && parseFloat(nft?.marketData?.currentAskPrice)
               console.log(typeof currentAskPriceAsNumber)
              if(!isNaN(currentAskPriceAsNumber) ){
                console.log('currentAskPric++++',currentAskPriceAsNumber)
              currentAskPriceAsNumber = BigNumber.from(String(currentAskPriceAsNumber))
              currentAskPriceAsNumber = formatUnits(currentAskPriceAsNumber,18)
              }
               
              return (
                <CollectibleLinkCard
                  key={nft.tokenId}
                  nft={nft}
                  currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                />
              )
            })}
          </Grid>
          <Flex mt="60px" mb="12px" justifyContent="center">
            {!isLastPage && (
              <Button
                onClick={handleLoadMore}
                scale="sm"
                disabled={isFetchingNfts}
                endIcon={isFetchingNfts ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              >
                {isFetchingNfts ? t('Loading') : t('Load more')}
              </Button>
            )}
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text fontWeight={600}>{t('No NFTs found')}</Text>
        </Flex>
      )}
    </>
  )
}

export default CollectionNfts
