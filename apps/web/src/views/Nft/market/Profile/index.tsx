import { FC } from 'react'
import { useRouter } from 'next/router'
import { isAddress } from 'utils'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import MarketPageHeader from '../components/MarketPageHeader'
// import NoNftsImage from '../components/Activity/NoNftsImage'
import { useNftsForAddress } from '../hooks/useNftsForAddress'

const TabMenuWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);

  ${({ theme }) => theme.mediaQueries.sm} {
    left: auto;
    transform: none;
  }
`

const NftProfile: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()

  const invalidAddress = !accountAddress || isAddress(accountAddress) === false

  if (invalidAddress) {
    return (
      <>
        <div style={{ minHeight: 'auto', margin: '20px' }}>
          <Flex p="24px" flexDirection="column" alignItems="center">
            {/* <NoNftsImage /> */}
            <Text textAlign="center" maxWidth="420px" pt="8px" bold>
              {t('Please enter a valid address, or connect your wallet to view your profile')}
            </Text>
          </Flex>
        </div>
      </>
    )
  }

  return (
    <>
      <div style={{ minHeight: 'auto' }}>{children}</div>
    </>
  )
}

export const NftProfileLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <NftProfile>{children}</NftProfile>
}

export default NftProfile
