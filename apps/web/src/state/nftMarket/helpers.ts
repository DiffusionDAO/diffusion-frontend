import { gql, request } from 'graphql-request'
import { stringify } from 'querystring'
import { API_NFT, GRAPH_API_NFTMARKET } from 'config/constants/endpoints'
import { multicallv2 } from 'utils/multicall'
import erc721Abi from 'config/abi/erc721.json'
import range from 'lodash/range'
import { BigNumber } from '@ethersproject/bignumber'
import { getNftMarketContract, getContract } from 'utils/contractHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { formatBigNumber } from '@pancakeswap/utils/formatBalance'
import fromPairs from 'lodash/fromPairs'
import { getNFTDatabaseAddress, getNftMarketAddress } from 'utils/addressHelpers'
import nftMarketAbi from 'config/abi/nftMarket.json'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import { formatUnits } from '@ethersproject/units'
import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  ApiCollection,
  ApiCollections,
  ApiResponseCollectionTokens,
  ApiResponseSpecificToken,
  AskOrderType,
  Collection,
  CollectionMarketDataBaseFields,
  NftActivityFilter,
  NftLocation,
  NftToken,
  TokenIdWithCollectionAddress,
  TokenMarketData,
  Transaction,
  AskOrder,
  ApiSingleTokenData,
  NftAttribute,
  ApiTokenFilterResponse,
  ApiCollectionsResponse,
  MarketEvent,
  UserActivity,
} from './types'
import { baseNftFields, collectionBaseFields, baseTransactionFields } from './queries'


export const getCollectionsApi = async (chainId:number): Promise<ApiCollectionsResponse> => {
  const nftDatabaseAddress = getNFTDatabaseAddress(chainId)
  const nftMarketAddress = getNftMarketAddress(chainId)
  const nftDatabase = getContract({ abi: nftDatabaseAbi, address: nftDatabaseAddress, chainId })
  const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId })
  const collectionAddresses = await nftDatabase.getCollections()
  const data: ApiCollection[] = await Promise.all(
    collectionAddresses.map(async (collectionAddress) => {
      const erc721 = getContract({ abi: erc721Abi, address: collectionAddress, chainId })
      const totalSupply = await erc721.totalSupply()
      const name = await erc721.name()
      const totalVolume = await nftMarket.totalVolume(collectionAddress)
      const apiCollection: ApiCollection = {
        name,
        address: collectionAddress,
        totalSupply,
        totalVolume: formatUnits(totalVolume),
        avatar: `/images/nfts/${name.toLowerCase()}/avatar.jpg`,
        banner: {
          small: `/images/nfts/${name.toLowerCase()}/large.jpg`,
          large: `/images/nfts/${name.toLowerCase()}/large.jpg`,
        },
      }

      return apiCollection
    }),
  )
  const response: ApiCollectionsResponse = { total: data.length, data }
  return response
}

export const getCollections = async (chainId:number): Promise<Record<string, any>> => {
  try {
    const collectionsApi = await getCollectionsApi(chainId)
    const collections = collectionsApi.data.reduce((accm, collection, index) => {
      // eslint-disable-next-line no-param-reassign
      accm[collection.address] = collection
      return { ...accm }
    }, {})
    return collections
  } catch (error) {
    console.error('getCollections Unable to fetch data:', error)
    return null
  }
}

export const getCollection = async (collectionAddress: string, chainId:number): Promise<Record<string, Collection> | null> => {
  try {
    const nftMarketAddress = getNftMarketAddress(chainId)
    const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId })
    const erc721 = getContract({ abi: erc721Abi, address: collectionAddress, chainId })
    const name = await erc721.name()
    const totalSupply = await erc721.totalSupply()
    const totalVolume = await nftMarket.totalVolume(collectionAddress)
    return {
      [collectionAddress]: {
        name,
        address: collectionAddress,
        owner: '',
        verified: true,
        id: '',
        symbol: '',
        active: true,
        totalVolume: formatUnits(BigNumber.from(totalVolume), 'ether'),
        totalSupply,
        avatar: `/images/nfts/${name.toLowerCase()}/avatar.jpg`,
        banner: {
          small: `/images/nfts/${name.toLowerCase()}/large.jpg`,
          large: `/images/nfts/${name.toLowerCase()}/large.jpg`,
        },
      },
    }
  } catch (error) {
    console.error('getCollection Unable to fetch data:', error)
    return null
  }
}

