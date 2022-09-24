import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection, getNftApi,getCollectionApi,getNfts } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
// eslint-disable-next-line camelcase
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

  if (typeof collectionAddress !== 'string' || typeof tokenId !== 'string') {
    return {
      notFound: true,
    }
  }
  const nfts = getNfts()
  let collectionWithToken
  if (!nfts) {
    collectionWithToken = await getCollectionApi(collectionAddress)
  } else {
    collectionWithToken = nfts[collectionAddress]
  }
  const collection = {[collectionAddress] : collectionWithToken[collectionAddress].data[0]}
  const metadata:any = collectionWithToken[collectionAddress].tokens[tokenId]
  console.log("metadata:",metadata)
  if (!metadata) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }

  const nft: NftToken = {
    tokenId,
    collectionAddress,
    collectionName: metadata.collectionName,
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    attributes: metadata.attributes,
  }

  return {
    props: {
      fallback: {
        [unstable_serialize(['nft', nft.collectionAddress, nft.tokenId])]: nft,
        ...(collection && {
          [unstable_serialize(['nftMarket', 'collections', collectionAddress.toLowerCase()])]: collection,
        }),
      },
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
