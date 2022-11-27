import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import noop from 'lodash/noop'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { getNFTDatabaseAddress, getStarlightAddress } from 'utils/addressHelpers'
import { NftToken } from 'state/nftMarket/types'

import { useNFTDatabaseContract } from 'hooks/useContract'
import { formatBigNumber } from 'utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { levelToName, levelToSPOS } from 'pages/profile/[accountAddress]'

import MainNFTCard from './MainNFTCard'
import { TwoColumnsContainer } from '../shared/styles'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'

import { useWeb3React } from '../../../../../../../packages/wagmi/src/useWeb3React'

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
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const bgImg = isMobile ? "url('/images/nfts/mretc.png')" : "url('/images/nfts/smxl.png')"
  const bgOffset = !isMobile ? '40px' : '80px'
  const [nft, setNFT] = useState<NftToken>()
  const collection = useGetCollection(collectionAddress)
  const nftDatabase = useNFTDatabaseContract()
  useEffect(() => {
    socialNFT.getToken(collectionAddress, tokenId).then((res) => {
      let thumbnail = `/images/nfts/socialnft/${res.level.toString()}`
      const starLightAddress = getStarlightAddress()
      if (res.collectionAddress === starLightAddress) {
        thumbnail = `/images/nfts/starlight/starlight${tokenId}.gif`
      }
      const level = res.level.toString()
      const nft: NftToken = {
        tokenId,
        collectionAddress,
        collectionName: t(collection.name),
        name: `${t(levelToName[res.level])}#${tokenId}`,
        description: t(res.collectionNamet),
        image: { original: 'string', thumbnail },
        attributes: [
          { traitType: t('Valid SPOS'), value: levelToSPOS[level].validSPOS, displayType: '' },
          { traitType: t('Unlockable SPOS'), value: levelToSPOS[level].unlockableSPOS, displayType: '' },
        ],
        staker: res.staker,
        owner: res.owner,
        marketData: {
          tokenId,
          collection: {
            id: tokenId,
          },
          currentAskPrice: formatBigNumber(res?.price, 3),
          currentSeller: res?.seller,
          isTradable: res?.price.gt(0) ?? false,
        },
      }
      setNFT(nft)
    })
  }, [account, t])

  const properties = nft?.attributes
  if (!nft || !collection) {
    return <PageLoader />
  }
  const isOwnNft = nft?.marketData?.currentSeller === account || nft?.owner === account || nft?.staker === account
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
            {/* <ManageNFTsCard collection={collection} tokenId={tokenId} onSuccess={noop} /> */}
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
