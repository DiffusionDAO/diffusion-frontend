import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection, getNftApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
/* eslint-disable camelcase */
import { SWRConfig, unstable_serialize } from 'swr'


const IndividualNFTPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <IndividualNFT />
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
  const { collectionAddress, tokenId } = params
  console.log("getStaticProps:",collectionAddress, tokenId)
  if (typeof collectionAddress !== 'string' || typeof tokenId !== 'string') {
    return {
      notFound: true,
    }
  }

  // const metadata = await getNftApi(collectionAddress, tokenId)
  const collection = await getCollection(collectionAddress)
  const metadata = collection[collectionAddress]
  if (!metadata) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }
  const nft: NftToken = {
    tokenId,
    collectionAddress,
    collectionName: metadata.name,
    name: metadata.name,
    description: metadata.description,
    image: {original:"string", thumbnail: metadata.banner.large},
    // attributes: metadata.attributes,
  }

  return {
    props: {
      fallback: {
        [unstable_serialize(['nft', nft.collectionAddress, nft.tokenId])]: nft,
        ...(metadata && {
          [unstable_serialize(['nftMarket', 'collections', collectionAddress.toLowerCase()])]: metadata,
        }),
      },
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
