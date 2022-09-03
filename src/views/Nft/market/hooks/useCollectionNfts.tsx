import { useEffect, useState, useRef, useMemo } from 'react'
import {
  ApiResponseCollectionTokens,
  ApiSingleTokenData,
  NftAttribute,
  NftToken,
  Collection,
} from 'state/nftMarket/types'
import { useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale, useGetCollection } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import {
  fetchNftsFiltered,
  getMarketDataForTokenIds,
  getNftApi,
  getNftsFromCollectionApi,
  getNftsMarketData,
} from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { REQUEST_SIZE } from '../Collection/config'
import { API_NFT, GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import { getDFSNFTContract, getNftMarketContract, getStarlightContract } from 'utils/contractHelpers'
import { getDFSNFTAddress, getStarlightAddress } from 'utils/addressHelpers'
import { BigNumber } from "@ethersproject/bignumber";

interface ItemListingSettings {
  field: string
  direction: 'asc' | 'desc'
  showOnlyNftsOnSale: boolean
  nftFilters: Record<string, NftAttribute>
}

const fetchTokenIdsFromFilter = async (address: string, settings: ItemListingSettings) => {
  const filterObject: Record<string, NftAttribute> = settings.nftFilters
  const attrParams = Object.values(filterObject).reduce(
    (accum, attr) => ({
      ...accum,
      [attr.traitType]: attr.value,
    }),
    {},
  )
  const attrFilters = !isEmpty(attrParams) ? await fetchNftsFiltered(address, attrParams) : null
  return attrFilters ? Object.values(attrFilters.data).map((apiToken) => apiToken.tokenId) : null
}

const fetchMarketDataNfts = async (
  collection: Collection,
  settings: ItemListingSettings,
  page: number,
  tokenIdsFromFilter: string[],
): Promise<NftToken[]> => {

  // const nftMarketContract = getNftMarketContract()
  // const marketItems = await nftMarketContract.fetchMarketItems()
  const starlightAddress = await getStarlightAddress()
  const dfsAddress = await getDFSNFTAddress()
  let totalSupply = 0;
  switch (collection.address) {
    case starlightAddress:
      const starlight = await getStarlightContract()
      totalSupply = await starlight.totalSupply()
      break
    case dfsAddress:
      const dfsNFT = await getDFSNFTContract()
      totalSupply = await dfsNFT.totalSupply()
      break
  }
  totalSupply = BigNumber.from(totalSupply).toNumber()
  var tokens = [...Array(totalSupply).keys()]
  console.log("tokens:", tokens)
  const apiRequestPromises = tokens
    .map(async (tokenId) => {
      const url = `${API_NFT}/collections/${collection.address}/tokens/${tokenId.toString()}`
      const res = await fetch(url)
      if (res.ok) {
        const json = await res.json()
        return json
      }
    })
  const apiResponses = await Promise.all(apiRequestPromises)
  // console.log("apiResponses:", apiResponses)
  // const newNfts: NftToken[] = apiResponses.reduce((acc, apiNft) => {
  //   console.log("apiNft:",apiNft)
  //   const marketData = apiResponses.find((marketNft) => marketNft?.tokenId === apiNft?.tokenId)
  //   console.log("marketData:",marketData)
  //   if (apiNft) {
  //     acc.push({
  //       ...apiNft,
  //       collectionAddress: collection.address,
  //       collectionName: apiNft.collection.name,
  //       marketData: marketData,
  //     })
  //   }
  //   return acc
  // }, [] as NftToken[])
  // console.log("newNfts:", newNfts)
  return apiResponses
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
  let newNfts: NftToken[] = []
  let tokenIds: string[] = []
  let collectionNftsResponse: ApiResponseCollectionTokens = null
  let fallbackMode = nftFallbackMode
  let fallbackPage = nftFallbackPage
  if (settings.field !== 'tokenId' && !fallbackMode) {
    console.log("collection:", collection, "settings:", settings, "page:", page, "tokenIdsFromFilter:", tokenIdsFromFilter)
    // const marketDataNfts = await fetchMarketDataNfts(collection, settings, page, tokenIdsFromFilter)
    var url = `${API_NFT}/collections/${collection.address}`
    const res = await fetch(url)
    if (res.ok) {
      const json = await res.json()
      newNfts = json[collection.address].tokens
    }
    // if (marketDataNfts.length) {
    //   newNfts.push(...marketDataNfts)
    // }
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
  const collection = useGetCollection(collectionAddress)
  const { field, direction } = useGetNftOrdering(collectionAddress)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(collectionAddress)
  const nftFilters = useGetNftFilters(collectionAddress)
  const [itemListingSettings, setItemListingSettings] = useState<ItemListingSettings>({
    field,
    direction,
    showOnlyNftsOnSale,
    nftFilters,
  })

  // We don't know the amount in advance if nft filters exist
  const resultSize =
    !Object.keys(nftFilters).length && collection
      ? showOnlyNftsOnSale
        ? collection.numberTokensListed
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
      console.log("showOnlyNftsOnSale:",settings.showOnlyNftsOnSale)
      const tokenIdsFromFilter = await fetchTokenIdsFromFilter(collection?.address, settings)
      let newNfts: NftToken[] = []
      if (settings.showOnlyNftsOnSale) {
        const nftMarketContract = getNftMarketContract()
        const marketItems = await nftMarketContract.fetchMarketItems()
        const marketTokenIds = marketItems.filter(item => item[4] == collectionAddress).map(item=>item[5])
        newNfts = await marketTokenIds
        .map(async (tokenId) => {
          const url = `${API_NFT}/collections/${collection.address}/tokens/${tokenId.toString()}`
          const res = await fetch(url)
          if (res.ok) {
            const json = await res.json()
            return json
          }
        })
        newNfts = await Promise.all(newNfts)
        console.log('newNfts:',newNfts)
      } else {
        var url = `${API_NFT}/collections/${collection.address}`
        const res = await fetch(url)
        if (res.ok) {
          const json = await res.json()
          newNfts = json[collection.address].tokens
        }
        // const {
        //   nfts: allNewNfts,
        //   fallbackMode: newFallbackMode,
        //   fallbackPage: newFallbackPage,
        // } = await fetchAllNfts(
        //   collection,
        //   settings,
        //   page,
        //   tokenIdsFromFilter,
        //   fetchedNfts.current,
        //   fallbackMode.current,
        //   fallbackModePage.current,
        // )
        // newNfts = allNewNfts
        // fallbackMode.current = newFallbackMode
        // fallbackModePage.current = newFallbackPage
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
