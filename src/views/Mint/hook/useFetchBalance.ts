import BigNumber from 'bignumber.js';
import { useTokenContract } from 'hooks/useContract';
import useSWR from 'swr';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core'


export const useFetchBalance = () => {
  const tokenContract = useTokenContract("0xd49f9D8F0aB1C2F056e1F0232d5b9989F8a12CeF")
  const { account } = useWeb3React();

  const { data } = useSWR("dfsBalance", async () => {
    const val = await tokenContract.balanceOf(account)
    return val
  })
  return { balance: data ? parseInt(formatUnits(data,"ether")):0 }
}