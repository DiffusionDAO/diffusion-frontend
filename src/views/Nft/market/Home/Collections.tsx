import { Button, ChevronRightIcon, Flex, Grid, Heading, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { CollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'

// const BtnViewWrap = styled.div`
// width: calc(50% - 5px);
//   border-radius: 8px;
//   color: #fff;
//   line-height: 36px;
//   text-align: center;
//   cursor: pointer;
//   border: 2px solid #EC6EFF;
// `

const Collections: React.FC<{ title: string; testId: string; collections: Collection[] }> = ({
  title,
  testId,
  collections,
}) => {
  const { t } = useTranslation()

  const addresses = Object.keys(collections)
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="32px" mt="80px">
        <Heading as="h3" scale="lg" data-test={testId}>
          {title}
        </Heading>
        <Button
          style={{ borderRadius: '8px', border: '2px solid #EC6EFF', color: '#fff', width: '200px' }}
          as={NextLinkFromReactRouter}
          to={`${nftsBaseUrl}/collections/`}
          variant="secondary"
          scale="sm"
          endIcon={<ChevronRightIcon color="#fff" width="24px" />}
        >
          {t('View All')}
        </Button>
      </Flex>
      <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(2, 1fr)']} mb="64px">
        {addresses.map((address) => {
          const collection = collections[address].data[0]
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
