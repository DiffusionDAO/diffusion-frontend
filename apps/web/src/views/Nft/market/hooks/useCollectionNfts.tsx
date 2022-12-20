import { useEffect, useState, useRef, useMemo } from 'react'
import { NftAttribute, NftToken, Collection, NftLocation } from 'state/nftMarket/types'
import { useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import { fetchNftsFiltered, getNftApi, getNftsMarketData } from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import fromPairs from 'lodash/fromPairs'
import { getContract, getDiffusionAICatContract } from 'utils/contractHelpers'
import { useERC721, useNftMarketContract } from 'hooks/useContract'
import {
  getSocialNFTAddress,
  getNftMarketAddress,
  getStarlightAddress,
  getMiningAddress,
  getDiffusionAICatAddress,
} from 'utils/addressHelpers'
import socialNFTAbi from 'config/abi/socialNFTAbi.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import dfsMiningAbi from 'config/abi/dfsMining.json'
import diffusionAICatAbi from 'config/abi/diffusionAICat.json'
import useSWR from 'swr'

import {
  levelToName,
  NFT,
  nftToNftToken,
  levelToSPOS,
  tokenIdToName,
  zeroAddress,
} from 'pages/profile/[accountAddress]'
import { useTranslation } from '@pancakeswap/localization'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { REQUEST_SIZE } from '../Collection/config'

interface ItemListingSettings {
  field: string
  direction: 'asc' | 'desc'
  showOnlyNftsOnSale: boolean
  nftFilters: Record<string, NftAttribute>
}

const fetchTokenIdsFromFilter = async (address: string, settings: ItemListingSettings) => {
  const filterObject: Record<string, NftAttribute> = settings.nftFilters
  const attrParams = fromPairs(Object.values(filterObject).map((attr) => [attr.traitType, attr.value]))
  const attrFilters = !isEmpty(attrParams) ? await fetchNftsFiltered(address, attrParams) : null
  return attrFilters ? Object.values(attrFilters.data).map((apiToken) => apiToken.tokenId) : null
}

const fetchMarketDataNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
  tokenIdsFromFilter: string[],
): Promise<NftToken[]> => {
  const whereClause = tokenIdsFromFilter
    ? {
        collection: collection.address.toLowerCase(),
        isTradable: true,
        tokenId_in: tokenIdsFromFilter,
      }
    : { collection: collection.address.toLowerCase(), isTradable: true }
  const subgraphRes = await getNftsMarketData(
    whereClause,
    REQUEST_SIZE,
    settings.field,
    settings.direction,
    page * REQUEST_SIZE,
  )

  const apiRequestPromises = subgraphRes.map((marketNft) => getNftApi(collection.address, marketNft.tokenId))
  const apiResponses = await Promise.all(apiRequestPromises)
  const newNfts: NftToken[] = apiResponses.reduce((acc, apiNft) => {
    if (apiNft) {
      acc.push({
        ...apiNft,
        collectionAddress: collection.address,
        collectionName: apiNft.collection.name,
        marketData: subgraphRes.find((marketNft) => marketNft.tokenId === apiNft.tokenId),
      })
    }
    return acc
  }, [] as NftToken[])
  return newNfts
}

const tokenIdsFromFallback = (
  collection: Collection,
  tokenIdsFromFilter: string[],
  fetchedNfts: NftToken[],
  fallbackPage: number,
): string[] => {
  let tokenIds: string[] = []
  const startIndex = fallbackPage * REQUEST_SIZE
  const endIndex = (fallbackPage + 1) * REQUEST_SIZE
  if (tokenIdsFromFilter) {
    tokenIds = tokenIdsFromFilter
      .filter((tokenId) => !fetchedNfts.some((fetchedNft) => fetchedNft.tokenId === tokenId))
      .slice(startIndex, endIndex)
  } else {
    const totalSupply = parseInt(collection?.totalSupply)
    let counter = startIndex
    let index = startIndex
    while (counter < endIndex) {
      if (index > totalSupply) {
        break
      }
      // eslint-disable-next-line no-loop-func
      if (!fetchedNfts.some((fetchedNft) => parseInt(fetchedNft.tokenId) === index)) {
        tokenIds.push(index.toString())
        counter++
      }
      index++
    }
  }
  return tokenIds
}

