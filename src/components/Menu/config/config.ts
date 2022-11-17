import {
  DashboardIcon,
  DashboardFillIcon,
  BondIcon,
  BondFillIcon,
  MintIcon,
  MintFillIcon,
  RewardIcon,
  RewardFillIcon,
  NftMarketIcon,
  NftMarketFillIcon,
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { perpTheme } from 'utils/getPerpetualTheme'
import { DropdownMenuItems } from '@pancakeswap/uikit/src/components/DropdownMenu/types'
import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains'
import { useDFSContract } from 'hooks/useContract'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
  isPrivate?: boolean,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) => {
  const items = [
    {
      label: t('Dashboard'),
      icon: DashboardIcon,
      fillIcon: DashboardIcon,
      href: '/dashboard',
      showItemsOnMobile: false,
      items: [],
    },
    {
      label: t('Bonds'),
      icon: BondIcon,
      fillIcon: BondFillIcon,
      href: '/bond',
      showItemsOnMobile: false,
      items: [],
    },
    {
      label: t('Mint'),
      icon: MintIcon,
      fillIcon: MintFillIcon,
      href: '/mint',
      showItemsOnMobile: false,
      items: [],
    },
    {
      label: t('Rewards'),
      icon: RewardIcon,
      fillIcon: RewardFillIcon,
      href: '/reward',
      showItemsOnMobile: false,
      items: [],
    },
    {
      label: t('NFT'),
      icon: NftMarketIcon,
      fillIcon: NftMarketFillIcon,
      href: `${nftsBaseUrl}`,
      showItemsOnMobile: false,
      items: [],
    },
  ]
  if (isPrivate) {
    items.push({
      label: t('Private'),
      icon: NftMarketIcon,
      fillIcon: NftMarketFillIcon,
      href: `/private`,
      showItemsOnMobile: false,
      items: [],
    })
  }
  console.log(items)
  return items
}

export default config