export const getNftsFromCollectionApi = async (
  collectionAddress: string,
  size = 100,
  page = 1,
): Promise<ApiResponseCollectionTokens> => {
  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()
  const requestPath = `${API_NFT}/collections/${collectionAddress}/tokens${
    !isPBCollection ? `?page=${page}&size=${size}` : ``
  }`

  try {
    const res = await fetch(requestPath)
    if (res.ok) {
      const data = await res.json()
      const filteredAttributesDistribution = Object.entries(data.attributesDistribution).filter(([, value]) =>
        Boolean(value),
      )
      const filteredData = Object.entries(data.data).filter(([, value]) => Boolean(value))
      const filteredTotal = filteredData.length
      return {
        ...data,
        total: filteredTotal,
        attributesDistribution: fromPairs(filteredAttributesDistribution),
        data: fromPairs(filteredData),
      }
    }
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, res.statusText)
    return null
  } catch (error) {
    console.error(`API: Failed to fetch NFT tokens for ${collectionAddress} collection`, error)
    return null
  }
}

export const getNftApi = async (
  collectionAddress: string,
  tokenId: string,
): Promise<ApiResponseSpecificToken['data']> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/tokens/${tokenId}`)
  if (res.ok) {
    const json = await res.json()
    return json.data
  }

  console.error(`API: Can't fetch NFT token ${tokenId} in ${collectionAddress}`, res.status)
  return null
}

export const getNftsFromDifferentCollectionsApi = async (
  from: { collectionAddress: string; tokenId: string }[],
): Promise<NftToken[]> => {
  const promises = from.map((nft) => getNftApi(nft.collectionAddress, nft.tokenId))
  const responses = await Promise.all(promises)
  return responses
    .filter((resp) => resp)
    .map((res, index) => ({
      tokenId: res.tokenId,
      name: res.name,
      collectionName: res.collection.name,
      collectionAddress: from[index].collectionAddress,
      description: res.description,
      attributes: res.attributes,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      image: res.image,
    }))
}

export const getCollectionSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            ${collectionBaseFields}
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase() },
    )
    return res.collection
  } catch (error) {
    console.error('Failed to fetch collection', error)
    return null
  }
}

export const getCollectionsSg = async (): Promise<CollectionMarketDataBaseFields[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        {
          collections {
            ${collectionBaseFields}
          }
        }
      `,
    )
    return res.collections
  } catch (error) {
    console.error('Failed to fetch NFT collections', error)
    return []
  }
}

export const getNftsFromCollectionSg = async (
  collectionAddress: string,
  first = 1000,
  skip = 0,
): Promise<TokenMarketData[]> => {
  const isPBCollection = collectionAddress.toLowerCase() === pancakeBunniesAddress.toLowerCase()

  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            nfts(orderBy:${isPBCollection ? 'updatedAt' : 'tokenId'}, skip: $skip, first: $first) {
             ${baseNftFields}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase(), skip, first },
    )
    return res.collection.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs from collection', error)
    return []
  }
}

export const getNftsByBunnyIdSg = async (
  bunnyId: string,
  existingTokenIds: string[],
  orderDirection: 'asc' | 'desc',
): Promise<TokenMarketData[]> => {
  try {
    const where =
      existingTokenIds.length > 0
        ? { otherId: bunnyId, isTradable: true, tokenId_not_in: existingTokenIds }
        : { otherId: bunnyId, isTradable: true }
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsByBunnyIdSg($collectionAddress: String!, $where: NFT_filter, $orderDirection: String!) {
          nfts(first: 30, where: $where, orderBy: currentAskPrice, orderDirection: $orderDirection) {
            ${baseNftFields}
          }
        }
      `,
      {
        collectionAddress: pancakeBunniesAddress.toLowerCase(),
        where,
        orderDirection,
      },
    )
    return res.nfts
  } catch (error) {
    console.error(`Failed to fetch collection NFTs for bunny id ${bunnyId}`, error)
    return []
  }
}

