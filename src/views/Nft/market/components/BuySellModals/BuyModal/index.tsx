import { useEffect, useState } from 'react'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { MaxUint256, Zero } from '@ethersproject/constants'
import useTheme from 'hooks/useTheme'
import { useTranslation, TranslateFunction } from 'contexts/Localization'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'
import tokens from 'config/constants/tokens'
import { CHAIN_ID } from 'config/constants/networks'
import { ChainId } from '@pancakeswap/sdk'
import { parseUnits, formatEther } from '@ethersproject/units'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { requiresApproval } from 'utils/requiresApproval'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { NftToken } from 'state/nftMarket/types'
import { StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import ConfirmStage from '../shared/ConfirmStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'

import TransactionConfirmed from '../shared/TransactionConfirmed'

import { Contract } from '@ethersproject/contracts'
import get from 'lodash/get'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import addresses from 'config/constants/contracts'
import { getAddress } from 'utils/addressHelpers'
import { formatUnits } from '@ethersproject/units'

const getNFTItems = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [] 
): Promise<Array<any>>  => {  
    const contractMethod = get(contract, methodName)    
    const nftItems = await contractMethod(
      ...methodArgs
    )
    return nftItems
}

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

const wbnbAddress =                                             
  CHAIN_ID === String(ChainId.MAINNET) ? tokens.wbnb.address : '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'

const BuyModal: React.FC<BuyModalProps> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BNB)
 // const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.DFS)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account } = useWeb3React()
  const wbnbContractReader = useERC20(wbnbAddress, false)
  const wbnbContractApprover = useERC20(wbnbAddress)
  const dfsContractApprover = useERC20(getAddress(addresses.dfs))
  const nftMarketContract = useNftMarketContract()
  const { toastSuccess } = useToast()
  const nftPriceWei = parseUnits(nftToBuy?.marketData?.currentAskPrice, 'ether')
  let nftPrice:any = parseFloat(nftToBuy?.marketData?.currentAskPrice)
  
  nftPrice = formatUnits(BigNumber.from(String(nftPrice)),18)
  console.log(nftPriceWei,'-------',nftPrice,'----==')

  // BNB - returns ethers.BigNumber
  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useGetBnbBalance()
  const formattedBnbBalance = parseFloat(formatEther(bnbBalance))
  // WBNB - returns BigNumber
  const { balance: wbnbBalance, fetchStatus: wbnbFetchStatus } = useTokenBalance(wbnbAddress)
  const formattedWbnbBalance = getBalanceNumber(wbnbBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.BNB ? formattedBnbBalance : formattedWbnbBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.BNB ? bnbFetchStatus : wbnbFetchStatus

  const notEnoughBnbForPurchase =
    paymentCurrency === PaymentCurrency.BNB
      ? bnbBalance.lt(nftPriceWei)
      : wbnbBalance.lt(ethersToBigNumber(nftPriceWei))
      
  useEffect(() => {
    if (bnbBalance.lt(nftPriceWei) && wbnbBalance.gte(ethersToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WBNB)
      setIsPaymentCurrentInitialized(true)
    }
  }, [bnbBalance, wbnbBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      console.log('=====onrequireApprove====')
      return requiresApproval(wbnbContractReader, account, nftMarketContract.address)
    },
    onApprove: async() => {
      return await dfsContractApprover.approve(nftMarketContract.address, MaxUint256)
      //return callWithGasPrice(wbnbContractApprover, 'approve', [nftMarketContract.address, MaxUint256])

      // return callWithGasPrice(dfsContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
    },
    // why approve require gas 
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WBNB!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // note this is buy NFT  confirm pay gas by BNB  remark by dry
    onConfirm: async () => {
      const payAmount = Number.isNaN(nftPrice) ? Zero : parseUnits(nftToBuy?.marketData?.currentAskPrice)
      
      if (paymentCurrency === PaymentCurrency.BNB) {
        // use ours contract  remark dry
        //callWithGasPrice(nftMarketContract, 'buyTokenUsingBNB', value: payAmount,
        //createMarketSaleByERC20
        
        const items = await getNFTItems(nftMarketContract,'fetchMarketItems')
        console.log('items->',items)
        const newItem =  items.find((item)=>{
        const bigToken =  BigNumber.from(nftToBuy.tokenId)
          if (bigToken.eq(item['tokenId'])){
             return true
          } else {
            return false
          }
        })
        const itemId = newItem['itemId']
        console.log('itemok:',itemId)
        return callWithGasPrice(nftMarketContract, 'createMarketSaleByERC20', [itemId], {
         
        })
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWBNB', [
        nftToBuy.collectionAddress,
        nftToBuy.tokenId,
        payAmount,
      ])
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
    //paymentCurrency === PaymentCurrency.WBNB
    if (paymentCurrency === PaymentCurrency.BNB && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
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
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
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
