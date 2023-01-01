import { Button, ChevronRightIcon, Flex, Grid, Heading, Text,NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { useEffect } from 'react'
import { formatUnits } from '@ethersproject/units'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CollectionCard } from '../components/CollectibleCard'
import { DFSAmountLabel } from '../components/CollectibleCard/styles'

const Collections: React.FC<{ title: string; testId: string; collections: Collection[] }> = ({
  title,
  testId,
  collections,
}) => {
  const { t } = useTranslation()
  const addresses = Object.keys(collections)
  const {chainId} = useActiveChainId()
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="32px" mt="80px">
        <Heading as="h3" scale="lg" data-test={testId}>
          {title}
        </Heading>
        <Button
          style={{ borderRadius: '8px', border: '2px solid #EC6EFF', color: '#fff', width: '200px' }}
          as={NextLinkFromReactRouter}
          to={`${nftsBaseUrl}/collections`}
          variant="secondary"
          scale="sm"
          endIcon={<ChevronRightIcon color="#fff" width="24px" />}
        >
          {t('View All')}
        </Button>
      </Flex>
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(2, 1fr)']} mb="64px">
        {addresses.map((address) => {
          const collection = collections[address]
          return (
            <CollectionCard
              key={collection?.address}
              bgSrc={collection?.banner?.small}
              avatarSrc={collection?.avatar}
              collectionName={collection?.name}
              url={`${nftsBaseUrl}/collections/${collection?.address}/${chainId}`}
            >
              <Flex alignItems="center">
                <Text fontSize="12px" color="textSubtle">
                  {t('Volume')}
                </Text>
                <DFSAmountLabel amount={collection?.totalVolume} />
              </Flex>
            </CollectionCard>
          )
        })}
      </Grid>
    </>
  )
}

export default Collections