export const getMarketDataForTokenIds = async (
  collectionAddress: string,
  existingTokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    if (existingTokenIds.length === 0) {
      return []
    }
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getMarketDataForTokenIds($collectionAddress: String!, $where: NFT_filter) {
          collection(id: $collectionAddress) {
            id
            nfts(first: 1000, where: $where) {
              ${baseNftFields}
            }
          }
        }
      `,
      {
        collectionAddress: collectionAddress.toLowerCase(),
        where: { tokenId_in: existingTokenIds },
      },
    )
    return res.collection.nfts
  } catch (error) {
    console.error(`Failed to fetch market data for NFTs stored tokens`, error)
    return []
  }
}

export const getNftsUpdatedMarketData = async (
  collectionAddress: string,
  tokenIds: string[],
): Promise<{ tokenId: string; currentSeller: string; currentAskPrice: BigNumber; isTradable: boolean }[]> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.viewAsksByCollectionAndTokenIds(collectionAddress.toLowerCase(), tokenIds)
    const askInfo = response?.askInfo

    if (!askInfo) return null

    return askInfo.map((tokenAskInfo, index) => {
      const isTradable = tokenAskInfo.seller ? tokenAskInfo.seller.toLowerCase() !== NOT_ON_SALE_SELLER : false

      return {
        tokenId: tokenIds[index],
        currentSeller: tokenAskInfo.seller,
        isTradable,
        currentAskPrice: tokenAskInfo.price,
      }
    })
  } catch (error) {
    console.error('Failed to fetch updated NFT market data', error)
    return null
  }
}

// export const getAccountNftsOnChainMarketData = async (
//   collections: ApiCollections,
//   account: string,
// ): Promise<TokenMarketData[]> => {
//   try {
//     const nftMarketAddress = getNftMarketAddress(chainId)
//     const collectionList = Object.values(collections)
//     const askCalls = collectionList.map((collection) => {
//       const { address: collectionAddress } = collection
//       return {
//         address: nftMarketAddress,
//         name: 'viewAsksByCollectionAndSeller',
//         params: [collectionAddress, account, 0, 1000],
//       }
//     })

//     const askCallsResultsRaw = await multicallv2({
//       abi: nftMarketAbi,
//       calls: askCalls,
//       options: { requireSuccess: false },
//     })
//     const askCallsResults = askCallsResultsRaw
//       .map((askCallsResultRaw, askCallIndex) => {
//         if (!askCallsResultRaw?.tokenIds || !askCallsResultRaw?.askInfo || !collectionList[askCallIndex]?.address)
//           return null
//         return askCallsResultRaw.tokenIds
//           .map((tokenId, tokenIdIndex) => {
//             if (!tokenId || !askCallsResultRaw.askInfo[tokenIdIndex] || !askCallsResultRaw.askInfo[tokenIdIndex].price)
//               return null

//             const currentAskPrice = formatBigNumber(askCallsResultRaw.askInfo[tokenIdIndex].price)

//             return {
//               collection: { id: collectionList[askCallIndex].address.toLowerCase() },
//               tokenId: tokenId.toString(),
//               account,
//               isTradable: true,
//               currentAskPrice,
//             }
//           })
//           .filter(Boolean)
//       })
//       .flat()
//       .filter(Boolean)

//     return askCallsResults
//   } catch (error) {
//     console.error('Failed to fetch NFTs onchain market data', error)
//     return []
//   }
// }

export const getNftsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getNftsMarketData($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) {
          nfts(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${baseNftFields}
            transactionHistory {
              ${baseTransactionFields}
            }
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

export const getAllPancakeBunniesLowestPrice = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: currentAskPrice, orderDirection: asc) {
        currentAskPrice
      }
    `,
    )
    const rawResponse: Record<string, { currentAskPrice: string }[]> = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return fromPairs(
      Object.keys(rawResponse).map((subQueryKey) => {
        const bunnyId = subQueryKey.split('b')[1]
        return [
          bunnyId,
          rawResponse[subQueryKey].length > 0 ? parseFloat(rawResponse[subQueryKey][0].currentAskPrice) : Infinity,
        ]
      }),
    )
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies lowest prices', error)
    return {}
  }
}

