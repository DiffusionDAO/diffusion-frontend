import { BinanceIcon, Box, Button, Card, CardBody, Flex, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import styled, { css } from 'styled-components'
import { NftToken } from 'state/nftMarket/types'
import { multiplyPriceByAmount } from 'utils/prices'
import { formatNumber } from 'utils/formatBalance'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import EditProfileModal from 'views/Nft/market/Profile/components/EditProfileModal'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { nftsBaseUrl } from '../../../constants'
import { CollectionLink, Container } from '../shared/styles'
//import { useMatchBreakpoints } from "../../../packages/uikit/src/hooks"

const NftBg = styled.div`
width: 300px;
height: 300px;
background: rgba(255, 255, 255, 0.05);
border-radius: 30px;
border: 1px solid rgba(70, 96, 255, 0.32);
position:absolute;
transform:rotate(10deg);

`
const TitleRow = styled.div`
  display:flex;  
`
const BtnB = styled(Button)`
width: 156px !important;
height: 48px !important;
background-color:transparent !important;
border-radius: 8px !important;
border: 2px solid !important;
color:#FFFFFF !important;
`
interface MainNFTCardProps {
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}
const BondGearImg = styled.img`
  position: absolute;
  animation: gear 10s linear infinite;
  animation-duration: 10s;
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        width: 150px;
        height: 150px;
        left: 160px;
        bottom: -10px;
      `;
    }
    return css`
      width: 180px;
      height: 180px;
      left: 280px;
      bottom: -10px;
    `;
  }};
`
//const { isMobile } = useMatchBreakpoints();
const MainNFTCard: React.FC<MainNFTCardProps> = ({ nft, isOwnNft, nftIsProfilePic, onSuccess }) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()

  const currentAskPriceAsNumber = nft?.marketData?.currentAskPrice ? parseFloat(nft.marketData?.currentAskPrice) : 0
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, currentAskPriceAsNumber)
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentSellModal] = useModal(
    <SellModal variant={nft.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)
  
  const ownerButtons = (
    <Flex flexDirection={['column', 'column', 'row']}>
      <Button
        disabled={nftIsProfilePic}
        minWidth="168px"
        mr="16px"
        width={['100%', null, 'max-content']}
        mt="24px"
        onClick={onPresentSellModal}
      >
        {nft.marketData?.isTradable ? t('Adjust price') : t('List for sale')}
      </Button>
      {!nft.marketData?.isTradable && (
        <Button
          minWidth="168px"
          variant="secondary"
          width={['100%', null, 'max-content']}
          mt="24px"
          onClick={onEditProfileModal}
        >
          {nftIsProfilePic ? t('Change Profile Pic') : t('Set as Profile Pic')}
        </Button>
      )}
    </Flex>
  )

  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box style={{marginLeft:'48px'}}>
              <TitleRow>
              <div style={{marginRight:'120px'}}>
              <CollectionLink to={`${nftsBaseUrl}/collections/${nft.collectionAddress}`}>
                {nft?.collectionName}
              </CollectionLink>
              <Text fontSize="32px" bold mt="12px">
                {nft.name}
              </Text>
              </div>

              <div>
              {/* {nft.description && <Text mt={['16px', '16px', '48px']}>{t(nft.description)}</Text>} */}
              <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Price')}
              </Text>
              {currentAskPriceAsNumber > 0 ? (
                <Flex alignItems="center" mt="10px">
                  <BinanceIcon width={18} height={18} mr="4px" />
                  <Text fontSize="32px" bold mr="4px">
                    {formatNumber(currentAskPriceAsNumber, 0, 5)}
                  </Text>
                  {bnbBusdPrice ? (
                    <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} USD)`}</Text>
                  ) : (
                    <Skeleton width="64px" />
                  )}
                </Flex>
              ) : (
                <Text fontSize="32px">{t('Not for sale')}</Text>
              )}
              </div>
              </TitleRow>
              {nftIsProfilePic && (
                <Text color="failure">
                  {t(
                    'This NFT is your profile picture, you must change it to some other NFT if you want to sell this one.',
                  )}
                </Text>
              )}
              
              <div style={{marginTop:'97px'}}>
              {isOwnNft && ownerButtons}
              {!isOwnNft && (
                <BtnB                 
                  minWidth="168px"
                  disabled={!nft.marketData?.isTradable}
                  mr="16px"
                  width={['100%', null, 'max-content']}
                  mt="24px"
                  onClick={onPresentBuyModal}
                >
                  {t('Buy')}
                 
                </BtnB>
              )}
              </div>
            </Box>
          </Flex>
          <Flex style={{position:'relative'}} flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
           
             <NftBg/>
              <div style={{position:'absolute',width:'334px',height:'334px'}}><img src='/images/nfts/imgbg.png'/></div>
              <NFTMedia key={nft.tokenId} nft={nft} width={304} height={304} />
              
              <BondGearImg isMobile ={ false } src="/images/gear.png"/>
           
           
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
