import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button,  DfsIcon, ErrorIcon, useTooltip, Skeleton } from '@pancakeswap/uikit'
import { escapeRegExp } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/nftMarket/types'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useBondContract, usePairContract } from 'hooks/useContract'
import useSWR from 'swr'
import { getDFSAddress, getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Divider } from '../shared/styles'
import { GreyedOutContainer, DfsAmountCell, RightAlignedInput, FeeAmountCell } from './styles'


interface SetPriceStageProps {
  nftToSell: NftToken
  variant: 'set' | 'adjust'
  currentPrice?: string
  lowestPrice?: number
  price: string
  setPrice: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

const MIN_PRICE = 0.005
const MAX_PRICE = 10000

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<React.PropsWithChildren<SetPriceStageProps>> = ({
  nftToSell,
  variant,
  lowestPrice,
  currentPrice,
  price,
  setPrice,
  continueToNextStage,
}) => {
  const {chainId} = useActiveChainId()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const adjustedPriceIsTheSame = variant === 'adjust' && parseFloat(currentPrice) === parseFloat(price)
  const priceIsValid = !price || Number.isNaN(parseFloat(price)) || parseFloat(price) <= 0

  const { creatorFee = '0', tradingFee = '5' } = useGetCollection(nftToSell.collectionAddress) || {}
  const creatorFeeAsNumber = parseFloat(creatorFee)
  const tradingFeeAsNumber = parseFloat(tradingFee)
  // const bnbPrice = useBNBBusdPrice()
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
  const priceAsFloat = parseFloat(price)
  const priceInUsd = priceAsFloat * dfsPrice

  const priceIsOutOfRange = priceAsFloat > MAX_PRICE || priceAsFloat < MIN_PRICE

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setPrice(nextUserInput)
    }
  }

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'When selling NFTs from this collection, a portion of the DFS paid will be diverted before reaching the seller:',
        )}
      </Text>
      {creatorFeeAsNumber > 0 && (
        <Text>{t('%percentage%% royalties to the collection owner', { percentage: creatorFee })}</Text>
      )}
      <Text>{t('%percentage%% trading fee will be used to burn', { percentage: tradingFee })}</Text>
    </>,
    { placement: 'auto' },
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const getButtonText = () => {
    if (variant === 'adjust') {
      if (adjustedPriceIsTheSame || priceIsValid) {
        return t('Input New Sale Price')
      }
      return t('Confirm')
    }
    return t('Enable Listing')
  }
  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {variant === 'set' ? t('Set Price') : t('Adjust Sale Price')}
      </Text>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Set Price')}
        </Text>
        <Flex>
          <Flex flex="1" alignItems="center">
            <DfsIcon width={24} height={24} mr="4px" />
            <Text bold>DFS</Text>
          </Flex>
          <Flex flex="2">
            <RightAlignedInput
              scale="sm"
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              inputMode="decimal"
              value={price}
              ref={inputRef}
              isWarning={priceIsOutOfRange}
              onChange={(e) => {
                enforcer(e.target.value.replace(/,/g, '.'))
              }}
            />
          </Flex>
        </Flex>
        <Flex alignItems="center" height="21px" justifyContent="flex-end">
          {!Number.isNaN(priceInUsd) && (
            <Text fontSize="12px" color="textSubtle">
              {`$${priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Text>
          )}
        </Flex>
        {priceIsOutOfRange && (
          <Text fontSize="12px" color="failure">
            {t('Allowed price range is between %minPrice% and %maxPrice% DFS', {
              minPrice: MIN_PRICE,
              maxPrice: MAX_PRICE,
            })}
          </Text>
        )}
        <Flex mt="8px">
          {Number.isFinite(creatorFeeAsNumber) && Number.isFinite(tradingFeeAsNumber) ? (
            <>
              <Text small color="textSubtle" mr="8px">
                {t('Seller pays %percentage%% platform fee on sale', {
                  percentage: creatorFeeAsNumber + tradingFeeAsNumber,
                })}
              </Text>
              <span ref={targetRef}>
                <ErrorIcon />
              </span>
              {tooltipVisible && tooltip}
            </>
          ) : (
            <Skeleton width="70%" />
          )}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Platform fee if sold')}
          </Text>
          {Number.isFinite(creatorFeeAsNumber) && Number.isFinite(tradingFeeAsNumber) ? (
            <FeeAmountCell dfsAmount={priceAsFloat} creatorFee={creatorFeeAsNumber} tradingFee={tradingFeeAsNumber} />
          ) : (
            <Skeleton width={40} />
          )}
        </Flex>
        {lowestPrice && (
          <Flex justifyContent="space-between" alignItems="center" mt="16px">
            <Text small color="textSubtle">
              {t('Lowest price on market')}
            </Text>
            <DfsAmountCell dfsAmount={lowestPrice} />
          </Flex>
        )}
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The NFT will be removed from your wallet and put on sale at this price.')}
          </Text>
          <Text small color="textSubtle">
            {t('Sales are in DFS.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {getButtonText()}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