export const getAllPancakeBunniesRecentUpdatedAt = async (bunnyIds: string[]): Promise<Record<string, number>> => {
  try {
    const singlePancakeBunnySubQueries = bunnyIds.map(
      (
        bunnyId,
      ) => `b${bunnyId}:nfts(first: 1, where: { otherId: ${bunnyId}, isTradable: true }, orderBy: updatedAt, orderDirection: desc) {
        updatedAt
      }
    `,
    )
    const rawResponse: Record<string, { updatedAt: string }[]> = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getAllPancakeBunniesLowestPrice {
          ${singlePancakeBunnySubQueries}
        }
      `,
    )
    return fromPairs(
      Object.keys(rawResponse).map((subQueryKey) => {
        const bunnyId = subQueryKey.split('b')[1]
        return [
          bunnyId,
          rawResponse[subQueryKey].length > 0 ? Number(rawResponse[subQueryKey][0].updatedAt) : -Infinity,
        ]
      }),
    )
  } catch (error) {
    console.error('Failed to fetch PancakeBunnies latest market updates', error)
    return {}
  }
}

/**
 * Returns the lowest/highest price of any NFT in a collection
 */
export const getLeastMostPriceInCollection = async (
  collectionAddress: string,
  orderDirection: 'asc' | 'desc' = 'asc',
) => {
  try {
    const response = await getNftsMarketData(
      { collection: collectionAddress.toLowerCase(), isTradable: true },
      1,
      'currentAskPrice',
      orderDirection,
    )

    if (response.length === 0) {
      return 0
    }

    const [nftSg] = response
    return parseFloat(nftSg.currentAskPrice)
  } catch (error) {
    console.error(`Failed to lowest price NFTs in collection ${collectionAddress}`, error)
    return 0
  }
}

/**
 * Fetch user trading data for buyTradeHistory, sellTradeHistory and askOrderHistory from the Subgraph
 * @param where a User_filter where condition
 * @returns a UserActivity object
 */
export const getUserActivity = async (address: string): Promise<UserActivity> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getUserActivity($address: String!) {
          user(id: $address) {
            buyTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${baseTransactionFields}
              nft {
                ${baseNftFields}
              }
            }
            sellTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${baseTransactionFields}
              nft {
                ${baseNftFields}
              }
            }
            askOrderHistory(first: 500, orderBy: timestamp, orderDirection: desc) {
              id
              block
              timestamp
              orderType
              askPrice
              nft {
                ${baseNftFields}
              }
            }
          }
        }
      `,
      { address },
    )

    return res.user || { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] }
  } catch (error) {
    console.error('Failed to fetch user Activity', error)
    return {
      askOrderHistory: [],
      buyTradeHistory: [],
      sellTradeHistory: [],
    }
  }
}

