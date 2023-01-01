import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useDFSMiningContract } from 'hooks/useContract'
import useSWR from 'swr'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const Menu = (props) => {
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const { account } = useWeb3React()

  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const dfsMining = useDFSMiningContract()

  const{data, status} = useSWR("MenuGetPrivateWhitelist", async()=>{
    const whitelist = await dfsMining.getPrivateWhitelist()
    const includes = whitelist.includes(account)
    setIsPrivate(includes)
  })
  const menuItems = useMenuItems(isPrivate)

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  return (
    <>
      <UikitMenu
        linkComponent={(linkProps) => {
          return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
        }}
        rightSide={
          <>
            <NetworkSwitcher />
            <UserMenu />
          </>
        }
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        // footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        {...props}
      />
    </>
  )
}

export default Menu
