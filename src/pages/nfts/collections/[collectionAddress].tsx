import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { getCollection, getCollectionApi } from 'state/nftMarket/helpers'
import CollectionPageRouter from 'views/Nft/market/Collection/CollectionPageRouter'
import { useNftStorage } from 'state/nftMarket/storage'
import Collection from 'views/Nft/market/Collection'
import toBuffer from 'it-to-buffer'
import { create } from 'ipfs-http-client'

const ipfs = create({
  host: '207.148.117.145',
  port: 5001,
  protocol: 'http',
})

const CollectionPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <CollectionPageRouter />
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { collectionAddress } = params
  if (typeof collectionAddress !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const collection = await getCollection(collectionAddress)
    const jsonString = JSON.stringify(collection)
    const collectionData = JSON.parse(jsonString)
    if (collectionData) {
      return {
        props: {
          fallback: {
            [unstable_serialize(['nftMarket', 'collections', collectionAddress.toLowerCase()])]: { ...collectionData },
          },
        },
        revalidate: 60 * 60 * 6, // 6 hours
      }
    }
    return {
      notFound: true,
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }
}

export default CollectionPage
