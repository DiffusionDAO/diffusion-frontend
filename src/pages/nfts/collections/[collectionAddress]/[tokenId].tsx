import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection, getNftApi, getCollectionApi } from 'state/nftMarket/helpers'
import { ApiCollection, Collection, NftToken } from 'state/nftMarket/types'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { getNFTDatabaseAddress, getStarlightAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/contractHelpers'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import { formatBigNumber } from 'utils/formatBalance'
import { CollectionData, levelToSPOS, NFT } from 'pages/profile/[accountAddress]'
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
  const nft: NFT = await nftDatabase.getToken(collectionAddress, tokenId)
  let collection = await getCollection(collectionAddress)
  collection = JSON.parse(JSON.stringify(collection))
  // const collectionWithToken: ApiCollection = await getCollectionApi(collectionAddress)
  // // const collectionWithToken: ApiCollection = {...data, address:collectionAddress, name:""}
  // console.log("collectionWithToken:",collectionWithToken)
  // const collection = { [collectionAddress]: collectionWithToken[collectionAddress].data[0] }
  // const metadata: any = collectionWithToken[collectionAddress].tokens[tokenId]
  if (!nft) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }
  let thumbnail = `/images/nfts/socialnft/${nft?.level?.toString()}`
  const starLightAddress = getStarlightAddress()
  if (collectionAddress === starLightAddress) {
    thumbnail = `/images/nfts/starlight/starlight${tokenId}.gif`
  }
  const level = nft?.level?.toString()
  const token: NftToken = {
    tokenId,
    collectionAddress,
    collectionName: nft.collectionName,
    name: nft.collectionName,
    description: nft.collectionName,
    image: { original: 'string', thumbnail },
    attributes: [{ traitType: 'SPOS', value: levelToSPOS[level].validSPOS, displayType: '' }],
    staker: nft.staker,
    owner: nft.owner,
    itemId: nft?.itemId?.toString(),
    marketData: {
      tokenId,
      collection: {
        id: tokenId,
      },
      currentAskPrice: formatBigNumber(nft.price, 2),
      currentSeller: nft.seller,
      isTradable: nft.price.gt(0) ?? false,
    },
  }
  console.log('token:', token)

  return {
    props: {
      fallback: {
        [unstable_serialize(['nft', token.collectionAddress, token.tokenId])]: token,
        ...(collection && {
          [unstable_serialize(['nftMarket', 'collections', collectionAddress.toLowerCase()])]: collection,
        }),
      },
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
