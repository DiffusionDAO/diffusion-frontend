import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useDFSMiningContract } from 'hooks/useContract'

const Menu = (props) => {
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const { account } = useWeb3React()

  const [whitelist, setWhitelist] = useState<string[]>([])

  const dfsMining = useDFSMiningContract()
  useEffect(() => {
    dfsMining.getPrivateWhitelist().then((res) => setWhitelist(res))
  }, [])
  const isPrivate = whitelist.includes(account)
  const menuItems = useMenuItems(isPrivate)

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })



  // const getFooterLinks = useMemo(() => {
  //   return footerLinks(t)
  // }, [t])

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
