import { NextLinkFromReactRouter } from 'components/NextLink'
import { StyledCollectibleCard, CheckBoxWrap, CheckBox } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl, pancakeBunniesAddress } from '../../constants'

const CollectibleLinkCard: React.FC<CollectibleCardProps> = ({ isCompound, nft, nftLocation, currentAskPrice, ...props }) => {
  const urlId =
    nft?.collectionAddress?.toLowerCase() === pancakeBunniesAddress.toLowerCase() ? nft.attributes[0].value : nft.tokenId
  return (
    <StyledCollectibleCard {...props}>
      {
        isCompound ? <>
          <CheckBoxWrap>
            {
              nft.selected ? <img src="/images/nfts/gou.svg" alt="img" style={{ height: "8px" }} /> : <CheckBox />
            }
          </CheckBoxWrap>
          <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
        </> : 
        <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${urlId}`}>
          <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
        </NextLinkFromReactRouter>
      }
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
