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
  TuneIcon,
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
  DropdownMenuItems
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains'
import { nftsBaseUrl } from 'views/Nft/market/constants'

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
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    
    {
      label: t('Dashboard'),
      icon: DashboardIcon,
      fillIcon: DashboardFillIcon,
      href: '/dashboard',
      showItemsOnMobile: false,
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Bonds'),
      icon: BondIcon,
      // supportChainIds: [],
      fillIcon: BondFillIcon,
      href: '/bond',
      showItemsOnMobile: false,
      // image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },


    {
      label: t('Mint'),
      href: '/mint',
      icon: MintIcon,
      // supportChainIds: [],
      fillIcon: MintFillIcon,
      showItemsOnMobile: false,
      image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Rewards'),
      href: '/reward',
      icon: RewardIcon,
      // supportChainIds: [],
      fillIcon: RewardFillIcon,
      showItemsOnMobile: false,
      image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('NFT'),
      href: `${nftsBaseUrl}`,
      icon: NftMarketIcon,
      // supportChainIds: [],
      fillIcon: NftMarketFillIcon,
      showItemsOnMobile: false,
      image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        }]
      }, 
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
