import BigNumber from 'bignumber.js';
import { useTokenContract } from 'hooks/useContract';
import useSWR from 'swr';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core'
import { getDFSAddress } from 'utils/addressHelpers';


export const useFetchBalance = () => {
  var address = getDFSAddress()
  const tokenContract = useTokenContract(address)
  const { account } = useWeb3React();

  const { data } = useSWR("dfsBalance", async () => {
    const val = await tokenContract.balanceOf(account)
    return val
  })
  return { balance: data ? formatUnits(data,"ether"):0 }
}

export const useFetchAllowance = (spender) => {
  var address = getDFSAddress()
  const tokenContract = useTokenContract(address)
  const { account } = useWeb3React();

  const { data } = useSWR("dfsAllowance", async () => {
    const val = await tokenContract.allowance(account,spender)
    return val
  })
  return { allowance: data ? formatUnits(data,"ether"):0 }
}
