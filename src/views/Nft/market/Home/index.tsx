import styled, { css } from 'styled-components'
import { Box, Button, Flex, Heading, LinkExternal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useGetCollections } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import PageLoader from 'components/Loader/PageLoader'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import SearchBar from '../components/SearchBar'
import Collections from './Collections'
import Newest from './Newest'
import config from './config'
import Typed from 'react-typed';
import {
  BackgroundWrap, BackgroundTitle, BackgroundDes,
  BackgroundText, NftSculptureWrap, NftSculptureGif
} from '../../../Nft/market/Profile/components/styles'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
`

const StyledPageHeader = styled(PageHeader)`
  margin-bottom: -40px;
  padding-bottom: 40px;
`

const StyledHeaderInner = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  & div:nth-child(1) {
    order: 1;
  }
  & div:nth-child(2) {
    order: 0;
    margin-bottom: 32px;
    align-self: end;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    & div:nth-child(1) {
      order: 0;
    }
    & div:nth-child(2) {
      order: 1;
      margin-bottom: 0;
      align-self: auto;
    }
  }
`
export const MagiccubeWrap = styled.img`
  position: absolute;
  top: 28px;
  bottom: -60px;
  right:90px;
  
  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 300px;
        width: 300px;
      `;
    }
    return css`
      height: 420px;
      width: 420px;
    `;
  }};
`

const Home = () => {
  const { isMobile } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { data: collections, status } = useGetCollections()

  const hotCollections = orderBy(
    collections,
    (collection) => (collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0),
    'desc',
  )

  const newestCollections = orderBy(
    collections,
    (collection) => (collection.createdAt ? Date.parse(collection.createdAt) : 0),
    'desc',
  )
  console.log("newestCollections:",newestCollections)
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto'}}>
      <PageMeta />
      {/* <StyledPageHeader>
        <StyledHeaderInner>
          <div>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('NFT Market')}
            </Heading>
            <Heading scale="lg" color="text">
              {t('Buy and Sell NFTs on BNB Smart Chain')}
            </Heading>
            {account && (
              <Button as={NextLinkFromReactRouter} to={`${nftsBaseUrl}/profile/${account.toLowerCase()}`} mt="32px">
                {t('Manage/Sell')}
              </Button>
            )}
          </div>
          <SearchBar />
        </StyledHeaderInner>
      </StyledPageHeader> */}

     {/* remove background={theme.colors.background}   */}
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          index={1}
          concaveDivider
          dividerPosition="top"
        >
      <NftSculptureWrap isMobile={isMobile}>
        <MagiccubeWrap isMobile={isMobile} src="/images/nfts/magicCube.png" alt="" />
      </NftSculptureWrap>
      <BackgroundWrap isMobile={isMobile}>
        <BackgroundText>
          <BackgroundTitle>
            <Typed
              strings={['Discover more possibilities explore more art and digital rights space']}
              typeSpeed={50}
              cursorChar=""
              style={{fontSize:40}}
            />
          </BackgroundTitle>
          <BackgroundDes>{t('This is a brand new digital art space, where you can use DFS to purchase and retail NFT to gain limitless wealth')}</BackgroundDes>
        </BackgroundText>
      </BackgroundWrap>
           <Collections
            key="newest-collections"
            title={t('Newest Collections')}
            testId="nfts-newest-collections"
            collections={newestCollections}
          />
          {/* <CollectionsNewest Collections
            key="hot-collections"
            title={t('Hot Collections')}
            testId="nfts-hot-collections"
            collections={hotCollections}
          />
          <Newest /> */}
        </PageSection>
      )}
      {/* <Gradient p="64px 0">
        <SectionsWithFoldableText header={t('FAQs')} config={config(t)} m="auto" />
        <LinkExternal href="https://docs.pancakeswap.finance/contact-us/nft-market-applications" mx="auto" mt="16px">
          {t('Apply to NFT Market!')}
        </LinkExternal>
      </Gradient> */}
    </div>
  )
}

export default Home
