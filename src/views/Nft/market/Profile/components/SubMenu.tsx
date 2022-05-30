import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import BaseSubMenu from '../../components/BaseSubMenu'
import { nftsBaseUrl } from '../../constants'

const SubMenuComponent: React.FC = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const accountAddress = router.query.accountAddress as string
  const { asPath } = router

  const ItemsConfig = [
    {
      label: t('我购买的NFT'),
      href: `${nftsBaseUrl}/profile/${accountAddress}`,
    },
  ]

  return <BaseSubMenu items={ItemsConfig} activeItem={asPath} justifyContent="flex-start" mb="20px" />
}

export default SubMenuComponent
