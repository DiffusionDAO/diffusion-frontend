import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getCollection } from 'state/nftMarket/helpers'
import { ApiCollection, Collection, NftToken } from 'state/nftMarket/types'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import {
  getSocialNFTAddress,
  getStarlightAddress,
  getNftMarketAddress,
  getMiningAddress,
  getDiffusionAICatAddress,
} from 'utils/addressHelpers'
import { getContract } from 'utils/contractHelpers'
import socialNFTAbi from 'config/abi/socialNFTAbi.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import dfsMiningAbi from 'config/abi/dfsMining.json'
import { levelToName, levelToSPOS, NFT, tokenIdToName } from 'pages/profile/[accountAddress]'
import { formatUnits } from '@ethersproject/units'
import { erc721ABI } from 'wagmi'
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

  const erc721 = getContract({ abi: erc721ABI, address: collectionAddress, chainId: ChainId.BSC_TESTNET })
  const socialNFTAddress = getSocialNFTAddress()
  const socialNFT = getContract({ abi: socialNFTAbi, address: socialNFTAddress, chainId: ChainId.BSC_TESTNET })

  const getToken = await socialNFT.getToken(tokenId)
  const level = getToken?.level?.toString()

  const nftMarketAddress = getNftMarketAddress()
  const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId: ChainId.BSC_TESTNET })
  const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)

  const dfsMiningAddress = getMiningAddress()
  const dfsMining = getContract({ abi: dfsMiningAbi, address: dfsMiningAddress, chainId: ChainId.BSC_TESTNET })
  const staker = await dfsMining.staker(tokenId)

  let name = await erc721.name()
  let thumbnail
  const starLightAddress = getStarlightAddress()
  const diffusionCatAddress = getDiffusionAICatAddress()
  thumbnail = `/images/nfts/${name.toLowerCase()}/${tokenId}`
  switch (collectionAddress) {
    case socialNFTAddress:
      thumbnail = `/images/nfts/${name.toLowerCase()}/${getToken?.level}`
      name = `${levelToName[level]}#${getToken.tokenId}`
      break
    case diffusionCatAddress:
      name = tokenIdToName[tokenId]
      break
    case starLightAddress:
      name = `StarLight#${getToken.tokenId}`
      break
    default:
      break
  }
  const nft: NFT = { ...getToken, ...sellPrice, collectionAddress, staker, thumbnail }

  let collection = await getCollection(collectionAddress)
  collection = JSON.parse(JSON.stringify(collection))

  if (!nft) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }

  const token = {
    tokenId,
    collectionAddress,
    name,
    image: { original: 'string', thumbnail },
    staker: nft.staker,
    owner: nft.owner,
    level: nft.level,
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
