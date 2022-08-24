import { useRouter } from 'next/router'
import { Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { formatNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import { nftsBaseUrl } from '../constants'
import TopBar from './TopBar'
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem'
import styled from 'styled-components'

interface HeaderProps {
  collection: Collection
}
const MarketWrap = styled.div`
border:1px solid rgba(171, 182, 255, 0.5);
border-radius:16px;
  
`
const Header: React.FC<HeaderProps> = ({ collection }) => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { totalSupply, numberTokensListed, totalVolumeBNB, banner, avatar } = collection
  const { t } = useTranslation()

  const volume = totalVolumeBNB
    ? parseFloat(totalVolumeBNB).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : '0'

  const itemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}`,
    },
    // {
    //   label: t('Traits'),
    //   href: `${nftsBaseUrl}/collections/${collectionAddress}#traits`,
    // },
    // {
    //   label: t('Activity'),
    //   href: `${nftsBaseUrl}/collections/${collectionAddress}#activity`,
    // },
  ]

  return (
    <>
      <MarketPageHeader>
      <TopBar />
      <MarketWrap>
      
        <BannerHeader bannerImage={banner.large} avatar={<AvatarImage src={avatar} />} />
        <MarketPageTitle
          title={collection.name}
          description={collection.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
        >
          <StatBox>
            <StatBoxItem title={t('Items')} stat={formatNumber(Number(totalSupply), 0, 0)} />
            <StatBoxItem
              title={t('Items listed')}
              stat={numberTokensListed ? formatNumber(Number(numberTokensListed), 0, 0) : '0'}
            />
            <LowestPriceStatBoxItem collectionAddress={collection.address} />
            <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'DFS' })} stat={volume} />
          </StatBox>
        </MarketPageTitle>
        </MarketWrap>
      </MarketPageHeader>
      <Container>
        <BaseSubMenu items={itemsConfig} activeItem={router.asPath} mt="24px" mb="8px" 
        style={{justifyContent:'left'}}
        />
      </Container>
    </>
  )
}

export default Header
