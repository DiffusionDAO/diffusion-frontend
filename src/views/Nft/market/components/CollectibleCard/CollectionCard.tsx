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
  left: 50%;
  transform: translateX(-48px);
  position: absolute;
  top: -48px;
  border: 4px white solid;
`

const StyledHotCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: 56px;
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
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
border:1px solid rgba(70, 96, 255, 0.4000);
border-top:none;
border-bottom-left-radius:16px;
border-bottom-right-radius:16px;
overflow:visible !important;
`

const StyledImage = styled(Image)`
border-top-left-radius: 16px;
border-top-right-radius: 16px;
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
    <CardBody p="8px">
      <StyledImage src={bgSrc} height={164} width={556} />
      <FlexWrap>
      <Flex
        position="relative"
        height="65px"
        justifyContent="center"
        alignItems="center"
        py="8px"
        flexDirection="column"
      >
        <CollectionAvatar src={avatarSrc} width={96} height={96} />
       
      </Flex>
      <Flex 
        flexDirection="column"
        height="65px"
        justifyContent="center"
        alignItems="center">
         <Heading  style={{color:'#ffffff'}} color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '8px' : '0'}>
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
