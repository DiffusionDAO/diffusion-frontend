
import {
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
    label: t('IDO'),
    icon: EarnIcon,
    fillIcon: EarnFillIcon,
    href: '/ido',
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t('NFT'),
    icon: NftIcon,
    fillIcon: NftFillIcon,
    href: `${nftsBaseUrl}`,
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
