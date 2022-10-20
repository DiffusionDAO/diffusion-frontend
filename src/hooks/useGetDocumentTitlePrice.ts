import { useEffect } from 'react'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import useSWR from 'swr'
import { useBondContract } from './useContract'

const useGetDocumentTitlePrice = () => {
  // const cakePriceBusd = useCakeBusdPrice()
  const bond = useBondContract()
  const { data, status } = useSWR('getDFSUSDTPrice', async () => {
    return bond.getDFSUSDTPrice()
  })
  useEffect(() => {
    const dfsPriceString = data ? data.toFixed(2) : ''
    document.title = `Diffusion - ${dfsPriceString}`
  }, [data])
}
export default useGetDocumentTitlePrice
