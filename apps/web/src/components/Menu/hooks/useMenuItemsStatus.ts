import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useChainCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
import { usePotteryStatus } from './usePotteryStatus'
// import { useCompetitionStatus } from './useCompetitionStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
 

  return useMemo(() => {
    return {
      // '/swap': 'soon',
      // '/gamefi': 'soon' ,
      // '/socialfi': 'soon' ,
    }
  }, [])
  // return {}
}
