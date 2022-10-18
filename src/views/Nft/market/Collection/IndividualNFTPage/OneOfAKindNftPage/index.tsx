import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import sum from 'lodash/sum'
import noop from 'lodash/noop'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import { getNFTDatabaseAddress } from 'utils/addressHelpers'
import { NftToken } from 'state/nftMarket/types'
import { getCollection } from 'state/nftMarket/helpers'
import { getContract } from 'utils/contractHelpers'

import MainNFTCard from './MainNFTCard'
import { TwoColumnsContainer } from '../shared/styles'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'
import useGetCollectionDistribution from '../../../hooks/useGetCollectionDistribution'
import OwnerCard from './OwnerCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import ActivityCard from './ActivityCard'
import ManageNFTsCard from '../shared/ManageNFTsCard'

import { ChainId } from '../../../../../../../packages/swap-sdk/src/constants'

interface IndividualNFTPageProps {
  collectionAddress: string
  tokenId: string
}

const BorderWrap = styled.div`
  backgroundcolor: rgba(70, 96, 255, 0.4);
  border: 2px solid rgba(70, 96, 255, 0.2);
  border-radius: 16px;
`
const OwnerActivityContainer = styled(Flex)`
  gap: 22px;
`
export const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 20px;
`

const IndividualNFTPage: React.FC<React.PropsWithChildren<IndividualNFTPageProps>> = ({
  collectionAddress,
  tokenId,
}) => {
  const { isMobile } = useMatchBreakpoints()
  const bgImg = isMobile ? "url('/images/nfts/mretc.png')" : "url('/images/nfts/smxl.png')"
  const bgOffset = !isMobile ? '40px' : '80px'
  const [collection, setCollection] = useState<any>()
  const [nft, setNFT] = useState<NftToken>()
  useEffect(() => {
    getCollection(collectionAddress)
      .then((res) => setCollection(res))
      .catch((error) => console.log(error))
    const nftDatabase = getContract({
      abi: nftDatabaseAbi,
      address: getNFTDatabaseAddress(),
      chainId: ChainId.BSC_TESTNET,
    })
    nftDatabase.getToken(collectionAddress, tokenId).then((res) => setNFT(res))
  }, [])

  const properties = nft?.attributes

  if (!nft || !collection) {
    return <PageLoader />
  }
  const isOwnNft = true
  const nftIsProfilePic = false
  return (
    <PageWrap>
      <div
        style={{
          backgroundImage: `${bgImg}`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `4px ${bgOffset}`,
        }}
      >
        <MainNFTCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={nftIsProfilePic} onSuccess={noop} />
        <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex flexDirection="column" width="100%">
            <ManageNFTsCard collection={collection} tokenId={tokenId} onSuccess={noop} />
            <PropertiesCard properties={properties} rarity={{}} />
            <DetailsCard contractAddress={collectionAddress} ipfsJson={nft?.marketData?.metadataUrl} />
          </Flex>
          {/* <OwnerActivityContainer flexDirection="column" width="100%">
            <OwnerCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={nftIsProfilePic} onSuccess={noop} />
            <ActivityCard nft={nft} />
          </OwnerActivityContainer> */}
        </TwoColumnsContainer>
      </div>
    </PageWrap>
  )
}

export default IndividualNFTPage
