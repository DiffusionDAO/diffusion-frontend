import { BinanceIcon, Box, Button, Card, CardBody, Flex, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import { NftToken } from 'state/nftMarket/types'
import styled, { css } from 'styled-components'
import { useDFSMineContract } from 'hooks/useContract'

import { formatNumber } from 'utils/formatBalance'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import EditProfileModal from 'views/Profile/components/EditProfileModal'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { nftsBaseUrl } from '../../../constants'
import { CollectionLink, Container } from '../shared/styles'

interface MainNFTCardProps {
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}

const NftBg = styled.div`
  width: 280px;
  height: 280px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  border: 1px solid rgba(70, 96, 255, 0.32);
  position: absolute;
  right: 15px;
  transform: rotate(10deg);
`

const NftBgMobile = styled.div`
  width: 245px;
  height: 245px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  border: 1px solid rgba(70, 96, 255, 0.32);
  position: absolute;
  top: 30px;
  transform: rotate(10deg);
`
const BtnB = styled(Button)`
  width: calc(50% - 5px);
  height: 40px;
  border-radius: 8px;
  color: #fff;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(90deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
const MainNFTCard: React.FC<React.PropsWithChildren<MainNFTCardProps>> = ({
  nft,
  isOwnNft,
  nftIsProfilePic,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  const dfsMineContract = useDFSMineContract()
  const currentAskPriceAsNumber = nft?.marketData?.currentAskPrice ?? '0'
  // const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, currentAskPriceAsNumber)
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentSellModal] = useModal(
    <SellModal variant={nft?.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)

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
        {nft?.marketData?.isTradable ? t('Adjust price') : t('List for sale')}
      </BtnB>
      {nft?.staked && (
        <BtnB
          minWidth="168px"
          variant="secondary"
          width={['100%', null, 'max-content']}
          mt="24px"
          onClick={async () => {
            await dfsMineContract.unstakeNFT(nft?.tokenId)
          }}
        >
          {t('Unstake')}
        </BtnB>
      )}
    </Flex>
  )

  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <CollectionLink to={`${nftsBaseUrl}/collections/${nft?.collectionAddress}`}>
                {nft?.collectionName}
              </CollectionLink>
              <Text fontSize="32px" bold mt="12px">
                {nft?.name}
              </Text>
              {nft?.description && <Text mt={['16px', '16px', '48px']}>{t(nft?.description)}</Text>}
              <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Price')}
              </Text>
              {currentAskPriceAsNumber !== '0' ? (
                <Flex alignItems="center" mt="8px">
                  <BinanceIcon width={18} height={18} mr="4px" />
                  <Text fontSize="32px" bold mr="4px">
                    {formatUnits(BigNumber.from(currentAskPriceAsNumber))}
                  </Text>
                </Flex>
              ) : (
                <Text fontSize="32px">{t('Not for sale')}</Text>
              )}
              {nftIsProfilePic && (
                <Text color="failure">
                  {t(
                    'This NFT is your profile picture, you must change it to some other NFT if you want to sell this one.',
                  )}
                </Text>
              )}
              {isOwnNft && ownerButtons}
              {!isOwnNft && (
                <Button
                  minWidth="168px"
                  disabled={!nft?.marketData?.isTradable}
                  mr="16px"
                  width={['100%', null, 'max-content']}
                  mt="24px"
                  onClick={onPresentBuyModal}
                >
                  {t('Buy')}
                </Button>
              )}
            </Box>
          </Flex>
          <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
            <NFTMedia key={nft?.tokenId} nft={nft} width={440} height={440} />
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
