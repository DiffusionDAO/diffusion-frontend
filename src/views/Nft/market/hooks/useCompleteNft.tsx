import { useWeb3React } from '@web3-react/core'
import { FetchStatus } from 'config/constants/types'
import { useCallback, useEffect } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { getNftApi, getNftsMarketData, getNftsOnChainMarketData } from 'state/nftMarket/helpers'
import { NftLocation, NftToken, TokenMarketData } from 'state/nftMarket/types'
import { useProfile } from 'state/profile/hooks'
import useSWR from 'swr'
import { NOT_ON_SALE_SELLER } from 'config/constants'

const useNftOwn = (collectionAddress: string, tokenId: string, marketData?: TokenMarketData) => {
  const { account } = useWeb3React()
  const { reader: collectionContract } = useErc721CollectionContract(collectionAddress)
  const { isInitialized: isProfileInitialized, profile } = useProfile()
  return useSWR(
    account && isProfileInitialized && collectionContract
      ? ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller]
      : null,
    async () => {
      const tokenOwner = await collectionContract.ownerOf(tokenId)
      let isOwn = false
      let nftIsProfilePic = false
      let location: NftLocation

      nftIsProfilePic = tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
      const nftIsOnSale = marketData ? marketData?.currentSeller !== NOT_ON_SALE_SELLER : false
      if (nftIsOnSale) {
        isOwn = marketData?.currentSeller.toLowerCase() === account.toLowerCase()
        location = NftLocation.FORSALE
      } else if (nftIsProfilePic) {
        isOwn = true
        location = NftLocation.PROFILE
      } else {
        isOwn = tokenOwner.toLowerCase() === account.toLowerCase()
        location = NftLocation.WALLET
      }

      return {
        isOwn,
        nftIsProfilePic,
        location,
      }
    },
  )
}
export const useCompleteNft = (collectionAddress: string, tokenId: string) => {
  console.log("useCompleteNft")
  const { account } = useWeb3React()

  const { data: nft, mutate } = useSWR(
    collectionAddress && tokenId ? ['nft', collectionAddress, tokenId] : null,
    async () => {
      const metadata = await getNftApi(collectionAddress, tokenId) as any
      console.log("metadata:",metadata)
      if (metadata) {
        return metadata
        // const basicNft: NftToken = {
        //   marketData: metadata.marketData,
        //   tokenId,
        //   collectionAddress,
        //   collectionName: metadata.collection.name,
        //   name: metadata.name,
        //   description: metadata.description,
        //   image: metadata.image,
        //   attributes: metadata.attributes,
        // }
        // return basicNft
      }
      return null
    },
  )
  // const { data: marketData, mutate: refetchNftMarketData } = useSWR(
  //   collectionAddress && tokenId ? ['nft', 'marketData', collectionAddress, tokenId] : null,
  //   async () => {
  //     const [onChainMarketDatas, marketDatas] = await Promise.all([
  //       getNftsOnChainMarketData(collectionAddress.toLowerCase(), [tokenId]),
  //       getNftsMarketData({ collection: collectionAddress.toLowerCase(), tokenId }, 1),
  //     ])
  //     const onChainMarketData = onChainMarketDatas[0]

  //     if (!marketDatas[0] && !onChainMarketData) return null

  //     if (!onChainMarketData) return marketDatas[0]

  //     return { ...marketDatas[0], ...onChainMarketData }
  //   },
  // )

  // const { data: nftOwn, mutate: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, metadata.marketData)

  const refetch = useCallback(async () => {
    await mutate()
  }, [mutate])
  // const refetch = useCallback(async () => {
  //   await mutate()
  //   await refetchNftMarketData()
  //   await refetchNftOwn()
  // }, [mutate, refetchNftMarketData, refetchNftOwn])
  console.log(account, nft?.marketData?.currentSeller)
  return {
    combinedNft: nft ? { ...nft, marketData:nft.marketData, location: nft?.location ?? NftLocation.WALLET } : undefined,
    isOwn: nft?.marketData?.currentSeller == account?.toLowerCase() || false,
    isProfilePic: nft?.location ==  NftLocation.PROFILE || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
