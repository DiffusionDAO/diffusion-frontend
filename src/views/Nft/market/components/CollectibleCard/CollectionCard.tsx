import { Card, CardBody, Flex, Heading, ProfileAvatar } from '@pancakeswap/uikit'

import Image from 'next/image'
import { NextLinkFromReactRouter } from 'components/NextLink'
import styled, { css } from 'styled-components'

interface HotCollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url?: string
  disabled?: boolean
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 42px;
  transform: translateX(-48px);
  position: absolute;
  top: -48px;
  border: 4px white solid;
`

const StyledHotCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: 80px;
  background: rgba(231, 227, 235,0.08);
  transition: opacity 200ms;
  overflow: visible;
  //border:8px solid;
  padding: 1px 1px 3px;
  & > div {
    border-radius: 4px;
    border-bottom-left-radius: 56px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }
`
const FlexWrap = styled.div`
//border:1px solid rgba(70, 96, 255, 0.4000);
//border-radius:16px;
//border-bottom-left-radius:60px;
border-bottom-right-radius:8px;
//background:rgba(171, 182, 255, 0.200);
padding:8px;

`

const StyledImage = styled(Image)`
// border-top-left-radius: 8x;
// border-top-right-radius: 8px;
   border-radius:4px;
   padding:8px;
`

const CollectionCard: React.FC<HotCollectionCardProps> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  disabled,
  children,
}) => {
  const renderBody = () => (
    // <CardBody>
    //   <StyledImage src={bgSrc} height={168} width={556} />
    //   <FlexWrap>
    //   <Flex
    //     position="relative"
    //     height="65px"
    //     justifyContent="center"
    //     alignItems="center"
    //     flexDirection="column"
    //   >
    //     <CollectionAvatar src={avatarSrc} width={96} height={96} />
       
    //   </Flex>
    //   <Flex 
    //     flexDirection="column"
    //     height="65px"
    //     justifyContent="center"
    //     alignItems="center">
    //      <Heading  style={{color:'#ffffff'}} color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '8px' : '0'}>
    //       {collectionName}
    //     </Heading>

    //     {children}

    //   </Flex>
    //   </FlexWrap>
    // </CardBody>
    <CardBody p="8px">
      <StyledImage src={bgSrc} height={180} width={556} />
      <FlexWrap>
      <Flex
        position="relative"
        height="54px"
        justifyContent="center"
        alignItems="flex-end"
        flexDirection="column"
      >
        <CollectionAvatar src={avatarSrc} width={96} height={96} />
        <Heading style={{color:'#ffffff'}} color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '6px' : '0'}>
          {collectionName}
        </Heading>
        {children}
      </Flex>
      </FlexWrap>
    </CardBody>
  )

  return (
    <StyledHotCollectionCard disabled={disabled} data-test="hot-collection-card">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledHotCollectionCard>
  )
}

export default CollectionCard
