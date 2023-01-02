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
import { levelToName, levelToSPOS, NFT, tokenIdToName, zeroAddress } from 'pages/profile/[accountAddress]'
import { formatUnits } from '@ethersproject/units'
import { erc721ABI } from 'wagmi'
import { ChainId,ChainIdName } from '@pancakeswap/sdk'

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
  const { collectionAddress, tokenId, chainId } = params
  if (typeof collectionAddress !== 'string' || typeof tokenId !== 'string' || typeof chainId !== 'string') {
    return {
      notFound: true,
    }
  }
  const chainIdName = ChainIdName[chainId]

  const nftMarketAddress = getNftMarketAddress(chainIdName)
  const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId:chainIdName })
  const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)


  const socialNFTAddress = getSocialNFTAddress(chainIdName)
  const erc721a = getContract({ abi: socialNFTAbi, address: collectionAddress, chainId:chainIdName})
  const getToken = await erc721a.getToken(tokenId)
  const level = getToken?.level

  let name = await erc721a.name()
  let thumbnail
  const starLightAddress = getStarlightAddress(chainIdName)
  const diffusionCatAddress = getDiffusionAICatAddress(chainIdName)
  thumbnail = `/images/nfts/${name.toLowerCase()}/${tokenId}`
  switch (collectionAddress) {
    case socialNFTAddress:
      thumbnail = `/images/nfts/${name.toLowerCase()}/${level}`
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

  const dfsMiningAddress = getMiningAddress(chainIdName)
  const dfsMining = getContract({ abi: dfsMiningAbi, address: dfsMiningAddress, chainId:chainIdName})

  const nft: NFT = {
    ...getToken,
    ...sellPrice,
    collectionAddress,
    thumbnail,
    name,
    staker: collectionAddress === socialNFTAddress ? await dfsMining.staker(tokenId) : zeroAddress,
    chainId
  }

  let collection = await getCollection(collectionAddress, chainIdName)
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

  console.log('token:', token)
  return {
    props: {
      fallback: {
        [unstable_serialize(['nft', token.collectionAddress,chainId, token.tokenId])]: token,
        ...(collection && {
          [unstable_serialize(['nftMarket', 'collections', collectionAddress.toLowerCase()])]: collection,
        }),
      },
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
