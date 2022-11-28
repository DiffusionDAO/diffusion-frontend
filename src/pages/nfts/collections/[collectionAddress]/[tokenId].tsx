import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection, getNftApi, getCollectionApi } from 'state/nftMarket/helpers'
import { ApiCollection, Collection, NftToken } from 'state/nftMarket/types'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { getSocialNFTAddress, getStarlightAddress, getNftMarketAddress, getMiningAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/contractHelpers'
import socialNFTAbi from 'config/abi/socialNFTAbi.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import dfsMiningAbi from 'config/abi/dfsMining.json'
import { CollectionData, levelToName, levelToSPOS, NFT } from 'pages/profile/[accountAddress]'
import { formatUnits } from '@ethersproject/units'
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

  const socianNFTAddress = getSocialNFTAddress()
  const socialNFT = getContract({ abi: socialNFTAbi, address: socianNFTAddress, chainId: ChainId.BSC_TESTNET })

  const getToken = await socialNFT.getToken(tokenId)
  const level = getToken?.level?.toString()
  const name = `${levelToName[level]}#${getToken.tokenId}`

  const nftMarketAddress = getNftMarketAddress()
  const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId: ChainId.BSC_TESTNET })
  const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)

  const dfsMiningAddress = getMiningAddress()
  const dfsMining = getContract({ abi: dfsMiningAbi, address: dfsMiningAddress, chainId: ChainId.BSC_TESTNET })
  const staker = await dfsMining.staker(tokenId)

  const nft: NFT = { ...getToken, ...sellPrice, collectionAddress, name, staker }

  console.log(nft)
  let collection = await getCollection(collectionAddress)
  collection = JSON.parse(JSON.stringify(collection))

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
  const token = {
    tokenId,
    collectionAddress,
    name,
    image: { original: 'string', thumbnail },
    attributes: [
      {
        traitType: 'Level',
        value: level,
        displayType: '',
      },
    ],
    staker: nft.staker,
    owner: nft.owner,
    marketData: {
      tokenId,
      collection: {
        id: tokenId,
      },
      currentAskPrice: formatUnits(nft.price),
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
