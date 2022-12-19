import { NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl, pancakeBunniesAddress } from '../../constants'
import { StyledCollectibleCard, CheckBoxWrap, CheckBox } from './styles'

const CollectibleLinkCard: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  isSelected,
  nft,
  nftLocation,
  currentAskPrice,
  ...props
}) => {
  const urlId = nft.tokenId
  const {chainId} = useActiveChainId()
  return (
    <StyledCollectibleCard {...props}>
      {isSelected ? (
        <>
          <CheckBoxWrap>
            {nft.selected ? <img src="/images/nfts/gou.svg" alt="img" style={{ height: '8px' }} /> : <CheckBox />}
          </CheckBoxWrap>
          <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
        </>
      ) : (
        <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${chainId}/${urlId}`}>
          <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
        </NextLinkFromReactRouter>
      )}
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
