import { MaxUint256, Zero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { formatEther, parseUnits } from '@ethersproject/units'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useDFSContract,
  useERC20,
  useNFTDatabaseContract,
  useNftMarketContract,
  useSocialNftContract,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'hooks/useTokenBalance'
import { NFT, zeroAddress } from 'pages/profile/[accountAddress]'
import { useEffect, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDFSAddress } from 'utils/addressHelpers'
import { ethersToBigNumber } from '@pancakeswap/utils/bigNumber'
import { getContract } from 'utils/contractHelpers'
import { formatBigNumber, formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import socialNFTAbi from 'config/abi/socialNFTAbi.json'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import ReviewStage from './ReviewStage'
import { StyledModal } from './styles'
import { BuyingStage, PaymentCurrency } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.APPROVE_AND_CONFIRM]: t('Back'),
  [BuyingStage.CONFIRM]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

// NFT WBNB in testnet contract is different
const TESTNET_WBNB_NFT_ADDRESS = '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'

const BuyModal: React.FC<React.PropsWithChildren<BuyModalProps>> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.DFS)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account, chainId } = useWeb3React()
  const dfsAddress = getDFSAddress(chainId)
  const dfsContractReader = useERC20(dfsAddress, false)
  const dfsContractApprover = useERC20(dfsAddress)
  const nftMarketContract = useNftMarketContract()

  const database = useNFTDatabaseContract()
  const dfsContract = useERC20(dfsAddress)
  const socialNFT = useSocialNftContract()
  const erc721a = getContract({ abi: socialNFTAbi, address: nftToBuy.collectionAddress, chainId })
  // useEffect(() => {
  //   dfsContract.allowance(account, nftMarketContract.address).then(allowance => {
  //     if (allowance.lt(parseUnits(nftToBuy.marketData.currentAskPrice,"ether"))) {
  //         callWithGasPrice(dfsContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
  //       }
  //     }).catch(error => console.log(error.reason))
  // }, [account])

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy?.marketData?.currentAskPrice, 'ether')
  const nftPrice = parseFloat(nftToBuy?.marketData?.currentAskPrice)

  // BNB - returns ethers.BigNumber
  // const { balance: walletBalance, fetchStatus: bnbFetchStatus } = useGetBnbBalance()
  // const formattedBnbBalance = parseFloat(formatEther(walletBalance))
  // // WBNB - returns BigNumber
  // const { balance: wbnbBalance, fetchStatus: wbnbFetchStatus } = useTokenBalance(wbnbAddress)
  // const formattedWbnbBalance = getBalanceNumber(wbnbBalance)

  // const walletBalance = paymentCurrency === PaymentCurrency.BNB ? formattedBnbBalance : formattedWbnbBalance
  const { balance: walletBalance, fetchStatus: walletFetchStatus } = useTokenBalance(getDFSAddress(chainId))
  const walletBalanceNumber = walletBalance.div(10 ** 18).toNumber()
  const notEnoughBnbForPurchase = walletBalance.lt(ethersToBigNumber(nftPriceWei)) ?? false
  useEffect(() => {
    if (walletBalance.lt(ethersToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WBNB)
      setIsPaymentCurrentInitialized(true)
    }
  }, [walletBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(dfsContract, account, nftMarketContract.address)
    },
    onApprove: () => {
      return callWithGasPrice(dfsContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WBNB!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      /* eslint-disable no-param-reassign */
      const transactionResponse: Promise<TransactionResponse> = callWithGasPrice(
        nftMarketContract,
        'createMarketSaleByERC20',
        [nftToBuy.collectionAddress, nftToBuy.tokenId],
      )
      transactionResponse
        .then((response) => {
          response.wait().then((res) => {
            erc721a.getToken(nftToBuy.tokenId).then((nft: NFT) => {
              nftToBuy.owner = account
              nftToBuy.marketData.isTradable = false
              nftToBuy.marketData.currentAskPrice = '0'
              nftToBuy.marketData.currentSeller = nft.seller
            })
          })
        })
        .catch((error) => console.log(error.reason))

      return transactionResponse
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WBNB && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      dfsContract
        .allowance(account, nftMarketContract.address)
        .then((allowance) => {
          if (allowance.lt(nftPriceWei)) {
            callWithGasPrice(dfsContractApprover, 'approve', [nftMarketContract.address, MaxUint256]).then((res) =>
              setStage(BuyingStage.CONFIRM),
            )
          } else {
            setStage(BuyingStage.CONFIRM)
          }
        })
        .catch((error) => console.log(error.reason))
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalanceNumber}
          walletFetchStatus={walletFetchStatus}
          notEnoughBnbForPurchase={notEnoughBnbForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
