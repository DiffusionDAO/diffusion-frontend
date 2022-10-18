import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection, getNftApi, getCollectionApi } from 'state/nftMarket/helpers'
import { ApiCollection, Collection, NftToken } from 'state/nftMarket/types'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { getNFTDatabaseAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/contractHelpers'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import { CollectionData, NFT } from 'pages/profile/[accountAddress]'
import { ChainId } from '../../../../../packages/swap-sdk/src/constants'

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

  const nftDatabaseAddress = getNFTDatabaseAddress()
  const nftDatabase = getContract({ abi: nftDatabaseAbi, address: nftDatabaseAddress, chainId: ChainId.BSC_TESTNET })
  const metadata: NFT = await nftDatabase.getToken(collectionAddress, tokenId)
  let collection = await getCollection(collectionAddress)
  collection = JSON.parse(JSON.stringify(collection))
  // const collectionWithToken: ApiCollection = await getCollectionApi(collectionAddress)
  // // const collectionWithToken: ApiCollection = {...data, address:collectionAddress, name:""}
  // console.log("collectionWithToken:",collectionWithToken)
  // const collection = { [collectionAddress]: collectionWithToken[collectionAddress].data[0] }
  // const metadata: any = collectionWithToken[collectionAddress].tokens[tokenId]
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
    name: metadata.collectionName,
    description: metadata.collectionName,
    image: { original: 'string', thumbnail: `/images/nfts/${metadata.level.toString()}` },
    attributes: [{ value: metadata.level.toString() }],
    staked: metadata.staked,
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
