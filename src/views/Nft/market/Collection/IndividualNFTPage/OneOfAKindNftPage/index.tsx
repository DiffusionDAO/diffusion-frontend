import { useMemo } from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import sum from 'lodash/sum'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import MainNFTCard from './MainNFTCard'
import ManageNFTsCard from './ManageNFTsCard'
import { TwoColumnsContainer } from '../shared/styles'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'
import useGetCollectionDistribution from '../../../hooks/useGetCollectionDistribution'
import OwnerCard from './OwnerCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import ActivityCard from './ActivityCard'
import { useCompleteNft } from '../../../hooks/useCompleteNft'
import { useMatchBreakpoints } from "../../../../../../../packages/uikit/src/hooks"

interface IndividualNFTPageProps {
  collectionAddress: string
  tokenId: string
}
const BorderWrap = styled.div`
backgroundColor:rgba(70, 96, 255, 0.4);
border: 2px solid rgba(70, 96, 255, 0.2);
border-radius:16px;
`
const OwnerActivityContainer = styled(Flex)`
  gap: 22px;
`
export const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

const IndividualNFTPage: React.FC<IndividualNFTPageProps> = ({ collectionAddress, tokenId }) => {
  const collection = useGetCollection(collectionAddress)
  // const { data: distributionData, isFetching: isFetchingDistribution } = useGetCollectionDistribution(collectionAddress)
  const {
    combinedNft: nft,
    isOwn: isOwnNft,
    isProfilePic,
    isLoading,
    refetch,
  } = useCompleteNft(collectionAddress, tokenId)

  const properties = nft?.attributes || null

  // const attributesRarity = useMemo(() => {
  //   if (distributionData  && properties) {
  //     return Object.keys(distributionData).reduce((rarityMap, traitType) => {
  //       const total = sum(Object.values(distributionData[traitType]))
  //       const nftAttributeValue = properties.find((attribute) => attribute.traitType === traitType)?.value
  //       const count = distributionData[traitType][nftAttributeValue]
  //       const rarity = (count / total) * 100
  //       return {
  //         ...rarityMap,
  //         [traitType]: rarity,
  //       }
  //     }, {})
  //   }
  //   return {}
  // }, [properties, isFetchingDistribution, distributionData])

  if (!nft || !collection) {
    // Normally we already show a 404 page here if no nft, just put this checking here for safety.

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }
  const { isMobile } = useMatchBreakpoints()
  let bgImg = isMobile ? "url('/images/nfts/smx1.png')": "url('/images/nfts/smxl.png')"
  
  return (
    <PageWrap>
      <div style={{backgroundImage:`${bgImg}`,backgroundRepeat:'no-repeat',
      backgroundPosition: '4px'
    }}>
         <MainNFTCard 
         nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
      </div>
      <TwoColumnsContainer flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <BorderWrap>
          <ManageNFTsCard nft={nft} isOwnNft={isOwnNft} isLoading={isLoading} onSuccess={refetch} />
          </BorderWrap>
          {/* <PropertiesCard properties={properties} rarity={attributesRarity} /> */}
          <BorderWrap>
          <DetailsCard contractAddress={collectionAddress} ipfsJson={nft?.marketData?.metadataUrl} />
          </BorderWrap>
        </Flex>
        
        <OwnerActivityContainer flexDirection="column" width="100%">
        <BorderWrap>
          <OwnerCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
         </BorderWrap>
         <BorderWrap>
          <ActivityCard nft={nft} />
          </BorderWrap>
        </OwnerActivityContainer>
      </TwoColumnsContainer>
      <MoreFromThisCollection collectionAddress={collectionAddress} currentTokenName={nft.name} />
    </PageWrap>
  )
}


export default IndividualNFTPage
