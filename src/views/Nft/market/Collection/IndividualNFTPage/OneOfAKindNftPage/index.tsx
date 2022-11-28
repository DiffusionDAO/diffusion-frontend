import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import noop from 'lodash/noop'
import { useGetCollection } from 'state/nftMarket/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { getNFTDatabaseAddress, getStarlightAddress } from 'utils/addressHelpers'
import { NftToken } from 'state/nftMarket/types'

import {
  useDFSMiningContract,
  useNFTDatabaseContract,
  useNftMarketContract,
  useSocialNftContract,
} from 'hooks/useContract'
import { formatBigNumber } from 'utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { levelToName, levelToSPOS, NFT } from 'pages/profile/[accountAddress]'

import { formatUnits } from '@ethersproject/units'
import useSWR from 'swr'
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
  const [nft, setNFT] = useState<NFT>()
  const collection = useGetCollection(collectionAddress)
  const socialNFT = useSocialNftContract()
  const nftMarket = useNftMarketContract()
  const dfsMining = useDFSMiningContract()
  const { data: nftToken, status } = useSWR('IndividualNFTPage', async () => {
    const getToken = await socialNFT.getToken(tokenId)
    const sellPrice = await nftMarket.sellPrice(collectionAddress, tokenId)
    const staker = await dfsMining.staker(tokenId)
    const nft = { ...getToken, ...sellPrice, staker }
    let thumbnail = `/images/nfts/socialnft/${nft?.level}`
    const starLightAddress = getStarlightAddress()
    if (collectionAddress === starLightAddress) {
      thumbnail = `/images/nfts/starlight/starlight${tokenId}.gif`
    }
    const level = nft?.level
    const nftToken: NftToken = {
      tokenId,
      collectionAddress,
      collectionName: t(collection.name),
      name: `${t(levelToName[level])}#${tokenId}`,
      description: t(nft?.collectionName),
      image: { original: 'string', thumbnail },
      attributes: [
        { traitType: t('Valid SPOS'), value: levelToSPOS[level].validSPOS, displayType: '' },
        { traitType: t('Unlockable SPOS'), value: levelToSPOS[level].unlockableSPOS, displayType: '' },
      ],
      staker: nft?.staker,
      owner: nft?.owner,
      marketData: {
        tokenId,
        collection: {
          id: tokenId,
        },
        currentAskPrice: formatUnits(nft?.price),
        currentSeller: nft?.seller,
        isTradable: nft?.price.gt(0) ?? false,
      },
    }
    return nftToken
  })

  const properties = nftToken?.attributes
  if (!nftToken || !collection) {
    return <PageLoader />
  }
  const isOwnNft =
    nftToken?.marketData?.currentSeller === account || nftToken?.owner === account || nftToken?.staker === account
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
        <MainNFTCard nft={nftToken} isOwnNft={isOwnNft} nftIsProfilePic={nftIsProfilePic} onSuccess={noop} />
        <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex flexDirection="column" width="100%">
            <PropertiesCard properties={properties} rarity={{}} />
            <DetailsCard contractAddress={collectionAddress} ipfsJson={nftToken?.marketData?.metadataUrl} />
          </Flex>
        </TwoColumnsContainer>
      </div>
    </PageWrap>
  )
}

export default IndividualNFTPage
