import { useMemo, useRef } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useGetCollections } from 'state/nftMarket/hooks'
import { NftLocation, ApiCollections } from 'state/nftMarket/types'
import { Profile } from 'state/types'
import useSWR from 'swr'
import { FetchStatus } from 'config/constants/types'
import { laggyMiddleware } from 'hooks/useSWRContract'
import { usePreviousValue } from '@pancakeswap/hooks'
import { isAddress } from 'utils'

export const useNftsForAddress = (account: string, profile: Profile, isProfileFetching: boolean) => {
  console.log("useNftsForAddress:")
  const { data: collections } = useGetCollections()

  const { nfts, isLoading, refresh } = useCollectionsNftsForAddress(account, profile, isProfileFetching, collections)
  return { nfts, isLoading, refresh }
}

export const useCollectionsNftsForAddress = (
  account: string,
  profile: Profile,
  isProfileFetching: boolean,
  collections: ApiCollections,
) => {
  const resetLaggyRef = useRef(null)
  const previousAccount = usePreviousValue(account)

  if (resetLaggyRef.current && previousAccount !== account) {
    resetLaggyRef.current()
  }
  const hasProfileNft = profile?.tokenId
  const profileNftTokenId = profile?.tokenId?.toString()
  const profileNftCollectionAddress = profile?.collectionAddress

  const profileNftWithCollectionAddress = useMemo(() => {
    if (hasProfileNft) {
      return {
        tokenId: profileNftTokenId,
        collectionAddress: profileNftCollectionAddress,
        nftLocation: NftLocation.PROFILE,
      }
    }
    return null
  }, [profileNftTokenId, profileNftCollectionAddress, hasProfileNft])

  // @ts-ignore

  return { nfts: [], isLoading: false, refresh: null }
}
