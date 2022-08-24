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
import { useMatchBreakpoints } from "../../../../../../../packages/uikit/src/hooks"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { combinedTokenMapFromUnsupportedUrlsSelector } from 'state/lists/hooks'
import { formatUnits } from '@ethersproject/units'
const NftBg = styled.div`
width: 280px;
height: 280px;
background: rgba(255, 255, 255, 0.05);
border-radius: 30px;
border: 1px solid rgba(70, 96, 255, 0.32);
position:absolute;
right:15px;
transform:rotate(10deg);
`

const NftBgMobile = styled.div`
width: 245px;
height: 245px;
background: rgba(255, 255, 255, 0.05);
border-radius: 30px;
border: 1px solid rgba(70, 96, 255, 0.32);
position:absolute;
top:30px;
transform:rotate(10deg);
`
const TitleRow = styled.div`
  display:flex;  
`
const BtnB = styled(Button)`

width: calc(50% - 5px);
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3C00FF, #EC6EFF);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
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
      left: 260px;
      bottom: 0px;
    `;
  }};
`

const MainNFTCard: React.FC<MainNFTCardProps> = ({ nft, isOwnNft, nftIsProfilePic, onSuccess }) => {
  
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  
  let currentAskPriceAsNumber:any = nft?.marketData?.currentAskPrice ? parseFloat(nft.marketData?.currentAskPrice) : 0
  console.log(currentAskPriceAsNumber)
  currentAskPriceAsNumber = BigNumber.from(String(currentAskPriceAsNumber))
  currentAskPriceAsNumber = formatUnits(currentAskPriceAsNumber,18)
  console.log(currentAskPriceAsNumber)
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, currentAskPriceAsNumber)
  
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentSellModal] = useModal(
    <SellModal variant={nft.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)
  const { isMobile } = useMatchBreakpoints()
  const ownerButtons = (
    <Flex flexDirection={['column', 'column', 'row']}>
      <BtnB
        disabled={nftIsProfilePic}
        minWidth="168px"
        mr="16px"
        width={['100%', null, 'max-content']}
        mt="24px"
        onClick={onPresentSellModal}
      >
        {nft.marketData?.isTradable ? t('Adjust price') : t('List for sale')}
      </BtnB>

      {/* !nft.marketData?.isTradable */}
      {!nft.marketData?.isTradable && (
        <BtnB
          minWidth="168px"
          variant="secondary"
          width={['100%', null, 'max-content']}
          mt="24px"
          onClick={onEditProfileModal}
        >
          {/* {nftIsProfilePic ? t('Change Profile Pic') : t('Set as Profile Pic')} */}
          { t('Stake')}
        </BtnB>
      )}
    </Flex>
  )
  
  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            { !isMobile ? (<Box style={{marginLeft:'48px'}}>
              <TitleRow>
              <div style={{marginRight:'120px'}}>
              <CollectionLink style={{color:'#ffffff'}} to={`${nftsBaseUrl}/collections/${nft.collectionAddress}`}>
                {nft?.collectionName}
              </CollectionLink>
              <Text fontSize="32px" bold mt="12px">
                {nft.name}
              </Text>
              </div>
              <div>
              {/* {nft.description && <Text mt={['16px', '16px', '48px']}>{t(nft.description)}</Text>} */}
              <Text  color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Price')}
              </Text>
              {currentAskPriceAsNumber > 0 ? (
                <Flex alignItems="center" mt="10px">
                  <BinanceIcon width={32} height={32} mr="4px" />
                  <Text fontSize="32px" bold mr="5px">
                    {formatNumber(currentAskPriceAsNumber, 0, 5)}
                  </Text>
                  {/* {bnbBusdPrice ? (
                    <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} USD)`}  </Text>
                  ) : (
                    <Skeleton width="64px" /> 
                  )} */}
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
              
              {/* disabled={!nft.marketData?.isTradable} */}
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
            </Box>) :(<Box style={{marginTop:'248px'}}>
              <TitleRow>
                
              <div style={{display:'flex',flexDirection:'column'}}>
              <CollectionLink  style={{color:'#ffffff'}} to={`${nftsBaseUrl}/collections/${nft.collectionAddress}`}>
                {nft?.collectionName}
              </CollectionLink>
              <Text fontSize="32px" bold mt="12px">
                {nft.name}
              </Text>    
              {/* {nft.description && <Text mt={['16px', '16px', '48px']}>{t(nft.description)}</Text>} */}
              <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Price')}
              </Text>
              {currentAskPriceAsNumber > 0 ? (
                <Flex alignItems="center" mt="10px">
                  <BinanceIcon width={32} height={32} mr="4px" />
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
              
            </Box>) }
          </Flex>

          <Flex style={{position:'relative'}} flex="2" justifyContent={['center', null, 'flex-start']} alignItems="center" maxWidth={440}>
             { !isMobile ? <NftBg/> : <NftBgMobile/> }              
              
             { !isMobile ? <div style={{position:'relative',left:'105px'}}><img width='334px' height='334px' src='/images/nfts/imgbg.png'/></div>
             : <div style={{position:'absolute',width:'260px',height:'260px',top:'20px'}}><img src='/images/nfts/imgbg.png'/></div>
            }

             {!isMobile ? <NFTMedia style={{position:'absolute',right:'10px'}} key={nft.tokenId} nft={nft} width={!isMobile ? 304 : 243}
               height={!isMobile ? 304 : 243} />
               :<NFTMedia style={{position:'absolute',top:'35px'}} key={nft.tokenId} nft={nft} width={!isMobile ? 304 : 223}
               height={!isMobile ? 304 : 223} />
             }
              
              { !isMobile && <BondGearImg isMobile ={ false } src="/images/gear.png"/> }
           
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
