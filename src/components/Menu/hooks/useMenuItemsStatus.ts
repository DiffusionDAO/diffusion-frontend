import { useMemo } from 'react'
import { LinkStatus } from '@pancakeswap/uikit/src/widgets/Menu/types'

export const useMenuItemsStatus = (): Record<string, string | (() => LinkStatus)> => {
  return useMemo(() => {
    return {}
  }, [])
}
