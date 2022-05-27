import { StyledCollectibleCard, CheckBox } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'

const CollectibleActionCard: React.FC<CollectibleCardProps> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
  ...props
}) => {
  return (
    <StyledCollectibleCard {...props}>
      <CheckBox selected={nft.selected} />
      <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} isUserNft={isUserNft} />
    </StyledCollectibleCard>
  )
}

export default CollectibleActionCard
