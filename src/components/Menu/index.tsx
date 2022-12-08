import { useRouter } from 'next/router'
import { useMemo, useState, useEffect } from 'react'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Menu as UikitMenu, useIsomorphicEffect } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { usePhishingBannerManager } from 'state/user/hooks'
import { useDFSMiningContract } from 'hooks/useContract'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'
import { useWeb3React } from '../../../packages/wagmi/src/useWeb3React'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const cakePriceUsd = useCakeBusdPrice({ forceMainnet: true })
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  const [showPhishingWarningBanner] = usePhishingBannerManager()
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

  const toggleTheme = useMemo(() => {
    return () => setTheme('dark')
  }, [setTheme, isDark])

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
            <UserMenu />
          </>
        }
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyCakeLabel={t('Buy DFS')}
        {...props}
      />
    </>
  )
}

export default Menu
