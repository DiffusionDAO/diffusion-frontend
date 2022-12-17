import { Card, CardBody, Flex, Heading, ProfileAvatar,NextLinkFromReactRouter } from '@pancakeswap/uikit'

import Image from 'next/image'
import styled, { css } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

interface HotCollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url?: string
  disabled?: boolean
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
  border: 4px white solid;
`

const StyledHotCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: 80px;
  background: rgba(231, 227, 235, 0.08);
  transition: opacity 200ms;
  overflow: visible;
  //border:8px solid;
  padding: 1px 1px 3px;

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

const StyledImage = styled(Image)`
  border-radius: 4px;
  padding: 8px;
`
const FlexWrap = styled.div`
  //border:1px solid rgba(70, 96, 255, 0.4000);
  //border-radius:16px;
  //border-bottom-left-radius:60px;
  border-bottom-right-radius: 8px;
  //background:rgba(171, 182, 255, 0.200);
  padding: 8px;
`
const CollectionCard: React.FC<React.PropsWithChildren<HotCollectionCardProps>> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  disabled,
  children,
}) => {
  const { t } = useTranslation()

  const renderBody = () => (
    <CardBody p="8px">
      <StyledImage src={bgSrc} height={180} width={556} />
      <FlexWrap>
        <Flex
          position="relative"
          height="54px"
          justifyContent="center"
          alignItems="flex-end"
          py="8px"
          flexDirection="column"
        >
          <CollectionAvatar src={avatarSrc} width={96} height={96} />
          <Heading
            style={{ color: '#FFFFFF' }}
            color={disabled ? 'textDisabled' : 'body'}
            as="h3"
            mb={children ? '8px' : '0'}
          >
            {t(collectionName)}
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
