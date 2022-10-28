import { useEffect } from 'react'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import useSWR from 'swr'
import { getPairAddress } from 'utils/addressHelpers'
import { useBondContract, usePairContract } from './useContract'

const useGetDocumentTitlePrice = () => {
  const pairAddress = getPairAddress()
  const pair = usePairContract(pairAddress)
  const { data, status } = useSWR('getPriceInUSDT', async () => {
    const reserves: any = await pair.getReserves()
    let marketPrice = reserves[1] / reserves[0]
    if (marketPrice < 1) {
      marketPrice = reserves[0] / reserves[1]
    }
    return marketPrice
  })
  useEffect(() => {
    const dfsPriceString = data ? data.toFixed(2) : ''
    document.title = `Diffusion - ${dfsPriceString}`
  }, [data])
}
export default useGetDocumentTitlePrice
