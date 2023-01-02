import styled, { css } from 'styled-components'
import { Box, Button, Flex, Heading, LinkExternal, useMatchBreakpoints,NextLinkFromReactRouter,PageHeader } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { useGetCollections } from 'state/nftMarket/hooks'
import { FetchStatus } from 'config/constants/types'
import PageLoader from 'components/Loader/PageLoader'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import Typed from 'react-typed'
import { useEffect } from 'react'

import Collections from './Collections'
import {
  BackgroundWrap,
  BackgroundTitle,
  BackgroundDes,
  BackgroundText,
  NftSculptureWrap,
  NftSculptureGif,
} from '../Profile/components/styles'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
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
  right: 90px;

  ${({ isMobile }: { isMobile: boolean }) => {
    if (isMobile) {
      return css`
        height: 300px;
        width: 300px;
      `
    }
    return css`
      height: 420px;
      width: 420px;
    `
  }};
`

const Home = () => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data: collections, status } = useGetCollections()

  const newestCollections = orderBy(
    collections,
    (collection) => (collection.createdAt ? Date.parse(collection.createdAt) : 0),
    'desc',
  )
  useEffect(() => {
    if (Object.keys(collections).length !== 0) {
      localStorage?.setItem('nfts', JSON.stringify(collections))
    }
  }, [account])

  return (
    <>
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          index={1}
          concaveDivider
          dividerPosition="top"
        >
          {!isMobile && (
            <NftSculptureWrap isMobile={isMobile}>
              <MagiccubeWrap isMobile={isMobile} src="/images/nfts/magicCube.png" alt="" />
            </NftSculptureWrap>
          )}
          {!isMobile && (
            <BackgroundWrap isMobile={isMobile}>
              <BackgroundText>
                <BackgroundTitle>
                  <Typed
                    strings={[
                      `${t('Discover more possibilities')}^1000`,
                      `${t('Explore more art and digital rights space')}^1000`,
                    ]}
                    typeSpeed={30}
                    style={{ fontSize: 35 }}
                    onComplete={(self) => self.reset()}
                  />
                </BackgroundTitle>
                <BackgroundDes>
                  {t(
                    'This is a brand new digital art space, where you can use DFS to purchase and retail NFT to gain limitless wealth',
                  )}
                </BackgroundDes>
              </BackgroundText>
            </BackgroundWrap>
          )}
          <Collections
            key="newest-collections"
            title={t('Newest Collections')}
            testId="nfts-newest-collections"
            collections={newestCollections}
          />
        </PageSection>
      )}
    </>
  )
}

export default Home
