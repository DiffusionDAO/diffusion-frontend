import { useEffect, useState, useRef, useMemo } from 'react'
import { NftAttribute, NftToken, Collection, NftLocation } from 'state/nftMarket/types'
import { useGetNftFilters, useGetNftOrdering, useGetNftShowOnlyOnSale } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import { fetchNftsFiltered, getNftApi, getNftsMarketData } from 'state/nftMarket/helpers'
import useSWRInfinite from 'swr/infinite'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import fromPairs from 'lodash/fromPairs'
import { getContract } from 'utils/contractHelpers'
import { useERC721, useNftMarketContract } from 'hooks/useContract'
import {
  getSocialNFTAddress,
  getNFTDatabaseAddress,
  getNftMarketAddress,
  getStarlightAddress,
  getMiningAddress,
} from 'utils/addressHelpers'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import socialNFTAbi from 'config/abi/socialNFTAbi.json'
import nftMarketAbi from 'config/abi/nftMarket.json'
import dfsMiningAbi from 'config/abi/dfsMining.json'

import erc721Abi from 'config/abi/erc721.json'
import { levelToName, NFT, nftToNftToken, levelToSPOS } from 'pages/profile/[accountAddress]'
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

export const useCollectionNfts = (collectionAddress: string) => {
  const fetchedNfts = useRef<NftToken[]>([])
  const fallbackMode = useRef(false)
  const fallbackModePage = useRef(0)
  const isLastPage = useRef(false)
  const { t } = useTranslation()
  const [tokenIds, setTokenIds] = useState<any[]>()
  const [tokens, setTokens] = useState<any[]>()
  const socianNFTAddress = getSocialNFTAddress()
  const socialNFT = getContract({ abi: socialNFTAbi, address: socianNFTAddress, chainId: ChainId.BSC_TESTNET })

  const nftMarketAddress = getNftMarketAddress()
  const nftMarket = getContract({ abi: nftMarketAbi, address: nftMarketAddress, chainId: ChainId.BSC_TESTNET })

  const dfsMiningAddress = getMiningAddress()
  const dfsMining = getContract({ abi: dfsMiningAbi, address: dfsMiningAddress, chainId: ChainId.BSC_TESTNET })

  const erc721 = useERC721(collectionAddress)

  const { data: collection, status: collectionStatus } = useSWR('collections', async () => {
    const getTokenContract = getContract({
      abi: socialNFTAbi,
      address: collectionAddress,
      chainId: ChainId.BSC_TESTNET,
    })
    const tokenIds = await getTokenContract.allTokens()
    setTokenIds(tokenIds)
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
    !Object.keys(nftFilters).length && tokenIds ? (showOnlyNftsOnSale ? tokenIds.length : tokenIds.length) : null

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
      const collectionName = await erc721.name()
      const getTokenContract = getContract({
        abi: socialNFTAbi,
        address: collectionAddress,
        chainId: ChainId.BSC_TESTNET,
      })
      const tokens = await Promise.all(
        tokenIds.slice(page * REQUEST_SIZE, (page + 1) * REQUEST_SIZE).map(async (tokenId) => {
          const tokenIdString = tokenId.toString()
          const getToken = await getTokenContract.getToken(tokenId)
          const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)
          const staker = await dfsMining.staker(tokenId)
          const nft: NFT = { ...getToken, ...sellPrice, staker }
          const level = nft.level.toString()
          let thumbnail
          let name
          const starLightAddress = getStarlightAddress()
          const dfsNFTAddress = getSocialNFTAddress()
          if (collectionAddress === starLightAddress) {
            thumbnail = `/images/nfts/starlight/starlight${tokenId}.gif`
            name = `StarLight#${tokenId}`
          } else if (collectionAddress === dfsNFTAddress) {
            thumbnail = `/images/nfts/socialnft/${level}`
            name = `${t(levelToName[level])}#${tokenId}`
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
            attributes: [{ traitType: 'SPOS', value: levelToSPOS[level], displayType: '' }],
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
        const marketItems = await nftMarket.fetchMarketItems()
        const marketTokenIds = marketItems
          .filter((item) => item.collection === collectionAddress)
          .map((item) => item.tokenId)
        newNfts = await Promise.all(
          marketTokenIds.map(async (tokenId) => {
            const token = await socialNFT.getToken(tokenId)
            const sellPrice = await nftMarket.sellPrice(socialNFT.address, tokenId)
            const name = `${t(levelToName[token.level])}#${token.tokenId}`
            const nft: NFT = { ...token, ...sellPrice, collectionName, collectionAddress: socialNFT.address, name }
            return nftToNftToken(nft)
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
