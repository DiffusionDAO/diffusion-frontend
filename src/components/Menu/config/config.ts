
import {
  MenuItemsType,
  BondIcon,
  BondFillIcon,
  DashboardIcon,
  DashboardFillIcon,
  RewardFillIcon,
  RewardIcon,
  NftMarketIcon,
  NftMarketFillIcon,
  MintIcon,
  MintFillIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { perpLangMap } from 'utils/getPerpetualLanguageCode'
// import { DropdownMenuItems } from '@pancakeswap/uikit/dist/components/DropdownMenu/types'

// export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
// export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean } & {
//   items?: ConfigMenuDropDownItemsType[]
// }
export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t'], languageCode?: string) => ConfigMenuItemsType[] = (t, languageCode) => [
  {
    label: t('Dashboard'),
    icon: DashboardIcon,
    fillIcon: DashboardFillIcon,
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
    label: t('Boxes'),
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
    items: [
      // {
      //   label: t('Overview'),
      //   href: `${nftsBaseUrl}`,
      // },
      // {
      //   label: t('Collections'),
      //   href: `${nftsBaseUrl}/collections`,
      // },
    ],
  },
]

export default config
