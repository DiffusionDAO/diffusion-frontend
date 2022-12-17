import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'

const Menu = (props) => {
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

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
