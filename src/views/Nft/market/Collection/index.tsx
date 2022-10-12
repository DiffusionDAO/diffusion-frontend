import PageLoader from 'components/Loader/PageLoader'
import { NextRouter, useRouter } from 'next/router'
import { getCollectionsApi } from 'state/nftMarket/helpers'
import Header from './Header'
import Items from './Items'

const getHashFromRouter = (router: NextRouter) => router.asPath.match(/#([a-z0-9]+)/gi)

const Collection = () => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string

  const parsed = JSON.parse(localStorage?.getItem('nfts'))
  let collections = Object.keys(parsed).length ? parsed : {}
  getCollectionsApi().then((res: any) => {
    localStorage?.setItem('nfts', JSON.stringify(res))
    collections = res
  })
  const collection = collections[collectionAddress]?.data[0]
  // const collection = useGetCollection(collectionAddress)
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
