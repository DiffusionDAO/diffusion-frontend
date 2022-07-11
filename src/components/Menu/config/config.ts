
import {
  MenuItemsType,
  DropdownMenuItemType,
  WalletIcon,
  WalletFilledIcon,
  TicketIcon,
  TicketFillIcon,
  EarnFillIcon,
  EarnIcon,
  NftIcon,
  NftFillIcon,
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
    icon: WalletIcon,
    fillIcon: WalletFilledIcon,
    href: '/dashboard',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Mint'),
    icon: TicketIcon,
    fillIcon: TicketFillIcon,
    href: '/mint',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('Reward'),
    icon: EarnIcon,
    fillIcon: EarnFillIcon,
    href: '/reward',
    showItemsOnMobile: false,
    items: [],
  },
  // {
  //   label: t('IDO'),
  //   icon: EarnIcon,
  //   fillIcon: EarnFillIcon,
  //   href: '/ido',
  //   showItemsOnMobile: false,
  //   items: [],
  // },
  {
    label: t('NFT'),
    icon: NftIcon,
    fillIcon: NftFillIcon,
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
