import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Grid, Flex, Text, BinanceIcon, Skeleton } from '@pancakeswap/uikit'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useBondContract } from 'hooks/useContract'
import useSWR from 'swr'
import { BuyingStage } from './types'

export const StyledModal = styled(Modal)<{ stage: BuyingStage }>`
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) =>
      stage === BuyingStage.APPROVE_AND_CONFIRM || stage === BuyingStage.CONFIRM
        ? `color: ${theme.colors.textSubtle}`
        : null};
  }
  & svg:first-of-type {
    ${({ stage, theme }) =>
      stage === BuyingStage.APPROVE_AND_CONFIRM || stage === BuyingStage.CONFIRM
        ? `fill: ${theme.colors.textSubtle}`
        : null};
  }
`

export const BorderedBox = styled(Grid)`
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 8px;
`

interface DfsAmountCellProps {
  dfsAmount: number
  isLoading?: boolean
  isInsufficient?: boolean
}

export const DfsAmountCell: React.FC<React.PropsWithChildren<DfsAmountCellProps>> = ({
  dfsAmount,
  isLoading,
  isInsufficient,
}) => {
  const bond = useBondContract()
  const { data: dfsPrice, status } = useSWR('getDFSUSDTPrice', async () => {
    const price = await bond.getDFSUSDTPrice()
    return price
  })

  if (isLoading) {
    return (
      <Flex flexDirection="column" justifySelf="flex-end">
        <Skeleton width="86px" height="20px" mb="6px" />
        <Skeleton width="86px" height="20px" />
      </Flex>
    )
  }
  const usdAmount = multiplyPriceByAmount(dfsPrice?.toNumber(), dfsAmount)
  return (
    <Flex justifySelf="flex-end" flexDirection="column">
      <Flex justifyContent="flex-end">
        <BinanceIcon height={16} width={16} mr="4px" />
        <Text bold color={isInsufficient ? 'failure' : 'text'}>{`${dfsAmount.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 5,
        })}`}</Text>
      </Flex>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}
