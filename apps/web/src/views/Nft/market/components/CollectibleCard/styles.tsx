import { ReactElement } from 'react'
import {
  Card,
  BinanceIcon,
  Box,
  BoxProps,
  CameraIcon,
  Flex,
  FlexProps,
  SellIcon,
  Text,
  WalletFilledIcon,
  Skeleton,
  DfsIcon,
} from '@pancakeswap/uikit'
import { Currency, Price } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { multiplyPriceByAmount } from 'utils/prices'
import styled from 'styled-components'

export const Footer: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box borderTop={[null, null, null, '1px solid']} borderColor="cardBorder" pt="8px" {...props}>
    {children}
  </Box>
)

interface BNBAmountLabelProps extends FlexProps {
  amount: number
}

export const DFSAmountLabel: React.FC<React.PropsWithChildren<BNBAmountLabelProps>> = ({ amount, ...props }) => (
  <Flex alignItems="center" {...props}>
    <DfsIcon width="16px" height="16px" mx="4px" />
    <Text fontWeight="600">
      {amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
      })}
    </Text>
  </Flex>
)

interface CostLabelProps extends FlexProps {
  cost: number
  bnbBusdPrice: Price<Currency, Currency>
}

export const CostLabel: React.FC<React.PropsWithChildren<CostLabelProps>> = ({ cost, bnbBusdPrice, ...props }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, cost)

  return (
    <Flex alignItems="center" {...props}>
      {/* {priceInUsd > 0 && (
        <Text fontSize="12px" color="textSubtle">{`($${priceInUsd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}</Text>
      )} */}
      <DFSAmountLabel amount={cost} />
    </Flex>
  )
}

interface MetaRowProps extends FlexProps {
  title: string
}

export const MetaRow: React.FC<React.PropsWithChildren<MetaRowProps>> = ({ title, children, ...props }) => (
  <Flex alignItems="center" justifyContent="space-between" {...props}>
    <Text fontSize="12px" color="textSubtle" maxWidth="120px" ellipsis title={title}>
      {title}
    </Text>
    <Box>{children}</Box>
  </Flex>
)

export interface NftTagProps extends FlexProps {
  icon?: ReactElement
  color?: string
}

export const NftTag: React.FC<React.PropsWithChildren<NftTagProps>> = ({
  icon,
  color = 'text',
  children,
  ...props
}) => (
  <Flex display="inline-flex" alignItems="center" height="24px" {...props}>
    {icon}
    <Text color={color} fontSize="14px" fontWeight="600">
      {children}
    </Text>
  </Flex>
)

export const ProfileNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<CameraIcon mr="4px" width="16px" color="textSubtle" />} color="textSubtle" {...props}>
      {t('Profile')}
    </NftTag>
  )
}

export const WalletNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<WalletFilledIcon mr="4px" width="16px" color="secondary" />} color="secondary" {...props}>
      {t('Wallet')}
    </NftTag>
  )
}

export const SellingNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<SellIcon mr="4px" width="16px" color="failure" />} color="failure" {...props}>
      {t('Selling')}
    </NftTag>
  )
}

export const StyledCollectibleCard = styled(Card)`
  border-radius: 8px;
  max-width: 320px;
  background: rgb(56, 50, 65);
  background: RGBA(26, 15, 73, 0.09);
  transition: opacity 200ms;
  :hover {
    background: url('/images/nfts/Colorframe.png');
    border: none;
    background-size: 100% 100%;
  }

  & > div {
    border: 1px solid rgba(70, 96, 255, 0.3);
    border-radius: 8px;
    background: rgb(39, 38, 44);
    background: RGBA(26, 15, 73, 0.09);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
`

export const CheckBoxWrap = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1;
  background: linear-gradient(135deg, #3c00ff, #ec6eff);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
`
export const CheckBox = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: antiquewhite;
`

interface LowestPriceMetaRowProps {
  lowestPrice: number
  isFetching: boolean
  bnbBusdPrice: Price<Currency, Currency>
}

export const LowestPriceMetaRow = ({ lowestPrice, isFetching, bnbBusdPrice }: LowestPriceMetaRowProps) => {
  const { t } = useTranslation()

  if (!isFetching && !lowestPrice) {
    return null
  }

  return (
    <MetaRow title={t('Lowest price')}>
      {isFetching ? (
        <Skeleton height="24px" width="30px" />
      ) : (
        <CostLabel cost={lowestPrice} bnbBusdPrice={bnbBusdPrice} />
      )}
    </MetaRow>
  )
}
