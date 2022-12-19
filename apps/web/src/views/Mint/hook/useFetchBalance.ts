import { useTokenContract } from 'hooks/useContract'
import useSWR from 'swr'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getDFSAddress } from 'utils/addressHelpers'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useFetchBalance = () => {
  const {chainId} = useActiveChainId()
  const address = getDFSAddress(chainId)
  const tokenContract = useTokenContract(address)
  const { account } = useWeb3React()

  const { data } = useSWR('dfsBalance', async () => {
    const val = await tokenContract.balanceOf(account)
    return val
  })

  return { balance: data || BigNumber.from(0) }
}

export const useFetchAllowance = (spender) => {
  const {chainId} = useActiveChainId()
  const address = getDFSAddress(chainId)
  const tokenContract = useTokenContract(address)
  const { account } = useWeb3React()

  const { data } = useSWR('dfsAllowance', async () => {
    const val = await tokenContract.allowance(account, spender)
    return val
  })
  return { allowance: data || BigNumber.from(0) }
}