export const getCollectionActivity = async (
  address: string,
  nftActivityFilter: NftActivityFilter,
  itemPerQuery,
): Promise<{ askOrders?: AskOrder[]; transactions?: Transaction[] }> => {
  const getAskOrderEvent = (orderType: MarketEvent): AskOrderType => {
    switch (orderType) {
      case MarketEvent.CANCEL:
        return AskOrderType.CANCEL
      case MarketEvent.MODIFY:
        return AskOrderType.MODIFY
      case MarketEvent.NEW:
        return AskOrderType.NEW
      default:
        return AskOrderType.MODIFY
    }
  }

  const isFetchAllCollections = address === ''

  const hasCollectionFilter = nftActivityFilter.collectionFilters.length > 0

  const collectionFilterGql = !isFetchAllCollections
    ? `collection: ${JSON.stringify(address)}`
    : hasCollectionFilter
    ? `collection_in: ${JSON.stringify(nftActivityFilter.collectionFilters)}`
    : ``

  const askOrderTypeFilter = nftActivityFilter.typeFilters
    .filter((marketEvent) => marketEvent !== MarketEvent.SELL)
    .map((marketEvent) => getAskOrderEvent(marketEvent))

  const askOrderIncluded = nftActivityFilter.typeFilters.length === 0 || askOrderTypeFilter.length > 0

  const askOrderTypeFilterGql =
    askOrderTypeFilter.length > 0 ? `orderType_in: ${JSON.stringify(askOrderTypeFilter)}` : ``

  const transactionIncluded =
    nftActivityFilter.typeFilters.length === 0 ||
    nftActivityFilter.typeFilters.some(
      (marketEvent) => marketEvent === MarketEvent.BUY || marketEvent === MarketEvent.SELL,
    )

  let askOrderQueryItem = itemPerQuery / 2
  let transactionQueryItem = itemPerQuery / 2

  if (!askOrderIncluded || !transactionIncluded) {
    askOrderQueryItem = !askOrderIncluded ? 0 : itemPerQuery
    transactionQueryItem = !transactionIncluded ? 0 : itemPerQuery
  }

  const askOrderGql = askOrderIncluded
    ? `askOrders(first: ${askOrderQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}, ${askOrderTypeFilterGql}
          }) {
              id
              block
              timestamp
              orderType
              askPrice
              seller {
                id
              }
              nft {
                ${baseNftFields}
              }
          }`
    : ``

  const transactionGql = transactionIncluded
    ? `transactions(first: ${transactionQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}
          }) {
            ${baseTransactionFields}
              nft {
                ${baseNftFields}
              }
          }`
    : ``

  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionActivity {
          ${askOrderGql}
          ${transactionGql}
        }
      `,
    )

    return res || { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('Failed to fetch collection Activity', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

export const getTokenActivity = async (
  tokenId: string,
  collectionAddress: string,
): Promise<{ askOrders: AskOrder[]; transactions: Transaction[] }> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getCollectionActivity($tokenId: BigInt!, $address: ID!) {
          nfts(where:{tokenId: $tokenId, collection: $address}) {
            transactionHistory(orderBy: timestamp, orderDirection: desc) {
              ${baseTransactionFields}
                nft {
                  ${baseNftFields}
                }
            }
            askHistory(orderBy: timestamp, orderDirection: desc) {
                id
                block
                timestamp
                orderType
                askPrice
                seller {
                  id
                }
                nft {
                  ${baseNftFields}
                }
            }
          }
        }
      `,
      { tokenId, address: collectionAddress },
    )

    if (res.nfts.length > 0) {
      return { askOrders: res.nfts[0].askHistory, transactions: res.nfts[0].transactionHistory }
    }
    return { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('Failed to fetch token Activity', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

/**
 * Get the most recently listed NFTs
 * @param first Number of nfts to retrieve
 * @returns NftTokenSg[]
 */
export const getLatestListedNfts = async (first: number): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_NFTMARKET,
      gql`
        query getLatestNftMarketData($first: Int) {
          nfts(where: { isTradable: true }, orderBy: updatedAt , orderDirection: desc, first: $first) {
            ${baseNftFields}
            collection {
              id
            }
          }
        }
      `,
      { first },
    )

    return res.nfts
  } catch (error) {
    console.error('Failed to fetch NFTs market data', error)
    return []
  }
}

/**
 * Filter NFTs from a collection
 * @param collectionAddress
 * @returns
 */
