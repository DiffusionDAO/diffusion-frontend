import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import PreviewImage from './PreviewImage'
import { CostLabel, LowestPriceMetaRow, MetaRow } from './styles'
import LocationTag from './LocationTag'
import { CollectibleCardProps } from './types'
import { useGetLowestPriceFromNft } from '../../hooks/useGetLowestPrice'
import { pancakeBunniesAddress } from '../../constants'
import NFTMedia from '../NFTMedia'


const CollectibleCardBody: React.FC<CollectibleCardProps> = ({ nft, nftLocation, currentAskPrice, isUserNft }) => {
  const { t } = useTranslation()
 
  const { name } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const isPancakeBunny = nft.collectionAddress?.toLowerCase() === pancakeBunniesAddress.toLowerCase()
  const { isFetching, lowestPrice } = useGetLowestPriceFromNft(nft)
  var thumbnail = nft?.image?.thumbnail
 
  return (

    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <div style={{display:'flex',justifyContent:'space-between',height:'8px',alignItems:'center'}}>
      <Text as="h4" fontWeight="600" >
        {name}
      </Text>
      {nft?.attributes && nft?.attributes[0].value && <img src={"/images/grade/"+nft.attributes[0].value+'.png'}/>}
      
      </div>
      
      <Box borderTop="1px solid rgba(171, 182, 255, 0.0200)" borderTopColor="cardBorder" pt="8px" mt="10px">
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
         {!currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={0.00} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
