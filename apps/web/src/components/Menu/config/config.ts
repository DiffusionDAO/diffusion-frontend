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
import { SUPPORT_ONLY_BSC,SUPPORT_ZAP } from 'config/constants/supportChains'
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
  isPrivate?: boolean,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId,isPrivate) => {
  const items = [
    {
      label: t('Dashboard'),
      icon: DashboardIcon,
      fillIcon: DashboardFillIcon,
      supportChainIds: SUPPORT_ZAP,
      href: '/dashboard',
      showItemsOnMobile: false,
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Bonds'),
      icon: BondIcon,
      supportChainIds: SUPPORT_ZAP,
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
      supportChainIds: SUPPORT_ZAP,
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
      supportChainIds: SUPPORT_ZAP,
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
      supportChainIds: SUPPORT_ZAP,
      fillIcon: NftMarketFillIcon,
      showItemsOnMobile: false,
      image: '/images/decorations/pe2.png',
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    }
    // {
      // label: t('Trade'),
      // icon: SwapIcon,
      // fillIcon: SwapFillIcon,
      // href: '/swap',
      // supportChainIds: SUPPORT_ZAP,
      // showItemsOnMobile: false,
      // items: [
      //   {
      //     label: t('Swap'),
      //     href: '/swap',
      //   },
      //   {
      //     label: t('Liquidity'),
      //     href: '/liquidity',
      //   }]
      // }, 

  ].map((item) => addMenuItemSupported(item, chainId))

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
  return items
}
export default config