export const fetchNftsFiltered = async (
  collectionAddress: string,
  filters: Record<string, string | number>,
): Promise<ApiTokenFilterResponse> => {
  const res = await fetch(`${API_NFT}/collections/${collectionAddress}/filter?${stringify(filters)}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  console.error(`API: Failed to fetch NFT collection ${collectionAddress}`, res.statusText)
  return null
}

/**
 * OTHER HELPERS
 */

export const getMetadataWithFallback = (apiMetadata: ApiResponseCollectionTokens['data'], bunnyId: string) => {
  // The fallback is just for the testnet where some bunnies don't exist
  return (
    apiMetadata[bunnyId] ?? {
      name: '',
      description: '',
      collection: { name: 'Pancake Bunnies' },
      image: {
        original: '',
        thumbnail: '',
      },
    }
  )
}

export const getPancakeBunniesAttributesField = (bunnyId: string) => {
  // Generating attributes field that is not returned by API
  // but can be "faked" since objects are keyed with bunny id
  return [
    {
      traitType: 'bunnyId',
      value: bunnyId,
      displayType: null,
    },
  ]
}

export const combineApiAndSgResponseToNftToken = (
  apiMetadata: ApiSingleTokenData,
  marketData: TokenMarketData,
  attributes: NftAttribute[],
) => {
  return {
    tokenId: marketData.tokenId,
    name: apiMetadata.name,
    description: apiMetadata.description,
    collectionName: apiMetadata.collection.name,
    collectionAddress: pancakeBunniesAddress,
    image: apiMetadata.image,
    marketData,
    attributes,
  }
}

export const fetchWalletTokenIdsForCollections = async (
  account: string,
  collections: ApiCollections,
): Promise<TokenIdWithCollectionAddress[]> => {
  const balanceOfCalls = Object.values(collections).map((collection) => {
    const { address: collectionAddress } = collection
    return {
      address: collectionAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const balanceOfCallsResultRaw = await multicallv2({
    abi: erc721Abi,
    calls: balanceOfCalls,
    options: { requireSuccess: false },
  })
  const balanceOfCallsResult = balanceOfCallsResultRaw.flat()

  const tokenIdCalls = Object.values(collections)
    .map((collection, index) => {
      const balanceOf = balanceOfCallsResult[index]?.toNumber() ?? 0
      const { address: collectionAddress } = collection

      return range(balanceOf).map((tokenIndex) => {
        return {
          address: collectionAddress,
          name: 'tokenOfOwnerByIndex',
          params: [account, tokenIndex],
        }
      })
    })
    .flat()

  const tokenIdResultRaw = await multicallv2({
    abi: erc721Abi,
    calls: tokenIdCalls,
    options: { requireSuccess: false },
  })
  const tokenIdResult = tokenIdResultRaw.flat()

  const nftLocation = NftLocation.WALLET

  const walletNfts = tokenIdResult.reduce((acc, tokenIdBn, index) => {
    if (tokenIdBn) {
      const { address: collectionAddress } = tokenIdCalls[index]
      acc.push({ tokenId: tokenIdBn.toString(), collectionAddress, nftLocation })
    }
    return acc
  }, [])

  return walletNfts
}


export const combineCollectionData = (
  collectionApiData: ApiCollection[],
  collectionSgData: CollectionMarketDataBaseFields[],
): Record<string, Collection> => {
  const collectionsMarketObj: Record<string, CollectionMarketDataBaseFields> = fromPairs(
    collectionSgData.map((current) => [current.id, current]),
  )

  return fromPairs(
    collectionApiData
      .filter((collection) => collection?.address)
      .map((current) => {
        const collectionMarket = collectionsMarketObj[current.address.toLowerCase()]
        const collection: Collection = {
          ...current,
          ...collectionMarket,
        }

        if (current.name) {
          collection.name = current.name
        }

        return [current.address, collection]
      }),
  )
}


export const getNftLocationForMarketNft = (
  tokenId: string,
  tokenIdsInWallet: string[],
  tokenIdsForSale: string[],
  profileNftId?: string,
): NftLocation => {
  if (tokenId === profileNftId) {
    return NftLocation.PROFILE
  }
  if (tokenIdsForSale.includes(tokenId)) {
    return NftLocation.FORSALE
  }
  if (tokenIdsInWallet.includes(tokenId)) {
    return NftLocation.WALLET
  }
  console.error(`Cannot determine location for tokenID ${tokenId}, defaulting to NftLocation.WALLET`)
  return NftLocation.WALLET
}


