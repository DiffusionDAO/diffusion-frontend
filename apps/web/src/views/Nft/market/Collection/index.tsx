import { useState, useEffect } from 'react'
import PageLoader from 'components/Loader/PageLoader'
import { NextRouter, useRouter } from 'next/router'
import { getCollection, getCollectionsApi } from 'state/nftMarket/helpers'
import { useGetCollection } from 'state/nftMarket/hooks'
import Header from './Header'
import Items from './Items'

const Collection = () => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const collection = useGetCollection(collectionAddress)
  // const hash = useMemo(() => getHashFromRouter(router)?.[0], [router])

  if (!collection) {
    return <PageLoader />
  }

  const content = <Items />

  return (
    <>
      <Header collection={collection} />
      {content}
    </>
  )
}

export default Collection
