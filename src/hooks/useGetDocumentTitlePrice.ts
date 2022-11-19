import { useEffect } from 'react'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import useSWR from 'swr'
import { getDFSAddress, getPairAddress, getUSDTAddress } from 'utils/addressHelpers'
import { usePairContract } from './useContract'

const useGetDocumentTitlePrice = () => {
  const pairAddress = getPairAddress()
  const dfsAddress = getDFSAddress()
  const usdtAddress = getUSDTAddress()
  const pair = usePairContract(pairAddress)
  const { data, status } = useSWR('getPriceInUSDT', async () => {
    const reserves: any = await pair.getReserves()
    const [numerator, denominator] =
      usdtAddress.toLowerCase() < dfsAddress.toLowerCase() ? [reserves[1], reserves[0]] : [reserves[0], reserves[1]]
    const marketPrice = numerator / denominator

    return marketPrice
  })
  useEffect(() => {
    const dfsPriceString = data ? data.toFixed(2) : ''
    document.title = `Diffusion - ${dfsPriceString}`
  }, [data])
}
export default useGetDocumentTitlePrice
