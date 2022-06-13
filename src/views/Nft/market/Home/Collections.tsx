import { Button, ChevronRightIcon, Flex, Grid, Heading, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { CollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'
import { useEffect, useLayoutEffect, useMemo } from 'react'
const toBuffer = require('it-to-buffer')

const { create } = require('ipfs-http-client')
// export const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: '5001',
//   protocol: 'https',
// })

export const ipfs = create({
  host: '207.148.117.14',
  port: '5001',
  protocol: 'http',
})
const Collections: React.FC<{ title: string; testId: string; collections: Collection[] }> = ({
  title,
  testId,
  collections,
}) => {
  const { t } = useTranslation()
    // collections.map(async (collection) => {
    //   const small = collection.banner.small.slice(1)
    //   try {
    //     const res = ipfs.cat(small)
    //     var buffer = await toBuffer(res)
    //     var blob = new Blob([buffer])
    //     collection.banner.small = URL.createObjectURL(blob)
    //   } catch (error) {
    //     console.log("error:", error)
    //   }
    //   var avatar = collection.avatar.slice(1)
    //   try {
    //     const res = ipfs.cat(avatar)
    //     var buffer = await toBuffer(res)
    //     var blob = new Blob([buffer])
    //     collection.avatar = URL.createObjectURL(blob)
    //   } catch (error) {
    //     console.log("error:", error)
    //   }
    //   const large = collection.banner.large.slice(1)
    //   try {
    //     const res = ipfs.cat(large)
    //     var buffer = await toBuffer(res)
    //     var blob = new Blob([buffer])
    //     collection.banner.large = URL.createObjectURL(blob)
    //   } catch (error) {
    //     console.log("error:", error)
    //   }
    // })

  return (
    <>
      {/* <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <Heading as="h3" scale="lg" data-test={testId}>
          {title}
        </Heading>
        <Button
          as={NextLinkFromReactRouter}
          to={`${nftsBaseUrl}/collections/`}
          variant="secondary"
          scale="sm"
          endIcon={<ChevronRightIcon color="primary" width="24px" />}
        >
          {t('View All')}
        </Button>
      </Flex> */}
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
        {collections.map((collection) => {
          return (
            <CollectionCard
              key={collection.address}
              bgSrc={collection.banner.small}
              avatarSrc={collection.avatar}
              collectionName={collection.name}
              url={`${nftsBaseUrl}/collections/${collection.address}`}
            >
              <Flex alignItems="center">
                <Text fontSize="12px" color="textSubtle">
                  {t('Volume')}
                </Text>
                <BNBAmountLabel amount={collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0} />
              </Flex>
            </CollectionCard>
          )
        })}
      </Grid>
    </>
  )
}

export default Collections
