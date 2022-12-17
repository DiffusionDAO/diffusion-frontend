import { useEffect, useState, useRef } from 'react'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getPancakeBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
  getNftsUpdatedMarketData,
} from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import { FetchStatus } from 'config/constants/types'
import { formatBigNumber } from '@pancakeswap/utils/formatBalance'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { pancakeBunniesAddress } from '../constants'

const fetchMarketDataNfts = async (
  bunnyId: string,
  nftMetadata: ApiResponseCollectionTokens,
  direction: 'asc' | 'desc',
  page: number,
  itemsPerPage: number,
): Promise<{ newNfts: NftToken[]; isPageLast: boolean }> => {
  const whereClause = {
    collection: pancakeBunniesAddress.toLowerCase(),
    otherId: bunnyId,
    isTradable: true,
  }
  const nftsMarket = await getNftsMarketData(
    whereClause,
    itemsPerPage,
    'currentAskPrice',
    direction,
    page * itemsPerPage,
  )

  const moreTokensWithRequestedBunnyId = nftsMarket.map((marketData) => {
    const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
    const attributes = getPancakeBunniesAttributesField(marketData.otherId)
    return combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
  })
  return { newNfts: moreTokensWithRequestedBunnyId, isPageLast: moreTokensWithRequestedBunnyId.length < itemsPerPage }
}
