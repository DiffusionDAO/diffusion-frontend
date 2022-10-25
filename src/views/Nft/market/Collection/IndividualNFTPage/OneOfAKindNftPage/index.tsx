import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import sum from 'lodash/sum'
import noop from 'lodash/noop'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import nftDatabaseAbi from 'config/abi/nftDatabase.json'
import { getNFTDatabaseAddress, getStarlightAddress } from 'utils/addressHelpers'
import { NftToken } from 'state/nftMarket/types'
import { getCollection } from 'state/nftMarket/helpers'
import { getContract } from 'utils/contractHelpers'

import { useNFTDatabaseContract } from 'hooks/useContract'
import { formatBigNumber } from 'utils/formatBalance'

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
  const [nft, setNFT] = useState<NftToken>()
  const collection = useGetCollection(collectionAddress)
  const nftDatabase = useNFTDatabaseContract()
  useEffect(() => {
    nftDatabase.getToken(collectionAddress, tokenId).then((res) => {
      // console.log("IndividualNFTPage:", res)
      let thumbnail = `/images/nfts/socialnft/${res.level.toString()}`
      const starLightAddress = getStarlightAddress()
      if (res.collectionAddress === starLightAddress) {
        thumbnail = `/images/nfts/starlight/starlight${tokenId}.gif`
      }
      const nft: NftToken = {
        tokenId,
        collectionAddress,
        collectionName: res.collectionName,
        name: res.collectionName,
        description: res.collectionName,
        image: { original: 'string', thumbnail },
        attributes: [{ value: res.level.toString() }],
        staker: res.staker,
        owner: res.owner,
        itemId: res.itemId.toString(),
        marketData: {
          tokenId,
          collection: {
            id: tokenId,
          },
          currentAskPrice: formatBigNumber(res?.price, 2),
          currentSeller: res?.seller,
          isTradable: res?.price.gt(0) ?? false,
        },
      }
      setNFT(nft)
    })
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
