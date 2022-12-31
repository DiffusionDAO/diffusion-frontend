import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Grid, Flex, Text, BinanceIcon, Skeleton, DfsIcon } from '@pancakeswap/uikit'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useBondContract, usePairContract } from 'hooks/useContract'
import useSWR from 'swr'
import { getDFSAddress, getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
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
  const {chainId} = useActiveChainId()
  const pairAddress = getPairAddress(chainId)
  const pair = usePairContract(pairAddress)
  const usdtAddress = getUSDTAddress(chainId)
  const dfsAddress = getDFSAddress(chainId)
  

  const { data: dfsPrice, status } = useSWR('getPriceInUSDT', async () => {
    const reserves: any = await pair.getReserves()

    const [numerator, denominator] =
      usdtAddress.toLowerCase() < dfsAddress.toLowerCase() ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]]

    const marketPrice = numerator / denominator

    return marketPrice
  })

  if (isLoading) {
    return (
      <Flex flexDirection="column" justifySelf="flex-end">
        <Skeleton width="86px" height="20px" mb="6px" />
        <Skeleton width="86px" height="20px" />
      </Flex>
    )
  }
  const usdAmount = dfsPrice * dfsAmount
  return (
    <Flex justifySelf="flex-end" flexDirection="column">
      <Flex justifyContent="flex-end">
        <DfsIcon height={16} width={16} mr="4px" />
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
