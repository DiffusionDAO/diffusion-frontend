import {
  useMatchBreakpoints,
  BinanceImage,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import { NftToken } from 'state/nftMarket/types'
import styled, { css } from 'styled-components'
import { useDFSContract, useDFSMiningContract } from 'hooks/useContract'
import { formatNumber } from 'utils/formatBalance'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import { MaxUint256 } from '@ethersproject/constants'
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
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  border: 1px solid rgba(70, 96, 255, 0.32);
  position: absolute;
  top: 10px;
  right: -5px;
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
      `
    }
    return css`
      width: 180px;
      height: 180px;
      left: 280px;
      bottom: 0px;
    `
  }};
`
interface noteProps {
  title: string
  description: string
  visible: boolean
}

const zeroAddress = '0x0000000000000000000000000000000000000000'

const MainNFTCard: React.FC<React.PropsWithChildren<MainNFTCardProps>> = ({
  nft,
  isOwnNft,
  nftIsProfilePic,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const router = useRouter()
  const dfsMineContract = useDFSMiningContract()
  const dfsContract = useDFSContract()
  const currentAskPriceAsNumber = nft?.marketData?.currentAskPrice ?? '0'
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentSellModal] = useModal(
    <SellModal variant={nft?.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )
  const [noteContent, setNoteContent] = useState<noteProps>({
    title: '',
    description: '',
    visible: false,
  })
  const { isMobile } = useMatchBreakpoints()
  const ownerButtons = (
    <Flex flexDirection={['column', 'column', 'row']}>
      <BtnB
        disabled={nftIsProfilePic}
        minWidth="168px"
        mr="16px"
        width={['100%', null, 'max-content']}
        mt="24px"
        onClick={
          nft?.staker === zeroAddress
            ? onPresentSellModal
            : async () => {
                setNoteContent({
                  title: t('Note'),
                  description: t('2% fees will be charged for unstaking'),
                  visible: true,
                })
                try {
                  const allowance = await dfsContract.allowance(account, dfsMineContract.address)
                  if (allowance.eq(0)) {
                    const receipt = await dfsContract.approve(dfsMineContract.address, MaxUint256)
                    await receipt.wait()
                  }
                  const receipt = await dfsMineContract.unstakeNFT(nft?.tokenId)
                  await receipt.wait()
                  router.push(`/profile/${account}`)
                } catch (error: any) {
                  window.alert(error.reason ?? error.data?.message ?? error.message)
                }
              }
        }
      >
        {nft?.marketData?.isTradable
          ? t('Adjust price')
          : nft?.staker === zeroAddress
          ? t('List for sale')
          : t('Unstake')}
      </BtnB>
    </Flex>
  )
  return (
    <Card mb="40px" background="none">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              {isMobile ? (
                <div style={{ marginBottom: '30px', marginTop: '330px' }}>
                  <CollectionLink to={`${nftsBaseUrl}/collections/${nft?.collectionAddress}`}>
                    {nft?.collectionName}
                  </CollectionLink>
                  <Text fontSize="32px" bold mt="12px">
                    {t(`${nft?.name}#%tokenId%`, { tokenId: nft?.tokenId })}
                  </Text>
                  <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                    {t('Price')}
                  </Text>
                  {currentAskPriceAsNumber !== '0' ? (
                    <Flex alignItems="center" mt="8px">
                      <BinanceImage width={30} height={30} mr="4px" />
                      <Text fontSize="32px" bold mr="4px">
                        {currentAskPriceAsNumber}
                      </Text>
                    </Flex>
                  ) : (
                    <Text fontSize="32px">{t('Not for sale')}</Text>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', marginBottom: '97px', marginTop: '30px', marginLeft: '48px' }}>
                  <div>
                    <CollectionLink to={`${nftsBaseUrl}/collections/${nft?.collectionAddress}`}>
                      {nft?.collectionName}
                    </CollectionLink>
                    <Text fontSize="32px" bold mt="12px">
                      {nft?.name}
                    </Text>
                  </div>
                  <div style={{ marginLeft: '158px' }}>
                    <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                      {t('Price')}
                    </Text>
                    {currentAskPriceAsNumber !== '0' ? (
                      <Flex alignItems="center" mt="8px">
                        <BinanceImage width={30} height={30} mr="4px" />
                        <Text fontSize="32px" bold mr="4px">
                          {currentAskPriceAsNumber}
                        </Text>
                      </Flex>
                    ) : (
                      <Text fontSize="32px">{t('Not for sale')}</Text>
                    )}
                  </div>
                </div>
              )}

              <div style={{ marginLeft: '48px' }}>
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
              </div>
            </Box>
          </Flex>
          <Flex
            flex="2"
            justifyContent={['center', null, 'flex-end']}
            style={{ position: 'relative' }}
            alignItems="center"
            maxWidth={440}
          >
            <NftBg />
            <div style={{ position: 'absolute', top: '-15px', right: '-15px' }}>
              <img width="334px" alt="" height="334px" src="/images/nfts/imgbg.png" />
            </div>
            <div style={{ position: 'absolute', top: '5px', width: '304px' }}>
              <NFTMedia key={nft?.tokenId} nft={nft} width={300} height={300} />
            </div>
            {!isMobile && <BondGearImg isMobile={false} src="/images/gear.png" />}
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