export const useCollectionNfts = (collectionAddress: string) => {
  const {chainId} = useActiveChainId()
  const fetchedNfts = useRef<NftToken[]>([])
  const fallbackMode = useRef(false)
  const fallbackModePage = useRef(0)
  const isLastPage = useRef(false)
  const { t } = useTranslation()
  const [tokenIds, setTokenIds] = useState<number[]>()
  const [tokenIdsOnSale, setTokenIdsOnSale] = useState<number[]>()
  const socialNFTAddress = getSocialNFTAddress(chainId)
  const socialNFT = getContract({ abi: socialNFTAbi, address: socialNFTAddress, chainId })

  const starlightAddress = getStarlightAddress(chainId)
  const starlight = getContract({ abi: socialNFTAbi, address: starlightAddress, chainId })

  const nftMarketAddress = getNftMarketAddress(chainId)
  const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId })

  const dfsMiningAddress = getMiningAddress(chainId)
  const dfsMining = getContract({ abi: dfsMiningAbi, address: dfsMiningAddress, chainId })

  const diffusionAICatAddress = getDiffusionAICatAddress(chainId)

  const diffusionAICatContract = getContract({
    abi: diffusionAICatAbi,
    address: diffusionAICatAddress,
    chainId,
  })
  const erc721 = useERC721(collectionAddress)

  useSWR('collections', async () => {
    const getTokenContract = getContract({
      abi: socialNFTAbi,
      address: collectionAddress,
      chainId,
    })
    setTokenIds(await getTokenContract.allTokens())

    setTokenIdsOnSale(await getTokenContract.tokensOfOwner(nftMarket.address))
  })

  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState<ItemListingSettings>({
    field,
    direction,
    showOnlyNftsOnSale,
    nftFilters,
  })

  const resultSize =
    !Object.keys(nftFilters).length && tokenIds
      ? showOnlyNftsOnSale
        ? tokenIdsOnSale?.length
        : tokenIds?.length
      : null

  const itemListingSettingsJson = JSON.stringify(itemListingSettings)
  const filtersJson = JSON.stringify(nftFilters)

  useEffect(() => {
    setItemListingSettings(() => ({
      field,
      direction,
      showOnlyNftsOnSale,
      nftFilters: JSON.parse(filtersJson),
    }))
    fallbackMode.current = false
    fallbackModePage.current = 0
    fetchedNfts.current = []
    isLastPage.current = false
  }, [field, direction, showOnlyNftsOnSale, filtersJson])

  const {
    data: nfts,
    status,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (pageIndex !== 0 && previousPageData && !previousPageData.length) return null
      return [collectionAddress, itemListingSettingsJson, pageIndex, 'collectionNfts']
    },
    async (address, settingsJson:string, page:number) => {
      const collectionName = await erc721.name()
      const getTokenContract = getContract({
        abi: socialNFTAbi,
        address: collectionAddress,
        chainId,
      })
      const tokens = await Promise.all(
        tokenIds.slice(page * REQUEST_SIZE, (page + 1) * REQUEST_SIZE).map(async (tokenId) => {
          const tokenIdString = tokenId.toString()
          // const collectionName = await getTokenContract.name()
          const getToken = await getTokenContract.getToken(tokenId)
          const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)
          const nft: NFT = { ...getToken, ...sellPrice }
          if (collectionAddress === socialNFTAddress) nft.staker = await dfsMining.staker(tokenId)
          const level = nft.level
          let name
          let thumbnail
          thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${tokenId}`
          switch (collectionAddress) {
            case socialNFTAddress:
              thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${level}`
              name = `${t(levelToName[level])}#${tokenId}`
              break
            case starlightAddress:
              name = `StarLight#${tokenId}`
              break
            case diffusionAICatAddress:
              name = `${tokenIdToName[tokenId]}`
              break
            default:
              break
          }
          const token = {
            tokenId: tokenIdString,
            name,
            description: name,
            collectionName,
            collectionAddress,
            image: {
              original: 'string',
              thumbnail,
            },
            level,
            attributes: [
              collectionAddress === socialNFTAddress && {
                traitType: 'SPOS',
                value: levelToSPOS[level],
                displayType: '',
              },
            ],
            createdAt: '',
            updatedAt: '',
            location: NftLocation.FORSALE,
            marketData: {
              tokenId: tokenIdString,
              collection: {
                id: tokenIdString,
              },
              currentAskPrice: formatUnits(nft.price, 'ether'),
              currentSeller: nft?.seller,
              isTradable: true,
            },
            staker: nft?.staker,
            owner: nft?.owner,
            seller: nft?.seller,
          }
          return token
        }),
      )
      const settings: ItemListingSettings = JSON.parse(settingsJson)
      const tokenIdsFromFilter = await fetchTokenIdsFromFilter(collectionAddress, settings)

      let newNfts: NftToken[] = []
      if (settings.showOnlyNftsOnSale) {
        newNfts = await Promise.all(
          tokenIdsOnSale.map(async (tokenId) => {
            const token = await getTokenContract.getToken(tokenId)
            let name

            let thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${tokenId}`

            switch (collectionAddress) {
              case socialNFTAddress:
                thumbnail = `/images/nfts/${collectionName.toLowerCase()}/${token.level}`
                name = `${levelToName[token?.level]}#${tokenId}`
                break
              case diffusionAICatAddress:
                name = `${tokenIdToName[tokenId]}`
                console.log(collectionAddress, diffusionAICatAddress, name)
                break
              case starlightAddress:
                name = `StarLight#${tokenId}`
                break
              default:
                break
            }
            const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)
            const nft: NFT = { ...token, ...sellPrice, collectionName, collectionAddress, name, thumbnail,chainId }
            const toToken = nftToNftToken(nft)
            return toToken
          }),
        )

        // eslint-disable-next-line no-return-assign, no-param-reassign
      } else {
        newNfts = tokens
      }
      if (newNfts.length < REQUEST_SIZE) {
        isLastPage.current = true
      }
      return newNfts
    },
    { revalidateAll: true },
  )
  const uniqueNftList: NftToken[] = useMemo(() => (nfts ? uniqBy(nfts.flat(), 'tokenId') : []), [nfts])
  fetchedNfts.current = uniqueNftList

  return {
    nfts: uniqueNftList,
    isFetchingNfts: status !== FetchStatus.Fetched,
    page: size,
    setPage: setSize,
    resultSize,
    isLastPage: isLastPage.current,
  }
}
