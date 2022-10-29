import { useEffect, useState, useRef, useMemo } from 'react'
import {
  ApiResponseCollectionTokens,
  ApiSingleTokenData,
  NftAttribute,
  NftToken,
  Collection,
  NftLocation,
} from 'state/nftMarket/types'
import {
  useGetNftFilters,
  useGetNftOrdering,
  useGetNftShowOnlyOnSale,
  useGetCollection,
  useGetCollections,
} from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import {
  fetchNftsFiltered,
  getCollection,
  getCollectionApi,
  getCollectionsApi,
  getMarketDataForTokenIds,
  getNftApi,
  getNftsFromCollectionApi,
  getNftsMarketData,
} from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import fromPairs from 'lodash/fromPairs'
import { getContract } from 'utils/contractHelpers'
import { useNftMarketContract } from 'hooks/useContract'
import { getDFSNFTAddress, getNFTDatabaseAddress, getNftMarketAddress, getStarlightAddress } from 'utils/addressHelpers'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import { levelToName, CollectionData, NFT, nftToNftToken, levelToSPOS } from 'pages/profile/[accountAddress]'
import useSWR from 'swr'
import { useTranslation } from '@pancakeswap/localization'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { ChainId } from '../../../../../packages/swap-sdk/src/constants'
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

const fetchAllNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
  tokenIdsFromFilter: string[],
  fetchedNfts: NftToken[],
  nftFallbackMode: boolean,
  nftFallbackPage: number,
): Promise<{ nfts: NftToken[]; fallbackMode: boolean; fallbackPage: number }> => {
  const newNfts: NftToken[] = []
  let tokenIds: string[] = []
  let collectionNftsResponse: ApiResponseCollectionTokens = null
  let fallbackMode = nftFallbackMode
  let fallbackPage = nftFallbackPage
  if (settings.field !== 'tokenId' && !fallbackMode) {
    const marketDataNfts = await fetchMarketDataNfts(collection, settings, page, tokenIdsFromFilter)
    if (marketDataNfts.length) {
      newNfts.push(...marketDataNfts)
    }
    if (newNfts.length < REQUEST_SIZE) {
      // eslint-disable-next-line no-param-reassign
      fallbackMode = true
      fetchedNfts.push(...newNfts)
    } else {
      return { nfts: newNfts, fallbackMode, fallbackPage }
    }
  }

  if (fallbackMode) {
    tokenIds = tokenIdsFromFallback(collection, tokenIdsFromFilter, fetchedNfts, fallbackPage)
    // eslint-disable-next-line no-param-reassign
    fallbackPage += 1
  } else if (tokenIdsFromFilter) {
    tokenIds = tokenIdsFromFilter.slice(page * REQUEST_SIZE, (page + 1) * REQUEST_SIZE)
  } else {
    collectionNftsResponse = await getNftsFromCollectionApi(collection.address, REQUEST_SIZE, page + 1)
    if (collectionNftsResponse?.data) {
      tokenIds = Object.values(collectionNftsResponse.data).map((nft) => nft.tokenId)
    }
  }

  if (tokenIds.length) {
    const nftsMarket = await getMarketDataForTokenIds(collection.address, tokenIds)

    const responsesPromises = tokenIds.map(async (id) => {
      const apiMetadata: ApiSingleTokenData = collectionNftsResponse
        ? collectionNftsResponse.data[id]
        : await getNftApi(collection.address, id)
      if (apiMetadata) {
        const marketData = nftsMarket.find((nft) => nft.tokenId === id)

        return {
          tokenId: id,
          name: apiMetadata.name,
          description: apiMetadata.description,
          collectionName: apiMetadata.collection.name,
          collectionAddress: collection.address,
          image: apiMetadata.image,
          attributes: apiMetadata.attributes,
          marketData,
        }
      }
      return null
    })

    const responseNfts: NftToken[] = (await Promise.all(responsesPromises)).filter((x) => x)
    newNfts.push(...responseNfts)
    return { nfts: newNfts, fallbackMode, fallbackPage }
  }
  return { nfts: [], fallbackMode, fallbackPage }
}

export const useCollectionNfts = (collectionAddress: string) => {
  const fetchedNfts = useRef<NftToken[]>([])
  const fallbackMode = useRef(false)
  const fallbackModePage = useRef(0)
  const isLastPage = useRef(false)
  const { t } = useTranslation()
  const [tokens, setTokens] = useState<any[]>()
  const nftDatabaseAddress = getNFTDatabaseAddress()
  const nftDatabase = getContract({ abi: nftDatabaseAbi, address: nftDatabaseAddress, chainId: ChainId.BSC_TESTNET })
  const { data: collection, status: collectionStatus } = useSWR('collections', async () => {
    const collection: any = getCollection(collectionAddress)

    const tokenIds = await nftDatabase.getCollectionTokenIds(collectionAddress)
    const getTokens = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenIdString = tokenId.toString()
        const nft: NFT = await nftDatabase.getToken(collectionAddress, tokenIdString)
        const level = nft.level.toString()
        let thumbnail
        let name
        const starLightAddress = getStarlightAddress()
        const dfsNFTAddress = getDFSNFTAddress()
        if (collectionAddress === starLightAddress) {
          thumbnail = `/images/nfts/starlight/starlight${tokenId}.gif`
          name = `StarLight#${tokenId}`
        } else if (collectionAddress === dfsNFTAddress) {
          thumbnail = `/images/nfts/socialnft/${level}`
          name = `${levelToName[level]}#${tokenId}`
        }
        const token = {
          tokenId: tokenIdString,
          name,
          description: name,
          collectionName: nft.collectionName,
          collectionAddress: nft.collectionAddress,
          image: {
            original: 'string',
            thumbnail,
          },
          attributes: [
            {
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
    setTokens(getTokens)
    return collection
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
    !Object.keys(nftFilters).length && collection
      ? showOnlyNftsOnSale
        ? collection?.numberTokensListed
        : collection?.totalSupply
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

  const nftMarketContract = useNftMarketContract()
  // const nftMarketAddress = getNftMarketAddress()
  // const nftMarketContract = new Contract(nftMarketAddress, nftMarketAbi, signer)
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
    async (address, settingsJson, page) => {
      const settings: ItemListingSettings = JSON.parse(settingsJson)
      const tokenIdsFromFilter = await fetchTokenIdsFromFilter(collection?.address, settings)
      let newNfts: NftToken[] = []
      if (settings.showOnlyNftsOnSale) {
        const marketItems = await nftMarketContract.fetchMarketItems()
        console.log(marketItems)
        const marketTokenIds = marketItems
          .filter((item) => item.collection === collectionAddress)
          .map((item) => item.tokenId)
        newNfts = await Promise.all(
          marketTokenIds.map(async (tokenId) => {
            const token = await nftDatabase.getToken(collectionAddress, tokenId)
            return nftToNftToken(token, t)
          }),
        )

        // eslint-disable-next-line no-return-assign, no-param-reassign
      } else {
        // const {
        //   nfts: allNewNfts,
        //   fallbackMode: newFallbackMode,
        //   fallbackPage: newFallbackPage,
        // } = await fetchAllNfts(
        //   collection,
        //   settings,
        //   page,
        //   [],
        //   fetchedNfts.current,
        //   fallbackMode.current,
        //   fallbackModePage.current,
        // )
        // newNfts = allNewNfts
        // fallbackMode.current = newFallbackMode
        // fallbackModePage.current = newFallbackPage
        newNfts = tokens.slice(page * REQUEST_SIZE, (page + 1) * REQUEST_SIZE)
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
